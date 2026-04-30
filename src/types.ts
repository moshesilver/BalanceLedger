export type StorageFile = {
	owes: StoredOwe[];
	people: StoredPerson[];
};

export type OweInput = {
	from: string; // person name
	to: string; // person name
	amount: string; // in dollars, e.g. "12.34"
	notes?: string;
};

export type StoredOwe = {
	id: string;
	from: string; // person name
	to: string; // person name
	amountCents: number; // stored as cents to avoid floating point issues, e.g. 1234 for $12.34
	notes?: string;
	createdAt: Date; // possibly use ISO string for easier storage
	updatedAt: Date; // possibly use ISO string for easier storage
};

export type PersonInput = {
	// id: string; // "CREATE_NEW"
	name: string;
};

export type StoredPerson = {
	// id: string;
	name: string;
};
