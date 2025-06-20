
'use client';

import React from 'react';
// Try wildcard import as named import seems to fail in this environment
import * as QRCodeModule from 'react-qr-code';
import { cn } from '@/lib/utils';

interface ClientQRCodeProps {
  value: string;
  size: number;
  className?: string;
}

const ClientQRCode: React.FC<ClientQRCodeProps> = ({ value, size, className }) => {
  // Attempt to access QRCodeSVG, it might be nested or default
  // Based on react-qr-code documentation, QRCodeSVG should be a named export.
  const ActualQRCodeComponent = QRCodeModule.QRCodeSVG;

  if (typeof ActualQRCodeComponent !== 'function') {
    // This console.error will help confirm if this path is taken,
    // indicating ActualQRCodeComponent itself is not resolving as expected.
    console.error(
      "ClientQRCode: QRCodeSVG component from 'react-qr-code' module (via QRCodeModule.QRCodeSVG) is not a function or is undefined. Value received:",
      ActualQRCodeComponent,
      "Full QRCodeModule structure:",
      QRCodeModule
    );
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted border border-dashed border-destructive rounded-md text-destructive p-2 text-xs text-center",
          className
        )}
        style={{ width: size, height: size }}
      >
        QR Code Load Error
      </div>
    );
  }

  // If we reach here, ActualQRCodeComponent should be a function.
  return <ActualQRCodeComponent value={value} size={size} className={className} />;
};

export default ClientQRCode;
