export function dollarsToCents(input: string): number {
	const amount = Number(input);
	if (Number.isNaN(amount)) return 0;

	return Math.round((amount + Number.EPSILON) * 100);
}

export function centsToDollars(cents: number): string {
	return (cents / 100).toFixed(2);
}
