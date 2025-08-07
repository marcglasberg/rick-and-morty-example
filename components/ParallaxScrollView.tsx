import { ReactElement, useCallback } from 'react';
import { ActivityIndicator, Button, FlatList, FlatListProps, ListRenderItem, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FetchCards } from '@/business/actions/fetch-cards-action';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useTheme } from '@/hooks/useTheme';
import { useDispatch, useIsFailed } from 'kiss-for-react';

const HEADER_HEIGHT = 250;

// Header content moves at half the scroll speed
const PARALLAX_FACTOR = 0.5; 

// Distance over which opacity changes
const HEADER_OPACITY_SCROLL_DISTANCE = 200; 

// Create an animated version of FlatList
const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<any>>(FlatList);

type Props<T> = Omit<FlatListProps<T>, 'renderItem'> & {
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  headerActions?: ReactElement;
  renderItem: ListRenderItem<T>;
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  contentContainerStyle?: FlatListProps<T>['contentContainerStyle'];
  minHeaderOpacity?: number; 
  loadMoreCallback?: () => void; 
  nextPage?: number | null; 
};

export default function ParallaxScrollView<T>({
  headerImage,
  headerBackgroundColor,
  headerActions,
  renderItem,
  data,
  keyExtractor,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  contentContainerStyle,
  minHeaderOpacity = 0.0, // Default minimum opacity when fully scrolled
  loadMoreCallback,
  nextPage = null, 
  ...flatListProps
}: Props<T>) {
  const theme = useTheme();          
  const isFetchCardsFailed: boolean = useIsFailed(FetchCards);
  const scrollY = useSharedValue(0);
  const flatListRef = useAnimatedRef<FlatList>();
  const bottom = useBottomTabOverflow();
  const insets = useSafeAreaInsets();
  
  // Track if we've triggered the loadMoreCallback, and prevents multiple calls 
  // while scrolling in one direction. Note: This is an optimization to avoid 
  // multiple calls to loadMoreCallback, but it's not strictly necessary, 
  // as `FetchCards` is non-reentrant and handles multiple calls gracefully.
  const hasTriggeredLoadMore = useSharedValue(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      
      // Check if we're near the end of the content to trigger loadMoreCallback
      if (loadMoreCallback && event.contentSize.height > 0) {
        const endThreshold = event.contentSize.height - event.layoutMeasurement.height - 100;
        
        // If we're past the threshold and haven't triggered the callback yet
        if (event.contentOffset.y > endThreshold && !hasTriggeredLoadMore.value) {
          hasTriggeredLoadMore.value = true;
          runOnJS(loadMoreCallback)();
        } 

        // Reset the trigger when scrolling back up
        else if (event.contentOffset.y <= endThreshold && hasTriggeredLoadMore.value) {
          hasTriggeredLoadMore.value = false;
        }
      }
    },
  });

  // Create the animated style for the header content:
  // Move the header content down at half the scroll speed (for positive scroll only).
  const headerContentAnimatedStyle = useAnimatedStyle(() => {

    // For positive scroll (scrolling down):
    // - Apply parallax effect (move at half speed)
    // For negative scroll (pull to refresh):
    // - Stop parallax (no parallax effect)
    const translateY = scrollY.value >= 0 
      ? scrollY.value * PARALLAX_FACTOR 
      : 0;
      
    return {
      transform: [{ translateY }]
    };
  });

  // New animated style for header opacity
  const headerOpacityStyle = useAnimatedStyle(() => {

    // Calculate opacity based on scroll position
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_OPACITY_SCROLL_DISTANCE],
      [1, minHeaderOpacity],
      Extrapolation.CLAMP
    );
    
    return {
      opacity
    };
  });      

  // The "loading cards" indicator, with a spinner.
  const LoadingFooterComponent = () => (
    <ThemedView style={styles.loadingFooter}>
      <ActivityIndicator size="small" />
      <ThemedText style={styles.loadingText}>
        Loading page {nextPage}
      </ThemedText>
    </ThemedView>
  );

  // Manual retry button, when fetching cards fails.
  const ManualRetryComponent = () => {             
    const dispatch = useDispatch();
    
    return (
      <ThemedView style={styles.retryContainer}>
        <ThemedText style={styles.retryText}>
          Failed to load cards
        </ThemedText>
        <Button 
          title="Retry" 
          onPress={() => dispatch(new FetchCards())}
        />
      </ThemedView>
    );
  };

  // Create a header component with the parallax effect.
  const HeaderComponent = useCallback(() => {
    return (
      <>
        {/* Parallax header - full width, no margins */}
        <Animated.View style={[
          styles.headerContainer, 
          { backgroundColor: headerBackgroundColor[theme] },
          headerOpacityStyle
        ]}>
          {/* The header content that moves at a different speed than the scroll */}
          <Animated.View style={[
            styles.headerContentContainer, 
            headerContentAnimatedStyle
          ]}>
            {headerImage}
          </Animated.View>
          
          {headerActions && (
            <View style={[
              styles.headerActions,
              { paddingTop: insets.top > 0 ? insets.top : 0 }
            ]}>
              {headerActions}
            </View>
          )}
        </Animated.View>
        
        {/* Container for the rest of the content with horizontal padding */}
        <View style={styles.contentContainer}>
          {/* The actual content following the header - separate from the parallax header */}
          {ListHeaderComponent && (typeof ListHeaderComponent === 'function' 
            ? <ListHeaderComponent /> 
            : ListHeaderComponent)}
        </View>
      </>
    );
  }, [ListHeaderComponent, headerImage, headerActions, headerBackgroundColor, theme, insets.top, headerContentAnimatedStyle, headerOpacityStyle]);
  return (
    <ThemedView style={styles.container}>
      <AnimatedFlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        scrollIndicatorInsets={{ bottom, top: insets.top }}
        contentContainerStyle={[
          { 
            paddingBottom: bottom,
            paddingTop: 0,
          },
          contentContainerStyle,
        ]}          ListHeaderComponent={HeaderComponent}
        ListFooterComponent={isFetchCardsFailed ? ManualRetryComponent : nextPage !== null ? LoadingFooterComponent : ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        {...flatListProps}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  headerContainer: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
    width: '100%',
    alignSelf: 'stretch',
  },
  headerContentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  headerActions: {
    position: 'absolute',
    top: 0, // Uses insets.top for dynamic safe area
    right: 16,
    zIndex: 20,
  },
  listContent: {
    gap: 16,
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 6,   
    paddingBottom: 24,
    gap: 10,
  },
  loadingText: {
    fontSize: 16,
  },
  retryContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,   
    paddingBottom: 24,
    gap: 12,
  },
  retryText: {
    fontSize: 16,
  },
});