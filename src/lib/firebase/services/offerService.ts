
import { db } from '@/lib/firebase/firebaseConfig';
import type { Offer, Comment } from '@/types';
import { 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { mockOfferList, mockUser } from '@/types';

const offersCollection = collection(db, 'offers');

// Helper to convert Firestore Timestamps to JS Dates in an Offer object
const convertOfferTimestamps = (offerData: any): Offer => {
  const newOfferData = { ...offerData };
  if (newOfferData.validityStartDate && newOfferData.validityStartDate instanceof Timestamp) {
    newOfferData.validityStartDate = newOfferData.validityStartDate.toDate();
  }
  if (newOfferData.validityEndDate && newOfferData.validityEndDate instanceof Timestamp) {
    newOfferData.validityEndDate = newOfferData.validityEndDate.toDate();
  }
  if (newOfferData.createdAt && newOfferData.createdAt instanceof Timestamp) {
    newOfferData.createdAt = newOfferData.createdAt.toDate();
  }
  if (newOfferData.updatedAt && newOfferData.updatedAt instanceof Timestamp) {
    newOfferData.updatedAt = newOfferData.updatedAt.toDate();
  }
  return newOfferData as Offer;
};

// --- MOCK IMPLEMENTATIONS ---
const USE_MOCK_DATA = true; // Switch to false to use real Firestore

export const createOffer = async (offerData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt' | 'comments'>): Promise<string> => {
  if (USE_MOCK_DATA) {
    console.log("Mock createOffer called with:", offerData);
    const newId = `mock-offer-${Date.now()}`;
    const newOffer = { 
      ...offerData, 
      id: newId, 
      createdAt: Timestamp.now(), 
      updatedAt: Timestamp.now(), 
      usersUsedCount: 0, 
      reviews: 0, 
      rating: 0 
    };
    mockOfferList.unshift(newOffer as Offer);
    return Promise.resolve(newId);
  }
  // Real implementation
  try {
    const now = serverTimestamp();
    const docRef = await addDoc(offersCollection, {
      ...offerData,
      createdAt: now,
      updatedAt: now,
      status: offerData.status || 'pending_approval',
      usersUsedCount: offerData.usersUsedCount || 0,
      reviews: 0,
      rating: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating offer: ", error);
    throw error;
  }
};

export const getOffer = async (offerId: string): Promise<Offer | null> => {
  if (USE_MOCK_DATA) {
    const offer = mockOfferList.find(o => o.id === offerId) || null;
    return Promise.resolve(offer);
  }
  // Real implementation
  if (!offerId) return null;
  const offerRef = doc(db, 'offers', offerId);
  try {
    const offerSnap = await getDoc(offerRef);
    if (offerSnap.exists()) {
      return convertOfferTimestamps({ ...offerSnap.data(), id: offerSnap.id });
    } else {
      console.log("No such offer!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching offer: ", error);
    throw error;
  }
};

export const getAllOffers = async (filters?: { category?: string; merchantId?: string }): Promise<Offer[]> => {
  if (USE_MOCK_DATA) {
    let offers = [...mockOfferList];
    if (filters?.category) {
        offers = offers.filter(o => o.category === filters.category);
    }
    if (filters?.merchantId) {
        offers = offers.filter(o => o.merchantId === filters.merchantId);
    }
    return Promise.resolve(offers);
  }
  // Real implementation
  try {
    let q = query(offersCollection, where("status", "in", ["active", "pending_approval"]), orderBy("createdAt", "desc"));
    if (filters?.category) {
      q = query(q, where("category", "==", filters.category));
    }
    if (filters?.merchantId) {
      q = query(q, where("merchantId", "==", filters.merchantId));
    }
    const querySnapshot = await getDocs(q);
    const offers: Offer[] = [];
    querySnapshot.forEach((docSnap) => {
      offers.push(convertOfferTimestamps({ ...docSnap.data(), id: docSnap.id }));
    });
    return offers;
  } catch (error) {
    console.error("Error fetching all offers: ", error);
    throw error;
  }
};

export const updateOffer = async (offerId: string, data: Partial<Omit<Offer, 'id' | 'createdAt'>>): Promise<void> => {
  if (USE_MOCK_DATA) {
      const offerIndex = mockOfferList.findIndex(o => o.id === offerId);
      if (offerIndex !== -1) {
          mockOfferList[offerIndex] = { ...mockOfferList[offerIndex], ...data, updatedAt: Timestamp.now() } as Offer;
          console.log("Mock updateOffer called for:", offerId, " with:", data);
      }
      return Promise.resolve();
  }
  // Real implementation
  const offerRef = doc(db, 'offers', offerId);
  try {
    await updateDoc(offerRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating offer: ", error);
    throw error;
  }
};

export const getOffersByMerchant = async (merchantId: string): Promise<Offer[]> => {
  return getAllOffers({ merchantId });
};


// Comments are now a subcollection
export const addCommentToOffer = async (offerId: string, commentData: Omit<Comment, 'id' | 'timestamp'>): Promise<string> => {
   if (USE_MOCK_DATA) {
        const offerIndex = mockOfferList.findIndex(o => o.id === offerId);
        if (offerIndex !== -1) {
            const newComment = {
                ...commentData,
                id: `mock-comment-${Date.now()}`,
                timestamp: Timestamp.now(),
            } as Comment;
            // This is simplified. In a real app, comments would be a subcollection.
            // We're not storing them on the mock offer object itself.
            console.log("Adding mock comment to offer:", offerId, newComment);
        }
        return Promise.resolve(`mock-comment-${Date.now()}`);
   }
  // Real implementation
  if (!offerId) throw new Error("Offer ID is required to add a comment.");
  
  const commentsSubCollectionRef = collection(db, 'offers', offerId, 'comments');
  try {
    const docRef = await addDoc(commentsSubCollectionRef, {
      ...commentData,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding comment: ", error);
    throw error;
  }
};

export const getOfferComments = async (offerId: string): Promise<Comment[]> => {
    if (USE_MOCK_DATA) {
        if (offerId === 'offer-pizza-1') {
            return Promise.resolve(mockUser.commentsMade || []);
        }
        return Promise.resolve([]);
    }
  // Real implementation
  if (!offerId) return [];
  const commentsSubCollectionRef = collection(db, 'offers', offerId, 'comments');
  try {
    const q = query(commentsSubCollectionRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const comments: Comment[] = [];
    querySnapshot.forEach((docSnap) => {
      const commentData = docSnap.data();
      let timestamp = commentData.timestamp;
      if (timestamp instanceof Timestamp) {
        timestamp = timestamp.toDate();
      }
      comments.push({ ...commentData, id: docSnap.id, timestamp } as Comment);
    });
    return comments;
  } catch (error) {
    console.error("Error fetching comments for offer: ", error);
    throw error;
  }
};


export const incrementOfferUsage = async (offerId: string): Promise<void> => {
    if (USE_MOCK_DATA) {
        const offerIndex = mockOfferList.findIndex(o => o.id === offerId);
        if (offerIndex !== -1) {
            mockOfferList[offerIndex].usersUsedCount = (mockOfferList[offerIndex].usersUsedCount || 0) + 1;
            console.log(`Incremented usage for ${offerId}. New count: ${mockOfferList[offerIndex].usersUsedCount}`);
        }
        return Promise.resolve();
    }
    // Real implementation
    const offerRef = doc(db, 'offers', offerId);
    try {
        const offerSnap = await getDoc(offerRef);
        if (offerSnap.exists()) {
            const currentUsage = offerSnap.data().usersUsedCount || 0;
            await updateDoc(offerRef, {
                usersUsedCount: currentUsage + 1,
                updatedAt: serverTimestamp()
            });
        }
    } catch (error) {
        console.error("Error incrementing offer usage: ", error);
    }
};
