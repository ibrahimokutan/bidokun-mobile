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
    /** Kurumsal kartlarda şirket slug'ı (ör. 'bidokun'). Bireysel kartlarda undefined. */
    companySlug?: string;
    personal_info: PersonalInfo;
}

/**
 * Gerçek API Yanıt Yapısı:
 * {
 *   "success": true,
 *   "data": {
 *     "id": 1,
 *     "slug": "ibrahimokutan",
 *     "vcard_data": { "personal_info": { ... } },
 *     "company": {              <-- Kurumsal kartlarda mevcut
 *       "id": 1,
 *       "name": "bidokun",
 *       "slug": "bidokun"
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
        company?: {
            id: number;
            name: string;
            slug: string;
        };
    };
}
