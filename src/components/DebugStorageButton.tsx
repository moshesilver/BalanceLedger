import {
	createButtonStyles,
	createCardStyles,
	createDebugStyles,
	createTypography,
	useTheme
} from '@/src/styles/styles';
import { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { readStorageFile } from '../storage/storageCore';
import haptics from '../utils/haptics';

export default function DebugStorageButton() {
	const theme = useTheme();

	const card = createCardStyles(theme);
	const typography = createTypography(theme);
	const button = createButtonStyles(theme);
	const debug = createDebugStyles(theme);

	const [modalVisible, setModalVisible] = useState(false);
	const [fileContents, setFileContents] = useState<object>({});

	const loadFile = async () => {
		try {
			const info = await readStorageFile();
			setFileContents(info);
		} catch (err) {
			setFileContents({ error: 'Error reading file: ' + err });
		}
	};

	const openModal = async () => {
		await loadFile();
		setModalVisible(true);
	};

	return (
		<>
			{/* Button consistent with Settings styling */}
			<TouchableOpacity
				style={card.settingsAction}
				onPress={() => {
					haptics.selection();
					openModal();
				}}
			>
				<Text style={debug.triggerText}>View Storage File</Text>
			</TouchableOpacity>

			{/* Modal */}
			<Modal visible={modalVisible} animationType="slide" transparent>
				<View style={debug.modalOverlay}>
					<SafeAreaView style={debug.modalContainer}>
						{/* Header */}
						<Text style={[typography.sectionTitle, card.sectionTight]}>
							BalanceLedger JSON
						</Text>

						{/* Scrollable content */}
						<ScrollView contentContainerStyle={debug.modalContent}>
							<Text style={debug.jsonText}>
								{JSON.stringify(fileContents, null, 2)}
							</Text>
						</ScrollView>

						{/* Close button */}
						<TouchableOpacity
							style={[button.primary, button.submitSpacing]}
							onPress={() => setModalVisible(false)}
						>
							<Text style={typography.buttonText}>Close</Text>
						</TouchableOpacity>
					</SafeAreaView>
				</View>
			</Modal>
		</>
	);
}
