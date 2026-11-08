import { useCallback, useEffect, useState } from 'react';
import { INITIAL_FLIGHTS } from '../constants/flights';

const STORAGE_KEY = 'skyfood_airport_flights_v2';

function readFlights() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_FLIGHTS;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed : INITIAL_FLIGHTS;
  } catch {
    return INITIAL_FLIGHTS;
  }
}

function saveFlights(flights) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flights));
}

export function useFlights() {
  const [flights, setFlights] = useState(() => readFlights());
  const [pendingId, setPendingId] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) saveFlights(INITIAL_FLIGHTS);
  }, []);

  const updateFlight = useCallback(async (id, action, value) => {
    setPendingId(id);
    await new Promise((resolve) => window.setTimeout(resolve, 180));

    const current = flights.find((flight) => String(flight.id) === String(id));
    if (!current) {
      setPendingId(null);
      return { ok: false, message: 'Рейс не найден' };
    }

    let patch = {};
    if (action === 'ADD_DELAY') {
      const nextDelay = Math.max(0, (current.delayMinutes || 0) + value);
      const now = new Intl.DateTimeFormat('ru-RU', {
        timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit', hour12: false,
      }).format(new Date());
      patch = {
        delayMinutes: nextDelay,
        status: 'DELAYED',
        updatedAt: new Date().toISOString(),
        lastAction: `Задержка увеличена на ${value} мин.`,
        events: [...(current.events || []), {
          time: now,
          title: 'Время задержки обновлено',
          detail: `Текущая задержка — ${nextDelay} минут`,
          tone: 'green',
        }],
      };
    } else if (action === 'BOARDING') {
      patch = { status: 'BOARDING', updatedAt: new Date().toISOString(), lastAction: 'Начата посадка' };
    } else if (action === 'CANCEL') {
      patch = { status: 'CANCELLED', updatedAt: new Date().toISOString(), lastAction: 'Рейс отменён' };
    } else if (action === 'DEPART') {
      patch = {
        status: 'DEPARTED', actualDeparture: new Date().toISOString(),
        updatedAt: new Date().toISOString(), lastAction: 'Рейс вылетел',
      };
    }

    const updated = { ...current, ...patch };
    const next = flights.map((flight) => String(flight.id) === String(id) ? updated : flight);
    saveFlights(next);
    setFlights(next);
    setPendingId(null);
    return { ok: true, flight: updated };
  }, [flights]);

  return { flights, pendingId, updateFlight };
}
