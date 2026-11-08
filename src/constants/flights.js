export const STATUS = {
  SCHEDULED: 'SCHEDULED',
  DELAYED: 'DELAYED',
  BOARDING: 'BOARDING',
  DEPARTED: 'DEPARTED',
  CANCELLED: 'CANCELLED',
};

export const STATUS_LABELS = {
  [STATUS.SCHEDULED]: 'По расписанию',
  [STATUS.DELAYED]: 'Задержан',
  [STATUS.BOARDING]: 'Идёт посадка',
  [STATUS.DEPARTED]: 'Вылетел',
  [STATUS.CANCELLED]: 'Отменён',
};

const airports = {
  SVO: { name: 'Шереметьево', city: 'Москва' },
  KZN: { name: 'Казань', city: 'Казань' },
  LED: { name: 'Пулково', city: 'Санкт-Петербург' },
};

const airlines = {
  1: { name: 'Аэрофлот', code: 'SU', icao: 'AFL' },
  2: { name: 'S7 Airlines', code: 'S7', icao: 'SBI' },
  3: { name: 'Уральские авиалинии', code: 'U6', icao: 'SVR' },
};

const routePairs = [
  ['SVO', 'KZN'], ['KZN', 'SVO'], ['SVO', 'LED'], ['LED', 'SVO'],
  ['KZN', 'LED'], ['LED', 'KZN'], ['SVO', 'KZN'],
];

export const INITIAL_FLIGHTS = Array.from({ length: 21 }, (_, index) => {
  const airlineId = Math.floor(index / 7) + 1;
  const flightIndex = index % 7;
  const [departureAirport, arrivalAirport] = routePairs[flightIndex];
  const prefix = airlines[airlineId].code;
  const flightNumber = airlineId === 1
    ? `SU${1001 + flightIndex}`
    : airlineId === 2
      ? `S7${1001 + flightIndex}`
      : `U6${1001 + flightIndex}`;
  const hour = 8 + flightIndex * 2;
  const delayed = flightIndex === 0;
  return {
    id: 1001 + index,
    flightNumber,
    airline: airlines[airlineId].name,
    airlineCode: prefix,
    airlineIcao: airlines[airlineId].icao,
    departureAirport,
    arrivalAirport,
    departureAirportName: airports[departureAirport].name,
    arrivalAirportName: airports[arrivalAirport].name,
    departureCity: airports[departureAirport].city,
    arrivalCity: airports[arrivalAirport].city,
    scheduledDeparture: `2026-12-${String(1 + airlineId - 1).padStart(2, '0')}T${String(hour - 3).padStart(2, '0')}:00:00.000Z`,
    scheduledArrival: `2026-12-${String(1 + airlineId - 1).padStart(2, '0')}T${String(hour - 2).padStart(2, '0')}:30:00.000Z`,
    passengers: 15,
    status: delayed ? STATUS.DELAYED : STATUS.SCHEDULED,
    delayMinutes: delayed ? 180 : 0,
    delayReason: delayed ? 'Техническая' : '—',
    events: delayed ? [
      { time: `${String(hour).padStart(2, '0')}:00`, title: 'Задержка зарегистрирована', detail: 'Старт события · NOT_STARTED → ACTIVE', tone: 'blue' },
      { time: `${String(hour + 2).padStart(2, '0')}:00`, title: 'Время задержки обновлено', detail: 'Зафиксировано изменение времени рейса', tone: 'green' },
      { time: `${String(hour + 3).padStart(2, '0')}:00`, title: 'Состояние на момент отчёта', detail: 'Текущая задержка — 180 минут', tone: 'orange' },
    ] : [],
  };
});

export const AIRPORTS = Object.values(airports).map((airport, index) => ({
  code: ['SVO', 'KZN', 'LED'][index],
  name: airport.name,
  city: airport.city,
}));

export const AIRLINES = Object.values(airlines).map((airline) => airline.name);
