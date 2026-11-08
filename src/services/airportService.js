import { STATUS, COMMANDS } from '../constants/flights';

const STORAGE_KEY = 'skyfood_airport_flights';
const MOCK_RESPONSE_DELAY = 550;
const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
const USE_MOCK = !API_BASE;

const MOCK_FLIGHTS = [
  {
    id: 1,
    flightNumber: 'SU1234',
    airline: 'Аэрофлот',
    departureAirport: 'SVO',
    arrivalAirport: 'AER',
    scheduledDeparture: '2026-11-08T14:00:00',
    status: STATUS.SCHEDULED,
  },
  {
    id: 2,
    flightNumber: 'SU1550',
    airline: 'Аэрофлот',
    departureAirport: 'SVO',
    arrivalAirport: 'LED',
    scheduledDeparture: '2026-11-08T16:00:00',
    status: STATUS.SCHEDULED,
  },
  {
    id: 3,
    flightNumber: 'SU2045',
    airline: 'Аэрофлот',
    departureAirport: 'DME',
    arrivalAirport: 'KZN',
    scheduledDeparture: '2026-11-08T12:00:00',
    status: STATUS.DELAYED,
  },
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function cloneFlights(flights) {
  return flights.map((flight) => ({ ...flight }));
}

function readMockFlights() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const initial = cloneFlights(MOCK_FLIGHTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : cloneFlights(MOCK_FLIGHTS);
  } catch {
    return cloneFlights(MOCK_FLIGHTS);
  }
}

function writeMockFlights(flights) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flights));
}

async function parseResponse(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || body.error || `Ошибка сервера (${response.status})`);
  }
  return body;
}

export async function fetchFlights() {
  if (USE_MOCK) {
    await wait(MOCK_RESPONSE_DELAY);
    return readMockFlights();
  }

  const response = await fetch(`${API_BASE}/api/flights`);
  const data = await parseResponse(response);
  return Array.isArray(data) ? data : data.flights;
}

export async function sendFlightCommand(flightId, commandKey) {
  const command = COMMANDS[commandKey];
  if (!command) throw new Error('Неизвестная команда');

  if (!USE_MOCK) {
    const response = await fetch(`${API_BASE}/api/flights/${flightId}/${command.path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await parseResponse(response);
    return data.flight ? data : { ...data, flight: data };
  }

  await wait(MOCK_RESPONSE_DELAY);

  const flights = readMockFlights();
  const index = flights.findIndex((flight) => String(flight.id) === String(flightId));
  if (index === -1) throw new Error('Рейс не найден');

  const currentFlight = flights[index];
  const nextStatus = commandKey === 'CANCEL_DELAY' ? STATUS.SCHEDULED : STATUS.DELAYED;
  const updatedFlight = {
    ...currentFlight,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
    lastCommand: commandKey,
  };

  flights[index] = updatedFlight;
  writeMockFlights(flights);

  return {
    success: true,
    message: commandKey === 'CANCEL_DELAY'
      ? 'Задержка рейса отменена'
      : commandKey === 'DELAY_4H'
        ? 'Команда задержки на 4 часа выполнена'
        : 'Рейс переведён в статус «Задержан»',
    flight: updatedFlight,
  };
}

export async function resetFlights() {
  if (USE_MOCK) {
    await wait(250);
    localStorage.removeItem(STORAGE_KEY);
    return readMockFlights();
  }

  const response = await fetch(`${API_BASE}/api/flights`);
  return parseResponse(response);
}
