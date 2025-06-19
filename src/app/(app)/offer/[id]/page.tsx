
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Offer, mockOffers, mockUser, mockAdvertiserUser } from '@/types'; // Assuming mockUser can represent current logged-in user
import OfferImageGallery from '@/components/offers/OfferImageGallery';
import OfferInfoSection from '@/components/offers/OfferInfoSection';
import OfferActionsSection from '@/components/offers/OfferActionsSection';
import OfferLocationSection from '@/components/offers/OfferLocationSection';
import OfferValidationSection from '@/components/offers/OfferValidationSection';
import OfferCommentsSection from '@/components/offers/OfferCommentsSection';
import { Button } from '@/components/ui/button';
import { Edit, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

// Simulate fetching an offer
const getOfferById = (id: string): Promise<Offer | undefined> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockOffers.find(offer => offer.id === id));
    }, 500);
  });
};

// Simulate determining current user type (for advertiser panel)
// In a real app, this would come from an auth context
const getCurrentUser = () => {
  // Toggle this to test advertiser view
  const isCurrentUserAdvertiser = false; 
  return isCurrentUserAdvertiser ? mockAdvertiserUser : mockUser;
}

export default function OfferDetailPage() {
  const params = useParams();
  const offerId = params.id as string;
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUser = getCurrentUser(); // Simulated current user
  const isOwner = currentUser.isAdvertiser && currentUser.advertiserProfileId === offer?.merchantId;


  useEffect(() => {
    if (offerId) {
      setLoading(true);
      getOfferById(offerId)
        .then(data => {
          if (data) {
            setOffer(data);
          } else {
            setError('Oferta não encontrada.');
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Erro ao carregar a oferta.');
          setLoading(false);
        });
    }
  }, [offerId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive text-lg">{error}</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/">Voltar para Ofertas</Link>
        </Button>
      </div>
    );
  }

  if (!offer) {
    return <div className="text-center py-10 text-muted-foreground">Oferta não encontrada.</div>;
  }

  // For actions that depend on user state (e.g., favorited)
  const [isFavorited, setIsFavorited] = useState(mockUser.favoriteOffers?.includes(offer.id) ?? false);
  const [isFollowing, setIsFollowing] = useState(false); // Placeholder

  const toggleFavorite = () => setIsFavorited(!isFavorited);
  const toggleFollow = () => setIsFollowing(!isFollowing);


  return (
    <div className="space-y-6 pb-8">
      <OfferImageGallery images={offer.galleryImages || [offer.imageUrl]} imageHints={offer.galleryImageHints || [offer['data-ai-hint'] || 'offer image']} offerTitle={offer.title} />
      
      <OfferInfoSection offer={offer} />
      
      <OfferActionsSection 
        offerId={offer.id}
        isFavorited={isFavorited}
        isFollowingMerchant={isFollowing}
        onToggleFavorite={toggleFavorite}
        onToggleFollow={toggleFollow}
        onCommentClick={() => document.getElementById('comment-section')?.scrollIntoView({ behavior: 'smooth' })}
      />

      {isOwner && (
        <Card className="bg-primary/10 border-primary">
          <CardHeader>
            <CardTitle className="text-primary text-lg">Painel do Anunciante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-primary/80">Você é o proprietário desta oferta.</p>
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/20">
              <Edit size={16} className="mr-2" /> Editar Oferta
            </Button>
            <div className="text-xs text-muted-foreground">
              <p>Visualizações: 1024 | Cliques: 320 | Check-ins: 45 (estatísticas de exemplo)</p>
            </div>
          </CardContent>
        </Card>
      )}

      <OfferValidationSection offer={offer} />
      
      <OfferLocationSection offer={offer} />
      
      <OfferCommentsSection offer={offer} />

    </div>
  );
}
