import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit3 } from 'lucide-react';
import type { User } from '@/types';

interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <div className="flex flex-col items-center py-8 bg-card rounded-lg shadow-md">
      <Avatar className="w-24 h-24 mb-4 border-4 border-primary ring-2 ring-primary-foreground">
        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile person" />
        <AvatarFallback className="text-3xl">{user.name?.substring(0, 1).toUpperCase()}</AvatarFallback>
      </Avatar>
      <h2 className="text-2xl font-headline font-semibold text-foreground">{user.name}</h2>
      <p className="text-muted-foreground mb-4">Pontos: {user.points.toLocaleString('pt-BR')}</p>
      <Button variant="outline">
        <Edit3 className="w-4 h-4 mr-2" /> Editar Perfil
      </Button>
    </div>
  );
};

export default UserInfo;
