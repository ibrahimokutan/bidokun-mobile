import { BottomSafeArea } from '@src/shared/components/BottomSafeArea';
import { CardItem } from '@src/shared/components/CardItem';
import { EmptyState } from '@src/shared/components/EmptyState';
import { Header } from '@src/shared/components/Header';
import { SectionHeader } from '@src/shared/components/SectionHeader';
import { colors } from '@src/shared/constants/theme';
import type { VCard } from '@src/shared/types';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useCardStore } from '../hooks/useCardStore';

const keyExtractor = (item: VCard) => String(item.id);

export default function HomeScreen() {
    const router = useRouter();
    const { card, isLoading, canAddCard } = useCardStore();
    const [search, setSearch] = useState('');

    const filteredCards: VCard[] = card
        ? [card].filter((c) => {
            const q = search.trim().toLowerCase();
            if (!q) return true;
            return (
                c.personal_info.first_name.toLowerCase().includes(q) ||
                c.personal_info.last_name.toLowerCase().includes(q) ||
                c.personal_info.title.toLowerCase().includes(q)
            );
        })
        : [];

    const handleAddPress = useCallback(() => router.push('/add'), [router]);
    const handleCardPress = useCallback((username: string) => router.push(`/card/${username}`), [router]);
    const handleScannerPress = useCallback(() => router.push('/scan'), [router]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.backgroundLight }}>
            <Header
                searchValue={search}
                onSearchChange={setSearch}
                onScannerPress={handleScannerPress}
                showScanner={canAddCard}
            />

            {/* main: flex-1 px-4 py-6 space-y-4 pb-24 */}
            <FlatList
                data={filteredCards}
                keyExtractor={keyExtractor}
                renderItem={({ item }) => (
                    <CardItem card={item} onPress={() => handleCardPress(item.username)} />
                )}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 24,       // py-6
                    paddingBottom: 96,    // pb-24
                    flexGrow: 1,
                }}
                ListHeaderComponent={
                    <SectionHeader canAddCard={canAddCard} onAddPress={handleAddPress} />
                }
                ListEmptyComponent={isLoading ? null : <EmptyState />}
                ListFooterComponent={<BottomSafeArea />}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            />
        </View>
    );
}
