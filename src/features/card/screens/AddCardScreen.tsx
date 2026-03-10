import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@src/shared/constants/theme';
import { fetchCorporateCard, fetchPersonalCard } from '@src/shared/services/vcardService';
import type { CardType, VCard } from '@src/shared/types';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCardStore } from '../hooks/useCardStore';

const CARD_TYPES: { value: CardType; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
    { value: 'kurumsal', label: 'Kurumsal', icon: 'business' },
    { value: 'bireysel', label: 'Bireysel', icon: 'person' },
];

export default function AddCardScreen() {
    const router = useRouter();
    const { canAddCard, saveCard } = useCardStore();

    const [cardType, setCardType] = useState<CardType>('kurumsal');
    const [companyUsername, setCompanyUsername] = useState('');
    const [username, setUsername] = useState('');
    const [preview, setPreview] = useState<VCard | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const isCorporate = cardType === 'kurumsal';

    const resetForm = () => {
        setPreview(null);
        setErrorMsg('');
        setUsername('');
        setCompanyUsername('');
    };

    const handleFetch = useCallback(async () => {
        const trimmedUsername = username.trim();
        const trimmedCompany = companyUsername.trim();

        if (!trimmedUsername) {
            setErrorMsg('Kullanıcı adı alanı boş olamaz.');
            return;
        }
        if (isCorporate && !trimmedCompany) {
            setErrorMsg('Şirket kullanıcı adı alanı boş olamaz.');
            return;
        }

        setIsLoading(true);
        setErrorMsg('');
        setPreview(null);
        try {
            const card = isCorporate
                ? await fetchCorporateCard(trimmedCompany, trimmedUsername)
                : await fetchPersonalCard(trimmedUsername);
            setPreview(card);
        } catch {
            setErrorMsg('Kart bulunamadı. Kullanıcı adını kontrol edip tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    }, [username, companyUsername, isCorporate]);

    const handleSave = useCallback(async () => {
        if (!preview) return;
        await saveCard(preview);
        router.replace('/');
    }, [preview, saveCard, router]);


    if (!canAddCard) {
        return (
            <SafeAreaView style={styles.limitContainer}>
                <View style={styles.limitIconBg}>
                    <MaterialIcons name="credit-card" size={32} color={colors.primary} />
                </View>
                <Text style={styles.limitTitle}>Kart Limitine Ulaştınız</Text>
                <Text style={styles.limitSub}>
                    Yalnızca 1 kart ekleyebilirsiniz. Yeni kart eklemek için mevcut kartı silin.
                </Text>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>Geri Dön</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Tip Seçimi */}
                    <View style={styles.typeRow}>
                        {CARD_TYPES.map(({ value, label, icon }) => {
                            const isSelected = cardType === value;
                            return (
                                <Pressable
                                    key={value}
                                    onPress={() => { setCardType(value); resetForm(); }}
                                    style={[styles.typeBtn, isSelected && styles.typeBtnSelected]}
                                >
                                    <MaterialIcons
                                        name={icon}
                                        size={24}
                                        color={isSelected ? colors.primary : '#94a3b8'}
                                    />
                                    <Text style={[styles.typeText, isSelected && styles.typeTextSelected]}>
                                        {label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* Şirket Kullanıcı Adı — sadece kurumsal tipinde */}
                    {isCorporate && (
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>ŞİRKET KULLANICI ADI</Text>
                            <View style={[styles.inputWrapper, !!errorMsg && styles.inputError]}>
                                <MaterialIcons name="business" size={20} color="#94a3b8" />
                                <TextInput
                                    value={companyUsername}
                                    onChangeText={(t) => { setCompanyUsername(t); setErrorMsg(''); setPreview(null); }}
                                    placeholder="bidokun"
                                    placeholderTextColor="#94a3b8"
                                    autoCapitalize="none"
                                    style={styles.textInput}
                                />
                            </View>
                        </View>
                    )}

                    {/* Kişisel Kullanıcı Adı */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>KART KULLANICI ADI</Text>
                        <View style={[styles.inputWrapper, !!errorMsg && styles.inputError]}>
                            <MaterialIcons name="person-outline" size={20} color="#94a3b8" />
                            <TextInput
                                value={username}
                                onChangeText={(t) => { setUsername(t); setErrorMsg(''); setPreview(null); }}
                                placeholder="ibrahimokutan"
                                placeholderTextColor="#94a3b8"
                                autoCapitalize="none"
                                style={styles.textInput}
                            />
                        </View>
                    </View>

                    {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

                    <TouchableOpacity
                        onPress={handleFetch}
                        disabled={isLoading}
                        style={[styles.mainBtn, isLoading && styles.btnDisabled]}
                        accessibilityLabel="Kullanıcı adı ile kart sorgula"
                    >
                        {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.mainBtnText}>Kartı Sorgula</Text>}
                    </TouchableOpacity>

                    {/* Preview */}
                    {preview && (
                        <View style={styles.previewCard}>
                            <Text style={styles.previewTag}>ÖNİZLEME · {preview.type}</Text>
                            <Text style={styles.previewName}>
                                {preview.personal_info.first_name} {preview.personal_info.last_name}
                            </Text>
                            <Text style={styles.previewTitle}>{preview.personal_info.title}</Text>

                            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                                <Text style={styles.saveBtnText}>Kartı Kaydet</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f6f7f8' },
    limitContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: 'white' },
    limitIconBg: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(19, 109, 236, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    limitTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
    limitSub: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
    backBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, backgroundColor: '#f1f5f9' },
    backBtnText: { color: '#475569', fontWeight: '600' },
    scrollContent: { padding: 16, gap: 16 },
    typeRow: { flexDirection: 'row', gap: 12 },
    typeBtn: { flex: 1, minHeight: 80, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', gap: 6 },
    typeBtnSelected: { borderColor: colors.primary, backgroundColor: 'rgba(19, 109, 236, 0.05)' },
    typeText: { fontSize: 13, fontWeight: '500', color: '#64748b' },
    typeTextSelected: { color: colors.primary, fontWeight: '600' },
    inputContainer: { gap: 8 },
    inputLabel: { fontSize: 12, fontWeight: '600', color: '#94a3b8', letterSpacing: 1 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 12, minHeight: 52 },
    inputError: { borderColor: '#ef4444' },
    textInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#0f172a' },
    errorText: { color: '#ef4444', fontSize: 12, fontWeight: '500' },
    mainBtn: { minHeight: 52, backgroundColor: colors.primary, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    btnDisabled: { opacity: 0.7 },
    mainBtnText: { color: 'white', fontSize: 15, fontWeight: '600' },
    previewCard: { backgroundColor: 'white', padding: 20, borderRadius: 16, gap: 4, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
    previewTag: { fontSize: 11, fontWeight: '700', color: colors.primary, letterSpacing: 1 },
    previewName: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
    previewTitle: { fontSize: 14, color: '#64748b', marginBottom: 12 },
    saveBtn: { minHeight: 48, backgroundColor: colors.primary, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    saveBtnText: { color: 'white', fontSize: 15, fontWeight: '600' },
});
