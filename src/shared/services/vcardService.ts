import { CORPORATE_VCARD_URL, PERSONAL_VCARD_URL } from '../constants/api';
import type { ApiVCardResponse, VCard } from '../types';
import { httpClient } from './httpClient';

/**
 * API response'u doğru şekilde parse eder.
 * vcard_data, raw.data'nın içinde bulunur.
 */
function parseApiResponse(raw: ApiVCardResponse, type: VCard['type']): VCard {
    const vcardData = raw.data.vcard_data;

    if (!vcardData) {
        throw new Error('API yanıtında vcard_data alanı bulunamadı');
    }

    return {
        id: raw.data.id,
        username: raw.data.slug,
        type,
        personal_info: {
            first_name: vcardData.personal_info.first_name,
            last_name: vcardData.personal_info.last_name,
            title: vcardData.personal_info.title ?? '',
        },
    };
}

export async function fetchCorporateCard(companySlug: string, username: string): Promise<VCard> {
    const raw = await httpClient.get<ApiVCardResponse>(CORPORATE_VCARD_URL(companySlug, username));
    return parseApiResponse(raw, 'kurumsal');
}

export async function fetchPersonalCard(username: string): Promise<VCard> {
    const raw = await httpClient.get<ApiVCardResponse>(PERSONAL_VCARD_URL(username));
    return parseApiResponse(raw, 'bireysel');
}

/**
 * URL'den kart tipini ve kullanıcı adı bilgilerini çözerek veriyi çeker.
 * 
 * Beklenen URL Formatları:
 * 1. .../bi/{username} -> Bireysel: vcards/view/{username}
 * 2. .../{company}/{username} -> Kurumsal: vcards/view/{company}/{username}
 */
export async function fetchVCardFromUrl(url: string): Promise<VCard> {
    const parts = url.split('/').filter(Boolean);
    if (parts.length < 2) {
        throw new Error('Geçersiz VCard URL formatı');
    }

    const username = parts[parts.length - 1];
    const prefixOrCompany = parts[parts.length - 2];

    if (prefixOrCompany === 'bi') {
        return fetchPersonalCard(username);
    }

    return fetchCorporateCard(prefixOrCompany, username);
}
