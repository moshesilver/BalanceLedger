import DebugStorageButton from '@/src/components/DebugStorageButton';
import { deleteAllOwes } from '@/src/storage/oweStorage';
import { deleteAllPeople } from '@/src/storage/personStorage';
import {
	createCardStyles,
	createLayout,
	createTypography,
	useTheme
} from '@/src/styles/styles';
import haptics from '@/src/utils/haptics';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
	const theme = useTheme();

	const layout = createLayout(theme);
	const card = createCardStyles(theme);
	const typography = createTypography(theme);

	return (
		<SafeAreaView style={layout.screen} edges={['top']}>
			<ScrollView contentContainerStyle={layout.content}>
				{/* Screen title */}
				<Text style={[typography.screenTitle, typography.screenTitleSpacing]}>
					Settings & Debug
				</Text>

				{/* Debug section */}
				<View style={card.container}>
					<Text style={[typography.sectionTitle, card.sectionTight]}>
						Debug Tools
					</Text>

					<DebugStorageButton />
				</View>

				{/* Danger zone */}
				<View style={[card.container, card.section]}>
					<Text style={[typography.sectionTitle, card.sectionTight]}>
						Danger Zone
					</Text>

					{/* Reset Ledger Entries */}
					<TouchableOpacity
						style={card.settingsAction}
						onPress={() =>
							Alert.alert(
								'Reset All Owes',
								'This will delete all owes, but keep people.',
								[
									{ text: 'Cancel', style: 'cancel' },
									{
										text: 'Confirm',
										style: 'destructive',
										onPress: async () => {
											haptics.heavy();
											await deleteAllOwes();
										}
									}
								]
							)
						}
					>
						<Text style={typography.dangerText}>Reset All Owes</Text>
					</TouchableOpacity>

					{/* Reset People */}
					<TouchableOpacity
						style={card.settingsAction}
						onPress={() =>
							Alert.alert(
								'Reset All People',
								'This will delete all people and may orphan owe entries.',
								[
									{ text: 'Cancel', style: 'cancel' },
									{
										text: 'Confirm',
										style: 'destructive',
										onPress: async () => {
											haptics.heavy();
											await deleteAllPeople();
										}
									}
								]
							)
						}
					>
						<Text style={typography.dangerText}>Reset All People</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
