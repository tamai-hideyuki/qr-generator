'use client';
import { useState } from 'react';
import axios from 'axios';

export default function QRGenerator() {
    const [url, setUrl] = useState('');
    const [qrBlobUrl, setQrBlobUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!url.trim()) return;

        setIsLoading(true);
        setError(null);
        setQrBlobUrl(null);

        try {
            // FastAPI のエンドポイントを呼び出し (戻り値は Blob 型)
            const response = await axios.post<Blob>(
                'http://localhost:8000/qr/generate_qr',
                { data: url, size: 256 },
                { responseType: 'blob' }
            );

            // 受け取った Blob をオブジェクトURLに変換
            const blob = new Blob([response.data], { type: 'image/png' });
            const objectUrl = URL.createObjectURL(blob);
            setQrBlobUrl(objectUrl);
        } catch (e) {
            console.error(e);
            setError('QRコードの生成に失敗しました。');
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

            {error && <p className="text-red-500 mb-4">{error}</p>}

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
