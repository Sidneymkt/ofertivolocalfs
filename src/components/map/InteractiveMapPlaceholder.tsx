import { Map, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const InteractiveMapPlaceholder = () => {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="text-primary" />
          Mapa Interativo de Ofertas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="w-full h-80 relative bg-muted rounded-md overflow-hidden border border-border"
          aria-label="Placeholder para mapa interativo"
        >
          <Image
            src="https://placehold.co/800x400.png"
            alt="Mapa interativo placeholder"
            layout="fill"
            objectFit="cover"
            data-ai-hint="city map"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <MapPin
              className="h-10 w-10 text-destructive drop-shadow-lg animate-bounce"
              fill="currentColor"
              style={{ animationDuration: '1.5s' }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMapPlaceholder;