import PersonDropdown from '@/src/components/PersonDropdown';
import { addPerson } from '@/src/storage/personStorage';
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
import { dollarsToCents } from '@/src/utils/money';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useRef, useState } from 'react';
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

	const handleAddNewPerson = async (person: PersonInput) => {
		await addPerson(person)
			.then(() => {
				haptics.success();
				Alert.alert('Success', `Added new person: ${person.name}`);
			})
			.catch(err => {
				console.error(err);
				haptics.error();
				Alert.alert('Error', 'Failed to add new person.');
			});
	};

	const handleAmountChange = (text: string) => {
		let cleaned = text.replace(/[^0-9.]/g, '');
		const parts = cleaned.split('.');
		if (parts.length > 2) cleaned = parts[0] + '.' + parts[1];
		if (parts[1]) cleaned = parts[0] + '.' + parts[1].slice(0, 2);

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
			console.log(formData.from, formData.to, formData.amount, formData.notes);

			if (!formData.from || !formData.to || !formData.amount) {
				haptics.error();
				Alert.alert('Error', 'Please fill out all required fields.');
				return;
			}

			const amountCents = dollarsToCents(formData.amount);

			if (amountCents <= 0) {
				haptics.error();
				Alert.alert('Error', 'Amount must be greater than zero.');
				return;
			}

			/////////////////////////////
			// TODO: Add API call to save
			/////////////////////////////
			console.log(
				`Save owe here. Data: ${formData.from} owes ${formData.to} $${formData.amount} (${amountCents} cents). Notes: ${formData.notes}`
			);
			console.log('Set up real people and storage!');

			haptics.success();

			navigation.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [{ name: 'index' }]
				})
			);
		} catch (err) {
			console.error(err);
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
								allPeople={[]} // people from storage will go here
								onSelect={person =>
									setFormData(p => ({ ...p, from: person.id }))
								}
								onCreateNew={async person => await handleAddNewPerson(person)}
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
								allPeople={[]} // people from storage will go here
								onSelect={person =>
									setFormData(p => ({ ...p, to: person.name }))
								}
								onCreateNew={async person => await handleAddNewPerson(person)}
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
