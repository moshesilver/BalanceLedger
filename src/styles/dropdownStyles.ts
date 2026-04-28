import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	outerContainer: {
		zIndex: 1000, // Fix for iOS overlap
		position: 'relative',
		width: '100%'
	},
	input: {
		height: 50,
		borderWidth: 1,
		borderColor: '#ccc',
		paddingHorizontal: 10,
		borderRadius: 8,
		backgroundColor: 'white'
	},
	dropdownContainer: {
		position: 'absolute',
		top: 55, // Just below the TextInput
		left: 0,
		right: 0,
		backgroundColor: 'white',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#eee',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4
	},
	item: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#f0f0f0'
	},
	createItem: {
		backgroundColor: '#f9f9f9'
	},
	itemText: {
		fontSize: 16
	},
	createText: {
		fontSize: 16,
		color: '#007AFF',
		fontWeight: 'bold'
	}
});

export default styles;
