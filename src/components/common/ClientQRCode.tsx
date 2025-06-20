'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Ensure this is from qrcode.react
import { cn } from '@/lib/utils';

interface ClientQRCodeProps {
  value: string;
  size: number;
  className?: string;
}

const ClientQRCode: React.FC<ClientQRCodeProps> = ({ value, size, className }) => {
  // Wrapper div to handle className for layout, as QRCodeSVG might not propagate it.
  // Using level "Q" for good error correction. bgColor and fgColor are also common props.
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <QRCodeSVG value={value} size={size} level="Q" bgColor="#FFFFFF" fgColor="#000000" />
    </div>
  );
};

export default ClientQRCode;
