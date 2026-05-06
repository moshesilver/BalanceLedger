import * as Crypto from 'expo-crypto';
import { Alert } from 'react-native';
import { OweInput, StoredOwe } from '../types';
import { dollarsToCents } from '../utils/money';
import { readStorageFile, writeStorageFile } from './storageCore';

export async function getOweById(id: string) {
	const storageData = await readStorageFile();
	return storageData.owes.find(o => o.id === id);
}

export async function getOwes() {
	const storageData = await readStorageFile();
	if (!storageData.owes) {
		return [];
	}
	return storageData.owes;
}

export async function addOwe(oweInput: OweInput) {
	const storageData = await readStorageFile();
	const { amount, ...otherData } = oweInput;
	const owe: StoredOwe = {
		id: Crypto.randomUUID(),
		amountCents: dollarsToCents(amount.replaceAll('$', '')), // remove here and in UI just to be safe
		createdAt: new Date().toISOString(),
		...otherData
	};
	storageData.owes.push(owe);
	await writeStorageFile(storageData);
}

export async function updateOwe(id: string, updates: Partial<OweInput>) {
	const storageData = await readStorageFile();
	const index = storageData.owes.findIndex(o => o.id === id);

	if (index === -1) {
		Alert.alert('Error', 'Owe not found.');
		return;
	}
	const { amount, ...otherUpdates } = updates;

	const updatedOwe = {
		...storageData.owes[index],
		...otherUpdates,
		updatedAt: new Date().toISOString()
	};

	if (amount !== undefined) {
		updatedOwe.amountCents = dollarsToCents(amount);
	}
	storageData.owes[index] = updatedOwe;
	await writeStorageFile(storageData);
}

export async function deleteOwe(id: string) {
	const storageData = await readStorageFile();
	const owe = storageData.owes.find(o => o.id === id);
	if (!owe) {
		Alert.alert('Error', 'Owe not found.');
		return;
	}
	storageData.owes = storageData.owes.filter(o => o.id !== id);
	await writeStorageFile(storageData);
}

export async function deleteOweHistory(p1: string, p2: string) {
	const storageData = await readStorageFile();
	storageData.owes = storageData.owes.filter(o => {
		const isMatch =
			(o.from === p1 && o.to === p2) || (o.from === p2 && o.to === p1);
		return !isMatch; // filter out matches
	});
	await writeStorageFile(storageData);
}

export async function deleteAllOwes() {
	const storageData = await readStorageFile();
	storageData.owes = [];
	await writeStorageFile(storageData);
}
