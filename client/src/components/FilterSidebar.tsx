import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Tag, FilterState } from '@/types';

interface FilterSidebarProps {
  tags: Tag[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function FilterSidebar({ tags, filters, onFilterChange, onClose, isMobile }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    color: true,
    fabric: true,
    occasion: true,
    style: true,
    price: true,
  });

  const colorTags = tags.filter(t => t.category === 'color');
  const fabricTags = tags.filter(t => t.category === 'fabric');
  const occasionTags = tags.filter(t => t.category === 'occasion');
  const styleTags = tags.filter(t => t.category === 'style');
  const dressTypeTags = tags.filter(t => t.category === 'dressType'); // Added dressTypeTags

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Modified toggleFilter to handle all categories including the new 'dressTypes'
  const toggleFilter = (category: keyof FilterState, value: string) => {
    if (category === 'priceRange') {
      // Price range is handled by the Slider component directly
      return;
    }
    const current = filters[category] as string[]; // Type assertion for array categories
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    
    onFilterChange({ ...filters, [category]: updated });
  };

  const clearAllFilters = () => {
    onFilterChange({
      colors: [],
      fabrics: [],
      occasions: [],
      styles: [],
      dressTypes: [], // Added dressTypes to clear
      priceRange: [0, 50000],
    });
  };

  const activeFilterCount = 
    filters.colors.length +
    filters.fabrics.length +
    filters.occasions.length +
    filters.styles.length +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 50000 ? 1 : 0);

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Filters</h2>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" data-testid="badge-filter-count">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              data-testid="button-clear-filters"
            >
              Clear All
            </Button>
          )}
          {isMobile && onClose && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              data-testid="button-close-filters"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Color Filter */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('color')}
              className="flex items-center justify-between w-full text-sm font-medium hover-elevate p-2 rounded-md"
              data-testid="button-toggle-color"
            >
              <span>Color ({colorTags.length})</span>
              {expandedSections.color ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {expandedSections.color && (
              <div className="grid grid-cols-4 gap-2">
                {colorTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => toggleFilter('colors', tag.name)}
                    className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                      filters.colors.includes(tag.name)
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover-elevate'
                    }`}
                    style={{ backgroundColor: tag.colorHex || '#ccc' }}
                    title={tag.name}
                    data-testid={`button-color-${tag.id}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Fabric Filter */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('fabric')}
              className="flex items-center justify-between w-full text-sm font-medium hover-elevate p-2 rounded-md"
              data-testid="button-toggle-fabric"
            >
              <span>Fabric ({fabricTags.length})</span>
              {expandedSections.fabric ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {expandedSections.fabric && (
              <div className="space-y-2">
                {fabricTags.map(tag => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`fabric-${tag.id}`}
                      checked={filters.fabrics.includes(tag.name)}
                      onCheckedChange={() => toggleFilter('fabrics', tag.name)}
                      data-testid={`checkbox-fabric-${tag.id}`}
                    />
                    <Label
                      htmlFor={`fabric-${tag.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {tag.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Occasion Filter */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('occasion')}
              className="flex items-center justify-between w-full text-sm font-medium hover-elevate p-2 rounded-md"
              data-testid="button-toggle-occasion"
            >
              <span>Occasion ({occasionTags.length})</span>
              {expandedSections.occasion ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {expandedSections.occasion && (
              <div className="space-y-2">
                {occasionTags.map(tag => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`occasion-${tag.id}`}
                      checked={filters.occasions.includes(tag.name)}
                      onCheckedChange={() => toggleFilter('occasions', tag.name)}
                      data-testid={`checkbox-occasion-${tag.id}`}
                    />
                    <Label
                      htmlFor={`occasion-${tag.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {tag.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Style Filter */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('style')}
              className="flex items-center justify-between w-full text-sm font-medium hover-elevate p-2 rounded-md"
              data-testid="button-toggle-style"
            >
              <span>Style ({styleTags.length})</span>
              {expandedSections.style ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {expandedSections.style && (
              <div className="space-y-2">
                {styleTags.map(tag => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`style-${tag.id}`}
                      checked={filters.styles.includes(tag.name)}
                      onCheckedChange={() => toggleFilter('styles', tag.name)}
                      data-testid={`checkbox-style-${tag.id}`}
                    />
                    <Label
                      htmlFor={`style-${tag.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {tag.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-sm font-medium hover-elevate p-2 rounded-md"
              data-testid="button-toggle-price"
            >
              <span>Price Range</span>
              {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {expandedSections.price && (
              <div className="space-y-4">
                <Slider
                  min={0}
                  max={50000}
                  step={1000}
                  value={filters.priceRange}
                  onValueChange={(value) => onFilterChange({ ...filters, priceRange: value as [number, number] })}
                  data-testid="slider-price-range"
                />
                <div className="flex items-center justify-between text-sm">
                  <span data-testid="text-price-min">₹{filters.priceRange[0].toLocaleString('en-IN')}</span>
                  <span data-testid="text-price-max">₹{filters.priceRange[1].toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
