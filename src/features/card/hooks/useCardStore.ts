import * as storageService from '@src/shared/services/storageService';
import type { VCard } from '@src/shared/types';
import { useCallback, useEffect, useState } from 'react';

interface CardStore {
    card: VCard | null;
    isLoading: boolean;
    canAddCard: boolean;
    loadCard: () => Promise<void>;
    saveCard: (card: VCard) => Promise<void>;
    removeCard: () => Promise<void>;
}

export function useCardStore(): CardStore {
    const [card, setCard] = useState<VCard | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadCard = useCallback(async () => {
        setIsLoading(true);
        try {
            const stored = await storageService.getCard();
            setCard(stored);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const saveCard = useCallback(async (newCard: VCard) => {
        await storageService.saveCard(newCard);
        setCard(newCard);
    }, []);

    const removeCard = useCallback(async () => {
        await storageService.deleteCard();
        setCard(null);
    }, []);

    useEffect(() => {
        void loadCard();
    }, [loadCard]);

    return {
        card,
        isLoading,
        canAddCard: card === null,
        loadCard,
        saveCard,
        removeCard,
    };
}
