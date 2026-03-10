import { MaterialIcons } from '@expo/vector-icons';
import { HttpError } from '@src/shared/services/httpClient';
import { fetchVCardFromUrl } from '@src/shared/services/vcardService';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCardStore } from '../hooks/useCardStore';

export default function ScannerScreen() {
    const router = useRouter();
    const { saveCard } = useCardStore();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!permission) {
        // Camera permissions are still loading.
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.message}>Kameraya erişim izni vermeniz gerekiyor.</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.button}>
                    <Text style={styles.buttonText}>İzin Ver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        if (scanned || loading) return;
        setScanned(true);
        setLoading(true);

        try {
            // app.bidokun.com domain ve path yapısını doğrula
            const isValidBidokunUrl =
                data.startsWith('https://app.bidokun.com/') &&
                (data.includes('/bi/') || data.split('/').filter(Boolean).length >= 4);
            if (!isValidBidokunUrl) {
                throw new Error('Geçersiz bidokun QR kodu. Lütfen bidokun kartı QR kodunu okutun.');
            }

            const card = await fetchVCardFromUrl(data);

            Alert.alert(
                'Kart Bulundu',
                `${card.personal_info.first_name} ${card.personal_info.last_name} adlı kişiyi listenize eklemek istiyor musunuz?`,
                [
                    {
                        text: 'Vazgeç',
                        style: 'cancel',
                        onPress: () => {
                            setScanned(false);
                            setLoading(false);
                        }
                    },
                    {
                        text: 'Ekle',
                        onPress: async () => {
                            await saveCard(card);
                            router.replace('/');
                        }
                    }
                ]
            );
        } catch (error) {
            const message =
                error instanceof HttpError && error.status === 404
                    ? 'Bu QR koda ait kart bulunamadı. Kartın var olduğundan emin olun.'
                    : error instanceof Error
                        ? error.message
                        : 'Bir hata oluştu. Lütfen tekrar deneyin.';
            Alert.alert('Kart Bulunamadı', message);
            setScanned(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
            />

            <View style={styles.overlay}>
                <View style={styles.unfocusedContainer} />
                <View style={styles.middleContainer}>
                    <View style={styles.unfocusedContainer} />
                    <View style={styles.focusedContainer}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                    <View style={styles.unfocusedContainer} />
                </View>
                <View style={styles.unfocusedContainer} />
            </View>

            <View style={styles.bottomControls}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                    <MaterialIcons name="close" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.hint}>QR kodu hizalayın</Text>
            </View>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: 'white',
    },
    button: {
        backgroundColor: '#136dec',
        padding: 12,
        borderRadius: 8,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    unfocusedContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    middleContainer: {
        flexDirection: 'row',
        height: 250,
    },
    focusedContainer: {
        width: 250,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: '#136dec',
        borderWidth: 4,
    },
    topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
    topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
    bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
    bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
    bottomControls: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        gap: 16,
    },
    closeBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hint: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
