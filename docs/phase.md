# bidokun Mobile — Phase Plan

> Checkbox tabanlı geliştirme fazı. Her görev tamamlandığında `[ ]` → `[x]` olarak işaretlenir.

---

## Phase 1 — Proje Kurulumu & Yapılandırma

- [x] **1.1** Expo projesi oluştur (`expo init bidokun --template expo-template-blank-typescript`)
- [x] **1.2** Klasör yapısını oluştur (SOLID & feature-based mimari)
  - [x] `src/features/card/` — kart özelliğine ait tüm dosyalar
  - [x] `src/features/nfc/` — NFC/HCE & QR mantığı
  - [x] `src/shared/components/` — paylaşılan UI bileşenleri
  - [x] `src/shared/hooks/` — paylaşılan custom hook'lar
  - [x] `src/shared/services/` — API servisleri
  - [x] `src/shared/constants/` — sabitler (API URL, renkler vb.)
  - [x] `src/shared/types/` — TypeScript arayüzleri
  - [x] `src/navigation/` — navigasyon tanımları
- [x] **1.3** Bağımlılıkları yükle
  - [x] `expo-router` — navigasyon
  - [x] `expo-nfc-manager` — NFC okuma/yazma & HCE (Android)
  - [x] `react-native-qrcode-svg` — QR üretimi (iOS)
  - [x] `@react-native-async-storage/async-storage` — tek kart yerel depolama
  - [x] `nativewind` + `tailwindcss` — Tailwind tabanlı stil
- [x] **1.4** Tailwind/NativeWind yapılandırması
  - [x] `tailwind.config.js` oluştur
  - [x] Renk paleti tanımla: `primary: #136dec`, `background-light: #f6f7f8`, `background-dark: #101822`
  - [x] Font: Inter entegre et (`@expo-google-fonts/inter`)
- [x] **1.5** Ortam değişkenleri ayarla (`.env`)
  - [x] `EXPO_PUBLIC_API_BASE_URL=https://api.bidokun.com/api/v1`
- [x] **1.6** ESLint + Prettier yapılandırması
- [x] **1.7** TypeScript strict mode etkinleştir

---

## Phase 2 — Tip & Servis Katmanı (SOLID: Single Responsibility)

- [x] **2.1** TypeScript tipleri tanımla (`src/shared/types/`)
- [x] **2.2** API sabitlerini oluştur (`src/shared/constants/api.ts`)
- [x] **2.3** HTTP istemci wrapper'ı yaz (`src/shared/services/httpClient.ts`)
- [x] **2.4** VCard servisini yaz (`src/shared/services/vcardService.ts`)
- [x] **2.5** Yerel depolama servisini yaz (`src/shared/services/storageService.ts`)

---

## Phase 3 — UI Bileşenlerinin Tasarıma Uygun Yazımı

> `bidokun-mobile.html` wireframe'i birebir referans alınacak.

