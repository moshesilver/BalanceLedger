import { Alert } from 'react-native';
import { PersonInput, StoredPerson } from '../types';
import { readStorageFile, writeStorageFile } from './storageCore';

export async function getPersonById(id: string) {
	const storageData = await readStorageFile();
	return storageData.people.find(p => p.id === id);
}

export async function getPeople() {
	const storageData = await readStorageFile();
	return storageData.people;
}

export async function addPerson(person: PersonInput) {
	const storageData = await readStorageFile();
	if (person.id !== 'CREATE_NEW') {
		Alert.alert('Error', 'Invalid person ID for creation.');
		return;
	}
	if (storageData.people.some(p => p.name === person.name)) {
		Alert.alert('Error', 'Person with this name already exists.');
		return;
	}
	person.id = crypto.randomUUID(); // generate a unique ID to replace "CREATE_NEW"
	storageData.people.push(person);
	await writeStorageFile(storageData);
}

export async function updatePerson(id: string, updates: Partial<StoredPerson>) {
	const storageData = await readStorageFile();
	const person = storageData.people.find(p => p.id === id);
	if (!person) {
		Alert.alert('Error', 'Person not found.');
		return;
	}
	if (storageData.people.some(p => p.name === person.name)) {
		Alert.alert('Error', 'Person with this name already exists.');
		return;
	}
	Object.assign(person, updates);
	await writeStorageFile(storageData);
}

export async function deletePerson(id: string) {
	const storageData = await readStorageFile();
	const person = storageData.people.find(p => p.id === id);
	if (!person) {
		Alert.alert('Error', 'Person not found.');
		return;
	}
	storageData.people = storageData.people.filter(p => p.id !== id);
	await writeStorageFile(storageData);
}

export async function deleteAllPeople() {
	const storageData = await readStorageFile();
	storageData.people = [];
	await writeStorageFile(storageData);
}
