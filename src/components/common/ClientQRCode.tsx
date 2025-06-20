
'use client';

import React from 'react';
import { QRCodeSVG } from 'react-qr-code';

interface ClientQRCodeProps {
  value: string;
  size: number;
  className?: string;
}

const ClientQRCode: React.FC<ClientQRCodeProps> = ({ value, size, className }) => {
  // Ensure the component only renders on the client where window is available
  if (typeof window === 'undefined') {
    return null; // Or a placeholder
  }
  return <QRCodeSVG value={value} size={size} className={className} />;
};

export default ClientQRCode;
