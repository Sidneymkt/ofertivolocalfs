
'use client';

import React from 'react';
import type { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Utensils, Wrench, ShoppingCart, Smile, HeartPulse, BookOpen, Package, type LucideProps, ListFilter } from 'lucide-react'; // Added ListFilter

interface CategoryPillsProps {
  categories: Category[];
  onSelectCategory?: (categoryName: string) => void; // Optional: for handling category selection
  selectedCategory?: string;
}

// Map icon names to Lucide components
const iconMap: { [key: string]: React.ElementType<LucideProps> } = {
  Utensils,
  Wrench,
  ShoppingCart,
  Smile,
  HeartPulse,
  BookOpen,
  Package,
  ListFilter, // Default/Fallback icon
};

const CategoryPills: React.FC<CategoryPillsProps> = ({ categories, onSelectCategory, selectedCategory }) => {
  const allCategoriesOption = { name: 'Todas', icon: 'ListFilter' };
  const displayCategories = [allCategoriesOption, ...categories];

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md px-4 md:px-0">
      <div className="flex space-x-2 pb-2.5">
        {displayCategories.map((category) => {
          const IconComponent = iconMap[category.icon] || ListFilter;
          const isActive = selectedCategory === category.name || (!selectedCategory && category.name === 'Todas');
          return (
            <Button
              key={category.name}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              className={`h-9 px-3.5 text-xs sm:text-sm ${isActive ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted/80'}`}
              onClick={() => onSelectCategory?.(category.name === 'Todas' ? '' : category.name)}
            >
              <IconComponent className={`mr-1.5 h-4 w-4 ${isActive ? '' : 'text-muted-foreground'}`} />
              {category.name}
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
};

export default CategoryPills;
