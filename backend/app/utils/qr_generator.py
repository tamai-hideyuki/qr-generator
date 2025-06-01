from io import BytesIO
import qrcode
from PIL import Image


def generate_qr_png(data: str, size: int = 256) -> bytes:
    
   # 渡された文字列 data を QR コードに変換し、指定したサイズ（ピクセル）でリサイズした PNG のバイトを返す。
    # QR オブジェクトの設定
    qr = qrcode.QRCode(
        version=1, 
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    # PIL Image オブジェクトを作成
    img: Image.Image = qr.make_image(fill_color="black", back_color="white")

    # 指定されたサイズにリサイズ
    img = img.resize((size, size), Image.NEAREST)

    # バイトストリームに PNG 形式で保存
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer.getvalue()


