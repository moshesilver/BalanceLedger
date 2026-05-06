import { getOwes } from '@/src/storage/oweStorage';
import {
	createCardStyles,
	createLayout,
	createTypography,
	spacing,
	useTheme
} from '@/src/styles/styles';
import { StoredOwe } from '@/src/types';
import { centsToDollars } from '@/src/utils/money';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OweDetails() {
	const navigation = useNavigation();
	const { p1, p2 } = useLocalSearchParams<{ p1: string; p2: string }>();
	const [history, setHistory] = useState<StoredOwe[]>([]);

	const theme = useTheme();
	const scheme = useColorScheme();
	const layout = createLayout(theme);
	const card = createCardStyles(theme);
	const typography = createTypography(theme);

	const netCents = history.reduce((total, owe) => {
		return owe.from === p1 ? total + owe.amountCents : total - owe.amountCents;
	}, 0);

	const isSettled = netCents === 0;

	useEffect(() => {
		if (!p1 || !p2) {
			navigation.goBack();
			return;
		}

		(async () => {
			const allOwes = await getOwes();
			const filteredOwes = allOwes.filter(
				owe =>
					(owe.from === p1 && owe.to === p2) ||
					(owe.from === p2 && owe.to === p1)
			);

			filteredOwes.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);

			setHistory(filteredOwes);
		})();
	}, [p1, p2, navigation]);

	return (
		<SafeAreaView style={layout.screen} edges={['top']}>
			<StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />

			{/* Header - Styled like Index.tsx */}
			<View
				style={{ paddingHorizontal: spacing.page, paddingVertical: spacing.sm }}
			>
				<Text style={typography.screenTitle}>Details</Text>
			</View>

			{/* Hero Summary - Using your card container and typography */}
			<View
				style={{ paddingHorizontal: spacing.page, marginBottom: spacing.md }}
			>
				<View style={card.container}>
					<Text style={typography.cardLabel}>Total Net Obligation</Text>
					<Text style={typography.amount}>
						${centsToDollars(Math.abs(netCents))}
					</Text>
					<Text
						style={[
							typography.sectionText,
							isSettled && { color: theme.success }
						]}
					>
						{isSettled
							? 'Perfectly Balanced'
							: netCents > 0
								? `${p1} owes ${p2}`
								: `${p2} owes ${p1}`}
					</Text>
				</View>
			</View>

			{/* Ledger Section */}
			<View style={{ flex: 1 }}>
				<Text style={typography.heading}>Debt Ledger</Text>

				<FlatList
					data={history}
					keyExtractor={item => item.id}
					contentContainerStyle={layout.content}
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => {
						const dateObj = new Date(item.createdAt);
						const isEdited =
							item.updatedAt && item.updatedAt !== item.createdAt;

						const formattedDate = dateObj.toLocaleDateString('en-US', {
							month: 'short',
							day: 'numeric'
						});

						const formattedTime = dateObj.toLocaleTimeString('en-US', {
							hour: 'numeric',
							minute: '2-digit',
							hour12: false
						});

						return (
							<View style={card.container}>
								{/* Transaction Header */}
								<View style={[card.row, { justifyContent: 'space-between' }]}>
									<Text style={typography.sectionTitle}>
										{item.from} → {item.to}
									</Text>
									<Text style={typography.sectionTitle}>
										${centsToDollars(item.amountCents)}
									</Text>
								</View>

								{/* Metadata Row */}
								<View style={card.inputSection}>
									<Text style={typography.mutedText}>
										{formattedDate} • {formattedTime}
										{isEdited && (
											<Text style={typography.dangerText}> • Edited</Text>
										)}
									</Text>

									{item.notes && (
										<Text style={typography.sectionText} numberOfLines={1}>
											Notes: {item.notes}
										</Text>
									)}
								</View>
							</View>
						);
					}}
				/>
			</View>
		</SafeAreaView>
	);
}
