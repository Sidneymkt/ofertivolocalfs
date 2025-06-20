
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import type { Offer, User as AppUser, Comment } from '@/types'; 
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
import { getOffer as fetchOffer, getOfferComments, addCommentToOffer as postComment } from '@/lib/firebase/services/offerService';
import { getUserProfile, addFavoriteOffer, removeFavoriteOffer, followMerchant, unfollowMerchant } from '@/lib/firebase/services/userService';
import { auth } from '@/lib/firebase/firebaseConfig';
import { useToast } from "@/hooks/use-toast";
import { serverTimestamp, POINTS_RATE_OFFER_OR_MERCHANT } from '@/types';

export default function OfferDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const offerId = params.id as string;
  
  const [offer, setOffer] = useState<Offer | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFollowingMerchant, setIsFollowingMerchant] = useState(false);

  const isOwner = !!offer && currentUser?.isAdvertiser && currentUser.id === offer.merchantId;

  const loadOfferData = useCallback(async () => {
    if (offerId) {
      setLoading(true);
      setError(null);
      try {
        const offerData = await fetchOffer(offerId);
        if (offerData) {
          setOffer(offerData);
          const offerComments = await getOfferComments(offerId);
          setComments(offerComments);
        } else {
          setError('Oferta não encontrada.');
        }
      } catch (e) {
        console.error("Error loading offer data:", e);
        setError('Erro ao carregar a oferta.');
      } finally {
        setLoading(false);
      }
    }
  }, [offerId]);

  useEffect(() => {
    loadOfferData();
  }, [loadOfferData]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        setCurrentUser(userProfile);
        if (userProfile && offer) {
          setIsFavorited(userProfile.favoriteOffers?.includes(offer.id!) ?? false);
          setIsFollowingMerchant(userProfile.followedMerchants?.includes(offer.merchantId) ?? false);
        }
      } else {
        setCurrentUser(null);
        setIsFavorited(false);
        setIsFollowingMerchant(false);
      }
    });
    return () => unsubscribe();
  }, [offer]);


  const toggleFavorite = async () => {
    if (!currentUser || !offer?.id) {
      toast({ title: "Ação Requer Login", description: "Faça login para favoritar ofertas.", variant: "destructive" });
      return;
    }
    try {
      if (isFavorited) {
        await removeFavoriteOffer(currentUser.id, offer.id);
      } else {
        await addFavoriteOffer(currentUser.id, offer.id);
      }
      setIsFavorited(!isFavorited);
      toast({
        title: !isFavorited ? "Adicionado aos Favoritos!" : "Removido dos Favoritos",
      });
    } catch (e) {
      toast({ title: "Erro", description: "Não foi possível atualizar favoritos.", variant: "destructive" });
    }
  };

  const toggleFollow = async () => {
    if (!currentUser || !offer?.merchantId) {
       toast({ title: "Ação Requer Login", description: "Faça login para seguir comerciantes.", variant: "destructive" });
      return;
    }
    try {
      if (isFollowingMerchant) {
        await unfollowMerchant(currentUser.id, offer.merchantId);
      } else {
        await followMerchant(currentUser.id, offer.merchantId);
      }
      setIsFollowingMerchant(!isFollowingMerchant);
       toast({
        title: !isFollowingMerchant ? "Seguindo Anunciante!" : "Deixou de Seguir",
      });
    } catch (e) {
      toast({ title: "Erro", description: "Não foi possível atualizar o status de seguir.", variant: "destructive" });
    }
  };

  const handlePostComment = async (commentText: string, rating: number) => {
    if (!currentUser || !offer?.id) {
      toast({ title: "Ação Requer Login", description: "Faça login para comentar.", variant: "destructive" });
      return false;
    }
    try {
      const commentData: Omit<Comment, 'id' | 'timestamp'> = {
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatarUrl: currentUser.avatarUrl,
        userAvatarHint: currentUser.avatarHint,
        rating,
        text: commentText,
        offerId: offer.id,
        offerTitle: offer.title, // Denormalized
        pointsEarned: POINTS_RATE_OFFER_OR_MERCHANT, // Example
      };
      await postComment(offer.id, commentData);
      // Refresh comments
      const updatedComments = await getOfferComments(offer.id);
      setComments(updatedComments);
      // TODO: Update user points (this should ideally be a backend operation or transaction)
      toast({ title: "Comentário Enviado!", description: "Obrigado pela sua avaliação." });
      return true;
    } catch (e) {
      toast({ title: "Erro ao Comentar", description: "Não foi possível enviar seu comentário.", variant: "destructive" });
      return false;
    }
  };


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

  return (
    <div className="space-y-6 pb-8">
      <OfferImageGallery 
        images={offer.galleryImages && offer.galleryImages.length > 0 ? offer.galleryImages : [offer.imageUrl]} 
        imageHints={offer.galleryImageHints || [offer['data-ai-hint'] || 'offer image']} 
        offerTitle={offer.title} 
      />
      
      <OfferInfoSection offer={offer} />
      
      <OfferActionsSection 
        offerId={offer.id!}
        isFavorited={isFavorited}
        isFollowingMerchant={isFollowingMerchant}
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
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/20" asChild>
              <Link href={`/dashboard/advertiser/create-offer?editId=${offer.id}`}>
                <Edit size={16} className="mr-2" /> Editar Oferta
              </Link>
            </Button>
            <div className="text-xs text-muted-foreground">
              <p>Visualizações: {offer.reviews ? offer.reviews * 5 + 100 : 1024}</p> {/* Placeholder analytics */}
              <p>Cliques: {offer.usersUsedCount ? offer.usersUsedCount * 2 + 50 : 320}</p>
              <p>Check-ins: {offer.usersUsedCount || 45}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <OfferValidationSection offer={offer} />
      
      <OfferLocationSection offer={offer} />
      
      <OfferCommentsSection offer={offer} comments={comments} onPostComment={handlePostComment} />

    </div>
  );
}
