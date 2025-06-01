from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel, Field

from ..utils.qr_generator import generate_qr_png

router = APIRouter(tags=["qr"])


# リクエストボディのモデル
class QRRequest(BaseModel):
    data: str = Field(..., title="QR にする文字列または URL", example="https://www.hacomono.co.jp/")
    size: int = Field(
        256,
        title="出力 PNG のサイズ（px）",
        description="正方形の一辺のピクセル数。64〜1024 の範囲で指定すると良い。",
        ge=64,
        le=1024,
    )


@router.post(
    "/generate_qr",
    summary="QR コードを生成して PNG を返却",
    response_class=Response,  # バイナリをそのまま返したいので Response を指定
)
async def generate_qr(request: QRRequest):
    """
    JSON ボディで data, size を受け取り、
    生成した QR コードを PNG バイナリで返す。
    """
    try:
        png_bytes = generate_qr_png(request.data, request.size)
    except Exception as e:
        # 何らかの理由で QR 作成に失敗したら 500 を返却
        raise HTTPException(status_code=500, detail=f"QR 生成エラー: {e}")

    # レスポンスに PNG バイナリをセットし、Content-Type を image/png に
    return Response(content=png_bytes, media_type="image/png")
