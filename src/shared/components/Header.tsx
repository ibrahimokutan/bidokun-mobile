import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../constants/theme';

interface HeaderProps {
    searchValue: string;
    onSearchChange: (text: string) => void;
    onScannerPress?: () => void;
    showScanner?: boolean;
}

export function Header({ searchValue, onSearchChange, onScannerPress, showScanner = true }: HeaderProps) {
    const [isFocused, setIsFocused] = useState(false);

    // HTML has pt-12 (48px)
    const paddingTop = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 12 : 48;

    return (
        <View style={[styles.container, { paddingTop }]}>
            <View style={styles.topRow}>
                <Text style={styles.logo}>bidokun</Text>
                {showScanner && (
                    <TouchableOpacity style={styles.btnIcon} onPress={onScannerPress}>
                        <MaterialIcons name="qr-code-scanner" size={24} color="#64748b" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchIcon}>
                    <MaterialIcons
                        name="search"
                        size={24}
                        color={isFocused ? colors.primary : '#cbd5e1'}
                    />
                </View>
                <TextInput
                    style={[styles.input, isFocused && styles.inputFocused]}
                    placeholder="Kartları ara..."
                    placeholderTextColor="#94a3b8"
                    value={searchValue}
                    onChangeText={onSearchChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(246, 247, 248, 0.8)', // background-light/80
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0', // slate-200
        paddingHorizontal: 16,
        paddingBottom: 16,
        zIndex: 10,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    logo: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0f172a', // slate-900
        letterSpacing: -0.5,
    },
    btnIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        left: 12,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        zIndex: 1,
    },
    input: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingVertical: 12,
        paddingLeft: 44,
        paddingRight: 16,
        fontSize: 14,
        color: '#0f172a',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    inputFocused: {
        borderColor: colors.primary,
        // Add shadow/ring logic if needed
    },
});
