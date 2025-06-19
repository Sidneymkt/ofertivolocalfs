
'use client';

import type React from 'react';
import { useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit3, Star as StarIcon, Users as UsersIcon, Award as AwardIcon, MessageSquare as MessageSquareIcon, Zap as ZapIcon, Camera, type LucideProps } from 'lucide-react';
import type { User, Badge as BadgeType } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface UserInfoProps {
  user: User;
}

const badgeIconMap: { [key: string]: React.ElementType<LucideProps> } = {
  Star: StarIcon,
  Users: UsersIcon,
  Award: AwardIcon,
  MessageSquare: MessageSquareIcon,
  Zap: ZapIcon,
};

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const { toast } = useToast();
  const xpProgress = user.currentXp && user.xpToNextLevel ? (user.currentXp / user.xpToNextLevel) * 100 : 0;
  
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(user.avatarUrl || null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(user.coverPhotoUrl || null);

  const handleEditAvatarClick = () => {
    avatarFileInputRef.current?.click();
  };

  const handleEditCoverPhotoClick = () => {
    coverFileInputRef.current?.click();
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>, 
    setImagePreviewUrl: React.Dispatch<React.SetStateAction<string | null>>,
    imageType: 'avatar' | 'cover'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
        toast({
          title: `Foto de ${imageType === 'avatar' ? 'perfil' : 'capa'} selecionada`,
          description: `Nova imagem "${file.name}" pronta para upload.`,
        });
      };
      reader.readAsDataURL(file);
      // In a real app, you would then upload the 'file' object.
      console.log(`Selected ${imageType} file:`, file.name);
    }
  };

  return (
    <Card className="shadow-xl overflow-hidden">
      <div className="relative">
        {/* Cover Photo Section */}
        <div className="w-full h-48 md:h-64 bg-muted/50 relative group">
          <Image 
            src={coverPreviewUrl || "https://placehold.co/1200x400.png?text=Capa"} 
            alt="Foto de Capa" 
            layout="fill" 
            objectFit="cover"
            className="transition-opacity duration-300 group-hover:opacity-80"
            data-ai-hint={user.coverPhotoHint || "profile cover background"}
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-3 right-3 rounded-full w-9 h-9 bg-card/80 backdrop-blur-sm border-primary text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleEditCoverPhotoClick}
            aria-label="Editar foto de capa"
          >
            <Camera size={16} />
          </Button>
          <input
            type="file"
            ref={coverFileInputRef}
            onChange={(e) => handleImageChange(e, setCoverPreviewUrl, 'cover')}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Avatar and Edit Button */}
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 transform">
          <div className="relative">
            <Avatar className="w-28 h-28 border-4 border-background shadow-lg ring-2 ring-offset-background ring-offset-2 ring-primary bg-card">
              <AvatarImage src={avatarPreviewUrl || user.avatarUrl} alt={user.name} data-ai-hint={user.avatarHint || "profile person"} />
              <AvatarFallback className="text-4xl bg-muted text-muted-foreground">
                {user.name?.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 bg-card border-primary text-primary hover:bg-primary/10"
              onClick={handleEditAvatarClick}
              aria-label="Editar foto do perfil"
            >
              <Edit3 size={14} />
            </Button>
            <input
              type="file"
              ref={avatarFileInputRef}
              onChange={(e) => handleImageChange(e, setAvatarPreviewUrl, 'avatar')}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </div>

      <CardContent className="pt-20 pb-6 flex flex-col items-center text-center">
        <h2 className="text-2xl font-headline font-bold text-foreground mb-1">{user.name}</h2>
        
        <div className="text-sm text-primary font-semibold mb-1">
          Nível {user.level || 1}
        </div>
        
        {user.currentXp !== undefined && user.xpToNextLevel !== undefined && user.xpToNextLevel !== Infinity && (
          <div className="w-full max-w-xs mb-3 px-4">
            <Progress value={xpProgress} className="h-2 bg-primary/20" />
            <p className="text-xs text-muted-foreground mt-1">
              {user.currentXp} / {user.xpToNextLevel} XP para o próximo nível
            </p>
          </div>
        )}

        <p className="text-xl font-semibold text-accent mb-4">
          {user.points.toLocaleString('pt-BR')} Pontos
        </p>

        {user.badges && user.badges.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Emblemas Conquistados:</h4>
            <div className="flex justify-center gap-3 flex-wrap">
              <TooltipProvider>
                {user.badges.map((badge: BadgeType) => {
                  const IconComponent = badgeIconMap[badge.icon];
                  return (
                    <Tooltip key={badge.id}>
                      <TooltipTrigger asChild>
                        <div className="p-2 bg-card border border-primary/20 rounded-full shadow-sm hover:scale-110 transition-transform">
                          {IconComponent ? <IconComponent className="w-6 h-6 text-primary" data-ai-hint={badge['data-ai-hint']}/> : null}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover text-popover-foreground">
                        <p className="font-semibold">{badge.name}</p>
                        <p className="text-xs">{badge.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </div>
          </div>
        )}
        
      </CardContent>
    </Card>
  );
};

export default UserInfo;

    