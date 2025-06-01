declare module 'qrcode.react' {
    import * as React from 'react';

    export interface QRCodeProps {
        value: string;
        size?: number;
        bgColor?: string;
        fgColor?: string;
        level?: 'L' | 'M' | 'Q' | 'H';
        renderAs?: 'canvas' | 'svg';
        includeMargin?: boolean;
        className?: string;
        id?: string;
    }

    // Canvas版 QRコードコンポーネント
    export class QRCodeCanvas extends React.Component<QRCodeProps> {}
    // SVG版 QRコードコンポーネント
    export class QRCodeSVG extends React.Component<QRCodeProps> {}
}
