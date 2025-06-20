
'use client';

import React, { useState, useEffect, type ComponentType } from 'react';
import { cn } from '@/lib/utils';

// Define props based on react-qr-code's QRCodeSVGProps for type safety
interface QRCodeSVGProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: string;
  title?: string;
  className?: string;
  // Add other props as needed from the library's documentation
}

interface ClientQRCodeProps {
  value: string;
  size: number;
  className?: string;
}

const ClientQRCode: React.FC<ClientQRCodeProps> = ({ value, size, className }) => {
  const [QRCodeComponent, setQRCodeComponent] = useState<ComponentType<QRCodeSVGProps> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically import 'react-qr-code' only on the client-side after mount
    import('react-qr-code')
      .then(module => {
        // Try to resolve QRCodeSVG, first as a named export, then as a default export
        const ResolvedQRCodeSVG = module.QRCodeSVG || module.default;
        
        if (typeof ResolvedQRCodeSVG === 'function') {
          // Using functional update for setState to ensure we're using the latest state if needed
          setQRCodeComponent(() => ResolvedQRCodeSVG as ComponentType<QRCodeSVGProps>);
        } else {
          console.error(
            "ClientQRCode: QRCodeSVG component could not be resolved from 'react-qr-code' module. Module structure:", 
            module
          );
          setError('Failed to load QR Code component. Module structure unexpected.');
        }
      })
      .catch(err => {
        console.error('ClientQRCode: Error importing react-qr-code:', err);
        setError('Error importing QR Code library.');
      });
  }, []); // Empty dependency array ensures this runs once on mount

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted border border-dashed border-destructive rounded-md text-destructive p-2 text-xs text-center",
          className
        )}
        style={{ width: size, height: size }}
      >
        {error}
      </div>
    );
  }

  if (!QRCodeComponent) {
    // This loading state is usually handled by the parent's dynamic import of ClientQRCode,
    // but it's good practice to have a fallback here as well.
    return (
       <div
        className={cn(
          "flex items-center justify-center bg-muted rounded-md p-2 text-xs text-muted-foreground animate-pulse",
          className
        )}
        style={{ width: size, height: size }}
      >
        Loading QR...
      </div>
    );
  }

  // Now QRCodeComponent is guaranteed to be a function (or error would have been thrown)
  return <QRCodeComponent value={value} size={size} className={className} />;
};

export default ClientQRCode;
