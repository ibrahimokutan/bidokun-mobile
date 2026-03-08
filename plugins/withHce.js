const { AndroidConfig, withAndroidManifest } = require('expo/config-plugins');
const { mkdirSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');

/**
 * Expo Config Plugin: react-native-hce için gerekli Android ayarlarını ekler.
 * 
 * 1. AndroidManifest.xml'e HCE Service tanımı ekler
 * 2. res/xml/aid_list.xml dosyasını oluşturur
 */
function withHce(config) {
    // Step 1: AndroidManifest.xml güncelle
    config = withAndroidManifest(config, (config) => {
        const manifest = config.modResults;
        const app = manifest.manifest.application?.[0];
        if (!app) return config;

        // HCE uses-feature ekle
        if (!manifest.manifest['uses-feature']) {
            manifest.manifest['uses-feature'] = [];
        }
        const hasHceFeature = manifest.manifest['uses-feature'].some(
            (f) => f.$?.['android:name'] === 'android.hardware.nfc.hce'
        );
        if (!hasHceFeature) {
            manifest.manifest['uses-feature'].push({
                $: {
                    'android:name': 'android.hardware.nfc.hce',
                    'android:required': 'false',
                },
            });
        }

        // HCE Service ekle
        if (!app.service) {
            app.service = [];
        }
        const hasHceService = app.service.some(
            (s) => s.$?.['android:name'] === 'com.reactnativehce.services.CardService'
        );
        if (!hasHceService) {
            app.service.push({
                $: {
                    'android:name': 'com.reactnativehce.services.CardService',
                    'android:exported': 'true',
                    'android:enabled': 'false',
                    'android:permission': 'android.permission.BIND_NFC_SERVICE',
                },
                'intent-filter': [
                    {
                        action: [
                            { $: { 'android:name': 'android.nfc.cardemulation.action.HOST_APDU_SERVICE' } },
                        ],
                        category: [
                            { $: { 'android:name': 'android.intent.category.DEFAULT' } },
                        ],
                    },
                ],
                'meta-data': [
                    {
                        $: {
                            'android:name': 'android.nfc.cardemulation.host_apdu_service',
                            'android:resource': '@xml/aid_list',
                        },
                    },
                ],
            });
        }

        // Step 2: aid_list.xml oluştur
        const projectRoot = config.modRequest.projectRoot;
        const xmlDir = join(projectRoot, 'android', 'app', 'src', 'main', 'res', 'xml');
        const aidListPath = join(xmlDir, 'aid_list.xml');

        if (!existsSync(xmlDir)) {
            mkdirSync(xmlDir, { recursive: true });
        }

        if (!existsSync(aidListPath)) {
            const aidListContent = `<?xml version="1.0" encoding="utf-8"?>
<host-apdu-service xmlns:android="http://schemas.android.com/apk/res/android"
                   android:description="@string/app_name"
                   android:requireDeviceUnlock="false">
  <aid-group android:category="other"
             android:description="@string/app_name">
    <aid-filter android:name="D2760000850101" />
  </aid-group>
</host-apdu-service>`;
            writeFileSync(aidListPath, aidListContent, 'utf-8');
        }

        return config;
    });

    return config;
}

module.exports = withHce;
