
'use server';

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
import { mockSweepstakeList } from '@/types';

// --- MOCK IMPLEMENTATIONS ---
const USE_MOCK_DATA = true; // Switch to false to use real Firestore

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
  return newSweepstakeData as Sweepstake;
};


export const createSweepstake = async (sweepstakeData: Omit<Sweepstake, 'id' | 'status' | 'isDrawn' | 'drawDate' | 'participantCount'>): Promise<string> => {
  if (USE_MOCK_DATA) {
      console.log("Mock createSweepstake called with:", sweepstakeData);
      const newId = `mock-sweep-${Date.now()}`;
      const newSweepstake = { 
          ...sweepstakeData, 
          id: newId, 
          status: 'upcoming', 
          isDrawn: false, 
          participantCount: 0 
      } as Sweepstake;
      mockSweepstakeList.unshift(newSweepstake);
      return Promise.resolve(newId);
  }
  // Real implementation
  if (!db) throw new Error("Firestore not initialized");
  const sweepstakesCollection = collection(db, 'sweepstakes');
  try {
    const docRef = await addDoc(sweepstakesCollection, {
      ...sweepstakeData,
      status: 'upcoming',
      isDrawn: false,
      participantCount: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating sweepstake: ", error);
    throw error;
  }
};

export const getSweepstake = async (sweepstakeId: string): Promise<Sweepstake | null> => {
  if (USE_MOCK_DATA) {
      const sweepstake = mockSweepstakeList.find(s => s.id === sweepstakeId) || null;
      return Promise.resolve(sweepstake ? convertSweepstakeTimestamps(sweepstake) : null);
  }
  // Real implementation
  if (!db) throw new Error("Firestore not initialized");
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
  if (USE_MOCK_DATA) {
    let sweepstakes = [...mockSweepstakeList];
    if (filters?.status) {
        sweepstakes = sweepstakes.filter(s => s.status === filters.status);
    }
    return Promise.resolve(sweepstakes.map(convertSweepstakeTimestamps));
  }
  // Real implementation
  if (!db) throw new Error("Firestore not initialized");
  const sweepstakesCollection = collection(db, 'sweepstakes');
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
   if (USE_MOCK_DATA) {
      const sweepstakeIndex = mockSweepstakeList.findIndex(s => s.id === sweepstakeId);
      if (sweepstakeIndex !== -1) {
          mockSweepstakeList[sweepstakeIndex] = { ...mockSweepstakeList[sweepstakeIndex], ...data } as Sweepstake;
          console.log("Mock updateSweepstake called for:", sweepstakeId, " with:", data);
      }
      return Promise.resolve();
  }
  // Real implementation
  if (!db) throw new Error("Firestore not initialized");
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
   if (USE_MOCK_DATA) {
       console.log("Adding mock participant to sweepstake:", sweepstakeId, participantData);
       const sweepstakeIndex = mockSweepstakeList.findIndex(s => s.id === sweepstakeId);
       if(sweepstakeIndex !== -1) {
           mockSweepstakeList[sweepstakeIndex].participantCount = (mockSweepstakeList[sweepstakeIndex].participantCount || 0) + 1;
       }
       return Promise.resolve(`mock-participant-${Date.now()}`);
   }
  // Real implementation
  if (!db) throw new Error("Firestore not initialized");
  if (!sweepstakeId) throw new Error("Sweepstake ID is required.");
  const participantsSubCollectionRef = collection(db, 'sweepstakes', sweepstakeId, 'participants');
  try {
    const docRef = await addDoc(participantsSubCollectionRef, {
      ...participantData,
      entryDate: serverTimestamp()
    });
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
  if (USE_MOCK_DATA) {
      // Return a mock list of participants for a specific sweepstake if needed for testing
      return Promise.resolve([]);
  }
  // Real implementation
  if (!db) throw new Error("Firestore not initialized");
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
   if (USE_MOCK_DATA) {
       console.log("Adding mock winners to sweepstake:", sweepstakeId, winners);
       const sweepstakeIndex = mockSweepstakeList.findIndex(s => s.id === sweepstakeId);
       if (sweepstakeIndex !== -1) {
           mockSweepstakeList[sweepstakeIndex].status = 'drawing_complete';
           mockSweepstakeList[sweepstakeIndex].isDrawn = true;
           mockSweepstakeList[sweepstakeIndex].drawDate = Timestamp.now();
       }
       return Promise.resolve();
   }
  // Real implementation
  if (!db) throw new Error("Firestore not initialized");
  if (!sweepstakeId || !winners || winners.length === 0) throw new Error("Sweepstake ID and winners list are required.");
  const batch = writeBatch(db);
  const winnersSubCollectionRef = collection(db, 'sweepstakes', sweepstakeId, 'winners');
  winners.forEach(winner => {
    const winnerDocRef = doc(winnersSubCollectionRef, winner.userId);
    batch.set(winnerDocRef, winner);
  });
  const sweepstakeRef = doc(db, 'sweepstakes', sweepstakeId);
  batch.update(sweepstakeRef, {
    isDrawn: true,
    status: 'drawing_complete',
    drawDate: serverTimestamp()
  });
  try {
    await batch.commit();
  } catch (error) {
    console.error("Error adding winners to sweepstake: ", error);
    throw error;
  }
};

export const getSweepstakeWinners = async (sweepstakeId: string): Promise<SweepstakeWinner[]> => {
  if (USE_MOCK_DATA) {
      if (sweepstakeId === 'sweep-3') {
          return Promise.resolve([{ userId: 'user-mock-1', userName: 'Maria Clara (Exemplo)', avatarUrl: 'https://placehold.co/40x40.png?text=MC', avatarHint: 'person avatar'}]);
      }
      return Promise.resolve([]);
  }
  // Real implementation
  if (!db) throw new Error("Firestore not initialized");
  if (!sweepstakeId) return [];
  const winnersSubCollectionRef = collection(db, 'sweepstakes', sweepstakeId, 'winners');
  try {
    const querySnapshot = await getDocs(winnersSubCollectionRef);
    const winners: SweepstakeWinner[] = [];
    querySnapshot.forEach((docSnap) => {
      winners.push(docSnap.data() as SweepstakeWinner);
    });
    return winners;
  } catch (error) {
    console.error("Error fetching winners for sweepstake: ", error);
    throw error;
  }
};
