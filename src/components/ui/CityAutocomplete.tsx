import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Lista das principais cidades brasileiras
export const brazilianCities = [
  // São Paulo
  'São Paulo', 'Campinas', 'Santos', 'Guarulhos', 'Santo André', 'São Bernardo do Campo',
  'Osasco', 'Sorocaba', 'Ribeirão Preto', 'São José dos Campos', 'Piracicaba', 'Bauru',
  'Jundiaí', 'Mogi das Cruzes', 'Diadema', 'Carapicuíba', 'Mauá', 'São José do Rio Preto',
  'Franca', 'Taubaté', 'Praia Grande', 'Limeira', 'Suzano', 'Taboão da Serra', 'Sumaré',
  'Barueri', 'Embu das Artes', 'São Vicente', 'Indaiatuba', 'Itaquaquecetuba', 'Americana',
  // Rio de Janeiro
  'Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói', 'Campos dos Goytacazes',
  'Belford Roxo', 'São João de Meriti', 'Petrópolis', 'Volta Redonda', 'Magé', 'Itaboraí',
  'Macaé', 'Mesquita', 'Nova Friburgo', 'Barra Mansa', 'Cabo Frio', 'Angra dos Reis', 'Teresópolis',
  // Minas Gerais
  'Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros',
  'Ribeirão das Neves', 'Uberaba', 'Governador Valadares', 'Ipatinga', 'Santa Luzia',
  'Sete Lagoas', 'Divinópolis', 'Poços de Caldas', 'Barbacena', 'Ouro Preto',
  // Bahia
  'Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Itabuna',
  'Lauro de Freitas', 'Ilhéus', 'Jequié', 'Teixeira de Freitas', 'Barreiras',
  // Paraná
  'Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'São José dos Pinhais',
  'Foz do Iguaçu', 'Colombo', 'Guarapuava', 'Paranaguá', 'Araucária', 'Toledo',
  // Rio Grande do Sul
  'Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria', 'Gravataí',
  'Viamão', 'Novo Hamburgo', 'São Leopoldo', 'Rio Grande', 'Alvorada', 'Passo Fundo',
  // Pernambuco
  'Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina', 'Paulista',
  'Cabo de Santo Agostinho', 'Camaragibe', 'Garanhuns', 'Vitória de Santo Antão',
  // Ceará
  'Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral', 'Crato',
  'Itapipoca', 'Maranguape', 'Iguatu', 'Quixadá',
  // Distrito Federal
  'Brasília',
  // Goiás
  'Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia', 'Águas Lindas de Goiás',
  // Pará
  'Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Parauapebas', 'Castanhal', 'Abaetetuba',
  // Maranhão
  'São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias', 'Codó',
  // Santa Catarina
  'Joinville', 'Florianópolis', 'Blumenau', 'São José', 'Criciúma', 'Chapecó',
  'Itajaí', 'Jaraguá do Sul', 'Lages', 'Palhoça', 'Balneário Camboriú',
  // Amazonas
  'Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari',
  // Paraíba
  'João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux',
  // Rio Grande do Norte
  'Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Macaíba',
  // Espírito Santo
  'Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Cachoeiro de Itapemirim', 'Linhares',
  // Mato Grosso
  'Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra',
  // Mato Grosso do Sul
  'Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã',
  // Piauí
  'Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano',
  // Alagoas
  'Maceió', 'Arapiraca', 'Rio Largo', 'Palmeira dos Índios', 'Penedo',
  // Sergipe
  'Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'São Cristóvão',
  // Rondônia
  'Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Cacoal',
  // Tocantins
  'Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins',
  // Acre
  'Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá',
  // Amapá
  'Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque',
  // Roraima
  'Boa Vista', 'Rorainópolis', 'Caracaraí',
].sort();

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CityAutocomplete({ 
  value, 
  onChange, 
  placeholder = "Digite a cidade",
  className 
}: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = brazilianCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: string) => {
    onChange(city);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true);
        }}
      />
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((city) => (
            <button
              key={city}
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted focus:bg-muted focus:outline-none transition-colors"
              onClick={() => handleSelect(city)}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
