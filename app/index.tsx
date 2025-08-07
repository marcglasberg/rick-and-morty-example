import { FetchCards } from '@/business/actions/fetch-cards-action';
import { SelectCard } from '@/business/actions/select-card-actions';
import { ToggleLike } from '@/business/actions/toggle-like-action';
import { ToggleTheme } from '@/business/actions/toggle-theme-action';
import { Card } from '@/business/state/card';
import { State } from '@/business/state/state';
import { triggerHaptic } from '@/components/HapticFeedback';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useIsDarkTheme, useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Href } from 'expo-router/build/typed-routes/types';
import { useDispatch, useIsWaiting, useSelect } from 'kiss-for-react';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Helper to generate typed routes for cards.
function cardRoute(cardId: string): Href {
  return {
    pathname: "/card/[id]",
    params: { id: cardId }
  };
}

export default function HomeScreen() {
  const cards: Card[] = useSelect((state: State) => state.cardList.items);
  const totalCount: number = useSelect((state: State) => state.totalCount);
  const nextPage: number | null = useSelect((state: State) => state.nextPage());
  const likedCards = useSelect((state: State) => state.likedCards);
  const isLoading: boolean = useIsWaiting(FetchCards);
  const dispatch = useDispatch();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const isDarkTheme = useIsDarkTheme();

  useEffect(() => {
    dispatch(new FetchCards());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardPress = (cardId: string) => {
    // Note: Checking `router.canGoBack()` prevents double-tapping 
    // the card to open the details scren card twice.
    if (!router.canGoBack()) {
      triggerHaptic('medium');
      dispatch(new SelectCard(cardId));
      router.push(cardRoute(cardId));
    }
  };

  const handleLikePress = (cardId: string, event: any) => {
    event.stopPropagation();
    triggerHaptic('medium');
    dispatch(new ToggleLike(cardId));
  };

  const renderCard = ({ item }: { item: Card }) => {
    const transparentColor = 'rgba(0, 0, 0, 0)';
    const overlayColor = isDarkTheme
      ? 'rgba(20, 20, 20, 0.50)' // Darker overlay for dark theme
      : 'rgba(255, 255, 255, 0.60)'; // Lighter overlay for light theme

    return (
      <ThemedView style={styles.card}>
        <TouchableHighlight
          onPress={() => handleCardPress(item.id)}
          delayPressIn={60}
          activeOpacity={0.6} // More transparent when pressed
          underlayColor={isDarkTheme ? "rgba(20, 20, 20, 0.8)" : "rgba(240, 240, 240, 0.8)"}
          style={{
            borderRadius: 12,
            overflow: 'hidden'
          }}
        >
          <View style={{ overflow: 'hidden', borderRadius: 12 }}>
            {/* Image spans the entire card */}
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.cardImage}
              contentFit="cover"
            />
            {/* Content overlay with transparent gradient */}
            <LinearGradient
              style={styles.cardContentOverlay}
              colors={[transparentColor, overlayColor, overlayColor]}
              locations={[0, 0.1, 1]} // First 10% is gradient from transparent to semi-transparent
            >
              <ThemedText type="defaultSemiBold" style={[
                styles.cardTitle,
                isDarkTheme ? styles.textShadowDark : styles.textShadowLight,
              ]} numberOfLines={1}>
                {item.title}
              </ThemedText>
              <View style={styles.speciesAndLikeRow}>
                <ThemedText numberOfLines={1} style={[
                  styles.cardDescription,
                  isDarkTheme ? styles.textShadowDark : styles.textShadowLight,
                  styles.expandedText
                ]}>
                  {item.species}</ThemedText>
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={(event) => handleLikePress(item.id, event)}
                >
                  <Ionicons
                    name={likedCards.isCardLiked(item.id) ? "heart" : "heart-outline"}
                    size={32}
                    color={likedCards.isCardLiked(item.id) ? "#ff4b4b" : (isDarkTheme ? "#fff" : "#000")}
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </TouchableHighlight>
      </ThemedView>
    );
  };

  const handleThemeToggle = () => {
    triggerHaptic('medium');
    dispatch(new ToggleTheme({ currentTheme: theme }));
  };

  const HeaderContent = () => (
    <>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
      </ThemedView>

      <ThemedView style={styles.cardListContainer}>
        <ThemedText type="subtitle" style={styles.cardListTitle}>
          {totalCount} cards available
        </ThemedText>
      </ThemedView>
    </>
  );

  // Component for when there are no items.
  const EmptyComponent = () => null;

  const handleLoadMore = () => {
    // Only trigger loading more if we're not already loading.
    if (!isLoading) {
      dispatch(new FetchCards());
    }
  };

  return (
    <ParallaxScrollView
      data={cards}
      keyExtractor={(item: Card) => item.id}
      renderItem={renderCard}
      ListHeaderComponent={HeaderContent}
      ListEmptyComponent={EmptyComponent}
      loadMoreCallback={handleLoadMore}
      nextPage={nextPage}
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/rick-and-morty-hero.png')}
          style={styles.reactLogo}
          contentFit="cover"
        />
      }
      headerActions={
        <TouchableOpacity
          style={[
            styles.themeToggle,
            { marginTop: insets.top > 0 ? insets.top : 10 } // Top margin based on safe area
          ]}
          onPress={handleThemeToggle}
          accessibilityLabel="Toggle light/dark theme"
        >
          <Ionicons
            name={isDarkTheme ? "sunny" : "moon"}
            size={24}
            color={isDarkTheme ? "#6B4E31" : "#6B4E31"}
          />
        </TouchableOpacity>
      }
    />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  }, reactLogo: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  textShadowLight: {
    textShadowColor: 'rgba(255, 255, 255, 1)', // White glow for light mode
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  textShadowDark: {
    textShadowColor: 'rgba(0, 0, 0, 1)', // Black shadow for dark mode
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4C385',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.15)',
    elevation: 3,
  },
  cardListContainer: {
    flex: 1,
    marginBottom: 0,
  },
  cardListTitle: {
    marginBottom: 16,
  },
  cardList: {
    gap: 24,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 24,  // Margin between cards    
    backgroundColor: 'transparent',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.25)',
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 350,
  },
  cardContentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 6,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardTitle: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  cardDescription: {
    marginBottom: 8,
    opacity: 0.9,
    lineHeight: 20,
    fontSize: 16,
  },
  likeButton: {
    padding: 8,
  },
  loadingContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  speciesAndLikeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  expandedText: {
    flex: 1,
  },
});
