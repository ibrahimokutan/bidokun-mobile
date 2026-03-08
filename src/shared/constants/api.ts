const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.bidokun.com/api/v1';

/** 
 * Kurumsal kart API: /vcards/view/{companySlug}/{username} 
 */
export const CORPORATE_VCARD_URL = (companySlug: string, username: string): string =>
    `${API_BASE_URL}/vcards/view/${companySlug}/${username}`;

/** 
 * Bireysel kart API: /vcards/view/{username} 
 */
export const PERSONAL_VCARD_URL = (username: string): string =>
    `${API_BASE_URL}/vcards/view/${username}`;
