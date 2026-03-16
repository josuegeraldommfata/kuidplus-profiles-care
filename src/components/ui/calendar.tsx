import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Clock, Check, X } from 'lucide-react';

interface ScheduleSlot {
  id?: number;
  date: string;
  time: string;
  isAvailable: boolean;
}

interface DayAvailability {
  date: string;
  dayName: string;
  totalSlots: number;
  availableSlots: number;
  hasAvailability: boolean;
}

interface CalendarProps {
  professionalId: number;
  onSlotClick?: (date: string, time: string) => void;
  readOnly?: boolean;
}

export default function Calendar({ professionalId, onSlotClick, readOnly = false }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState<DayAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [daySlots, setDaySlots] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00'
  ];

  useEffect(() => {
    loadWeekAvailability();
  }, [currentDate, professionalId]);

  const loadWeekAvailability = async () => {
    try {
      setLoading(true);
      const startDate = getMonday(currentDate).toISOString().split('T')[0];
      const response = await api.get(`/api/schedules/${professionalId}/week`, {
        params: { startDate }
      });
      setWeekDays(response.data);
    } catch (error) {
      console.error('Erro ao carregar disponibilidade:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDaySlots = async (date: string) => {
    try {
      const response = await api.get(`/api/schedules/${professionalId}/availability`, {
        params: { date }
      });

      if (response.data.slots && response.data.slots.length > 0) {
        setDaySlots(response.data.slots.map((s: any) => ({
          date,
          time: s.time_slot,
          isAvailable: s.is_available
        })));
      } else {
        // Se não houver slots, criar slots vazios
        setDaySlots(timeSlots.map(time => ({
          date,
          time,
          isAvailable: true
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      setDaySlots(timeSlots.map(time => ({
        date,
        time,
        isAvailable: true
      })));
    }
  };

  const getMonday = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    loadDaySlots(date);
  };

  const toggleSlotAvailability = async (slot: ScheduleSlot) => {
    if (readOnly) return;

    try {
      await api.post('/api/schedules', {
        professionalId,
        date: slot.date,
        timeSlot: slot.time,
        isAvailable: !slot.isAvailable
      });

      setDaySlots(prev => prev.map(s =>
        s.time === slot.time ? { ...s, isAvailable: !s.isAvailable } : s
      ));
    } catch (error) {
      console.error('Erro ao atualizar slot:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.getDate();
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  return (
    <div className="space-y-4">
      {/* Navegação da semana */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => navigateWeek(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          {getMonday(currentDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </div>
        <Button variant="outline" size="icon" onClick={() => navigateWeek(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <button
            key={day.date}
            onClick={() => handleDateClick(day.date)}
            disabled={readOnly}
            className={`
              p-2 rounded-lg text-center transition-all
              ${selectedDate === day.date ? 'bg-primary text-white' : 'hover:bg-muted'}
              ${!day.hasAvailability && !selectedDate ? 'opacity-50' : ''}
              ${isToday(day.date) ? 'ring-2 ring-primary' : ''}
            `}
          >
            <div className="text-xs text-muted-foreground mb-1">
              {day.dayName.substring(0, 3)}
            </div>
            <div className="text-lg font-bold">{formatDate(day.date)}</div>
            <div className="text-xs mt-1">
              {day.availableSlots > 0 ? (
                <span className="text-green-500">{day.availableSlots} vagas</span>
              ) : (
                <span className="text-red-500">Lotado</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Horários do dia selecionado */}
      {selectedDate && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horários em {new Date(selectedDate).toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {daySlots.length > 0 ? daySlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => {
                    if (!readOnly) toggleSlotAvailability(slot);
                    onSlotClick?.(slot.date, slot.time);
                  }}
                  disabled={readOnly}
                  className={`
                    p-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1
                    ${slot.isAvailable
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'}
                    ${readOnly ? 'cursor-not-allowed' : ''}
                  `}
                >
                  {slot.isAvailable ? (
                    <><Check className="h-3 w-3" /> {slot.time}</>
                  ) : (
                    <><X className="h-3 w-3" /> {slot.time}</>
                  )}
                </button>
              )) : (
                timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      if (!readOnly) {
                        api.post('/api/schedules', {
                          professionalId,
                          date: selectedDate,
                          timeSlot: time,
                          isAvailable: true
                        }).then(() => loadDaySlots(selectedDate));
                      }
                      onSlotClick?.(selectedDate, time);
                    }}
                    disabled={readOnly}
                    className="p-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200"
                  >
                    {time}
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
