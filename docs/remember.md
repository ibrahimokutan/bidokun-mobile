# bidokun Mobile — Proje Hatırlatma Dosyası

> Bu dosya, geliştirme sürecinde bağlamı korumak ve kritik kararları hatırlamak için kullanılır.

---

## 🧭 Proje Özeti

**bidokun**, Bitrust tarafından geliştirilen bir NFC dijital kartvizit uygulamasıdır. Kullanıcılar kart profillerini API üzerinden alır; Android'de telefonu fiziksel NFC kart gibi davrandırır, iOS'ta ise QR kod ile paylaşır.

---

## 📐 Tasarım Kuralları

- Tüm UI, `bidokun-mobile.html` wireframe'ini **birebir** takip eder.
- Renk paleti:
  - `primary`: `#136dec`
  - `background-light`: `#f6f7f8`
  - `background-dark`: `#101822`
- Font: **Inter** (400, 500, 600, 700)
- İkonlar: Material Symbols Outlined
- Border radius: `0.25rem` (default), `0.5rem` (lg), `0.75rem` (xl), `9999px` (full)
- Dark mode desteklenir (`dark:` class'ları)
- Sticky header + backdrop blur
- Kart üzerinde dekoratif gradient blob (sadece `kurumsal` tipinde)
- Header: `pt-12` (status bar boşluğu), bildirim ikonu sağda
- Bottom safe area: `h-6`

---

## 🔌 API Yapısı

### Endpoint'ler
| Kart Tipi | URL Formatı |
|-----------|-------------|
| Kurumsal  | `https://api.bidokun.com/api/v1/vcards/view/{slug}/{slug}` |
| Bireysel  | `https://api.bidokun.com/api/v1/vcards/view/{slug}` |

### Kullanılan Alanlar (sadece bunlar)
```json
{
  "data": {
    "id": 4,
    "slug": "ibrahimokutan"
  },
  "vcard_data": {
    "personal_info": {
      "first_name": "İbrahim",
      "last_name": "Okutan",
      "title": "Founder"
    }
  }
}
```
> ⚠️ API'den gelen diğer tüm alanlar **görmezden gelinir**. Sadece yukarıdaki 5 alan işlenir ve depolanır.

---

## 📱 Platform Davranışı

### Android — HCE (Host Card Emulation)
- Kart eklendikten sonra telefon, NFC okuyucuya yaklaşıldığında kart gibi davranır.
- HCE payload: kart slug'ına göre üretilen URL (NDEF formatında).
- `android.permission.NFC` + `HostApduService` manifest kaydı gereklidir.
- **⚠️ NFC desteklemeyen Android cihazlar:** HCE modu devre dışıdır; bu cihazlar da iOS gibi **QR kod** kullanır.

### iOS — QR Paylaşım
- HCE desteklenmez (Apple kısıtlaması).
- Karta tıklandığında QR kod ekranı açılır.
- QR, kart URL'ini (`https://app.bidokun.com/...`) encode eder.
- `expo-sharing` ile paylaşılabilir.

### QR Fallback Kuralı (Evrensel)
- **Kullanım koşulu:** `Platform.OS === 'ios'` VEYA (`Platform.OS === 'android'` VE NFC/HCE desteklenmiyor)
- NFC destekleniyorsa → HCE mod göster
- NFC desteklenmiyorsa (tüm platformlar) → QR ekranı göster

---

## 📦 Tek Kart Kısıtlaması

- Uygulamaya **yalnızca 1 kart** eklenebilir.
- Kart varken `+ Yeni Ekle` butonu gizlenir/devre dışı kalır.
- Yeni kart eklemek için önce mevcut kart silinmelidir.
- Kart verisi `AsyncStorage`'da saklanır.

---

## 🏗️ Mimari Notlar (SOLID)

| Prensip | Uygulama |
|---------|----------|
| **S** — Single Responsibility | Her servis tek iş yapar: `vcardService`, `storageService`, `nfcService`, `qrService` ayrı dosyalar |
| **O** — Open/Closed | Kart tipi (kurumsal/bireysel) URL üretimi `strategy pattern` ile genişletilebilir |
| **L** — Liskov | Servis interface'leri `mock` ile değiştirilebilir (test için) |
| **I** — Interface Segregation | NFC ve QR ayrı interface/servis; platform bazlı seçim yapılır |
| **D** — Dependency Inversion | Ekranlar servislere doğrudan bağlı değil, hook'lar üzerinden erişir |

---

## 📁 Klasör Yapısı Özeti

```
src/
├── features/
│   ├── card/
│   │   ├── screens/         # HomeScreen, AddCardScreen, CardDetailScreen
│   │   └── hooks/           # useCardStore
│   └── nfc/
│       ├── services/        # nfcService (Android), qrService (iOS)
│       └── hooks/           # useNfc
├── shared/
│   ├── components/          # SearchBar, CardItem, Header, SectionHeader, EmptyState
│   ├── hooks/
│   ├── services/            # httpClient, vcardService, storageService
│   ├── constants/           # api.ts, theme.ts
│   └── types/               # VCard, CardType vb.
└── navigation/
```

---

## 🔑 Kritik Kararlar (Geçmişte Verilmiş)

- **Tasarım:** `bidokun-mobile.html` birebir referans — yorum yok, sapma yok.
- **iOS'ta HCE yok:** Apple, üçüncü taraf uygulamalara HCE izni vermez → QR fallback kesin karar.
- **Tek kart:** UX basitliği ve NFC güvenilirliği için bilinçli kısıtlama.
- **API alanları:** Sadece 5 alan (`id`, `slug`, `first_name`, `last_name`, `title`) — gereksiz veri depolanmaz.
- **Framework:** Expo (managed workflow) — native modüller için `expo-nfc-manager` kullanılır.

---

## 🚀 Geliştirme Ortamı

- **Framework:** Expo (TypeScript)
- **Stil:** NativeWind (Tailwind CSS → React Native)
- **Navigasyon:** expo-router
- **Depolama:** @react-native-async-storage/async-storage
- **NFC:** expo-nfc-manager
- **QR:** react-native-qrcode-svg
- **Build:** EAS Build

---

> Son güncelleme: Mart 2026 | Bitrust — bidokun projesi | Kart URL'leri app.bidokun.com subdomainine taşındı.
