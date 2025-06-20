
'use client';

import React, { useState, useEffect } from 'react';
import PointsDisplay from '@/components/rewards/PointsDisplay';
import Leaderboard from '@/components/rewards/Leaderboard';
import SweepstakesList from '@/components/rewards/SweepstakesList';
import { POINTS_SIGNUP_WELCOME, POINTS_PROFILE_COMPLETE, POINTS_CHECKIN, POINTS_RATE_OFFER_OR_MERCHANT, POINTS_SHARE_OFFER, POINTS_FOLLOW_MERCHANT } from '@/types';
import type { User, Sweepstake } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, Gift, Ticket, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/firebase/firebaseConfig';
import { getUserProfile } from '@/lib/firebase/services/userService';
import { getAllSweepstakes } from '@/lib/firebase/services/sweepstakeService';

export default function RewardsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sweepstakes, setSweepstakes] = useState<Sweepstake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userAuth = auth.currentUser;
        if (userAuth) {
          const userProfile = await getUserProfile(userAuth.uid);
          setCurrentUser(userProfile);
        }
        const allSweepstakes = await getAllSweepstakes();
        const activeAndUpcoming = allSweepstakes.filter(s => s.status === 'active' || s.status === 'upcoming');
        setSweepstakes(activeAndUpcoming);
      } catch (error) {
        console.error("Error fetching rewards page data:", error);
      }
      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchData();
      } else {
        setCurrentUser(null); // Clear user if not logged in
        fetchData(); // Still fetch sweepstakes
      }
    });
    return () => unsubscribe();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {currentUser && <PointsDisplay points={currentUser.points} />}
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Gift size={24} className="text-primary"/> Como Ganhar Pontos?
            </CardTitle>
          <CardDescription>Realize ações no app e acumule pontos para trocar por benefícios e participar de sorteios!</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Cadastro inicial: <span className="font-semibold text-primary">+{POINTS_SIGNUP_WELCOME} pontos</span></li>
            <li>Completar perfil: <span className="font-semibold text-primary">+{POINTS_PROFILE_COMPLETE} pontos</span></li>
            <li>Check-in em ofertas: <span className="font-semibold text-primary">+{POINTS_CHECKIN} pontos</span></li>
            <li>Avaliar ofertas e comerciantes: <span className="font-semibold text-primary">+{POINTS_RATE_OFFER_OR_MERCHANT} ponto(s)</span></li>
            <li>Compartilhar ofertas: <span className="font-semibold text-primary">+{POINTS_SHARE_OFFER} pontos</span></li>
            <li>Seguir um negócio: <span className="font-semibold text-primary">+{POINTS_FOLLOW_MERCHANT} pontos</span></li>
          </ul>
        </CardContent>
      </Card>

      {currentUser && <Leaderboard currentUser={currentUser} />} {/* Pass current user to Leaderboard */}
      
      <SweepstakesList sweepstakes={sweepstakes.slice(0, 2)} /> 

      <div className="text-center mt-8">
        <Link href="/sweepstakes" passHref>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Ticket className="mr-2 h-4 w-4" /> Ver todos os Sorteios
          </Button>
        </Link>
      </div>
    </div>
  );
}
