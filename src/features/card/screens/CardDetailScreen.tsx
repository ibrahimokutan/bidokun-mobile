import { MaterialIcons } from '@expo/vector-icons';
import { QRDisplayModal } from '@src/features/nfc/components/QRDisplayModal';
import { useNfc } from '@src/features/nfc/hooks/useNfc';
import { generateQrUrl } from '@src/features/nfc/services/qrService';
import { BottomSafeArea } from '@src/shared/components/BottomSafeArea';
import { colors } from '@src/shared/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCardStore } from '../hooks/useCardStore';

export default function CardDetailScreen() {
    const { username } = useLocalSearchParams<{ username: string }>();
    const router = useRouter();
    const { card, removeCard } = useCardStore();
    const { isChecking, isHceActive, showQr, startHce, stopHce } = useNfc();

    const [qrVisible, setQrVisible] = useState(false);

    if (!card || card.username !== username) {
        return (
            <SafeAreaView style={styles.emptyContainer}>
                <MaterialIcons name="credit-card" size={48} color="#94a3b8" />
                <Text style={styles.emptyText}>Kart bulunamadı.</Text>
                <TouchableOpacity onPress={() => router.replace('/')} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>Geri Dön</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const qrUrl = generateQrUrl(card);
    const fullName = `${card.personal_info.first_name} ${card.personal_info.last_name}`;
    const isCorporate = card.type === 'kurumsal';

    const handleHceToggle = useCallback(async () => {
        if (isHceActive) {
            await stopHce();
        } else {
            await startHce(qrUrl);
        }
    }, [isHceActive, startHce, stopHce, qrUrl]);

    const handleDelete = useCallback(() => {
        Alert.alert(
            'Kartı Sil',
            'Bu kartı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
            [
                { text: 'Vazgeç', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        await stopHce();
                        await removeCard();
                        router.replace('/');
                    },
                },
            ],
        );
    }, [removeCard, router, stopHce]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                    <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Kart Detayı</Text>
                <TouchableOpacity onPress={handleDelete} style={styles.headerBtn}>
                    <MaterialIcons name="delete-outline" size={24} color="#ef4444" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Card Preview Area */}
                <View style={styles.cardWrapper}>
                    <View style={[styles.card, isCorporate && styles.cardCorporate]}>
                        {/* Contactless Icon */}
                        <View style={styles.iconContainer}>
                            <MaterialIcons
                                name="contactless"
                                size={32}
                                color={isCorporate ? 'rgba(19, 109, 236, 0.4)' : '#cbd5e1'}
                            />
                        </View>

                        <View style={styles.cardContent}>
                            <Text style={[styles.typeLabel, isCorporate ? styles.typeCorporate : styles.typePersonal]}>
                                {card.type}
                            </Text>
                            <Text style={styles.name}>{fullName}</Text>
                            <Text style={styles.title}>{card.personal_info.title}</Text>
                        </View>

                        {isCorporate && <View style={styles.blob} />}
                    </View>
                </View>

                {/* Action Section */}
                <View style={styles.actionSection}>
                    <Text style={styles.sectionLabel}>PAYLAŞIM MODU</Text>

                    {isChecking ? (
                        <View style={styles.statusBox}>
                            <ActivityIndicator color={colors.primary} />
                            <Text style={styles.statusText}>NFC kontrol ediliyor...</Text>
                        </View>
                    ) : (
                        <View style={styles.actionBox}>
                            {!showQr ? (
                                /* NFC Mode (Android) */
                                <>
                                    <View style={styles.infoRow}>
                                        <MaterialIcons
                                            name="wifi"
                                            size={24}
                                            color={isHceActive ? '#22c55e' : colors.primary}
                                            style={{ transform: [{ rotate: '90deg' }] }}
                                        />
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.actionTitle}>NFC Paylaşımı</Text>
                                            <Text style={styles.actionSub}>
                                                {isHceActive
                                                    ? 'Yayın aktif! Telefonu okuyucuya yaklaştırın.'
                                                    : 'Cihazı başka bir telefona dokundurarak paylaşın.'}
                                            </Text>
                                        </View>
                                        {isHceActive && <View style={styles.activeDot} />}
                                    </View>

                                    <TouchableOpacity
                                        onPress={handleHceToggle}
                                        style={[styles.actionBtn, isHceActive && styles.btnActive]}
                                    >
                                        <Text style={styles.btnText}>
                                            {isHceActive ? 'Yayını Durdur' : 'Paylaşımı Başlat'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setQrVisible(true)} style={styles.secondaryBtn}>
                                        <Text style={styles.secondaryBtnText}>veya QR Kod göster</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                /* QR Mode (iOS / No NFC) */
                                <>
                                    <View style={styles.infoRow}>
                                        <MaterialIcons name="qr-code" size={24} color={colors.primary} />
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.actionTitle}>QR Kod Paylaşımı</Text>
                                            <Text style={styles.actionSub}>
                                                NFC desteği kısıtlı olduğundan QR kod ile paylaşın.
                                            </Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => setQrVisible(true)}
                                        style={styles.actionBtn}
                                    >
                                        <Text style={styles.btnText}>QR Kodu Göster</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    )}
                </View>

                <BottomSafeArea />
            </ScrollView>

            <QRDisplayModal
                visible={qrVisible}
                url={qrUrl}
                cardName={fullName}
                onClose={() => setQrVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f6f7f8' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 12, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    headerBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
    scrollContent: { padding: 16 },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: '#f6f7f8' },
    emptyText: { fontSize: 15, color: '#64748b' },
    backBtn: { marginTop: 8, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, backgroundColor: 'white', borderWidth: 1, borderColor: '#e2e8f0' },
    backBtnText: { color: '#475569', fontWeight: '600' },
    cardWrapper: { marginBottom: 24 },
    card: { position: 'relative', overflow: 'hidden', backgroundColor: 'white', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 4 },
    cardCorporate: { borderColor: 'rgba(19, 109, 236, 0.2)' },
    iconContainer: { marginBottom: 40 },
    cardContent: { gap: 4 },
    typeLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2 },
    typeCorporate: { color: colors.primary },
    typePersonal: { color: '#64748b' },
    name: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
    title: { fontSize: 15, color: '#64748b' },
    blob: { position: 'absolute', right: -60, bottom: -60, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(19, 109, 236, 0.08)' },
    actionSection: { gap: 12 },
    sectionLabel: { fontSize: 12, fontWeight: '600', color: '#94a3b8', letterSpacing: 1, marginLeft: 4 },
    statusBox: { padding: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    statusText: { marginTop: 12, fontSize: 13, color: '#94a3b8' },
    actionBox: { padding: 20, backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', gap: 20 },
    infoRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
    actionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
    actionSub: { fontSize: 13, color: '#64748b', lineHeight: 18 },
    activeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#22c55e' },
    actionBtn: { minHeight: 52, backgroundColor: colors.primary, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    btnActive: { backgroundColor: '#22c55e' },
    btnText: { color: 'white', fontSize: 15, fontWeight: '700' },
    secondaryBtn: { alignItems: 'center', paddingVertical: 8 },
    secondaryBtnText: { color: colors.primary, fontSize: 13, fontWeight: '500' },
});
