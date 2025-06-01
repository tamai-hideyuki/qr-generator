from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import qr

app = FastAPI(
    title="QR Generator Backend",
    description="FastAPI で QR コードを生成して返す API",
    version="0.2.0",
)

# CORS 設定（開発中はワイルドカードで緩めに、本番は allow_origins を本番ドメインのみにする）
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:4173",
        "http://192.168.1.9:5173",
        "http://127.0.0.1:5173",


    ],
    allow_credentials=True,       # クッキーや認証トークンを含める場合に必要
    allow_methods=["*"],          # GET, POST, OPTIONS, PUT, DELETE... すべて許可
    allow_headers=["*"],          # すべてのヘッダーを許可
)

@app.get("/ping", summary="ヘルスチェック用")
async def ping():
    return {"message": "pong"}

# QR 生成ルーターをマウント
app.include_router(qr.router, prefix="/qr")
