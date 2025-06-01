import React from 'react';
import QRGenerator from './components/QRGenerator';

export default function App() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            {/* ここで QRGenerator コンポーネントを呼び出す */}
            <QRGenerator />
        </div>
    );
}
