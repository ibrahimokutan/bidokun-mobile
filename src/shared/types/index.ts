export type CardType = 'kurumsal' | 'bireysel';

export interface PersonalInfo {
    first_name: string;
    last_name: string;
    title: string;
}

export interface VCard {
    id: number;
    username: string;
    type: CardType;
    personal_info: PersonalInfo;
}

/**
 * Gerçek API Yanıt Yapısı:
 * {
 *   "success": true,
 *   "data": {
 *     "id": 1,
 *     "slug": "...",
 *     "vcard_data": {           <-- vcard_data, data'nın İÇİNDE
 *       "personal_info": { ... }
 *     }
 *   }
 * }
 */
export interface ApiVCardResponse {
    success: boolean;
    data: {
        id: number;
        slug: string;
        vcard_data: {
            personal_info: PersonalInfo;
        };
    };
}
