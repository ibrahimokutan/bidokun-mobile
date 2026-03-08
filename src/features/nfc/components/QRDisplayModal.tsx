import { Ionicons } from '@expo/vector-icons';
import { colors } from '@src/shared/constants/theme';
import React, { useCallback, useRef } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRDisplayModalProps {
    visible: boolean;
    url: string;
    cardName: string;
    onClose: () => void;
}

export function QRDisplayModal({ visible, url, cardName, onClose }: QRDisplayModalProps) {
    const svgRef = useRef<any>(null);

    const handleShare = useCallback(async () => {
        try {
            await Share.share({
                message: `${cardName} dijital kartı: ${url}`,
                url,
            });
        } catch {
            Alert.alert('Paylaşım', 'Paylaşım sırasında bir hata oluştu.');
        }
    }, [url, cardName]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={onClose} />
                <View style={styles.contentContainer}>
                    {/* Handle */}
                    <View style={styles.handle} />

                    {/* Başlık */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>QR Kod ile Paylaş</Text>
                        <Pressable
                            onPress={onClose}
                            style={styles.closeBtn}
                            accessibilityLabel="Kapat"
                        >
                            <Ionicons name="close" size={20} color={colors.textMuted} />
                        </Pressable>
                    </View>

                    {/* QR Kod Section */}
                    <View style={styles.qrWrapper}>
                        <View style={styles.qrContainer}>
                            <QRCode
                                value={url}
                                size={180} // Optimized size to avoid overflow
                                color="#000000"
                                backgroundColor="white"
                                getRef={(ref) => {
                                    svgRef.current = ref;
                                }}
                            />
                        </View>
                        <Text style={styles.cardNameText} numberOfLines={1}>
                            {cardName}
                        </Text>
                    </View>

                    {/* URL Display */}
                    <View style={styles.urlBox}>
                        <Text style={styles.urlText} numberOfLines={1}>
                            {url}
                        </Text>
                    </View>

                    {/* Paylaş butonu */}
                    <TouchableOpacity
                        onPress={handleShare}
                        activeOpacity={0.8}
                        style={styles.shareBtn}
                    >
                        <Ionicons name="share-outline" size={20} color="white" />
                        <Text style={styles.shareBtnText}>Bağlantıyı Paylaş</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    contentContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 40,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#e2e8f0',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrWrapper: {
        alignItems: 'center',
        marginBottom: 24,
    },
    qrContainer: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
        marginBottom: 16,
    },
    cardNameText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    urlBox: {
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginBottom: 24,
    },
    urlText: {
        fontSize: 12,
        color: '#64748b',
        textAlign: 'center',
    },
    shareBtn: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    shareBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
