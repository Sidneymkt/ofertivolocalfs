
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

export const createOffer = async (offerData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt' | 'comments'>): Promise<string> => {
  try {
    const now = serverTimestamp();
    const docRef = await addDoc(offersCollection, {
      ...offerData,
      createdAt: now,
      updatedAt: now,
      status: offerData.status || 'pending_approval', // Default status
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
  try {
    let q = query(offersCollection, where("status", "==", "active"), orderBy("createdAt", "desc"));

    if (filters?.category) {
      q = query(q, where("category", "==", filters.category));
    }
    if (filters?.merchantId) {
      q = query(q, where("merchantId", "==", filters.merchantId));
    }
    // Add more filters as needed (e.g., price range, tags - might require more complex indexing or client-side filtering for arrays)

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
  if (!offerId) throw new Error("Offer ID is required to add a comment.");
  
  const commentsSubCollectionRef = collection(db, 'offers', offerId, 'comments');
  try {
    const docRef = await addDoc(commentsSubCollectionRef, {
      ...commentData,
      timestamp: serverTimestamp()
    });
    // Here you might want to update the offer's main document with aggregated comment data (count, average rating) using a transaction or cloud function.
    // For simplicity, this part is omitted for now.
    return docRef.id;
  } catch (error) {
    console.error("Error adding comment: ", error);
    throw error;
  }
};

export const getOfferComments = async (offerId: string): Promise<Comment[]> => {
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

// TODO: Functions to increment usersUsedCount, update average rating on an offer.
// These often involve transactions for atomicity.
export const incrementOfferUsage = async (offerId: string): Promise<void> => {
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
        // Optionally re-throw or handle as needed
    }
};
