'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './QRGenerator.css';

export default function QRGenerator() {
    const [url, setUrl] = useState('');
    const [qrBlobUrl, setQrBlobUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    // URL の有効性をチェックする関数
    const isValidUrl = (input: string): boolean => {
        try {
            new URL(input);
            return true;
        } catch {
            return false;
        }
    };

    // 入力 URL が変更されるたびにエラーメッセージ・QR画像をリセット
    useEffect(() => {
        setValidationError(null);
        setApiError(null);
        setQrBlobUrl(null);
    }, [url]);

    const handleGenerate = async () => {
        // 空文字チェック
        if (!url.trim()) {
            setValidationError('URL を入力してください。');
            return;
        }
        // フォーマットチェック
        if (!isValidUrl(url.trim())) {
            setValidationError('有効な URL を入力してください（例: https://example.com）。');
            return;
        }

        // バリデーションOKなら QR 生成処理へ
        setIsLoading(true);
        setApiError(null);
        setQrBlobUrl(null);

        try {
            const response = await axios.post<Blob>(
                'http://localhost:8000/qr/generate_qr',
                { data: url.trim(), size: 256 },
                { responseType: 'blob' }
            );

            const blob = new Blob([response.data], { type: 'image/png' });
            const objectUrl = URL.createObjectURL(blob);
            setQrBlobUrl(objectUrl);
        } catch (e: any) {
            console.error(e);
            if (e.response) {
                setApiError(`サーバーエラー: ${e.response.status}`);
            } else if (e.request) {
                setApiError('サーバーと通信できません。ネットワークをご確認ください。');
            } else {
                setApiError('不明なエラーが発生しました。');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!qrBlobUrl) return;
        const link = document.createElement('a');
        link.href = qrBlobUrl;
        link.download = 'qr_code.png';
        link.click();
    };

    return (
        <div className="qr-container">
            <h1 className="qr-title">QRコードジェネレーター</h1>

            <div className="qr-input-group">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="QRコードにしたいURLを入力してください"
                    className="qr-input"
                />
                <button
                    onClick={handleGenerate}
                    className={`qr-button generate-button ${isLoading ? 'disabled' : ''}`}
                    disabled={isLoading}
                    aria-label="QRコードを生成する"
                >
                    {isLoading ? '生成中…' : '生成'}
                </button>
            </div>

            {validationError && (
                <p className="qr-error validation-error">{validationError}</p>
            )}

            {apiError && (
                <p className="qr-error api-error">{apiError}</p>
            )}

            {qrBlobUrl && (
                <div className="qr-result-group">
                    <div className="qr-image-wrapper">
                        <img
                            src={qrBlobUrl}
                            alt="Generated QR Code"
                            className="qr-image"
                            width={256}
                            height={256}
                        />
                    </div>
                    <button
                        onClick={handleDownload}
                        className="qr-button download-button"
                        aria-label="QRコードをダウンロードする"
                    >
                        ダウンロード
                    </button>
                </div>
            )}
        </div>
    );
}
