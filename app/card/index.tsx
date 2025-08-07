import { Redirect } from 'expo-router';

// This file is needed to prevent the "card" header from showing
// It redirects to the main screen
export default function CardIndexScreen() {
  return <Redirect href="/" />;
}
