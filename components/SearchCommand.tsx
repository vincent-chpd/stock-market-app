'use client';

import { useState, useEffect } from 'react';
import { Command, CommandDialog, CommandEmpty, CommandInput, CommandList } from '@/components/ui/command';
import { Button } from './ui/button';
import { Loader2, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { searchStocks } from '@/lib/actions/finnhub.actions';
import { useDebounce } from '@/hooks/useDebounce';

const SearchCommand = ({ renderAs = 'button', label = 'Add stock', initialStocks }: SearchCommandProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  const handleSearch = async () => {
    if (!isSearchMode) return setStocks(initialStocks);

    setLoading(true);
    try {
      const result = await searchStocks(searchTerm.trim());
      setStocks(result);
    } catch {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useDebounce(handleSearch, 500);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm('');
    setStocks(initialStocks);
  };

  return (
    <>
      {renderAs === 'text' ? (
        <span onClick={() => setOpen(true)} className="search-text">
          {label}
        </span>
      ) : (
        <Button onClick={() => setOpen(true)} className="search-btn">
          {label}
        </Button>
      )}
      <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
        <Command>
          <div className="search-field">
            <CommandInput placeholder="Search stocks..." value={searchTerm} onValueChange={setSearchTerm} />
            {loading && <Loader2 className="search-loader" />}
          </div>
          <CommandList className="search-list">
            {loading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : displayStocks?.length === 0 ? (
              <div className="search-list-indicator">{isSearchMode ? 'No results found' : 'No stocks available'}</div>
            ) : (
              <ul>
                <div className="search-count">
                  {isSearchMode ? 'Search results' : 'Popular stocks'}({displayStocks?.length || 0})
                </div>
                {displayStocks?.map((stock, i) => (
                  <li key={stock.symbol} className="search-item">
                    <Link href={`/stocks/${stock.symbol}`} onClick={handleSelectStock} className="search-item-link">
                      <TrendingUp className="text-500 h-4 w-4" />
                      <div className="flex-1">
                        <div className="search-item-name">{stock.name}</div>
                        <div className="text-sm text-gray-500">
                          {stock.symbol} | {stock.exchange} | {stock.type}
                        </div>
                      </div>
                      <Star className="text-500 h-4 w-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};

export default SearchCommand;
