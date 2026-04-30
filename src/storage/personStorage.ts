// import * as Crypto from 'expo-crypto';
import { Alert } from 'react-native';
import { PersonInput, StoredPerson } from '../types';
import { readStorageFile, writeStorageFile } from './storageCore';

/* export async function getPersonById(id: string) {
	const storageData = await readStorageFile();
	return storageData.people.find(p => p.id === id);
} */

export async function getPersonByName(name: string) {
	const storageData = await readStorageFile();
	return storageData.people.find(p => p.name === name);
}

export async function getPeople() {
	const storageData = await readStorageFile();
	if (!storageData.people) {
		return [];
	}
	return storageData.people;
}

export async function addPerson(person: PersonInput) {
	const storageData = await readStorageFile();
	/* if (person.id !== 'CREATE_NEW') {
		Alert.alert('Error', 'Invalid person ID for creation.');
		return;
	} */
	if (storageData.people.some(p => p.name === person.name)) {
		Alert.alert('Error', 'Person with this name already exists.');
		return;
	}
	// person.id = Crypto.randomUUID(); // generate a unique ID to replace "CREATE_NEW"
	storageData.people.push(person);
	await writeStorageFile(storageData);
}

export async function updatePerson(
	oldName: string,
	updates: Partial<StoredPerson>
) {
	const storageData = await readStorageFile();
	const index = storageData.people.findIndex(p => p.name === oldName);
	if (index === -1) {
		Alert.alert('Error', 'Person not found.');
		return;
	}
	if (updates.name && updates.name !== oldName) {
		const nameExists = storageData.people.some(p => p.name === updates.name);
		if (nameExists) {
			Alert.alert('Error', 'Person with this name already exists.');
			return;
		}
	}
	storageData.people[index] = { ...storageData.people[index], ...updates };
	await writeStorageFile(storageData);
}

export async function deletePerson(name: string) {
	const storageData = await readStorageFile();
	const person = storageData.people.find(p => p.name === name);
	if (!person) {
		Alert.alert('Error', 'Person not found.');
		return;
	}
	storageData.people = storageData.people.filter(p => p.name !== name);
	await writeStorageFile(storageData);
}

export async function deleteAllPeople() {
	const storageData = await readStorageFile();
	storageData.people = [];
	await writeStorageFile(storageData);
}
