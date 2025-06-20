
'use client';

import React, { useState, useEffect, type ComponentType } from 'react';

// Props for QRCodeSVG from react-qr-code
interface QRCodeSVGProps extends React.SVGProps<SVGSVGElement> {
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
  // State to hold the dynamically imported component
  const [QrComponent, setQrComponent] = useState<ComponentType<QRCodeSVGProps> | null>(null);

  useEffect(() => {
    // Dynamically import the QRCodeSVG component from react-qr-code
    // This ensures the import only happens on the client-side
    import('react-qr-code')
      .then(module => {
        // Check if the module and QRCodeSVG export exist
        if (module && typeof module.QRCodeSVG === 'function') {
          setQrComponent(() => module.QRCodeSVG);
        } else {
          // Log an error if QRCodeSVG is not found (for developer debugging)
          console.error('QRCodeSVG component not found in react-qr-code module.');
        }
      })
      .catch(error => {
        // Log any errors during the dynamic import (for developer debugging)
        console.error('Error dynamically importing react-qr-code:', error);
      });
  }, []); // Empty dependency array ensures this runs once on mount

  // If the component hasn't been loaded yet, render nothing.
  // The parent component using next/dynamic for ClientQRCode will handle its own loading state.
  if (!QrComponent) {
    return null;
  }

  // Render the dynamically imported QRCodeSVG component with the provided props
  return <QrComponent value={value} size={size} className={className} />;
};

export default ClientQRCode;
