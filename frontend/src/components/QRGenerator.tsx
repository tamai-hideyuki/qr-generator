'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function QRGenerator() {
    const [url, setUrl] = useState('');
    const [qrBlobUrl, setQrBlobUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    // URL の有効性をチェックする関数
    const isValidUrl = (input: string): boolean => {
        try {
            // URL コンストラクタでチェック（https:// や http:// を含める必要）
            new URL(input);
            return true;
        } catch {
            return false;
        }
    };

    // 入力 URL が変更されるたびにバリデーションエラーをリセット
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

        // バリデーションOKなら、QR 生成処理へ
        setIsLoading(true);
        setApiError(null);
        setQrBlobUrl(null);

        try {
            const response = await axios.post<Blob>(
                'http://localhost:8000/qr/generate_qr',
                { data: url.trim(), size: 256 },
                { responseType: 'blob' }
            );

            // レスポンスコードが 200 以外でも catch に飛ぶので、ここでは Blob 生成だけ
            const blob = new Blob([response.data], { type: 'image/png' });
            const objectUrl = URL.createObjectURL(blob);
            setQrBlobUrl(objectUrl);
        } catch (e: any) {
            console.error(e);
            // Axios のエラーかどうかを判定
            if (e.response) {
                // サーバーがエラーコードを返してきた
                setApiError(`サーバーエラー: ${e.response.status}`);
            } else if (e.request) {
                // リクエストは送ったがレスポンスが帰ってこない
                setApiError('サーバーと通信できません。ネットワークをご確認ください。');
            } else {
                // 送信前のエラー
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
        <div className="flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold mb-4">QRコードジェネレーター</h1>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="QRコードにしたいURLを入力してください"
                    className="border border-gray-300 px-4 py-2 rounded w-80"
                />
                <button
                    onClick={handleGenerate}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? '生成中…' : '生成'}
                </button>
            </div>

            {/* バリデーションエラーの表示 */}
            {validationError && (
                <p className="text-red-500 mb-4">{validationError}</p>
            )}

            {/* API エラーの表示 */}
            {apiError && <p className="text-red-500 mb-4">{apiError}</p>}

            {/* QRコード表示 & ダウンロードボタン */}
            {qrBlobUrl && (
                <div className="flex flex-col items-center">
                    <img
                        src={qrBlobUrl}
                        alt="Generated QR Code"
                        className="border border-gray-300"
                        width={256}
                        height={256}
                    />
                    <button
                        onClick={handleDownload}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        ダウンロード
                    </button>
                </div>
            )}
        </div>
    );
}
