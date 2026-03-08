import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as nfcService from '../services/nfcService';
import { shouldShowQr } from '../services/qrService';

interface NfcState {
    /** NFC donanım desteği var mı? */
    isNfcSupported: boolean;
    /** NFC + HCE aktif mi */
    isHceSupported: boolean;
    /** Yüklenme durumu */
    isChecking: boolean;
    /** HCE şu an yayın yapıyor mu */
    isHceActive: boolean;
    /** QR gösterilmeli mi (iOS || NFC desteksiz Android) */
    showQr: boolean;
    /** HCE başlat */
    startHce: (url: string) => Promise<void>;
    /** HCE durdur */
    stopHce: () => Promise<void>;
}

export function useNfc(): NfcState {
    const [isNfcSupported, setIsNfcSupported] = useState(false);
    const [isHceSupported, setIsHceSupported] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [isHceActive, setIsHceActive] = useState(false);
    const hceStartedRef = useRef(false);

    useEffect(() => {
        if (Platform.OS !== 'android') {
            setIsChecking(false);
            return;
        }

        let cancelled = false;
        async function check() {
            const [nfcOk, hceOk] = await Promise.all([
                nfcService.isNfcSupported(),
                nfcService.isHceSupported(),
            ]);
            if (!cancelled) {
                setIsNfcSupported(nfcOk);
                setIsHceSupported(hceOk);
                setIsChecking(false);
            }
        }

        void check();
        return () => { cancelled = true; };
    }, []);

    const startHce = useCallback(async (url: string) => {
        if (!isHceSupported || hceStartedRef.current) return;
        try {
            await nfcService.startHceMode(url);
            hceStartedRef.current = true;
            setIsHceActive(true);
        } catch {
            setIsHceActive(false);
        }
    }, [isHceSupported]);

    const stopHce = useCallback(async () => {
        if (!hceStartedRef.current) return;
        await nfcService.stopHceMode();
        hceStartedRef.current = false;
        setIsHceActive(false);
    }, []);

    return {
        isNfcSupported,
        isHceSupported,
        isChecking,
        isHceActive,
        showQr: shouldShowQr(isNfcSupported),
        startHce,
        stopHce,
    };
}
