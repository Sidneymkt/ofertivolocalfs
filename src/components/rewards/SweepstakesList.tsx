import Image from 'next/image';
import type { Sweepstake } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SweepstakesListProps {
  sweepstakes: Sweepstake[];
}

const SweepstakesList: React.FC<SweepstakesListProps> = ({ sweepstakes }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-headline font-semibold flex items-center gap-2">
          <Ticket className="text-primary" /> Sorteios Ativos
        </h3>
      </div>
      {sweepstakes.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Nenhum sorteio ativo no momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sweepstakes.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col">
              <CardHeader className="p-0 relative">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={600}
                  height={200}
                  className="object-cover w-full h-40"
                  data-ai-hint={item['data-ai-hint'] as string}
                />
                 <Badge variant="secondary" className="absolute top-2 left-2 flex items-center gap-1">
                    <CalendarDays size={14} /> Termina em: {new Date(item.endDate).toLocaleDateString('pt-BR')}
                </Badge>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg font-headline mb-1">{item.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</CardDescription>
                <p className="text-sm font-semibold text-primary">
                  Custo: {item.pointsToEnter} pontos
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Ticket className="w-4 h-4 mr-2" /> Participar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SweepstakesList;
