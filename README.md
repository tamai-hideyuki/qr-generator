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