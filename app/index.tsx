import { getOwes } from '@/src/storage/oweStorage';
import {
	createButtonStyles,
	createCardStyles,
	createLayout,
	createTypography,
	spacing,
	useTheme
} from '@/src/styles/styles';
import { OweSummary } from '@/src/types';
import calculateOweSummary from '@/src/utils/calculateOweSummary';
import { centsToDollars } from '@/src/utils/money';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
	FlatList,
	Text,
	TouchableOpacity,
	useColorScheme,
	View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import haptics from '../src/utils/haptics';

export default function Index() {
	const [oweTotals, setOweTotals] = useState<OweSummary>({
		outstanding: [],
		settled: []
	});

	const theme = useTheme();

	const layout = createLayout(theme);
	const card = createCardStyles(theme);
	const typography = createTypography(theme);
	const button = createButtonStyles(theme);

	const scheme = useColorScheme();

	const loadData = useCallback(async () => {
		const owes = await getOwes();
		const oweSummary = calculateOweSummary(owes);
		setOweTotals(oweSummary);
	}, []);

	useFocusEffect(
		useCallback(() => {
			loadData();
		}, [loadData])
	);

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

			{/* Outstanding Owes */}
			<Text style={typography.heading}>Net Balances</Text>
			<FlatList
				data={oweTotals.outstanding}
				keyExtractor={item => `${item.from}-${item.to}`}
				contentContainerStyle={{
					paddingHorizontal: spacing.page,
					paddingBottom: spacing.xl
				}}
				ListEmptyComponent={
					<Text
						style={{
							textAlign: 'center',
							color: theme.textMuted,
							marginTop: spacing.xl
						}}
					>
						No owes yet...
					</Text>
				}
				renderItem={({ index }) => {
					const reverseIndex = oweTotals.outstanding.length - 1 - index;
					const item = oweTotals.outstanding[reverseIndex];
					return (
						<TouchableOpacity
							style={card.container}
							onPress={() => {
								haptics.selection();
								router.push({
									pathname: '/OweDetails',
									params: { p1: item.from, p2: item.to }
								});
							}}
						>
							<Text style={typography.sectionTitle}>
								{item.from} → {item.to}
							</Text>
							<Text style={typography.sectionTitle}>
								${centsToDollars(item.amountCents)}
							</Text>
						</TouchableOpacity>
					);
				}}
			/>

			{/* Settled Owes */}
			{oweTotals.settled.length > 0 && (
				<>
					<Text style={typography.heading}>Pending Settlement</Text>
					<FlatList
						data={oweTotals.settled}
						keyExtractor={item => `${item.from}-${item.to}`}
						contentContainerStyle={{
							paddingHorizontal: spacing.page,
							paddingBottom: spacing.xl
						}}
						renderItem={({ index }) => {
							const reverseIndex = oweTotals.settled.length - 1 - index;
							const item = oweTotals.settled[reverseIndex];
							return (
								<TouchableOpacity
									style={card.container}
									onPress={() => {
										haptics.selection();
										// router.push();
									}}
								>
									<Text style={typography.sectionTitle}>
										{item.from} → {item.to}
									</Text>
									<Text style={typography.sectionTitle}>Settled</Text>
								</TouchableOpacity>
							);
						}}
					/>
				</>
			)}
		</SafeAreaView>
	);
}
