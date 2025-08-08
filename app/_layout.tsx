import { AppPersistor } from '@/business/infra/app-persistor';
import { State } from '@/business/state/state';
import { useIsDarkTheme } from '@/hooks/useTheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ShowUserException, StoreProvider, createStore } from 'kiss-for-react';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Linking, Platform, StyleSheet, Text, View } from 'react-native';
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
  
  // Initialize dimensions state - use consistent source
  const [dimensions, setDimensions] = useState(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    };
  });

  // Update dimensions on window resize (web only)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleResize = () => {
        // Use window dimensions directly for accurate real-time values
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const windowWidth = dimensions.width;

  // Detect if running on mobile web browser
  const isMobileWeb = Platform.OS === 'web' && typeof window !== 'undefined' && 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);

  // Show phone skin only on desktop web, not mobile web
  if (Platform.OS === 'web' && !isMobileWeb) {
    return (
      <View style={styles.webContainer}>
        {/* Phone device with pure CSS sizing */}
        <View style={styles.phoneDevice}>
          {/* Phone frame */}
          <View style={styles.phoneFrame}>
            {/* Notch */}
            <View style={styles.notch} />
            
            {/* Volume buttons */}
            <View style={styles.volumeUp} />
            <View style={styles.volumeDown} />
            
            {/* Power button */}
            <View style={styles.powerButton} />
            
            {/* Screen area */}
            <View style={styles.phoneScreen}>
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
        </View>        
         
        {windowWidth > 760 && (
          <View style={styles.webFooter}>
            <Text style={styles.footerBold}>Rick and Morty Example</Text>            
            <View style={styles.footerLinks}>              
              <Text 
                  style={styles.sourceCode} 
                  onPress={() => Linking.openURL('https://github.com/marcglasberg/rick-and-morty-example')}
                >Source code on Github</Text>
            </View>
            <Text style={styles.footerBullet}>React Native app using:</Text>
            <View style={styles.footerLinks}>
              <Text style={styles.footerBullet}>• </Text>
              <Text 
                style={styles.footerLink} 
                onPress={() => Linking.openURL('https://expo.dev')}
              >
                Expo
              </Text>
            </View>
            <View style={styles.footerLinks}>
              <Text style={styles.footerBullet}>• </Text>
              <Text 
                style={styles.footerLink} 
                onPress={() => Linking.openURL('https://kissforreact.org')}
              >
                Kiss state management
              </Text>              
            </View>
            <View style={styles.footerLinks}>
              <Text style={styles.footerBullet}>• </Text>
              <Text 
                style={styles.footerLink} 
                onPress={() => Linking.openURL('https://rickandmortyapi.com/')}
              >
                Rick and Morty API
              </Text>              
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemeProvider value={isDarkTheme ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="card" options={{ headerShown: false }} />        
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={isDarkTheme ? 'light' : 'dark'} />
      </ThemeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  phoneDevice: {
    width: 400,
    maxWidth: '90%',
    height: 800,
    maxHeight: '90%',
    aspectRatio: '400/800',
  },
  phoneFrame: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 40,
    padding: 10,
    boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 30,
    overflow: 'hidden',
  },
  notch: {
    position: 'absolute',
    top: 10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 180,
    height: 30,
    backgroundColor: '#000',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10,
  },
  volumeUp: {
    position: 'absolute',
    left: -3,
    top: 150,
    width: 3,
    height: 40,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  volumeDown: {
    position: 'absolute',
    left: -3,
    top: 200,
    width: 3,
    height: 40,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  powerButton: {
    position: 'absolute',
    right: -3,
    top: 180,
    width: 3,
    height: 60,
    backgroundColor: '#1a1a1a',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  webFooter: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    maxWidth: 400,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 14,
    lineHeight: 20,
  },
  footerBold: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  footerBullet: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 14,
    marginRight: 4,
  },
  footerLink: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  sourceCode: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 14,
    textDecorationLine: 'underline',
    paddingBottom: 24,
  },
});

