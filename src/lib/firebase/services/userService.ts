
import { db } from '@/lib/firebase/firebaseConfig';
import type { User } from '@/types';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';

const usersCollection = collection(db, 'users');

export const createUserProfile = async (userId: string, userData: Omit<User, 'id' | 'joinDate'> & { joinDate?: Timestamp }): Promise<void> => {
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
  if (!userId) {
    console.warn("getUserProfile called with no userId");
    return null;
  }
  const userRef = doc(db, 'users', userId);
  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data() as any; // Use any to avoid TS errors during conversion

      // Helper function to convert timestamps in an array of objects
      const convertTimestampsInArray = (arr: any[], dateKey: string) => {
        if (!Array.isArray(arr)) return arr;
        return arr.map(item => {
          if (item && item[dateKey] && item[dateKey] instanceof Timestamp) {
            return { ...item, [dateKey]: item[dateKey].toDate() };
          }
          return item;
        });
      };
      
      // Convert all known timestamp fields
      if (userData.joinDate && userData.joinDate instanceof Timestamp) {
        userData.joinDate = userData.joinDate.toDate();
      }
      
      // Arrays
      userData.checkInHistory = convertTimestampsInArray(userData.checkInHistory, 'timestamp');
      userData.sharedOffersHistory = convertTimestampsInArray(userData.sharedOffersHistory, 'timestamp');
      userData.sweepstakeParticipations = convertTimestampsInArray(userData.sweepstakeParticipations, 'timestamp');
      userData.commentsMade = convertTimestampsInArray(userData.commentsMade, 'timestamp');
      userData.badges = convertTimestampsInArray(userData.badges, 'unlockedDate');

      return { ...userData, id: userSnap.id } as User;
    } else {
      console.log("No such user profile!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile: ", error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, data);
  } catch (error) {
    console.error("Error updating user profile: ", error);
    throw error;
  }
};

export const addFavoriteOffer = async (userId: string, offerId: string): Promise<void> => {
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
  try {
    const q = query(usersCollection, where("isAdvertiser", "==", true));
    const querySnapshot = await getDocs(q);
    const merchants: User[] = [];
    querySnapshot.forEach((docSnap) => {
      const merchantData = docSnap.data() as User;
      if (merchantData.joinDate && merchantData.joinDate instanceof Timestamp) {
        merchantData.joinDate = merchantData.joinDate.toDate();
      }
      merchants.push({ ...merchantData, id: docSnap.id });
    });
    return merchants;
  } catch (error) {
    console.error("Error fetching merchants: ", error);
    throw error;
  }
};
