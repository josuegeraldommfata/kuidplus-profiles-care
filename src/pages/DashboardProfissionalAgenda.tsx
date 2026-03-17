import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import CalendarPicker from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AvailabilitySlot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  service_title?: string;
}

export default function DashboardProfissionalAgenda() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [availabilities, setAvailabilities] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<AvailabilitySlot[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchAvailabilities();
    }
  }, [user?.id]);

  useEffect(() => {
    filterSlotsByDate();
  }, [selectedDate, availabilities]);

  const fetchAvailabilities = async () => {
    try {
      const response = await api.get(`/api/professionals/${user.id}/availabilities`);
      setAvailabilities(response.data);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar agenda',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSlotsByDate = () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    setSelectedSlots(availabilities.filter(slot => slot.date === dateStr));
  };

  const handleAddAvailability = async () => {
    // Modal para adicionar novo horário
    const startTime = prompt('Hora início (HH:MM):');
    const endTime = prompt('Hora fim (HH:MM):');

    if (!startTime || !endTime) return;

    try {
      const response = await api.post('/api/availabilities', {
        professional_id: user.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: startTime,
        end_time: endTime,
      });

      toast({
        title: 'Sucesso',
        description: 'Horário adicionado à agenda',
      });
      fetchAvailabilities();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar horário',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'booked':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Minha Agenda</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleAddAvailability}>
              + Novo Horário
            </Button>
            <Button>Configurar Recorrência</Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendário */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Calendário Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarPicker
                professionalId={user?.id}
                readOnly
              />
            </CardContent>
          </Card>

          {/* Horários do dia */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold">
                {format(selectedDate, 'dd/MM/yyyy (EEEE)', { locale: ptBR })}
              </h2>
              <Badge variant={selectedSlots.length > 0 ? "default" : "secondary"}>
                {selectedSlots.length} horários
              </Badge>
            </div>

            {selectedSlots.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Nenhum horário cadastrado para este dia
                  </p>
                  <Button onClick={handleAddAvailability} variant="outline">
                    Adicionar horário
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedSlots.map((slot) => (
                      <div key={slot.id} className="p-4 border rounded-lg">
                        <div className="font-semibold mb-2">
                          {slot.start_time} - {slot.end_time}
                        </div>
                        <Badge className={getStatusColor(slot.status)}>
                          {slot.status === 'available' ? '🟢 Disponível' :
                           slot.status === 'booked' ? '🔶 Reservado' : '❌ Cancelado'}
                        </Badge>
                        {slot.service_title && (
                          <p className="text-sm mt-2 text-muted-foreground">
                            {slot.service_title}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

