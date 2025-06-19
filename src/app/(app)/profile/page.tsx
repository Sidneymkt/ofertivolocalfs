import UserInfo from '@/components/profile/UserInfo';
import FavoriteDealsList from '@/components/profile/FavoriteDealsList';
import ProfileActions from '@/components/profile/ProfileActions';
import { mockUser, mockOffers } from '@/types';

export default function ProfilePage() {
  // Filter mockOffers to get only the ones favorited by mockUser
  const favoritedOffers = mockOffers.filter(offer => mockUser.favoriteOffers?.includes(offer.id));

  return (
    <div className="space-y-8">
      <UserInfo user={mockUser} />
      <FavoriteDealsList favoriteOffers={favoritedOffers} />
      <ProfileActions />
    </div>
  );
}
