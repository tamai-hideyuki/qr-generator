'use client';
import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRGenerator() {
    const [url, setUrl] = useState('');
    const [showQR, setShowQR] = useState(false);

    const handleGenerate = () => {
        if (url.trim()) {
            setShowQR(true);
        }
    };

    const handleDownload = () => {
        const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'qr_code.png';
        downloadLink.click();
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
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    生成
                </button>
            </div>

            {showQR && (
                <div className="flex flex-col items-center">
                    <QRCodeCanvas id="qr-code" value={url} size={256} includeMargin={true} />
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
