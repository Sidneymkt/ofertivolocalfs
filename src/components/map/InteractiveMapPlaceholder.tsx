import { Map } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
          className="w-full h-80 bg-muted rounded-md flex items-center justify-center border border-dashed border-border"
          aria-label="Placeholder para mapa interativo"
        >
          <div className="text-center text-muted-foreground">
            <Map size={48} className="mx-auto mb-2" />
            <p className="font-medium">Mapa em breve</p>
            <p className="text-sm">Aqui você verá as ofertas geolocalizadas.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMapPlaceholder;
