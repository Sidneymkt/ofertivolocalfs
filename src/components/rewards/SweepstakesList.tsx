
import Image from 'next/image';
import type { Sweepstake } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket, CalendarDays, Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SweepstakesListProps {
  sweepstakes: Sweepstake[];
}

const SweepstakesList: React.FC<SweepstakesListProps> = ({ sweepstakes }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-headline font-semibold flex items-center gap-2">
          <Ticket className="text-primary" size={24}/> Sorteios Ativos
        </h3>
      </div>
      {sweepstakes.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Nenhum sorteio ativo no momento. Volte em breve!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sweepstakes.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col bg-card">
              <CardHeader className="p-0 relative">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={600}
                  height={200}
                  className="object-cover w-full h-48" // Increased height for better visuals
                  data-ai-hint={item['data-ai-hint'] as string}
                />
                 <Badge variant="secondary" className="absolute top-3 left-3 flex items-center gap-1.5 py-1 px-2.5 text-xs bg-black/50 text-white backdrop-blur-sm">
                    <CalendarDays size={14} /> Termina em: {new Date(item.endDate).toLocaleDateString('pt-BR')}
                </Badge>
              </CardHeader>
              <CardContent className="p-5 flex-grow">
                <CardTitle className="text-lg font-headline mb-2 leading-tight">{item.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.description}</CardDescription>
                <div className="flex items-center gap-2 text-base font-semibold text-primary">
                  <Coins size={18} className="text-amber-500"/>
                  Custo: {item.pointsToEnter} pontos por bilhete
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0 border-t mt-auto">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base py-3">
                  <Ticket className="w-5 h-5 mr-2" /> Participar do Sorteio
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
       <div className="text-center mt-8">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            Ver todos os Sorteios
          </Button>
        </div>
    </div>
  );
};

export default SweepstakesList;

    