import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StarRating } from '@/components/ui/StarRating';
import { mockProfessionals, brazilianStates, priceRanges } from '@/data/mockData';
import {
  Search,
  Filter,
  CheckCircle,
  MapPin,
  X,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Buscar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    profession: '',
    sex: '',
    priceRange: '',
    minRating: '',
  });
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');

  const filteredProfessionals = useMemo(() => {
    let result = mockProfessionals.filter((p) => p.status === 'approved');

    // Search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.city.toLowerCase().includes(term) ||
          p.profession.toLowerCase().includes(term)
      );
    }

    // Filters
    if (filters.state) {
      result = result.filter((p) => p.state === filters.state);
    }
    if (filters.city) {
      result = result.filter((p) =>
        p.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    if (filters.profession) {
      result = result.filter((p) => p.profession === filters.profession);
    }
    if (filters.sex) {
      result = result.filter((p) => p.sex === filters.sex);
    }
    if (filters.priceRange) {
      const range = priceRanges.find((r) => r.label === filters.priceRange);
      if (range) {
        result = result.filter(
          (p) => p.priceRange.min >= range.min && p.priceRange.max <= range.max
        );
      }
    }
    if (filters.minRating) {
      const minRating = parseFloat(filters.minRating);
      result = result.filter((p) => p.rating >= minRating);
    }

    // Sort
    if (sortBy === 'recent') {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchTerm, filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      state: '',
      city: '',
      profession: '',
      sex: '',
      priceRange: '',
      minRating: '',
    });
    setSearchTerm('');
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Estado</label>
        <Select
          value={filters.state}
          onValueChange={(value) => setFilters((f) => ({ ...f, state: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os estados</SelectItem>
            {brazilianStates.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Cidade</label>
        <Input
          placeholder="Digite a cidade"
          value={filters.city}
          onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Profissão</label>
        <Select
          value={filters.profession}
          onValueChange={(value) =>
            setFilters((f) => ({ ...f, profession: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as profissões" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as profissões</SelectItem>
            <SelectItem value="Enfermeiro(a)">Enfermeiro(a)</SelectItem>
            <SelectItem value="Técnico(a) de Enfermagem">
              Técnico(a) de Enfermagem
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Sexo</label>
        <Select
          value={filters.sex}
          onValueChange={(value) => setFilters((f) => ({ ...f, sex: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="Masculino">Masculino</SelectItem>
            <SelectItem value="Feminino">Feminino</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Faixa de valor (12h)</label>
        <Select
          value={filters.priceRange}
          onValueChange={(value) =>
            setFilters((f) => ({ ...f, priceRange: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as faixas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as faixas</SelectItem>
            {priceRanges.map((range) => (
              <SelectItem key={range.label} value={range.label}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Avaliação mínima</label>
        <Select
          value={filters.minRating}
          onValueChange={(value) =>
            setFilters((f) => ({ ...f, minRating: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Qualquer avaliação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Qualquer avaliação</SelectItem>
            <SelectItem value="4.5">4.5+ estrelas</SelectItem>
            <SelectItem value="4.0">4.0+ estrelas</SelectItem>
            <SelectItem value="3.5">3.5+ estrelas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Limpar filtros ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        {/* Search Header */}
        <div className="bg-background border-b border-border sticky top-16 z-40">
          <div className="container py-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, cidade ou profissão..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Sort & Filter */}
              <div className="flex gap-2">
                <Select
                  value={sortBy}
                  onValueChange={(value: 'recent' | 'rating') => setSortBy(value)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais recentes</SelectItem>
                    <SelectItem value="rating">Melhor avaliação</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="md:hidden relative">
                      <Filter className="h-4 w-4" />
                      {activeFiltersCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-6">
          <div className="flex gap-6">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden md:block w-64 shrink-0">
              <Card className="sticky top-36">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </h3>
                  <FilterContent />
                </CardContent>
              </Card>
            </aside>

            {/* Results */}
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-4">
                {filteredProfessionals.length} profissional
                {filteredProfessionals.length !== 1 ? 'is' : ''} encontrado
                {filteredProfessionals.length !== 1 ? 's' : ''}
              </p>

              {filteredProfessionals.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    Nenhum profissional encontrado com os filtros selecionados.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={clearFilters}
                  >
                    Limpar filtros
                  </Button>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProfessionals.map((professional, index) => (
                    <Card
                      key={professional.id}
                      className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() =>
                        navigate(`/profissional/${professional.id}`)
                      }
                    >
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img
                          src={professional.profileImage}
                          alt={professional.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          {professional.backgroundCheck && (
                            <div className="bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Verificado
                            </div>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-semibold">
                              {professional.name}
                            </h3>
                            <p className="text-sm text-primary">
                              {professional.profession}
                            </p>
                          </div>
                          <StarRating
                            rating={professional.rating}
                            totalRatings={professional.totalRatings}
                            size="sm"
                            showCount={false}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {professional.city}, {professional.state}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            R$ {professional.priceRange.min}–
                            {professional.priceRange.max}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {professional.experienceYears} anos exp.
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
