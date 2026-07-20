import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, MapPin, ChevronDown, Plus, Loader2, Store, ShoppingBag } from 'lucide-react';
import { CommodityCard } from '../components/CommodityCard';
import { getJSON } from '../api';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const CommodityMarketplace = () => {
  const { t } = useLanguage();

  const [filters, setFilters] = useState({
    type: 'sell',
    product: '',
    variety: '',
    location: '',
    buyingFrequency: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 12
  });

  const [expandedCategories, setExpandedCategories] = useState([]);
  const [sortByLocal, setSortByLocal] = useState('latest');
  const [favorites, setFavorites] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState(filters.product || '');
  const searchDebounceRef = useRef(null);

  const updateSortFilters = useCallback((sortValue) => {
    switch (sortValue) {
      case 'price-low':
        setFilters(prev => ({ ...prev, sortBy: 'price', sortOrder: 'asc' }));
        setSortByLocal('price-low');
        break;
      case 'price-high':
        setFilters(prev => ({ ...prev, sortBy: 'price', sortOrder: 'desc' }));
        setSortByLocal('price-high');
        break;
      default:
        setFilters(prev => ({ ...prev, sortBy: 'date', sortOrder: 'desc' }));
        setSortByLocal('latest');
    }
  }, []);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = {
        ...filters,
        page,
        limit: filters.limit,
        ...(filters.minPrice && { minPrice: Number(filters.minPrice) }),
        ...(filters.maxPrice && { maxPrice: Number(filters.maxPrice) })
      };

      const response = await getJSON('/requirements', queryParams);
      if (response?.success) {
        setItems(response.data || []);
        setTotalPages(response.totalPages || 0);
        setCurrentPage(response.page || page);
      } else {
        setItems([]);
        setTotalPages(0);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Failed to fetch requirements:', error);
      setItems([]);
      setTotalPages(0);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  }, []);

  const handleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, product: searchInput, page: 1 }));
    }, 350);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchInput]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const goToPage = (page) => {
    fetchData(page);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          badge="Agri Marketplace"
          badgeIcon={Store}
          title="Commodity B2B Trade Marketplace"
          subtitle="Direct farmer-to-buyer agricultural marketplace for grains, spices, fruits, and plantation crops."
          actions={
            <Link to="create-requirement">
              <Button>
                <ShoppingBag className="h-4 w-4" />
                <span>Post Requirement / Listing</span>
              </Button>
            </Link>
          }
        />

        {/* Search & Filter Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  type="text"
                  placeholder="Search commodities e.g. Paddy, Pepper, Cardamom..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  icon={Search}
                />
              </div>

              <select
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-slate-900 text-xs outline-none cursor-pointer"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="sell">Sell Listings (Sellers)</option>
                <option value="buy">Purchase Requirements (Buyers)</option>
              </select>

              <select
                value={sortByLocal}
                onChange={(e) => updateSortFilters(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-slate-900 text-xs outline-none cursor-pointer"
              >
                <option value="latest">{t('sort.latest')}</option>
                <option value="price-low">{t('sort.priceLow')}</option>
                <option value="price-high">{t('sort.priceHigh')}</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="text-xs font-semibold">Loading marketplace listings...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Store className="h-12 w-12 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No commodity listings found</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {items.map((commodity) => (
                <CommodityCard
                  key={commodity._id || commodity.id}
                  commodity={commodity}
                  onFavorite={handleFavorite}
                  isFavorite={favorites.includes(commodity._id || commodity.id)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  {t('pagination.prev')}
                </Button>
                <span className="text-xs font-bold text-slate-700">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || loading}
                >
                  {t('pagination.next')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommodityMarketplace;
