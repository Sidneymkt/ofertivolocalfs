
import UserInfo from '@/components/profile/UserInfo';
import FavoriteDealsList from '@/components/profile/FavoriteDealsList';
import ProfileActions from '@/components/profile/ProfileActions';
import { mockUser, mockOffers, getMockMerchantById } from '@/types';
import PersonalDataCard from '@/components/profile/PersonalDataCard';
import ActivityHistoryCard from '@/components/profile/ActivityHistoryCard';
import GamificationCard from '@/components/profile/GamificationCard';
import InteractionsCard from '@/components/profile/InteractionsCard';
import FollowedMerchantsList from '@/components/profile/FollowedMerchantsList';
import type { Offer, User } from '@/types';

export default function ProfilePage() {
  // Filter mockOffers to get only the ones favorited by mockUser
  const favoritedOffers = mockOffers.filter(offer => mockUser.favoriteOffers?.includes(offer.id));
  
  const followedMerchantsData = mockUser.followedMerchants
    ?.map(id => getMockMerchantById(id))
    .filter(Boolean) as Array<{ id: string; name: string; imageUrl?: string; 'data-ai-hint'?: string; isVerified?: boolean }>;


  return (
    <div className="space-y-8 pb-4">
      <UserInfo user={mockUser} />
      
      <PersonalDataCard user={mockUser} />

      <GamificationCard user={mockUser} />
      
      <ActivityHistoryCard user={mockUser} />

      <InteractionsCard 
        favoriteOffers={favoritedOffers} 
        followedMerchants={followedMerchantsData}
        commentsMade={mockUser.commentsMade || []}
      />
      
      <ProfileActions />
    </div>
  );
}

    