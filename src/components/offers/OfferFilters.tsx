import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, Filter, ListFilter, MapPin } from 'lucide-react';
import { categories } from '@/types'; // Assuming categories are defined in types

const OfferFilters = () => {
  // Placeholder state and handlers
  const distanceOptions = ['<1km', '<5km', '<10km', 'Qualquer'];

  return (
    <div className="mb-6 flex flex-wrap gap-2 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <ListFilter size={18} /> Categoria
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <ul className="space-y-1 p-2">
            {categories.map((cat) => (
              <li key={cat.name}>
                <Button variant="ghost" className="w-full justify-start font-normal h-9">
                  {/* <Check size={16} className="mr-2 opacity-0" /> Placeholder for active state */}
                  {cat.name}
                </Button>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <MapPin size={18} /> Distância
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0">
           <ul className="space-y-1 p-2">
            {distanceOptions.map((dist) => (
              <li key={dist}>
                <Button variant="ghost" className="w-full justify-start font-normal h-9">
                  {/* <Check size={16} className="mr-2 opacity-0" /> Placeholder for active state */}
                  {dist}
                </Button>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
      
      <Button variant="ghost" className="flex items-center gap-2 text-primary hover:text-primary">
        <Filter size={18} /> Mais Filtros
      </Button>
    </div>
  );
};

export default OfferFilters;
