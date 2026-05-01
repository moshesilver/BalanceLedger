import { OweSummary, StoredOwe } from '../types';

export default function calculateOweSummary(owes: StoredOwe[]): OweSummary[] {
	const balances: Record<string, number> = {};

	owes.forEach(owe => {
		// Sort names to ensure consistent key regardless of direction
		const people = [owe.from, owe.to].sort();
		const key = `${people[0]}|${people[1]}`;

		if (!balances[key]) balances[key] = 0;

		// Determine if owe is positive or negative based on direction
		if (owe.from === people[0]) {
			balances[key] += owe.amountCents; // person[0] owes person[1]
		} else {
			balances[key] -= owe.amountCents; // person[1] owes person[0]
		}
	});

	const summaries: OweSummary[] = [];

	Object.entries(balances).forEach(([key, amountCents]) => {
		const [p1, p2] = key.split('|');

		summaries.push({
			from: amountCents >= 0 ? p1 : p2,
			to: amountCents >= 0 ? p2 : p1,
			amountCents: Math.abs(amountCents)
		});
	});

	return summaries;
}
