import { SelectCard } from '@/business/actions/select-card-action';
import { triggerHaptic } from '@/components/HapticFeedback';
import { useFocusEffect, useRouter, type Href } from 'expo-router';
import { useDispatch } from 'kiss-for-react';
import { useCallback, useRef } from 'react';

export function useOpenCard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const openingCard = useRef(false);

  // Router 58 queues navigation until commit. Gate repeated presses immediately
  // and release the gate when Back gives the list focus again.
  useFocusEffect(useCallback(() => {
    openingCard.current = false;
  }, []));

  return (cardId: string) => {
    // Home can legitimately retain history after a cold detail -> Home visit.
    // History is not a duplicate-press signal; the immediate gate is.
    if (!openingCard.current) {
      openingCard.current = true;
      try {
        triggerHaptic('medium');
        dispatch(new SelectCard(cardId));
        router.push({ pathname: '/card/[id]', params: { id: cardId } } satisfies Href);
      } catch (error) {
        openingCard.current = false;
        throw error;
      }
    }
  };
}
