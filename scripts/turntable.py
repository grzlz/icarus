"""
Headless Blender turntable for one catalog piece: the garment GLB with the
phrase and the Icarus wing projected onto the chest, spinning one full turn.
Renders RGBA PNG frames (transparent background); render-turntable.mjs paints
the textures beforehand and encodes the frames afterwards.

    blender -b -P scripts/turntable.py -- --type Playera --technique estampado --print print.png \
        --wing wing.png --fabric 9,14,18 --out frames/ [--frames 288] \
        [--samples 48] [--size 720] [--only N]

Coordinates are Blender's (Z up, front of the garment facing -Y). The decal
boxes mirror src/lib/models3d.js, converted from glTF space (x, y, z) to
Blender space (x, -z, y).
"""

import argparse
import math
import sys

import bpy

ROOT = '/'.join(__file__.split('/')[:-2])

MODELS = {
    'Playera': {
        'url': f'{ROOT}/static/models/shirt.glb',
        # decal boxes: center (x, z) and width on the chest, in mesh units
        'print': {'center': (0.0, 0.03), 'width': 0.26},
        'patch': {'center': (-0.08, 0.1), 'width': 0.14},
        'logo': {'center': (0.1, 0.14), 'width': 0.07},
    },
}


def parse_args():
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument('--type', default='Playera')
    p.add_argument('--technique', default='estampado', choices=['estampado', 'bordado'])
    p.add_argument('--print', dest='print_png', required=True)
    p.add_argument('--wing', required=True)
    p.add_argument('--fabric', required=True, help='sRGB r,g,b 0-255')
    p.add_argument('--out', required=True)
    p.add_argument('--frames', type=int, default=288)
    p.add_argument('--samples', type=int, default=48)
    p.add_argument('--size', type=int, default=720)
    p.add_argument('--only', type=int, help='render just this frame (look tests)')
    return p.parse_args(argv)


