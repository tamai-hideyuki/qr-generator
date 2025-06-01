import pytest
from fastapi.testclient import TestClient
import app.routes.qr as qr_route_module

from app.main import app

client = TestClient(app)


def test_ping_endpoint():
    """
    GET /ping で 'pong' が返ることを確認する。
    """
    response = client.get("/ping")
    assert response.status_code == 200
    assert response.json() == {"message": "pong"}


def test_generate_qr_success():
    """
    正常なデータ・サイズで /qr/generate_qr を呼び出したとき 200 + image/png が返ることを確認する。
    """
    payload = {
        "data": "https://www.hacomono.co.jp/",
        "size": 128,
    }
    response = client.post("/qr/generate_qr", json=payload)

    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    # バイナリ長がゼロより大きいこと（PNG として何らかのデータが返っていること）を確認
    assert len(response.content) > 0


@pytest.mark.parametrize(
    "payload, expected_status",
    [
        # size が範囲外（32 < 64 のため）
        ({"data": "https://example.com", "size": 32}, 422),
        # data が空文字
        ({"data": "   ", "size": 256}, 422),
        # data が URL 形式だが長さゼロ（抜けにできないケース。validator で弾く）
        ({"data": "", "size": 256}, 422),
    ],
)
def test_generate_qr_validation_error(payload, expected_status):
    """
    不正なリクエストボディで /qr/generate_qr を呼び出したとき、422 が返るかを確認する。
    """
    response = client.post("/qr/generate_qr", json=payload)
    assert response.status_code == expected_status


def test_generate_qr_server_error(monkeypatch):
    """
    generate_qr_png で例外が発生したとき、HTTP 500 が返るかを確認する。
    例として、monkeypatch で generate_qr_png を強制的に例外化する。
    """
    monkeypatch.setattr(
           qr_route_module,
           "generate_qr_png",
           lambda data, size: (_ for _ in ()).throw(Exception("強制エラー"))
       )


    payload = {"data": "https://example.com", "size": 128}
    response = client.post("/qr/generate_qr", json=payload)
    assert response.status_code == 500
    assert "QR 生成エラー" in response.json()["detail"]

