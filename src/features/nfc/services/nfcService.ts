import { Platform } from 'react-native';
import NfcManager from 'react-native-nfc-manager';

let _initialized = false;

async function ensureInitialized(): Promise<void> {
    if (_initialized) return;
    await NfcManager.start();
    _initialized = true;
}

/**
 * Cihazın NFC donanımını destekleyip desteklemediğini kontrol eder.
 */
export async function isNfcSupported(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;
    try {
        return await NfcManager.isSupported();
    } catch {
        return false;
    }
}

/**
 * NFC + HCE desteklenip desteklenmediğini kontrol eder.
 */
export async function isHceSupported(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;
    try {
        await ensureInitialized();
        const nfcOk = await NfcManager.isSupported();
        if (!nfcOk) return false;
        const enabled = await NfcManager.isEnabled();
        return enabled;
    } catch {
        return false;
    }
}

// ─── HCE Session Management ───────────────────────────────────

let _hceSession: any = null;

/**
 * HCE modunu başlatır — kart URL'ini NFC Type 4 Tag olarak yayınlar.
 * Karşı cihaz telefona dokunduğunda bu URL'yi NDEF olarak okur.
 */
export async function startHceMode(url: string): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
        const { HCESession, NFCTagType4, NFCTagType4NDEFContentType } = require('react-native-hce');

        const tag = new NFCTagType4({
            type: NFCTagType4NDEFContentType.URL,
            content: url,
            writable: false,
        });

        _hceSession = await HCESession.getInstance();
        _hceSession.setApplication(tag);
        await _hceSession.setEnabled(true);
    } catch (error) {
        console.warn('[HCE] startHceMode error:', error);
        throw error;
    }
}

/**
 * HCE modunu durdurur.
 */
export async function stopHceMode(): Promise<void> {
    if (Platform.OS !== 'android') return;
    try {
        if (_hceSession) {
            await _hceSession.setEnabled(false);
            _hceSession = null;
        }
    } catch {
        // Sessizce hata yut — zaten durdurulmuş olabilir
    }
}
