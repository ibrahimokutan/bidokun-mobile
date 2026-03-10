import { Platform } from 'react-native';
import type { VCard } from '../../../shared/types';

/** Bireysel ve kurumsal kartvizit profil sayfalarının subdomain adresi */
const CARD_BASE_URL = 'https://app.bidokun.com';

/**
 * Kart tipine göre QR kodun yönlendireceği URL'i üretir.
 * Bu URL, kartın halka açık profil sayfasıdır.
 *
 * Yapı:
 * Bireysel: https://app.bidokun.com/bi/{username}
 * Kurumsal: https://app.bidokun.com/{companySlug}/{username}
 */
export function generateQrUrl(card: VCard): string {
    if (card.type === 'kurumsal') {
        const slug = card.companySlug ?? 'unknown';
        return `${CARD_BASE_URL}/${slug}/${card.username}`;
    }
    return `${CARD_BASE_URL}/bi/${card.username}`;
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
