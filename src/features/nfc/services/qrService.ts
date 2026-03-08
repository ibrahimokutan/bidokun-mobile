import { Platform } from 'react-native';
import type { VCard } from '../../../shared/types';

/**
 * Kart tipine göre QR kodun yönlendireceği URL'i üretir.
 * Bu URL, kartın halka açık profil sayfasıdır.
 * 
 * Yapı:
 * Bireysel: https://bidokun.com/bi/{username}
 * Kurumsal: https://bidokun.com/bidokun/{username}
 */
export function generateQrUrl(card: VCard): string {
    const baseUrl = 'https://bidokun.com';
    if (card.type === 'kurumsal') {
        // Kurumsal kartlarda varsayılan olarak 'bidokun' kullanıyoruz
        return `${baseUrl}/bidokun/${card.username}`;
    }
    return `${baseUrl}/bi/${card.username}`;
}

/**
 * HCE için payload URL üretir.
 * QR URL'i ile aynıdır.
 */
export function generateHceUrl(card: VCard): string {
    return generateQrUrl(card);
}

/**
 * Platform ve NFC desteğine göre QR gösterilip gösterilmeyeceğine karar verir.
 */
export function shouldShowQr(isNfcSupported: boolean): boolean {
    if (Platform.OS === 'ios') return true;
    if (Platform.OS === 'android' && !isNfcSupported) return true;
    return false;
}
