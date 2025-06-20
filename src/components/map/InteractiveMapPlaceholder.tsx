
import { Map, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const InteractiveMapPlaceholder = () => {
  return (
    // Removed Card wrapper to allow it to fill flex-grow space more easily
    // The parent div in MapPage will handle padding/margins if needed
    <div
      className="w-full h-full relative bg-muted rounded-md overflow-hidden border border-border"
      aria-label="Placeholder para mapa interativo"
    >
      <Image
        src="https://placehold.co/800x600.png" // Adjusted aspect ratio for better fit
        alt="Mapa interativo placeholder"
        layout="fill"
        objectFit="cover"
        className="opacity-80" // Slightly reduced opacity for a softer look
        data-ai-hint="city map navigation" // Updated hint
      />
      {/* Example of map pins - these would be dynamically rendered in a real map */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <MapPin
          className="h-10 w-10 text-destructive drop-shadow-lg transform -translate-x-8 -translate-y-12 animate-bounce"
          fill="currentColor"
          style={{ animationDuration: '1.5s', animationDelay: '0.1s' }}
        />
         <MapPin
          className="h-8 w-8 text-primary drop-shadow-lg transform translate-x-16 -translate-y-4 animate-bounce"
          fill="currentColor"
          style={{ animationDuration: '1.6s', animationDelay: '0.3s' }}
        />
         <MapPin
          className="h-7 w-7 text-secondary drop-shadow-lg transform translate-x-2 translate-y-10 animate-bounce"
          fill="currentColor"
          style={{ animationDuration: '1.4s', animationDelay: '0.2s' }}
        />
      </div>
       <div className="absolute bottom-4 right-4 space-y-2 pointer-events-auto">
          <button className="bg-card/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-card">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          <button className="bg-card/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-card">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
    </div>
  );
};

export default InteractiveMapPlaceholder;
