import {
	createButtonStyles,
	createLayout,
	createTypography,
	spacing,
	useTheme
} from '@/src/styles/styles';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import haptics from '../src/utils/haptics';

export default function Index() {
	const theme = useTheme();

	const layout = createLayout(theme);
	const typography = createTypography(theme);
	const button = createButtonStyles(theme);

	const scheme = useColorScheme();

	return (
		<SafeAreaView style={layout.screen} edges={['top']}>
			<StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />

			{/* Header */}
			<View
				style={{
					paddingHorizontal: spacing.page,
					paddingTop: spacing.sm,
					paddingBottom: spacing.md,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
			>
				<Text style={typography.screenTitle}>Balances</Text>

				<TouchableOpacity
					onPress={() => {
						haptics.selection();
						router.push('/settings');
					}}
				>
					<Text style={{ fontSize: 22 }}>⚙️</Text>
				</TouchableOpacity>
			</View>

			{/* Add Button */}
			<View style={{ paddingHorizontal: spacing.page }}>
				<TouchableOpacity
					style={[button.primary, { marginBottom: spacing.md }]}
					onPress={() => {
						haptics.light();
						router.push('/forms/NewOweForm');
					}}
				>
					<Text style={typography.buttonText}>+ Add Owe</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
