import { Stack } from 'expo-router';

export default function RootLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false // hides default headers globally; optional if you want per-screen headers
			}}
		/>
	);
}
