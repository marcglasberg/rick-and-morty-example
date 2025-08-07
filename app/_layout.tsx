import { AppPersistor } from '@/business/infra/app-persistor';
import { State } from '@/business/state/state';
import { useIsDarkTheme } from '@/hooks/useTheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ShowUserException, StoreProvider, createStore } from 'kiss-for-react';
import React from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

export const userExceptionDialog: ShowUserException =
  (exception, count, next) => {

    // Use browser's alert on web
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.alert(exception.title ? `${exception.title}\n${exception.message}` : exception.message);
      }
      next();
    }
    //
    // Use React Native's Alert on mobile
    else {
      Alert.alert(
        exception.title || exception.message,
        exception.title ? exception.message : '',
        [{ text: 'OK', onPress: (_value?: string) => next() }]
      );
    }
  };

const store = createStore<State>({
  initialState: State.initialState,
  logger: console.log,
  logStateChanges: true,
  showUserException: userExceptionDialog,
  persistor: new AppPersistor(),
});

// IMPORTANT:
// Uncomment the following line to use the simulated DAO for testing.
// setDao(new SimulatedDao());

export default function RootLayout() {

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <StoreProvider store={store}>
      <MainAppLayout />
    </StoreProvider>
  );
}

function MainAppLayout() {

  const isDarkTheme = useIsDarkTheme();

  return (
    <View style={[styles.container, Platform.OS === 'web' && styles.webContainer]}>
      <View style={Platform.OS === 'web' && styles.webContentWrapper}>
        <ThemeProvider value={isDarkTheme ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="card" options={{ headerShown: false }} />        
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style={isDarkTheme ? 'light' : 'dark'} />
        </ThemeProvider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    backgroundColor: '#222222',
    alignItems: 'center',
  },
  webContentWrapper: {
    maxWidth: 400,
    width: '100%',
    flex: 1,
  },
});

