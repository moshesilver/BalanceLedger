import PersonDropdown from '@/src/components/PersonDropdown';
import { addOwe } from '@/src/storage/oweStorage';
import { addPerson, getPeople } from '@/src/storage/personStorage';
import {
	createButtonStyles,
	createCardStyles,
	createInputStyles,
	createLayout,
	createTypography,
	spacing,
	useTheme
} from '@/src/styles/styles';
import { OweInput, PersonInput } from '@/src/types';
import haptics from '@/src/utils/haptics';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
	Alert,
	Keyboard,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NewOweForm() {
	const navigation = useNavigation();
	const insets = useSafeAreaInsets();

	const [people, setPeople] = useState<PersonInput[]>([]);
	const [submitting, setSubmitting] = useState(false);
	const [amountText, setAmountText] = useState('');
	const [formData, setFormData] = useState<OweInput>({
		from: '',
		to: '',
		amount: '',
		notes: ''
	});

	const theme = useTheme();

	const layout = createLayout(theme);
	const card = createCardStyles(theme);
	const typography = createTypography(theme);
	const button = createButtonStyles(theme);
	const input = createInputStyles(theme);

	const fromRef = useRef<TextInput>(null);
	const toRef = useRef<TextInput>(null);
	const amountRef = useRef<TextInput>(null);
	const notesRef = useRef<TextInput>(null);

	useEffect(() => {
		(async () => setPeople(await getPeople()))();
	}, []);

	const handleAddNewPerson = (person: PersonInput, field: 'from' | 'to') => {
		Keyboard.dismiss();
		Alert.alert(`Create New Person: ${person.name}?`, '', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Add',
				onPress: async () => {
					try {
						await addPerson(person);
						haptics.success();

						setPeople(await getPeople());

						setFormData(prev => ({ ...prev, [field]: person.name }));

						Alert.alert('Success', `Added new person: ${person.name}`);
					} catch (err) {
						console.error(err);
						haptics.error();
						Alert.alert('Error', 'Failed to add new person.');
					}
				}
			}
		]);
	};

	const handleAmountChange = (text: string) => {
		let cleaned = text.replace(/[^0-9.]/g, '');
		const parts = cleaned.split('.');
		if (parts.length > 2) cleaned = parts[0] + '.' + parts[1];
		if (parts[1]) cleaned = parts[0] + '.' + parts[1].slice(0, 2);

		if (text !== '') {
			cleaned = '$' + cleaned;
			if (cleaned === '$') cleaned = '';
		}

		setAmountText(cleaned);
		setFormData(prev => ({
			...prev,
			amount: cleaned
		}));
	};

	const handleSubmit = async () => {
		Keyboard.dismiss();

		if (submitting) return;
		setSubmitting(true);

		try {
			if (!formData.from || !formData.to || !formData.amount) {
				haptics.error();
				Alert.alert('Error', 'Please fill out all required fields.');
				return;
			}

			const fromExists = people.some(p => p.name === formData.from);
			const toExists = people.some(p => p.name === formData.to);

			if (!fromExists || !toExists) {
				const missingName = !fromExists ? formData.from : formData.to;
				haptics.error();
				Alert.alert(
					'Person Not Found',
					`"${missingName}" hasn't been added to your list. Please select them from the list or tap "Create" in the dropdown.`
				);
				return;
			}

			if (formData.from === formData.to) {
				haptics.error();
				Alert.alert('Error', 'You cannot owe yourself.');
				return;
			}

			if (parseFloat(formData.amount) <= 0) {
				haptics.error();
				Alert.alert('Error', 'Amount must be greater than zero.');
				return;
			}

			await addOwe({
				from: formData.from,
				to: formData.to,
				amount: formData.amount.replaceAll('$', ''), // replace here and in backend just to be safe
				notes: formData.notes ? formData.notes.trim() : undefined
			});

			haptics.success();

			navigation.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [{ name: 'index' }]
				})
			);
		} catch (err) {
			console.error(err);
			haptics.error();
			Alert.alert('Error', 'Failed to save.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<KeyboardAwareScrollView
			style={layout.screen}
			contentContainerStyle={{
				paddingTop: insets.top + spacing.lg,
				paddingHorizontal: spacing.page,
				paddingBottom: spacing.xl
			}}
			enableOnAndroid
			keyboardShouldPersistTaps="handled"
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View>
					<Text style={[typography.screenTitle, typography.screenTitleSpacing]}>
						{/* {isEditMode ? 'Edit Entry' : 'New Entry'} */}New Entry
					</Text>

					{/* From */}
					<View style={[card.sectionWide, { zIndex: 50 }]}>
						<View style={card.container}>
							<PersonDropdown
								value={formData.from}
								onChangeText={text => setFormData(p => ({ ...p, from: text }))}
								placeholder="Who owes money?"
								inputRef={fromRef}
								allPeople={people}
								onSelect={person =>
									setFormData(p => ({ ...p, from: person.name }))
								}
								onCreateNew={person => handleAddNewPerson(person, 'from')}
								style={[card.inputSection, input.input]}
								returnKeyType="next"
								onSubmitEditing={() => toRef.current?.focus()}
							/>
						</View>
					</View>

					{/* To */}
					<View style={[card.sectionWide, { zIndex: 40 }]}>
						<View style={card.container}>
							<PersonDropdown
								value={formData.to}
								onChangeText={text => setFormData(p => ({ ...p, to: text }))}
								placeholder="To whom?"
								allPeople={people}
								onSelect={person =>
									setFormData(p => ({ ...p, to: person.name }))
								}
								onCreateNew={person => handleAddNewPerson(person, 'to')}
								style={[card.inputSection, input.input]}
								returnKeyType="next"
								onSubmitEditing={() => amountRef.current?.focus()}
							/>
						</View>
					</View>

					{/* Amount */}
					<View style={card.sectionWide}>
						<View style={card.container}>
							<TextInput
								placeholder="Amount"
								value={amountText}
								onChangeText={handleAmountChange}
								style={[card.inputSection, input.input]}
								keyboardType="numeric"
								ref={amountRef}
								returnKeyType="next"
								onSubmitEditing={() => notesRef.current?.focus()}
							/>
						</View>
					</View>

					{/* Notes */}
					<View style={card.sectionWide}>
						<View style={card.container}>
							<TextInput
								placeholder="Notes (optional)"
								value={formData.notes}
								onChangeText={text =>
									setFormData(prev => ({ ...prev, notes: text }))
								}
								style={[card.inputSection, input.input]}
								ref={notesRef}
								returnKeyType="done"
								onSubmitEditing={() => Keyboard.dismiss()}
							/>
						</View>
					</View>

					{/* Submit Button */}
					<TouchableOpacity
						onPress={handleSubmit}
						disabled={submitting}
						style={[
							button.primary,
							button.submitSpacing,
							submitting && button.disabled
						]}
					>
						<Text style={typography.buttonText}>
							{/* {submitting ? 'Submitting...' : isEditMode ? 'Update' : 'Submit'} */}
							{submitting ? 'Submitting...' : 'Submit'}
						</Text>
					</TouchableOpacity>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAwareScrollView>
	);
}
