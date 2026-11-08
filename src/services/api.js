import { DEMO_FLIGHTS } from '../data/demoFlights';
import { DEMO_REPORTS } from '../data/demoReports';

const MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const MOCK_FLIGHTS_KEY = 'skyfood_airport_flights_v3';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(message || `HTTP ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export function isMockMode() { return MOCK; }

export async function loadFlights() {
  if (MOCK) {
    // Используем отдельный ключ, чтобы старые тестовые рейсы из прошлых архивов
    // не подменяли согласованный набор из 21 рейса.
    try {
      const saved = localStorage.getItem(MOCK_FLIGHTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    localStorage.setItem(MOCK_FLIGHTS_KEY, JSON.stringify(DEMO_FLIGHTS));
    return DEMO_FLIGHTS;
  }
  const result = await request('/api/v1/flights');
  const list = Array.isArray(result) ? result : result?.content || result?.flights || [];
  return list.map((f) => ({
    id: f.id ?? f.flightId,
    flightNumber: f.flightNumber ?? f.flight_number,
    airline: f.airline ?? f.airlineName ?? f.airline_name,
    origin: f.origin ?? f.departureAirport ?? f.departure_airport,
    destination: f.destination ?? f.arrivalAirport ?? f.arrival_airport,
    scheduledDeparture: f.scheduledDeparture ?? f.scheduled_departure,
    scheduledArrival: f.scheduledArrival ?? f.scheduled_arrival,
    status: String(f.status || 'SCHEDULED').toUpperCase(),
    delayMinutes: Number(f.delayMinutes ?? f.delay_minutes ?? 0),
    passengerCount: f.passengerCount ?? f.passenger_count ?? '—',
    date: f.date ?? f.flightDate ?? f.flight_date,
    airlineCode: f.airlineCode ?? f.airline_code ?? '',
    delayReason: f.delayReason ?? f.delay_reason ?? '—'
  }));
}

export async function saveFlight(flight) {
  if (MOCK) {
    const current = await loadFlights();
    const next = current.map(f => f.id === flight.id ? flight : f);
    localStorage.setItem(MOCK_FLIGHTS_KEY, JSON.stringify(next));
    return flight;
  }
  return request(`/api/v1/flights/${encodeURIComponent(flight.id)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: flight.status,
      delayMinutes: flight.delayMinutes
    })
  });
}

export async function loadReportList() {
  if (MOCK) return DEMO_REPORTS;
  const result = await request('/api/v1/reports/flights');
  return Array.isArray(result) ? result : result?.content || result?.reports || [];
}

export async function loadFlightReport(flightId) {
  if (MOCK) return DEMO_REPORTS.find(report => String(report.flightId) === String(flightId)) || null;
  return request(`/api/v1/reports/flights/${encodeURIComponent(flightId)}`);
}