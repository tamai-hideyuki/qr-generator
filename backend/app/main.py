from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import qr  

app = FastAPI(
    title="QR Generator Backend",
    description="FastAPI 環境構築＋テストエンドポイント",
    version="0.1.0"
)

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping", summary="ヘルスチェック用")
async def ping():
    return {"message": "pong"}

# 後続で QR 生成ルーターを include するなら
# app.include_router(qr.router, prefix="/qr", tags=["qr"])

