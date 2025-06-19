
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Offer, mockOffers, mockUser, mockAdvertiserUser } from '@/types';
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
const getCurrentUser = () => {
  const isCurrentUserAdvertiser = false; 
  return isCurrentUserAdvertiser ? mockAdvertiserUser : mockUser;
}

export default function OfferDetailPage() {
  const params = useParams();
  const offerId = params.id as string;
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFavorited, setIsFavorited] = useState(false);
  const [isFollowingMerchant, setIsFollowingMerchant] = useState(false); // Renamed from isFollowing

  const currentUser = getCurrentUser(); 
  const isOwner = currentUser.isAdvertiser && currentUser.advertiserProfileId === offer?.merchantId;

  useEffect(() => {
    if (offerId) {
      setLoading(true);
      setError(null); // Clear previous error before new fetch
      getOfferById(offerId)
        .then(data => {
          if (data) {
            setOffer(data);
            setIsFavorited(currentUser.favoriteOffers?.includes(data.id) ?? false);
            setIsFollowingMerchant(currentUser.followedMerchants?.includes(data.merchantId) ?? false);
          } else {
            setError('Oferta não encontrada.');
          }
        })
        .catch(() => {
          setError('Erro ao carregar a oferta.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [offerId]); // currentUser is stable based on mock data, so not needed as dependency here

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

  const toggleFavorite = () => setIsFavorited(!isFavorited);
  const toggleFollow = () => setIsFollowingMerchant(!isFollowingMerchant); // Updated to use renamed state setter


  return (
    <div className="space-y-6 pb-8">
      <OfferImageGallery images={offer.galleryImages || [offer.imageUrl]} imageHints={offer.galleryImageHints || [offer['data-ai-hint'] || 'offer image']} offerTitle={offer.title} />
      
      <OfferInfoSection offer={offer} />
      
      <OfferActionsSection 
        offerId={offer.id}
        isFavorited={isFavorited}
        isFollowingMerchant={isFollowingMerchant} // Passed renamed state
        onToggleFavorite={toggleFavorite}
        onToggleFollow={toggleFollow} // Passes the renamed toggle function
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
