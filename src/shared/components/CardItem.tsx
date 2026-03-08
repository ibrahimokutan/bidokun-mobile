import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/theme';
import type { VCard } from '../types';

interface CardItemProps {
    card: VCard;
    onPress: () => void;
}

const CardItem = React.memo(function CardItem({ card, onPress }: CardItemProps) {
    const isCorporate = card.type === 'kurumsal';
    const fullName = `${card.personal_info.first_name} ${card.personal_info.last_name}`;

    return (
        /**
         * Two-layer structure:
         * - shadowContainer: owns the shadow (no overflow:hidden, so shadow works on Android)
         * - clipContainer: owns the border + overflow:hidden for rounded clipping
         */
        <View style={styles.shadowContainer}>
            <View style={styles.clipContainer}>
                <TouchableOpacity
                    onPress={onPress}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel={`${fullName}, ${card.personal_info.title}`}
                    style={styles.card}
                >
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="contactless" size={24} color="#94a3b8" />
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Text style={[styles.typeLabel, isCorporate ? styles.typeCorporate : styles.typePersonal]}>
                            {card.type}
                        </Text>
                        <Text style={styles.name} numberOfLines={1}>
                            {fullName}
                        </Text>
                        <Text style={styles.title} numberOfLines={1}>
                            {card.personal_info.title}
                        </Text>
                    </View>

                    {/* Blob */}
                    {isCorporate && <View style={styles.blob} />}
                </TouchableOpacity>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    // Outer layer: SHADOW only — no overflow:hidden so shadow renders on Android
    shadowContainer: {
        marginBottom: 16,
        borderRadius: 14,
        backgroundColor: '#ffffff', // needed for elevation shadow on Android
        shadowColor: '#64748b',      // slate-500 — soft colored shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    // Inner layer: thin border + clips children to rounded corners
    clipContainer: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#e2e8f0',      // slate-200 — whisper-thin line border
        overflow: 'hidden',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 24,
    },
    iconContainer: {
        marginBottom: 32,
    },
    content: {
        gap: 4,
    },
    typeLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    typeCorporate: {
        color: colors.primary,
    },
    typePersonal: {
        color: '#64748b',
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        lineHeight: 24,
    },
    title: {
        fontSize: 14,
        color: '#64748b',
    },
    blob: {
        position: 'absolute',
        right: -40,
        bottom: -40,
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: 'rgba(19, 109, 236, 0.07)',
    },
});

export { CardItem };

