'use client';

import React from 'react';
import type { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Utensils, Wrench, ShoppingCart, Smile, HeartPulse, BookOpen, Package, type LucideProps, ListFilter } from 'lucide-react';

interface CategoryPillsProps {
  categories: Category[];
  onSelectCategory: (categoryName: string) => void;
  selectedCategory?: string;
}

const iconMap: { [key: string]: React.ElementType<LucideProps> } = {
  Utensils,
  Wrench,
  ShoppingCart,
  Smile,
  HeartPulse,
  BookOpen,
  Package,
  ListFilter, // Default/Fallback icon for "Todas"
};

const CategoryPills: React.FC<CategoryPillsProps> = ({ categories, onSelectCategory, selectedCategory }) => {
  const allCategoriesOption = { name: 'Todas', icon: 'ListFilter' };
  const displayCategories = [allCategoriesOption, ...categories];

  return (
    <ScrollArea className="w-full whitespace-nowrap -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex space-x-2 pb-2.5 justify-center">
        {displayCategories.map((category) => {
          const IconComponent = iconMap[category.icon] || ListFilter;
          const isActive = category.name === 'Todas' 
            ? !selectedCategory || selectedCategory === '' 
            : selectedCategory === category.name;
            
          return (
            <Button
              key={category.name}
              variant={isActive ? 'secondary' : 'outline'}
              size="sm"
              className={`h-9 px-4 rounded-full text-xs sm:text-sm shadow-sm transition-all ${isActive ? 'text-secondary-foreground' : 'bg-card hover:bg-muted'}`}
              onClick={() => onSelectCategory(category.name === 'Todas' ? '' : category.name)}
            >
              <IconComponent className={`mr-1.5 h-4 w-4`} />
              {category.name}
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CategoryPills;
