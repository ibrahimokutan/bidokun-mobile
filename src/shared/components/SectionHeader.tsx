import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/theme';

interface SectionHeaderProps {
    canAddCard: boolean;
    onAddPress: () => void;
}

export function SectionHeader({ canAddCard, onAddPress }: SectionHeaderProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>KARTLARIM</Text>
            {canAddCard && (
                <TouchableOpacity
                    onPress={onAddPress}
                    style={styles.addButton}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="add" size={18} color={colors.primary} />
                    <Text style={styles.addText}>Yeni Ekle</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        marginBottom: 16, // space-y-4 concept
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748b', // slate-500
        letterSpacing: 1, // tracking-wider
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    addText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
    },
});