- [x] **3.1** Tema & global stiller (`src/shared/constants/theme.ts`)
  - [ ] Renkler, fontlar, border-radius tanımları (HTML'deki Tailwind config ile eşleşecek)
- [x] **3.2** `SearchBar` bileşeni — Ionicons arama ikonu, focus vurgulama, 44px yükseklik
- [x] **3.3** `CardItem` bileşeni — çift blob (kurumsal), NFC ikon (90° döndürülmüş wifi), pressed shadow
- [x] **3.4** Header bileşeni — NFC logo ikonu + bidokun wordmark, bildirim badge, status bar aware
- [x] **3.5** Section Header bileşeni — uppercase tracking-widest, canAddCard kısıtı
- [x] **3.6** `EmptyState` bileşeni — card Ionicon, renkli + Yeni Ekle metni
- [x] **3.7** `BottomSafeArea` bileşeni
- [x] **3.8** Dark mode desteği — tüm bileşenlerde `dark:` class'ları

---

## Phase 4 — Ekranlar (Screens)

- [x] **4.1** **Ana Ekran** — FlatList + memoized CardListItem, arama filtresi, keyboard dismiss
- [x] **4.2** **Kart Ekleme Ekranı** — tip seçici (Ionicons), slug girişi, API preview, kaydet
- [x] **4.3** **Kart Detay / NFC Ekranı** — showQr lojiği, HCE aktif gösterge, delete cleanup

---

## Phase 5 — NFC / HCE (Android) Entegrasyonu

- [x] **5.1** `react-native-nfc-manager` kurulumu ve izin yapılandırması
  - [x] `android.permission.NFC` izni (app.json)
  - [x] `react-native-nfc-manager` plugin (app.json)
- [x] **5.2** NFC servisi — `isNfcSupported`, `isHceSupported`, `startHceMode`, `stopHceMode`
- [x] **5.3** `useNfc` hook — `showQr` computed, HCE toggle, async capability check
- [x] **5.4** HCE payload URL'leri qrService'te
- [x] **5.5** CardDetailScreen'de HCE aktifleşme
- [x] **5.6** NFC desteklemeyen Android → QR fallback (useNfc.showQr)

---

## Phase 6 — QR Paylaşım (iOS + NFC Desteklemeyen Android)

> **QR Fallback Kuralı:** iOS VEYA NFC'siz Android → her zaman QR göster.

- [x] **6.1** `react-native-qrcode-svg` zaten kurulu ✔
- [x] **6.2** `generateQrUrl(card)` + `shouldShowQr(isNfcSupported)` — platform lojiği
- [x] **6.3** `QRDisplayModal` — bottom sheet, 220px QR, RN Share API paylaşım
- [x] **6.4** Platform guard: iOS=QR, Android+NFC=HCE, Android+noNFC=QR
- [x] **6.5** CardDetailScreen `showQr` ile branch uygulandı

---

## Phase 7 — Tek Kart Kısıtlaması & İş Kuralları

- [ ] **7.1** `useCardStore` hook/context (`src/features/card/hooks/useCardStore.ts`)
  - [ ] AsyncStorage'dan kart yükle (app açılışında)
  - [ ] `canAddCard` computed değeri → kart yoksa `true`
- [ ] **7.2** `+ Yeni Ekle` butonu: kart varsa devre dışı bırak veya gizle
- [ ] **7.3** Kart silme akışı: sil → yeni kart eklenebilir duruma geç
- [ ] **7.4** Edge case: API hatası, ağ bağlantısı yoksa uygun hata mesajı

---

## Phase 8 — Navigasyon

- [ ] **8.1** `expo-router` ile stack navigasyon kur
  - [ ] `/` → HomeScreen
  - [ ] `/add` → AddCardScreen
  - [ ] `/card/[slug]` → CardDetailScreen
- [ ] **8.2** `+ Yeni Ekle` → `/add` yönlendirmesi
- [ ] **8.3** `CardItem` tıklaması → `/card/[slug]` yönlendirmesi
- [ ] **8.4** Geri tuşu / gesture davranışı

---

## Phase 9 — Test & Kalite

- [ ] **9.1** Birim testleri
  - [ ] `vcardService` — veri çekme ve parse etme
  - [ ] `storageService` — kaydet/oku/sil
  - [ ] `qrService` — URL üretme
  - [ ] `nfcService` — mock ile HCE kontrolü
- [ ] **9.2** Bileşen testleri (`@testing-library/react-native`)
  - [ ] `CardItem` render testi
  - [ ] `SectionHeader` — kart var/yok durumu
- [ ] **9.3** Android cihazda HCE manuel testi
- [ ] **9.4** iOS cihazda QR paylaşım manuel testi
- [ ] **9.5** Dark mode görsel testi
- [ ] **9.6** API hata senaryoları testi (404, 500, network off)

---

## Phase 10 — Build & Yayın Hazırlığı

- [ ] **10.1** `app.json` / `app.config.js` yapılandırması
  - [ ] Bundle identifier (iOS & Android)
  - [ ] İzin tanımları (NFC, kamera — QR için)
  - [ ] Uygulama adı, ikon, splash screen
- [ ] **10.2** EAS Build yapılandırması (`eas.json`)
  - [ ] `development` profili
  - [ ] `preview` profili (internal testing)
  - [ ] `production` profili
- [ ] **10.3** Android: HCE için gerekli manifest ayarlarını doğrula
- [ ] **10.4** iOS: NFC capability (entitlement) ekle — dikkat: iOS HCE yok, sadece QR
- [ ] **10.5** `eas build` ile APK/IPA üret ve test et
- [ ] **10.6** Store gönderim hazırlığı (isteğe bağlı)

---

> **Toplam Phase:** 10 | **Toplam Ana Görev:** ~60+
> Son güncelleme: Mart 2026
