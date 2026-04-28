import { StyleSheet, TextStyle, useColorScheme } from 'react-native';

export type Theme = {
	background: string;
	surface: string;
	surfaceElevated: string;
	border: string;

	primary: string;
	success: string;
	danger: string;

	textPrimary: string;
	textSecondary: string;
	textMuted: string;

	paid: string;
};

export const lightTheme: Theme = {
	background: '#F2F4F8',
	surface: '#FFFFFF',
	surfaceElevated: '#FFFFFF',
	border: '#E6E8EC',

	primary: '#2563EB',
	success: '#16A34A',
	danger: '#DC2626',

	textPrimary: '#0F172A',
	textSecondary: '#475569',
	textMuted: '#94A3B8',

	paid: '#DCFCE7'
};

export const darkTheme: Theme = {
	background: '#0B0F1A',
	surface: '#121826',
	surfaceElevated: '#1A2235',
	border: '#1F2937',

	primary: '#3B82F6',
	success: '#22C55E',
	danger: '#EF4444',

	textPrimary: '#F8FAFC',
	textSecondary: '#CBD5E1',
	textMuted: '#64748B',

	paid: '#064E3B'
};

export const useTheme = (): Theme => {
	const scheme = useColorScheme();
	return scheme === 'dark' ? darkTheme : lightTheme;
};

/* ---------------------------------- */
/* SPACING */
/* ---------------------------------- */

export const spacing = {
	page: 20,
	xs: 6,
	sm: 10,
	md: 16,
	lg: 22,
	xl: 32
};

/* ---------------------------------- */
/* LAYOUT */
/* ---------------------------------- */

export const createLayout = (theme: Theme) =>
	StyleSheet.create({
		screen: {
			flex: 1,
			backgroundColor: theme.background
		},
		content: {
			paddingHorizontal: spacing.page,
			paddingBottom: spacing.xl
		}
	});

/* ---------------------------------- */
/* TYPOGRAPHY */
/* ---------------------------------- */

export const createTypography = (theme: Theme) => ({
	screenTitle: {
		fontSize: 28,
		fontWeight: '700' as TextStyle['fontWeight'],
		color: theme.textPrimary,
		letterSpacing: -0.5
	},
	screenTitleSpacing: {
		marginBottom: spacing.lg
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600' as TextStyle['fontWeight'],
		color: theme.textPrimary
	},
	heading: {
		fontSize: 18,
		fontWeight: '700' as TextStyle['fontWeight'],
		color: theme.textPrimary,
		paddingHorizontal: spacing.page,
		marginVertical: spacing.sm
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '600' as TextStyle['fontWeight'],
		color: '#FFFFFF'
	},
	mutedText: {
		fontSize: 15,
		color: theme.textSecondary
	},
	cardSecondaryText: {
		fontSize: 15,
		color: theme.textSecondary,
		fontWeight: '500' as TextStyle['fontWeight']
	},
	dangerText: {
		fontSize: 15,
		fontWeight: '600' as TextStyle['fontWeight'],
		color: theme.danger
	},

	secondaryActionText: {
		fontSize: 15,
		fontWeight: '500' as TextStyle['fontWeight'],
		color: theme.textSecondary
	},

	/* EntryDetails */
	amount: {
		fontSize: 22,
		fontWeight: '700' as const,
		color: theme.textPrimary,
		marginTop: spacing.xs
	},
	cardLabel: {
		fontSize: 15,
		color: theme.textSecondary,
		marginTop: spacing.xs
	},
	cardValue: {
		fontSize: 15,
		fontWeight: '500' as const,
		color: theme.textPrimary,
		marginTop: spacing.xs
	},
	sectionText: {
		fontSize: 15,
		color: theme.textSecondary,
		marginTop: spacing.sm
	}
});

/* ---------------------------------- */
/* CARD */
/* ---------------------------------- */

export const createCardStyles = (theme: Theme) =>
	StyleSheet.create({
		container: {
			backgroundColor: theme.surfaceElevated,
			borderRadius: 18,
			padding: spacing.md,
			marginBottom: spacing.sm,

			shadowColor: '#000',
			shadowOffset: { width: 0, height: 6 },
			shadowOpacity: 0.08,
			shadowRadius: 18,
			elevation: 6,

			borderWidth: 1,
			borderColor: theme.border
		},

		inputSection: {
			marginTop: spacing.sm
		},

		row: {
			flexDirection: 'row',
			gap: spacing.sm,
			alignItems: 'center'
		},

		settingsAction: {
			paddingVertical: spacing.sm
		},

		/* Added spacing helpers */
		section: {
			marginBottom: spacing.md
		},
		sectionTight: {
			marginBottom: spacing.sm
		},
		sectionWide: {
			marginBottom: spacing.lg
		},

		tollRemoveButton: {
			position: 'absolute',
			top: spacing.xs,
			right: spacing.xs,
			width: 28,
			height: 28,
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: 5,
			paddingBottom: spacing.xs
		},
		tollRemoveButtonText: {
			fontSize: 16,
			color: theme.danger,
			fontWeight: '700' as TextStyle['fontWeight']
		},

		/* CARD - PARTICIPANTS */
		participantInput: {
			borderWidth: 1,
			borderColor: theme.border,
			borderRadius: 12,
			paddingHorizontal: 12,
			paddingVertical: 10,
			flex: 1,
			fontSize: 16,
			color: theme.textPrimary,
			backgroundColor: theme.surface
		},

		participantRemove: {
			fontSize: 18,
			color: theme.danger,
			fontWeight: '700' as TextStyle['fontWeight'],
			paddingHorizontal: 4
		},

		smallCheckboxContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: spacing.xs
		},

		smallCheckbox: {
			width: 18,
			height: 18,
			borderWidth: 1,
			borderColor: theme.border,
			borderRadius: 4,
			marginRight: spacing.xs,
			justifyContent: 'center',
			alignItems: 'center'
		},

		smallCheckboxTick: {
			fontSize: 12,
			color: theme.primary,
			fontWeight: '700' as TextStyle['fontWeight']
		},

		smallCheckboxLabel: {
			fontSize: 13,
			color: theme.textSecondary
		}
	});

