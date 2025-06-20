
'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'react-qr-code';

interface ClientQRCodeProps {
  value: string;
  size: number;
  className?: string;
}

const ClientQRCode: React.FC<ClientQRCodeProps> = ({ value, size, className }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []); // Empty dependency array ensures this runs once on mount

  if (!isMounted) {
    // You can return a placeholder or null before the component is mounted on the client
    return null; 
  }

  // Now that isMounted is true, we are sure we're on the client.
  return <QRCodeSVG value={value} size={size} className={className} />;
};

export default ClientQRCode;
