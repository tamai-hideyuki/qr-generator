import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5173,
        allowedHosts: ['*'],
    },
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
                'favicon.ico',
                'icons/icon-192.png',
                'icons/icon-512.png'
            ],
            manifest: {
                name: "QRコード変換君",
                short_name: "QRジェネレータ",
                description: "ブラウザ上でQRコードを生成し、ダウンロードできるPWA",
                lang: "ja",
                start_url: ".",
                display: "standalone",
                background_color: "#f7fafc",
                theme_color: "#3182ce",
                icons: [
                    {
                        src: "icons/icon-192.png",
                        sizes: "192x192",
                        type: "image/png"
                    },
                    {
                        src: "icons/icon-512.png",
                        sizes: "512x512",
                        type: "image/png"
                    }
                ]
            },
            workbox: {
                runtimeCaching: [
                    {
                        // バックエンドの QR API をランタイムキャッシュ
                        urlPattern: /^http:\/\/localhost:8000\/qr\/generate_qr$/,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'qr-api-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 // 1日キャッシュ
                            },
                            networkTimeoutSeconds: 10
                        }
                    }
                ]
            }
        })
    ]
})