def srgb_to_linear(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def import_garment(url):
    bpy.ops.import_scene.gltf(filepath=url)
    mesh = next(o for o in bpy.context.scene.objects if o.type == 'MESH')
    for poly in mesh.data.polygons:
        poly.use_smooth = True
    mesh.modifiers.new('smooth', 'SUBSURF').levels = 1
    return mesh


def decal_alpha(nodes, links, coords, front, png, box):
    """Planar front projection of `png` into `box`; returns its alpha socket
    (masked to front-facing surfaces) and color socket."""
    img = nodes.new('ShaderNodeTexImage')
    img.image = bpy.data.images.load(png)
    img.extension = 'CLIP'
    img.interpolation = 'Cubic'

    # object (x, z) → uv: u = (x - cx) / w + 0.5, v = (z - cz) / h + 0.5
    ratio = img.image.size[1] / img.image.size[0]
    w, (cx, cz) = box['width'], box['center']
    h = w * ratio
    mapping = nodes.new('ShaderNodeMapping')
    mapping.inputs['Location'].default_value = (0.5 - cx / w, 0.5 - cz / h, 0)
    mapping.inputs['Scale'].default_value = (1 / w, 1 / h, 1)

    # swizzle object coords so z lands in the texture's v
    sep = nodes.new('ShaderNodeSeparateXYZ')
    comb = nodes.new('ShaderNodeCombineXYZ')
    links.new(coords, sep.inputs[0])
    links.new(sep.outputs['X'], comb.inputs['X'])
    links.new(sep.outputs['Z'], comb.inputs['Y'])
    links.new(comb.outputs[0], mapping.inputs['Vector'])
    links.new(mapping.outputs[0], img.inputs['Vector'])

    masked = nodes.new('ShaderNodeMath')
    masked.operation = 'MULTIPLY'
    links.new(img.outputs['Alpha'], masked.inputs[0])
    links.new(front, masked.inputs[1])
    return masked.outputs[0], img.outputs['Color']


def dress(mesh, model, args):
    """Cotton material: fabric color with the print and wing layered on top.
    Keeps the GLB's baked normal map (wrinkles) wired into the BSDF."""
    mat = mesh.data.materials[0]
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    bsdf = next(n for n in nodes if n.type == 'BSDF_PRINCIPLED')
    for socket in ('Base Color', 'Roughness', 'Metallic'):
        for link in list(bsdf.inputs[socket].links):
            links.remove(link)

    fabric = [srgb_to_linear(float(c)) for c in args.fabric.split(',')]
    bsdf.inputs['Base Color'].default_value = (*fabric, 1)
    bsdf.inputs['Roughness'].default_value = 0.92
    bsdf.inputs['Metallic'].default_value = 0
    bsdf.inputs['Sheen Weight'].default_value = 0.12
    bsdf.inputs['Sheen Roughness'].default_value = 0.4
    bsdf.inputs['Specular IOR Level'].default_value = 0.2

    tex = nodes.new('ShaderNodeTexCoord')
    # front-facing mask: object-space normal pointing toward -Y
    nsep = nodes.new('ShaderNodeSeparateXYZ')
    links.new(tex.outputs['Normal'], nsep.inputs[0])
    front = nodes.new('ShaderNodeMapRange')
    front.inputs['From Min'].default_value = 0.0
    front.inputs['From Max'].default_value = -0.08
    links.new(nsep.outputs['Y'], front.inputs['Value'])

    color = bsdf.inputs['Base Color'].default_value[:]
    base = nodes.new('ShaderNodeRGB')
    base.outputs[0].default_value = color
    layer = base.outputs[0]
    # bordado: small patch, wearer's-right chest; estampado: big centered print
    art = model['patch'] if args.technique == 'bordado' else model['print']
    for png, box in ((args.print_png, art), (args.wing, model['logo'])):
        alpha, rgb = decal_alpha(nodes, links, tex.outputs['Object'], front.outputs[0], png, box)
        mix = nodes.new('ShaderNodeMix')
        mix.data_type = 'RGBA'
        links.new(alpha, mix.inputs['Factor'])
        links.new(layer, mix.inputs['A'])
        links.new(rgb, mix.inputs['B'])
        layer = mix.outputs['Result']
    links.new(layer, bsdf.inputs['Base Color'])


def area_light(name, location, energy, size):
    light = bpy.data.lights.new(name, 'AREA')
    light.energy, light.size = energy, size
    obj = bpy.data.objects.new(name, light)
    obj.location = location
    track = obj.constraints.new('TRACK_TO')
    track.target = bpy.data.objects['pivot']
    bpy.context.scene.collection.objects.link(obj)


def stage(mesh, args):
    scene = bpy.context.scene

    # Spin around the garment's vertical axis through its bbox center.
    xs = [v.co.x for v in mesh.data.vertices]
    ys = [v.co.y for v in mesh.data.vertices]
    zs = [v.co.z for v in mesh.data.vertices]
    center = ((min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2, (min(zs) + max(zs)) / 2)
    pivot = bpy.data.objects.new('pivot', None)
    pivot.location = center
    scene.collection.objects.link(pivot)
    mesh.parent = pivot
    mesh.location = tuple(-c for c in center)

    # One exact turn over `frames`; frame N+1 would equal frame 1, so it loops.
    scene.frame_start, scene.frame_end = 1, args.frames
    pivot.rotation_euler = (0, 0, 0)
    pivot.keyframe_insert('rotation_euler', index=2, frame=1)
    pivot.rotation_euler = (0, 0, 2 * math.pi)
    pivot.keyframe_insert('rotation_euler', index=2, frame=args.frames + 1)
    for fc in pivot.animation_data.action.fcurves:
        for k in fc.keyframe_points:
            k.interpolation = 'LINEAR'

    # Frame the widest silhouette the spin produces, with a thin margin.
    reach = max(math.hypot(x - center[0], y - center[1]) for x, y in zip(xs, ys))
    height = max(zs) - min(zs)
    span = max(2 * reach, height) * 1.06
    cam_data = bpy.data.cameras.new('cam')
    cam_data.lens = 100
    cam_data.sensor_width = 36
    distance = span * cam_data.lens / cam_data.sensor_width
    cam = bpy.data.objects.new('cam', cam_data)
    cam.location = (center[0], center[1] - distance, center[2])
    cam.rotation_euler = (math.pi / 2, 0, 0)
    scene.collection.objects.link(cam)
    scene.camera = cam

    # Studio: big soft key, low fill, a rim from behind so black cotton
    # separates from the background.
    cx, cy, cz = center
    area_light('key', (cx - 1.4, cy - 1.8, cz + 1.4), 200, 1.6)
    area_light('fill', (cx + 1.8, cy - 1.2, cz + 0.2), 35, 2.0)
    area_light('rim', (cx + 0.6, cy + 1.8, cz + 1.2), 180, 1.0)

    world = bpy.data.worlds.new('world')
    world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.9, 0.88, 0.85, 1)
    world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.15
    scene.world = world


def render(args):
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'CPU'
    scene.cycles.samples = args.samples
    scene.cycles.use_denoising = True
    scene.render.resolution_x = scene.render.resolution_y = args.size
    scene.render.film_transparent = True
    # Standard, not AgX: keep garment colors true to the brand tokens.
    scene.view_settings.view_transform = 'Standard'
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.filepath = f"{args.out.rstrip('/')}/f_"
    if args.only:
        scene.frame_start = scene.frame_end = args.only
    bpy.ops.render.render(animation=True)


def main():
    args = parse_args()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    model = MODELS[args.type]
    mesh = import_garment(model['url'])
    dress(mesh, model, args)
    stage(mesh, args)
    render(args)


main()
