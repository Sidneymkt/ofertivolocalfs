
'use client';

import React from 'react';
// Statically import QRCodeSVG. Its client-side nature should be handled by
// the parent's dynamic import of this entire component with ssr: false.
import { QRCodeSVG } from 'react-qr-code';
import { cn } from '@/lib/utils';

interface ClientQRCodeProps {
  value: string;
  size: number;
  className?: string;
}

const ClientQRCode: React.FC<ClientQRCodeProps> = ({ value, size, className }) => {
  // This component (ClientQRCode) is dynamically imported by its parents with ssr: false.
  // Thus, this code should only execute on the client-side.
  // The primary issue is whether 'import { QRCodeSVG } from "react-qr-code"'
  // successfully resolves QRCodeSVG to a function.

  if (typeof QRCodeSVG !== 'function') {
    // This console.error will help confirm if this path is taken,
    // indicating QRCodeSVG itself is not resolving as expected.
    console.error(
      "ClientQRCode: QRCodeSVG from 'react-qr-code' is not a function or is undefined. Value received:",
      QRCodeSVG
    );
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted border border-dashed border-destructive rounded-md text-destructive p-2 text-xs text-center",
          className
        )}
        style={{ width: size, height: size }}
      >
        QR Code Unavailable
      </div>
    );
  }

  // If we reach here, QRCodeSVG should be a function.
  return <QRCodeSVG value={value} size={size} className={className} />;
};

export default ClientQRCode;
