import { RefObject, useMemo, useState } from 'react';
import {
	ReturnKeyType,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';
import styles from '../styles/dropdownStyles';
import type { PersonInput, StoredPerson } from '../types';

interface Props {
	placeholder: string;
	allPeople: StoredPerson[];
	onSelect: (person: StoredPerson) => void;
	onCreateNew: (input: PersonInput) => void;
	inputRef?: RefObject<TextInput | null>;
	returnKeyType?: ReturnKeyType;
	onSubmitEditing?: () => void;
	style?: any;
	value: string;
	onChangeText: (text: string) => void;
}

export default function PersonDropdown({
	placeholder,
	allPeople,
	onSelect,
	onCreateNew,
	inputRef,
	returnKeyType,
	onSubmitEditing,
	style,
	value,
	onChangeText
}: Props) {
	// const [searchQuery, setSearchQuery] = useState('');
	const [modalVisible, setModalVisible] = useState(false);

	// Memoize filtering so it only recalculates when searchQuery or allPeople changes
	const filteredData = useMemo(() => {
		if (!value) return [];

		const filtered = allPeople.filter(p =>
			p.name.toLowerCase().includes(value.toLowerCase())
		);

		const exactMatch = allPeople.find(
			p => p.name.toLowerCase() === value.trim().toLowerCase()
		);

		// If if no exact match, inject the "Create New" option at the top
		if (value.trim().length > 0 && !exactMatch) {
			return [{ id: 'CREATE_NEW', name: value.trim() }, ...filtered];
		}

		return filtered;
	}, [value, allPeople]);

	const handleSelect = (person: StoredPerson) => {
		if (person.id === 'CREATE_NEW') {
			onCreateNew(person); // pass the person to the parent to handle creation
		} else {
			onSelect(person); // pass the selected person to the parent
			// setSearchQuery(person.name); // update the input to show the selected name
		}
		setModalVisible(false); // close the dropdown
	};

	return (
		<View style={styles.outerContainer}>
			<TextInput
				style={style}
				returnKeyType={returnKeyType}
				onSubmitEditing={onSubmitEditing}
				ref={inputRef}
				value={value}
				onChangeText={text => {
					onChangeText(text);
					setModalVisible(text.length > 0);
				}}
				onFocus={() => {
					if (value.length > 0) setModalVisible(true);
				}}
				placeholder={placeholder}
				onBlur={() => {
					// Delay closing slightly so the 'onPress' of the list has time to fire
					setTimeout(() => setModalVisible(false), 200);
				}}
				autoCapitalize="words" // Capitalizes first letter of names, but keeps it manual
				autoCorrect={false}
				spellCheck={false} // Removes the red squiggly lines
				autoComplete="off" // Prevents system-level contact/address suggestions
				textContentType="none"
			/>

			{modalVisible && (
				<View style={styles.dropdownContainer}>
					<View style={{ width: '100%' }}>
						{filteredData.map(person => {
							const isCreatedOption = person.id === 'CREATE_NEW';
							return (
								<TouchableOpacity
									key={person.id}
									style={[styles.item, isCreatedOption && styles.createItem]}
									onPress={() => handleSelect(person)}
								>
									<Text
										style={
											isCreatedOption ? styles.createText : styles.itemText
										}
									>
										{isCreatedOption
											? `+ Create "${person.name}"`
											: person.name}
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				</View>
			)}
		</View>
	);
}
