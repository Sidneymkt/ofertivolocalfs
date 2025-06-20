
import { db } from '@/lib/firebase/firebaseConfig';
import type { Sweepstake, SweepstakeParticipant, SweepstakeWinner } from '@/types';
import { 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';

const sweepstakesCollection = collection(db, 'sweepstakes');

// Helper to convert Firestore Timestamps to JS Dates in a Sweepstake object
const convertSweepstakeTimestamps = (sweepstakeData: any): Sweepstake => {
  const newSweepstakeData = { ...sweepstakeData };
  if (newSweepstakeData.startDate && newSweepstakeData.startDate instanceof Timestamp) {
    newSweepstakeData.startDate = newSweepstakeData.startDate.toDate();
  }
  if (newSweepstakeData.endDate && newSweepstakeData.endDate instanceof Timestamp) {
    newSweepstakeData.endDate = newSweepstakeData.endDate.toDate();
  }
  if (newSweepstakeData.drawDate && newSweepstakeData.drawDate instanceof Timestamp) {
    newSweepstakeData.drawDate = newSweepstakeData.drawDate.toDate();
  }
  // Convert timestamps in participants and winners if they are embedded
  // However, it's better to fetch them from subcollections and convert there.
  return newSweepstakeData as Sweepstake;
};


export const createSweepstake = async (sweepstakeData: Omit<Sweepstake, 'id' | 'status' | 'isDrawn' | 'drawDate' | 'participantCount'>): Promise<string> => {
  try {
    const docRef = await addDoc(sweepstakesCollection, {
      ...sweepstakeData,
      status: 'upcoming', // Default status
      isDrawn: false,
      participantCount: 0,
      // Timestamps for startDate and endDate should be provided as JS Date objects and will be converted by Firestore
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating sweepstake: ", error);
    throw error;
  }
};

export const getSweepstake = async (sweepstakeId: string): Promise<Sweepstake | null> => {
  if (!sweepstakeId) return null;
  const sweepstakeRef = doc(db, 'sweepstakes', sweepstakeId);
  try {
    const sweepstakeSnap = await getDoc(sweepstakeRef);
    if (sweepstakeSnap.exists()) {
      return convertSweepstakeTimestamps({ ...sweepstakeSnap.data(), id: sweepstakeSnap.id });
    } else {
      console.log("No such sweepstake!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching sweepstake: ", error);
    throw error;
  }
};

export const getAllSweepstakes = async (filters?: { status?: Sweepstake['status'] }): Promise<Sweepstake[]> => {
  try {
    let q = query(sweepstakesCollection, orderBy("startDate", "desc"));

    if (filters?.status) {
      q = query(q, where("status", "==", filters.status));
    }
    
    const querySnapshot = await getDocs(q);
    const sweepstakes: Sweepstake[] = [];
    querySnapshot.forEach((docSnap) => {
      sweepstakes.push(convertSweepstakeTimestamps({ ...docSnap.data(), id: docSnap.id }));
    });
    return sweepstakes;
  } catch (error) {
    console.error("Error fetching all sweepstakes: ", error);
    throw error;
  }
};

export const updateSweepstake = async (sweepstakeId: string, data: Partial<Omit<Sweepstake, 'id'>>): Promise<void> => {
  const sweepstakeRef = doc(db, 'sweepstakes', sweepstakeId);
  try {
    await updateDoc(sweepstakeRef, data);
  } catch (error) {
    console.error("Error updating sweepstake: ", error);
    throw error;
  }
};

// Participants subcollection management
export const addParticipantToSweepstake = async (
  sweepstakeId: string, 
  participantData: Omit<SweepstakeParticipant, 'id' | 'entryDate'>
): Promise<string> => {
  if (!sweepstakeId) throw new Error("Sweepstake ID is required.");
  const participantsSubCollectionRef = collection(db, 'sweepstakes', sweepstakeId, 'participants');
  try {
    const docRef = await addDoc(participantsSubCollectionRef, {
      ...participantData,
      entryDate: serverTimestamp()
    });
    // Increment participantCount on the main sweepstake document
    const sweepstakeRef = doc(db, 'sweepstakes', sweepstakeId);
    const sweepstakeSnap = await getDoc(sweepstakeRef);
    if (sweepstakeSnap.exists()) {
      const currentCount = sweepstakeSnap.data().participantCount || 0;
      await updateDoc(sweepstakeRef, { participantCount: currentCount + 1 });
    }
    return docRef.id;
  } catch (error) {
    console.error("Error adding participant: ", error);
    throw error;
  }
};

export const getSweepstakeParticipants = async (sweepstakeId: string): Promise<SweepstakeParticipant[]> => {
  if (!sweepstakeId) return [];
  const participantsSubCollectionRef = collection(db, 'sweepstakes', sweepstakeId, 'participants');
  try {
    const q = query(participantsSubCollectionRef, orderBy("entryDate", "asc"));
    const querySnapshot = await getDocs(q);
    const participants: SweepstakeParticipant[] = [];
    querySnapshot.forEach((docSnap) => {
      const participantData = docSnap.data();
      let entryDate = participantData.entryDate;
      if (entryDate instanceof Timestamp) {
        entryDate = entryDate.toDate();
      }
      participants.push({ ...participantData, id: docSnap.id, entryDate } as SweepstakeParticipant);
    });
    return participants;
  } catch (error) {
    console.error("Error fetching participants for sweepstake: ", error);
    throw error;
  }
};


// Winners subcollection management
export const addWinnersToSweepstake = async (sweepstakeId: string, winners: SweepstakeWinner[]): Promise<void> => {
  if (!sweepstakeId || !winners || winners.length === 0) throw new Error("Sweepstake ID and winners list are required.");
  
  const batch = writeBatch(db);
  const winnersSubCollectionRef = collection(db, 'sweepstakes', sweepstakeId, 'winners');
  
  winners.forEach(winner => {
    const winnerDocRef = doc(winnersSubCollectionRef, winner.userId); // Use userId as doc ID for winners to prevent duplicates
    batch.set(winnerDocRef, winner);
  });
  
  // Update the main sweepstake document
  const sweepstakeRef = doc(db, 'sweepstakes', sweepstakeId);
  batch.update(sweepstakeRef, {
    isDrawn: true,
    status: 'drawing_complete',
    drawDate: serverTimestamp()
    // winners: winners // Storing winners directly on the sweepstake doc might be okay for small numbers,
                       // but subcollection is better for querying/scaling if winners list grows large.
                       // For now, the winners are primarily in the subcollection.
  });

  try {
    await batch.commit();
  } catch (error) {
    console.error("Error adding winners to sweepstake: ", error);
    throw error;
  }
};

export const getSweepstakeWinners = async (sweepstakeId: string): Promise<SweepstakeWinner[]> => {
  if (!sweepstakeId) return [];
  const winnersSubCollectionRef = collection(db, 'sweepstakes', sweepstakeId, 'winners');
  try {
    const querySnapshot = await getDocs(winnersSubCollectionRef);
    const winners: SweepstakeWinner[] = [];
    querySnapshot.forEach((docSnap) => {
      winners.push(docSnap.data() as SweepstakeWinner); // Assuming winner doc ID is userId
    });
    return winners;
  } catch (error) {
    console.error("Error fetching winners for sweepstake: ", error);
    throw error;
  }
};
