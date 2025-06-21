
'use client';

import React, { useState, useEffect } from 'react';
import UserInfo from '@/components/profile/UserInfo';
import ProfileActions from '@/components/profile/ProfileActions';
import PersonalDataCard from '@/components/profile/PersonalDataCard';
import ActivityHistoryCard from '@/components/profile/ActivityHistoryCard';
import GamificationCard from '@/components/profile/GamificationCard';
import InteractionsCard from '@/components/profile/InteractionsCard';
import { getUserProfile, updateUserProfile } from '@/lib/firebase/services/userService';
import { getOffer } from '@/lib/firebase/services/offerService'; // For fetching favorite offer details
import type { Offer, User as AppUser, Comment } from '@/types';
import { auth } from '@/lib/firebase/firebaseConfig';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FollowedMerchantDisplayItem } from '@/components/profile/FollowedMerchantsList';
import Link from 'next/link';
import { FirestoreConnectionError } from '@/components/common/FirestoreConnectionError';

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [favoritedOffersDetails, setFavoritedOffersDetails] = useState<Offer[]>([]);
  const [followedMerchantsDetails, setFollowedMerchantsDetails] = useState<FollowedMerchantDisplayItem[]>([]);
  const [commentsMadeDetails, setCommentsMadeDetails] = useState<Comment[]>([]); // Assuming comments are part of User or fetched separately
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        setLoading(true);
        setError(null);
        try {
          const userProfile = await getUserProfile(userAuth.uid);
          setCurrentUser(userProfile);

          if (userProfile) {
            // Fetch details for favorited offers
            if (userProfile.favoriteOffers && userProfile.favoriteOffers.length > 0) {
              const favOffers = await Promise.all(
                userProfile.favoriteOffers.map(id => getOffer(id)).filter(Boolean)
              );
              setFavoritedOffersDetails(favOffers.filter(o => o !== null) as Offer[]);
            } else {
              setFavoritedOffersDetails([]);
            }

            // Fetch details for followed merchants
            if (userProfile.followedMerchants && userProfile.followedMerchants.length > 0) {
              const followedData = await Promise.all(
                userProfile.followedMerchants.map(async (id) => {
                  const merchantProfile = await getUserProfile(id);
                  return merchantProfile ? {
                    id: merchantProfile.id,
                    name: merchantProfile.businessName || merchantProfile.name,
                    imageUrl: merchantProfile.businessLogoUrl || merchantProfile.avatarUrl,
                    'data-ai-hint': merchantProfile.businessLogoHint || merchantProfile.avatarHint || 'store logo',
                    isVerified: merchantProfile.advertiserStatus === 'active' // Example logic for verification
                  } : null;
                })
              );
              setFollowedMerchantsDetails(followedData.filter(Boolean) as FollowedMerchantDisplayItem[]);
            } else {
              setFollowedMerchantsDetails([]);
            }
            // TODO: Fetch comments made by user if stored in a separate subcollection or field.
            // For now, using placeholder if available on user object (which it isn't yet ideally)
             setCommentsMadeDetails(userProfile.commentsMade || []); 
          }
        } catch (err: any) {
          console.error("Error fetching profile data:", err);
          if (err.message.includes("offline") || err.message.includes("Failed to get document")) {
            setError("Não foi possível conectar ao banco de dados para carregar seu perfil. Verifique sua configuração do Firebase.");
          } else {
            setError("Ocorreu um erro ao carregar seus dados. Tente novamente mais tarde.");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [toast]);

  const handleSaveChanges = async (updatedData: Partial<AppUser>) => {
    if (currentUser) {
      try {
        await updateUserProfile(currentUser.id, updatedData);
        // Re-fetch user profile to reflect changes
        const refreshedUserProfile = await getUserProfile(currentUser.id);
        setCurrentUser(refreshedUserProfile);
        toast({ title: "Perfil Atualizado!", description: "Suas informações foram salvas." });
      } catch (error) {
        console.error("Error saving profile changes:", error);
        toast({ title: "Erro ao Salvar", description: "Não foi possível atualizar seu perfil.", variant: "destructive" });
      }
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
     return <FirestoreConnectionError message={error} />;
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        Por favor, <Link href="/login" className="text-primary hover:underline">faça login</Link> para ver seu perfil.
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-4">
      <UserInfo user={currentUser} />
      <PersonalDataCard user={currentUser} onSaveChanges={handleSaveChanges} />
      <GamificationCard user={currentUser} />
      <ActivityHistoryCard user={currentUser} /> {/* This component needs to be updated to fetch history from subcollections */}
      <InteractionsCard 
        favoriteOffers={favoritedOffersDetails} 
        followedMerchants={followedMerchantsDetails}
        commentsMade={commentsMadeDetails} // Pass actual comments if fetched
      />
      <ProfileActions />
    </div>
  );
}
