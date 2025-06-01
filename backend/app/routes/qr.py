from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel, Field, validator


from app.utils.qr_generator import generate_qr_png

router = APIRouter(tags=["qr"])


class QRRequest(BaseModel):
    data: str = Field(

        title="QR にする文字列または URL",
        example="https://www.hacomono.co.jp/"
    )
    size: int = Field(
        256,
        title="出力 PNG のサイズ（px）",
        description="64〜1024 の範囲で指定してください。",
        ge=64, le=1024,
    )

    @validator('data')
    def non_empty_data(cls, v: str):
        if not v or not v.strip():
            raise ValueError('data は空文字または空白のみではいけません')
        return v


@router.post(
    "/generate_qr",
    summary="QR コードを生成して PNG を返却",
    response_class=Response,
)
async def generate_qr(request: QRRequest):
    try:
        # QR 生成関数を呼び出し
        png_bytes = generate_qr_png(request.data, request.size)
    except Exception as e:
        # 例外時は 500 エラーで返す
        raise HTTPException(status_code=500, detail=f"QR 生成エラー: {e}")

    return Response(content=png_bytes, media_type="image/png")
