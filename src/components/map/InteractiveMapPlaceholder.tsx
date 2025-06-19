import { Map } from 'lucide-react';
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
          {/* Você pode adicionar um ícone de marcador sobreposto aqui se desejar */}
          {/* Exemplo: <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500" size={32} /> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMapPlaceholder;
