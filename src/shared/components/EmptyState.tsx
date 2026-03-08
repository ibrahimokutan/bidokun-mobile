import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

export function EmptyState() {
    return (
        <View style={styles.container}>
            <View style={styles.iconCircle}>
                <MaterialIcons name="credit-card" size={40} color={colors.primary} />
            </View>
            <Text style={styles.title}>Henüz kart eklenmedi</Text>
            <Text style={styles.description}>
                NFC kartınızı eklemek için yukarıdaki <Text style={styles.boldText}>+ Yeni Ekle</Text> butonuna dokunun.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        marginTop: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(19, 109, 236, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 20,
    },
    boldText: {
        fontWeight: '600',
        color: colors.primary,
    },
});
