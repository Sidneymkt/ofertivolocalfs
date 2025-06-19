
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Heart, MessageSquare, Share2, UserPlus, BellRing } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface OfferActionsSectionProps {
  offerId: string;
  isFavorited: boolean;
  isFollowingMerchant: boolean; // Placeholder for actual follow state
  onToggleFavorite: () => void;
  onToggleFollow: () => void; // Placeholder for actual follow action
  onCommentClick: () => void;
}

const OfferActionsSection: React.FC<OfferActionsSectionProps> = ({
  offerId,
  isFavorited,
  isFollowingMerchant,
  onToggleFavorite,
  onToggleFollow,
  onCommentClick,
}) => {
  const { toast } = useToast();

  const handleGetOffer = () => {
    // In a real app, this might navigate to a QR code, instructions, or trigger an action.
    document.getElementById('qr-code-section')?.scrollIntoView({ behavior: 'smooth' });
    toast({ title: "Oferta Obtida!", description: "Use o QR Code no estabelecimento." });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Confira esta oferta incrível!',
        text: `Não perca esta oferta: ${document.title}`, // Placeholder, get offer title
        url: window.location.href,
      })
      .then(() => console.log('Compartilhado com sucesso!'))
      .catch((error) => console.error('Erro ao compartilhar:', error));
    } else {
      alert('Compartilhamento não suportado neste navegador. URL copiada para a área de transferência (simulado).');
      // navigator.clipboard.writeText(window.location.href); // Uncomment for actual copy
      toast({ title: "Link Copiado!", description: "Compartilhe com seus amigos."});
    }
  };
  
  const handleToggleFavorite = () => {
    onToggleFavorite();
    toast({
      title: isFavorited ? "Removido dos Favoritos" : "Adicionado aos Favoritos!",
      description: isFavorited ? "Esta oferta não está mais nos seus favoritos." : "Você pode encontrar esta oferta na sua lista de favoritos.",
    });
  };

  const handleToggleFollow = () => {
    onToggleFollow();
     toast({
      title: isFollowingMerchant ? "Deixou de Seguir" : "Seguindo Anunciante!",
      description: isFollowingMerchant ? "Você não receberá mais novidades deste anunciante." : "Agora você receberá novidades deste anunciante.",
    });
  };


  return (
    <Card className="shadow-md">
      <CardContent className="p-4 space-y-3">
        <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleGetOffer}>
          <CheckCircle className="mr-2" /> Obter Oferta Agora
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant={isFavorited ? "default" : "outline"} className="w-full" onClick={handleToggleFavorite}>
            <Heart className={`mr-2 ${isFavorited ? 'fill-destructive text-destructive' : 'text-primary'}`} /> 
            {isFavorited ? 'Favoritado' : 'Favoritar'}
          </Button>
          <Button variant="outline" className="w-full" onClick={onCommentClick}>
            <MessageSquare className="mr-2 text-primary" /> Comentar
          </Button>
          <Button variant="outline" className="w-full" onClick={handleShare}>
            <Share2 className="mr-2 text-primary" /> Compartilhar
          </Button>
           <Button variant={isFollowingMerchant ? "secondary" : "outline"} className="w-full" onClick={handleToggleFollow}>
            {isFollowingMerchant ? <BellRing className="mr-2 text-secondary-foreground" /> : <UserPlus className="mr-2 text-primary" /> }
            {isFollowingMerchant ? 'Seguindo' : 'Seguir Negócio'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferActionsSection;
