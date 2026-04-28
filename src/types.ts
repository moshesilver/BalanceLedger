export type StorageFile = {
	owes: StoredOwe[];
	people: StoredPerson[];
};

export type OweInput = {
	from: string; // person id
	to: string; // person id
	amount: string; // in dollars, e.g. "12.34"
	notes?: string;
};

export type StoredOwe = {
	id: string;
	from: string; // person id
	to: string; // person id
	amountCents: number; // stored as cents to avoid floating point issues, e.g. 1234 for $12.34
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
};

export type PersonInput = {
	id: string; // "CREATE_NEW"
	name: string;
};

export type StoredPerson = {
	id: string;
	name: string;
};
