### 全体マイルストーンとブランチ構成(開発終了後は削除のこと)
## 🧭 QRコードジェネレーター：開発マイルストーン一覧

| No | マイルストーン                         | ブランチ名                      | 内容                                                                 |
|----|----------------------------------|----------------------------|----------------------------------------------------------------------|
| 1  | 📁 プロジェクト構成準備                   | `feature/init-structure`   | `frontend/` と `backend/` ディレクトリ作成、基本README記述など                     |
| 2  | 🎨 フロント：UI作成                    | `feature/frontend-ui`      | 入力欄／生成ボタン／QR表示／DLボタンのReactコンポーネント構築                          |
| 3  | ⚙️ バックエンド：FastAPIセットアップ       | `feature/backend-setup`    | FastAPI環境構築＋テストエンドポイント作成（`/ping`など）                             |
| 4  | 🧠 バックエンド：QRコード生成API実装        | `feature/qr-api`           | `/generate_qr` POST APIでPNGを生成し返却（Base64 or image/png）       |
| 5  | 🔗 API接続：React → FastAPI        | `feature/api-integration`  | ReactからQRコード生成APIを呼び出し、画像として表示                                   |
| 6  | 💾 画像ダウンロード機能                   | `feature/download-support` | canvasではなく `img` ベースで `a download` に対応                         |
| 7  | 🧪 テスト・例外処理                     | `feature/test-and-errors`  | バリデーション（空URLなど）＋エラーハンドリング                                      |
| 8  | 🎀 UI微調整＋最終仕上げ                  | `feature/ui-polish`        | Tailwindで微調整、アクセシビリティ対応など                                      |
| 9  | 🐳 Docker or 開発用スクリプト追加（任意）     | `feature/dev-env`          | `docker-compose` でフロント＆バック同時起動可に                               |
| 10 | 📝 README & 公開準備                | `release/0.1`              | 動作説明／使い方／デプロイ方法記載・初回リリース準備                                 |



## 概要：
**任意のURLからQRコードを作成し、ダウンロード可能にします。**

## 技術スタック
| 領域    | 使用技術                          | 備考                               |
| ----- | ----------------------------- | -------------------------------- |
| フロント  | React（Vite or Next.js）        | URL入力 → APIにPOST → Blob受け取り表示＋DL |
| バックエンド | FastAPI + `qrcode` + `Pillow` | PNGをメモリ上で生成し、Base64またはバイナリ返却     |
| QR生成 | Pythonで確実・カスタマイズ可能            | 色・誤り訂正・サイズも対応                    |
| 通信  | REST API（POST）                | `/generate_qr` にURLを送信           |
| オプション | Docker / docker-compose       | 環境一括構築も可能に                       |


## 初期構成案構造
```
qr-generator-app/
├── backend/
│   ├── app/
│   │   ├── main.py               
│   │   ├── routes/
│   │   │   └── qr.py             
│   │   └── utils/
│   │       └── qr_generator.py   # QRコード生成ロジック（Pillow使用）
│   ├── requirements.txt         
│   └── uvicorn_config.py         
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── QRGenerator.tsx  
│   │   └── App.tsx
│   ├── index.html
│   └── vite.config.ts          
│
├── .gitignore
├── README.md
└── docker-compose.yml           # フロント・バックを同時起動する場合

```