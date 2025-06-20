
'use client';

import React from 'react';
// Statically import QRCodeSVG. Its client-side nature is handled by the parent's dynamic import of this entire component.
import { QRCodeSVG } from 'react-qr-code';

// Props for QRCodeSVG from react-qr-code.
// It's good practice to define or import the specific props if available,
// but for this fix, we'll assume the basic props are sufficient or use 'any'.
interface QRCodeSVGActualProps extends React.SVGProps<SVGSVGElement> {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: 'L' | 'M' | 'Q' | 'H';
    title?: string;
}

interface ClientQRCodeProps {
  value: string;
  size: number;
  className?: string;
}

const ClientQRCode: React.FC<ClientQRCodeProps> = ({ value, size, className }) => {
  // This component is dynamically imported with ssr:false by its parents.
  // So, by the time this renders, we should be on the client, and QRCodeSVG should be defined.

  if (typeof QRCodeSVG !== 'function') {
    // This indicates a problem with the import or the library itself.
    console.error('QRCodeSVG is not a function. Check react-qr-code import, installation, and library version. The value of QRCodeSVG is:', QRCodeSVG);
    // Fallback UI
    return (
        <div 
            className={cn("flex items-center justify-center bg-muted border border-dashed border-destructive rounded-md text-destructive p-2 text-xs text-center", className)} 
            style={{ width: size, height: size }}
        >
            Error: QR Code indisponível.
        </div>
    );
  }
  
  // Cast to any if specific props are not strictly typed or to bypass potential minor type mismatches.
  // For a production component, ensuring accurate prop typing is better.
  const QRComponent = QRCodeSVG as React.ComponentType<QRCodeSVGActualProps>;

  return <QRComponent value={value} size={size} className={className} />;
};

export default ClientQRCode;

