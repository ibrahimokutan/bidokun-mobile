/**
 * Yerel depolama servisi.
 * react-native-async-storage kullanır.
 * Expo Go'da native module yoksa graceful fallback ile in-memory çalışır.
 */
import type { VCard } from '../types';

const CARD_STORAGE_KEY = '@bidokun:card';

// Bellek tabanlı yedek depo
const memoryStore = new Map<string, string>();

interface IStorage {
    setItem(key: string, value: string): Promise<void>;
    getItem(key: string): Promise<string | null>;
    removeItem(key: string): Promise<void>;
}

let activeStorage: IStorage | null = null;

/**
 * Storage motorunu güvenli bir şekilde döner.
 * Hata anında bellek tabanlı depoya düşer.
 */
async function getSafeStorage(): Promise<IStorage> {
    if (activeStorage) return activeStorage;

    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require('@react-native-async-storage/async-storage');
        const storage = mod.default ?? mod;

        // Küçük bir test yaparak native modülün gerçekten çalışıp çalışmadığını kontrol ediyoruz.
        // Eğer native modül null ise, bu aşamada hata fırlatacak.
        await storage.getItem('__probe__');

        activeStorage = storage;
        return storage;
    } catch (error) {
        console.warn('AsyncStorage native module not available, using memory fallback:', error);
        activeStorage = {
            setItem: async (key, val) => { memoryStore.set(key, val); },
            getItem: async (key) => memoryStore.get(key) ?? null,
            removeItem: async (key) => { memoryStore.delete(key); },
        };
        return activeStorage;
    }
}

export async function saveCard(card: VCard): Promise<void> {
    const s = await getSafeStorage();
    await s.setItem(CARD_STORAGE_KEY, JSON.stringify(card));
}

export async function getCard(): Promise<VCard | null> {
    const s = await getSafeStorage();
    const raw = await s.getItem(CARD_STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as VCard;
    } catch {
        return null;
    }
}

export async function deleteCard(): Promise<void> {
    const s = await getSafeStorage();
    await s.removeItem(CARD_STORAGE_KEY);
}

export async function hasCard(): Promise<boolean> {
    const s = await getSafeStorage();
    const raw = await s.getItem(CARD_STORAGE_KEY);
    return raw !== null;
}
