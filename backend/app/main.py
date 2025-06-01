from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import qr

app = FastAPI(
    title="QR Generator Backend",
    description="FastAPI で QR コードを生成して返す API",
    version="0.2.0",
)

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        # 必要に応じて、本番環境のドメインを追加
    ],
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/ping", summary="ヘルスチェック用")
async def ping():
    return {"message": "pong"}

# QR 生成ルーターをマウント
app.include_router(qr.router, prefix="/qr")
