// src/pages/account.tsx
import { useAppContext } from '../context/AppContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';

export default function Account() {
  const { user } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-purple-600 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <ProfileCard 
          username={user.username} 
          score={user.score} 
          trainingRoute={user.trainingRoute} 
        />
      </main>
      <footer className="py-4 text-center">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} Cognitive Training App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
