
import { db } from '@/lib/firebase/firebaseConfig';
import type { User } from '@/types';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, getDocs, query, where, Timestamp, orderBy, limit } from 'firebase/firestore';
import { mockUser, mockUserList, mockAdvertiserUser, mockAdvertiserList } from '@/types';

// --- MOCK IMPLEMENTATIONS ---
const USE_MOCK_DATA = true; // Switch to false to use real Firestore

const usersCollection = collection(db, 'users');

const convertUserDocumentData = (data: any): User => {
  const newUserData = { ...data };

  const convertTimestampsInArray = (arr: any[], dateKey: string) => {
    if (!Array.isArray(arr)) return arr || []; // Return empty array if undefined/null
    return arr.map(item => {
      if (item && item[dateKey] && item[dateKey] instanceof Timestamp) {
        return { ...item, [dateKey]: item[dateKey].toDate() };
      }
      return item;
    });
  };
  
  if (newUserData.joinDate && newUserData.joinDate instanceof Timestamp) {
    newUserData.joinDate = newUserData.joinDate.toDate();
  }
  
  newUserData.checkInHistory = convertTimestampsInArray(newUserData.checkInHistory, 'timestamp');
  newUserData.sharedOffersHistory = convertTimestampsInArray(newUserData.sharedOffersHistory, 'timestamp');
  newUserData.sweepstakeParticipations = convertTimestampsInArray(newUserData.sweepstakeParticipations, 'timestamp');
  newUserData.commentsMade = convertTimestampsInArray(newUserData.commentsMade, 'timestamp');
  newUserData.badges = convertTimestampsInArray(newUserData.badges, 'unlockedDate');

  return newUserData as User;
};


export const createUserProfile = async (userId: string, userData: Omit<User, 'id' | 'joinDate'> & { joinDate?: Timestamp }): Promise<void> => {
  if (USE_MOCK_DATA) {
    console.log("Mock createUserProfile called for:", userId, "with data:", userData);
    const newUser = {
      ...userData,
      id: userId,
      joinDate: Timestamp.now(),
    } as User;
    if (newUser.isAdvertiser) {
      mockAdvertiserList.push(newUser);
    } else {
      mockUserList.push(newUser);
    }
    return Promise.resolve();
  }
  
  const userRef = doc(db, 'users', userId);
  const now = Timestamp.now();
  try {
    await setDoc(userRef, {
      ...userData,
      id: userId, // Ensure ID is part of the document data
      joinDate: userData.joinDate || now, // Use provided joinDate or current server time
      points: userData.points || 0,
      level: userData.level || 'Iniciante',
      currentXp: userData.currentXp || 0,
      xpToNextLevel: userData.xpToNextLevel || 100,
      isAdvertiser: userData.isAdvertiser || false,
      status: userData.status || 'active',
    });
  } catch (error) {
    console.error("Error creating user profile: ", error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  if (USE_MOCK_DATA) {
    const allMocks = [...mockUserList, ...mockAdvertiserList, mockUser, mockAdvertiserUser];
    const user = allMocks.find(u => u.id === userId);
    if (user) {
        return Promise.resolve(convertUserDocumentData(user));
    }
    // Fallback for any other user ID (like a real authenticated one in dev) to allow pages to load.
    console.log(`Mock getUserProfile: UID ${userId} not found in mocks, returning default mockUser.`);
    return Promise.resolve(convertUserDocumentData(mockUser));
  }
  
  if (!userId) {
    console.warn("getUserProfile called with no userId");
    return null;
  }
  const userRef = doc(db, 'users', userId);
  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return convertUserDocumentData({ ...userSnap.data(), id: userSnap.id });
    } else {
      console.log("No such user profile!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile: ", error);
    throw error;
  }
};

export const getLeaderboardUsers = async (count: number): Promise<User[]> => {
    if (USE_MOCK_DATA) {
        const sortedUsers = [...mockUserList, mockUser].sort((a, b) => b.points - a.points);
        const uniqueUsers = Array.from(new Map(sortedUsers.map(item => [item.id, item])).values());
        return Promise.resolve(uniqueUsers.slice(0, count).map(convertUserDocumentData));
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("points", "desc"), limit(count));
    try {
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => convertUserDocumentData({ ...doc.data(), id: doc.id }));
    } catch (error) {
        console.error("Error fetching leaderboard users: ", error);
        throw error;
    }
};


export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<void> => {
  if (USE_MOCK_DATA) {
      const userIndex = mockUserList.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
          mockUserList[userIndex] = { ...mockUserList[userIndex], ...data };
      } else {
          const advertiserIndex = mockAdvertiserList.findIndex(a => a.id === userId);
          if (advertiserIndex !== -1) {
              mockAdvertiserList[advertiserIndex] = { ...mockAdvertiserList[advertiserIndex], ...data };
          }
      }
      console.log("Mock updateUserProfile called for:", userId, " with:", data);
      return Promise.resolve();
  }

  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, data);
  } catch (error) {
    console.error("Error updating user profile: ", error);
    throw error;
  }
};

export const addFavoriteOffer = async (userId: string, offerId: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    console.log(`Mock: Adding offer ${offerId} to user ${userId}'s favorites.`);
    return Promise.resolve();
  }
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, {
      favoriteOffers: arrayUnion(offerId)
    });
  } catch (error) {
    console.error("Error adding favorite offer: ", error);
    throw error;
  }
};

export const removeFavoriteOffer = async (userId: string, offerId: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    console.log(`Mock: Removing offer ${offerId} from user ${userId}'s favorites.`);
    return Promise.resolve();
  }
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, {
      favoriteOffers: arrayRemove(offerId)
    });
  } catch (error) {
    console.error("Error removing favorite offer: ", error);
    throw error;
  }
};

export const followMerchant = async (userId: string, merchantId: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    console.log(`Mock: User ${userId} now following merchant ${merchantId}.`);
    return Promise.resolve();
  }
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, {
      followedMerchants: arrayUnion(merchantId)
    });
  } catch (error) {
    console.error("Error following merchant: ", error);
    throw error;
  }
};

export const unfollowMerchant = async (userId: string, merchantId: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    console.log(`Mock: User ${userId} unfollowed merchant ${merchantId}.`);
    return Promise.resolve();
  }
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, {
      followedMerchants: arrayRemove(merchantId)
    });
  } catch (error) {
    console.error("Error unfollowing merchant: ", error);
    throw error;
  }
};

// Example: Get all merchants (users who are advertisers)
export const getAllMerchants = async (): Promise<User[]> => {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockAdvertiserList.map(convertUserDocumentData));
  }
  try {
    const q = query(usersCollection, where("isAdvertiser", "==", true));
    const querySnapshot = await getDocs(q);
    const merchants: User[] = [];
    querySnapshot.forEach((docSnap) => {
      merchants.push(convertUserDocumentData({ ...docSnap.data(), id: docSnap.id }));
    });
    return merchants;
  } catch (error) {
    console.error("Error fetching merchants: ", error);
    throw error;
  }
};
