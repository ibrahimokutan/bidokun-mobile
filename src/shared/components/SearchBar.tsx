import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
    TextInput,
    View
} from 'react-native';
import { colors } from '../constants/theme';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export function SearchBar({
    value,
    onChangeText,
    placeholder = 'Kartları ara...',
}: SearchBarProps) {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);

    return (
        <View
            className={`flex-row items-center rounded-xl bg-white shadow-sm px-3 py-2 dark:bg-gray-800 ${isFocused ? 'border border-primary' : 'border border-transparent'
                }`}
            style={{ minHeight: 44 }}
        >
            <Ionicons
                name="search-outline"
                size={18}
                color={isFocused ? colors.primary : colors.textMuted}
                style={{ marginRight: 8 }}
            />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="flex-1 text-sm text-slate-900 dark:text-white"
                style={{ fontFamily: 'Inter_400Regular' }}
                accessibilityLabel="Kart arama"
                accessibilityHint="Kart adı veya unvan ile arayın"
                returnKeyType="search"
                clearButtonMode="while-editing"
            />
        </View>
    );
}