/* ---------------------------------- */
/* BUTTONS */
/* ---------------------------------- */

export const createButtonStyles = (theme: Theme) =>
	StyleSheet.create({
		primary: {
			backgroundColor: theme.primary,
			borderRadius: 14,
			paddingVertical: spacing.md,
			alignItems: 'center'
		},
		success: {
			backgroundColor: theme.success,
			borderRadius: 14,
			paddingVertical: spacing.sm,
			paddingHorizontal: spacing.md,
			alignItems: 'center'
		},
		muted: {
			backgroundColor: theme.surface,
			borderRadius: 14,
			paddingVertical: spacing.sm,
			paddingHorizontal: spacing.md,
			alignItems: 'center',
			borderWidth: 1,
			borderColor: theme.border
		},
		mutedText: {
			color: theme.textPrimary,
			fontWeight: '500' as TextStyle['fontWeight']
		},
		submitSpacing: {
			marginTop: spacing.lg
		},
		disabled: {
			opacity: 0.4
		}
	});

export const createInputStyles = (theme: Theme) =>
	StyleSheet.create({
		input: {
			borderWidth: 1,
			borderColor: theme.border,
			borderRadius: 12,
			paddingHorizontal: 14,
			paddingVertical: 12,
			fontSize: 16,
			color: theme.textPrimary,
			backgroundColor: theme.surface
		}
	});

export const createSegmentStyles = (theme: Theme) =>
	StyleSheet.create({
		wrapper: {
			flexDirection: 'row',
			gap: spacing.sm
		},
		segment: {
			flex: 1,
			paddingVertical: spacing.sm,
			borderRadius: 12,
			alignItems: 'center',
			borderWidth: 1,
			borderColor: theme.border,
			backgroundColor: theme.surface
		},
		segmentActive: {
			backgroundColor: theme.primary,
			borderColor: theme.primary
		},
		segmentText: {
			fontWeight: '600',
			color: theme.textPrimary
		},
		segmentTextActive: {
			color: '#FFFFFF'
		}
	});

/* ---------------------------------- */
/* PICKER (Date / Time) */
/* ---------------------------------- */

export const createPickerStyles = (theme: Theme) =>
	StyleSheet.create({
		overlay: {
			flex: 1,
			backgroundColor: 'rgba(0,0,0,0.4)',
			justifyContent: 'center',
			alignItems: 'center'
		},

		container: {
			width: '90%',

			backgroundColor: theme.surfaceElevated,
			borderRadius: 18,
			padding: spacing.lg,

			borderWidth: 1,
			borderColor: theme.border,

			shadowColor: '#000',
			shadowOffset: { width: 0, height: 6 },
			shadowOpacity: 0.15,
			shadowRadius: 20,
			elevation: 10
		},

		row: {
			flexDirection: 'row',
			justifyContent: 'space-between'
		},

		column: {
			flex: 1,
			marginHorizontal: spacing.xs
		},

		label: {
			fontSize: 14,
			fontWeight: '600' as TextStyle['fontWeight'],
			color: theme.textPrimary,
			textAlign: 'center',
			marginBottom: spacing.xs
		},

		scroll: {
			maxHeight: 150
		},

		item: {
			fontSize: 15,
			color: theme.textSecondary,
			paddingVertical: spacing.xs,
			paddingHorizontal: spacing.sm,
			textAlign: 'center',
			borderRadius: 8
		},

		selected: {
			color: theme.primary,
			fontWeight: '600' as TextStyle['fontWeight'],
			backgroundColor: theme.surface,
			borderRadius: 8
		}
	});

/* ---------------------------------- */
/* DEBUG / DEV TOOLS */
/* ---------------------------------- */

export const createDebugStyles = (theme: Theme) =>
	StyleSheet.create({
		triggerText: {
			fontSize: 15,
			fontWeight: '600' as TextStyle['fontWeight'],
			color: theme.primary
		},

		modalOverlay: {
			flex: 1,
			backgroundColor: 'rgba(0,0,0,0.35)',
			justifyContent: 'center',
			alignItems: 'center',
			paddingHorizontal: spacing.md
		},

		modalContainer: {
			width: '100%',
			maxHeight: '85%',
			backgroundColor: theme.surfaceElevated,
			borderRadius: 18,
			padding: spacing.md,
			borderWidth: 1,
			borderColor: theme.border
		},

		modalContent: {
			paddingBottom: spacing.sm
		},

		jsonText: {
			fontFamily: 'Courier',
			fontSize: 14,
			color: theme.textPrimary
		}
	});
