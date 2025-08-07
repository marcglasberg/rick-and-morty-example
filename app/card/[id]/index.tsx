import { triggerHaptic } from '@/components/HapticFeedback';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ToggleLike } from '@/business/actions/toggle-like-action';
import { State } from '@/business/state/state';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useIsDarkTheme } from '@/hooks/useTheme';
import { useDispatch, useSelect } from 'kiss-for-react';

export default function CardDetailScreen() {

    const { id } = useLocalSearchParams() as { id: string };
    const router = useRouter();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const isDarkTheme = useIsDarkTheme();
    const card = useSelect((state: State) => state.cardList.find(id));
    const isLiked = useSelect((state: State) => state.likedCards.isCardLiked(id));

    if (!card) {
        return (
            <ThemedView style={styles.notFound}>
                <ThemedText>Card not found</ThemedText>
                <ThemedText>Deep Linking not implemented</ThemedText>
                {
                    /*                                   
                    Note: Deep Linking not implemented because this would be needed for web only, 
                    and this app is meant to be a mobile app. The app will show "Card not found" 
                    if we type http://localhost:8081/card/1 directly in the browser, because the 
                    card data hasn't been loaded yet. To fix it, we need to: 
                    - Fetch cards when the component loads if they aren't available
                    - Show a loading state while fetching
                    - Handle proper navigation regardless of entry point 
                    */
                }
                <TouchableOpacity onPress={() => {
                    triggerHaptic('medium');
                    router.navigate('/');
                }} style={styles.backToHome}>
                    <ThemedText>Home</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    const handleLikePress = () => {
        triggerHaptic('medium');
        dispatch(new ToggleLike(card.id));
    };

    const handleBackPress = () => {
        triggerHaptic('medium');
        router.back();
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={[
                styles.header,
                {
                    paddingTop: ((insets.top > 0) ? insets.top : 0),
                    paddingBottom: 0,
                }
            ]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBackPress}
                    accessibilityLabel="Go back"
                >
                    <Ionicons
                        name="arrow-back"
                        size={26}
                        color={isDarkTheme ? "#FFFFFF" : "#000000"}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.likeButton}
                    onPress={handleLikePress} accessibilityLabel={isLiked ? "Unlike card" : "Like card"}
                >
                    <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={32}
                        color={isLiked ? "#ff4b4b" : (isDarkTheme ? "#FFFFFF" : "#000000")}
                    />
                </TouchableOpacity>
            </ThemedView>

            <Image
                source={{ uri: card.imageUrl }}
                style={styles.image}
                contentFit="cover"
            />

            <ThemedView style={styles.content} variant="card">
                <ThemedText type="title" style={[
                    styles.title,
                    isDarkTheme ? styles.textShadowDark : styles.textShadowLight
                ]}>{card.title}</ThemedText>
                <ThemedView style={styles.descriptionContainer}>
                    {card.getDescriptionItems().map((item, index) => (
                        <ThemedText
                            key={index}
                            style={[
                                styles.description,
                                isDarkTheme ? styles.textShadowDark : styles.textShadowLight
                            ]}
                        >
                            {item}
                        </ThemedText>
                    ))}
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },    
    textShadowLight: {
        textShadowColor: 'rgba(255, 255, 255, 0.9)', // White glow for light mode
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    textShadowDark: {
        textShadowColor: 'rgba(0, 0, 0, 0.9)', // Black shadow for dark mode
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    image: {
        width: '100%',
        height: 330,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    }, backButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backToHome: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(125, 125, 125, 0.4)',
        elevation: 3,
    },
    likeButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: 24,
        marginTop: -20, // Overlapps image slightly because of the round corners.
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        marginBottom: 16,
    },
    descriptionContainer: {
        marginTop: 8,
        backgroundColor: 'transparent',
    },
    description: {
        fontFamily: 'SpaceMono',
        fontSize: 13,
        lineHeight: 24,
    },
    notFound: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});
