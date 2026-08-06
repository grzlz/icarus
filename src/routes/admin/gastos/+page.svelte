<script>
	import { enhance } from '$app/forms';
	import { money, shortDateTime } from '$lib/admin/format.js';

	let { data, form } = $props();

	const catLabels = {
		produccion: 'Producción',
		envio: 'Envíos',
		marketing: 'Marketing',
		equipo: 'Equipo',
		otro: 'Otro'
	};

	let totalShown = $derived(data.expenses.reduce((s, e) => s + e.amount_cents, 0));

	const input =
		'border-grey-400 bg-bone-50 text-ink-950 focus:border-tomato-500 focus:ring-tomato-500 w-full rounded-lg border px-3 py-2 text-sm';
</script>

<svelte:head>
	<title>Gastos — Icarus Admin</title>
</svelte:head>

<h1 class="text-ink-950 mb-6 text-2xl font-bold">Gastos</h1>

{#if form?.error}
	<p class="bg-tomato-500/10 text-tomato-600 mb-4 rounded-lg px-4 py-2 text-sm font-medium">
		{form.error}
	</p>
{:else if form?.ok}
	<p class="mb-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600">
		{form.ok}
	</p>
{/if}

<div class="grid gap-4 lg:grid-cols-3">
	<form
		method="POST"
		action="?/create"
		use:enhance
		class="border-bone-200 bg-bone-100 h-fit space-y-3 rounded-2xl border p-5"
	>
		<h2 class="text-ink-950 font-semibold">Registrar gasto</h2>
		<input type="text" name="description" required placeholder="Descripción" class={input} />
		<div class="grid grid-cols-2 gap-3">
			<select name="category" required class={input}>
				{#each data.categories as c (c)}
					<option value={c}>{catLabels[c]}</option>
				{/each}
			</select>
			<input
				type="number"
				name="amount"
				step="0.01"
				min="0.01"
				required
				placeholder="Monto $"
				class="{input} tabular-nums"
			/>
		</div>
		<button
			type="submit"
			class="bg-ink-950 text-bone-50 hover:bg-ink-800 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition"
		>
			Registrar
		</button>
	</form>

	<div class="border-bone-200 bg-bone-100 rounded-2xl border p-5 lg:col-span-2">
		<div class="flex items-baseline justify-between">
			<h2 class="text-ink-950 font-semibold">Historial</h2>
			<p class="text-grey-500 text-sm">
				Total mostrado: <span class="text-ink-950 font-semibold tabular-nums"
					>{money(totalShown)}</span
				>
			</p>
		</div>
		{#if data.expenses.length === 0}
			<p class="text-grey-500 mt-3 text-sm">Sin gastos registrados.</p>
		{:else}
			<table class="mt-3 w-full text-sm">
				<tbody>
					{#each data.expenses as e (e.id)}
						<tr class="border-bone-200 border-t">
							<td class="text-grey-500 py-2 pr-3 whitespace-nowrap"
								>{shortDateTime(e.created_at)}</td
							>
							<td class="text-ink-950 py-2 pr-3">{e.description}</td>
							<td class="py-2 pr-3">
								<span
									class="bg-bone-200 text-grey-600 rounded-full px-2.5 py-0.5 text-xs font-medium"
								>
									{catLabels[e.category]}
								</span>
							</td>
							<td class="text-ink-950 py-2 pr-3 text-right font-semibold tabular-nums"
								>{money(e.amount_cents)}</td
							>
							<td class="py-2 text-right">
								<form
									method="POST"
									action="?/remove"
									use:enhance
									onsubmit={(ev) => {
										if (!confirm('¿Eliminar este gasto?')) ev.preventDefault();
									}}
								>
									<input type="hidden" name="expense_id" value={e.id} />
									<button
										type="submit"
										class="text-grey-400 hover:text-tomato-600 text-xs font-medium"
									>
										Eliminar
									</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>
