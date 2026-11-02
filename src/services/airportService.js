import { STATUS, COMMANDS } from '../constants/flights';

const STORAGE_KEY = 'skyfood_flights';
const NETWORK_DELAY_MS = 700;
const API_BASE = import.meta.env.VITE_API_BASE ?? '';
const USE_MOCK = !API_BASE;

const MOCK_FLIGHTS = [
  {
    id: 1,
    flightNumber: 'SU1234',
    departureAirport: 'SVO',
    arrivalAirport: 'AER',
    scheduledDeparture: '2026-11-02T14:00:00',
    status: STATUS.SCHEDULED,
  },
  {
    id: 2,
    flightNumber: 'SU1550',
    departureAirport: 'SVO',
    arrivalAirport: 'LED',
    scheduledDeparture: '2026-11-02T16:00:00',
    status: STATUS.SCHEDULED,
  },
  {
    id: 3,
    flightNumber: 'SU2045',
    departureAirport: 'DME',
    arrivalAirport: 'KZN',
    scheduledDeparture: '2026-11-02T12:00:00',
    status: STATUS.DELAYED,
  },
];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function readMock() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_FLIGHTS));
      return structuredClone(MOCK_FLIGHTS);
    }
    return JSON.parse(raw);
  } catch {
    return structuredClone(MOCK_FLIGHTS);
  }
}

function writeMock(flights) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flights));
}

export async function fetchFlights() {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE}/api/flights`);
    if (!res.ok) throw new Error(`Не удалось загрузить рейсы (${res.status})`);
    return res.json();
  }
  await wait(NETWORK_DELAY_MS);
  return readMock();
}

export async function sendFlightCommand(flightId, commandKey) {
  const command = COMMANDS[commandKey];
  if (!command) throw new Error('Неизвестная команда');

  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE}/api/flights/${flightId}/${command.path}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error(`Ошибка команды (${res.status})`);
    return res.json();
  }

  await wait(NETWORK_DELAY_MS);

  const flights = readMock();
  const idx = flights.findIndex((f) => f.id === flightId);
  if (idx === -1) throw new Error('Рейс не найден');

  const current = flights[idx];

  if (commandKey === 'CANCEL_DELAY' && current.status !== STATUS.DELAYED) {
    throw new Error('У рейса нет активной задержки');
  }

  const nextStatus =
    commandKey === 'CANCEL_DELAY' ? STATUS.SCHEDULED : STATUS.DELAYED;

  flights[idx] = { ...current, status: nextStatus, updatedAt: new Date().toISOString() };
  writeMock(flights);

  return { success: true, flight: flights[idx] };
}

export async function resetFlights() {
  await wait(300);
  localStorage.removeItem(STORAGE_KEY);
  return readMock();
}