import * as FileSystem from 'expo-file-system/legacy';
import type { StorageFile } from '../types';

const isDev = __DEV__;

const STORAGE_FILENAME = isDev
	? 'BalanceLedgerData-dev.json'
	: 'BalanceLedgerData.json';

const FILE_PATH = FileSystem.documentDirectory + STORAGE_FILENAME;

async function ensureFileExists() {
	const info = await FileSystem.getInfoAsync(FILE_PATH);
	if (!info.exists) {
		const empty: StorageFile = { owes: [], people: [] };
		await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(empty));
	}
}

export async function readStorageFile(): Promise<StorageFile> {
	await ensureFileExists();
	const contents = await FileSystem.readAsStringAsync(FILE_PATH);
	const parsed = JSON.parse(contents);

	return {
		owes: parsed.owes ?? [],
		people: parsed.people ?? []
	};
}

export async function writeStorageFile(data: StorageFile) {
	await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(data));
}
