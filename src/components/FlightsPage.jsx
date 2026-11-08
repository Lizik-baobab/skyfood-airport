import { useMemo, useState } from 'react';
import StatusBadge from './StatusBadge';

export default function FlightsPage({ flights, onOpen, onRefresh }) {
  const [search, setSearch] = useState('');
  const [airport, setAirport] = useState('ALL');
  const [airline, setAirline] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [applied, setApplied] = useState({ search: '', airport: 'ALL', airline: 'ALL', status: 'ALL' });

  const airports = [...new Set(flights.flatMap(f => [f.origin, f.destination]).filter(Boolean))];
  const airlines = [...new Set(flights.map(f => f.airline).filter(Boolean))];
  const filtered = useMemo(() => flights.filter(f => {
    const term = applied.search.toLowerCase();
    const text = `${f.flightNumber} ${f.id} ${f.origin} ${f.destination}`.toLowerCase();
    const airportMatch = applied.airport === 'ALL' || f.origin === applied.airport || f.destination === applied.airport;
    return text.includes(term) && airportMatch && (applied.airline === 'ALL' || f.airline === applied.airline) && (applied.status === 'ALL' || f.status === applied.status);
  }), [flights, applied]);

  const apply = () => setApplied({ search, airport, airline, status });
  const reset = () => { setSearch(''); setAirport('ALL'); setAirline('ALL'); setStatus('ALL'); setApplied({ search: '', airport: 'ALL', airline: 'ALL', status: 'ALL' }); };

  return <section>
    <div className="page-title">Рейсы</div>
    <p className="page-description">Список рейсов авиакомпаний. Используйте фильтры и откройте рейс для изменения.</p>
    <div className="filters-panel">
      <label className="filter-field search-field"><span>Поиск</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Номер рейса, ID или маршрут…"/></label>
      <label className="filter-field"><span>Аэропорт</span><select value={airport} onChange={e => setAirport(e.target.value)}><option value="ALL">Все значения</option>{airports.map(a => <option key={a}>{a}</option>)}</select></label>
      <label className="filter-field"><span>Авиакомпания</span><select value={airline} onChange={e => setAirline(e.target.value)}><option value="ALL">Все значения</option>{airlines.map(a => <option key={a}>{a}</option>)}</select></label>
      <label className="filter-field"><span>Статус</span><select value={status} onChange={e => setStatus(e.target.value)}><option value="ALL">Все значения</option><option value="SCHEDULED">По расписанию</option><option value="DELAYED">Задержан</option><option value="BOARDING">Посадка</option><option value="DEPARTED">Вылетел</option><option value="CANCELLED">Отменён</option></select></label>
      <div className="filter-actions"><button className="btn-blue" onClick={apply}>Применить</button><button className="btn-light" onClick={reset}>Сброс</button></div>
    </div>
    <div className="table-panel">
      <div className="table-scroll"><table className="flight-table">
        <thead><tr><th>Рейс</th><th>Авиакомпания</th><th>Маршрут</th><th>Вылет · UTC+3</th><th>Пассажиры</th><th>Статус</th><th>Действия</th></tr></thead>
        <tbody>{filtered.map(f => <tr key={f.id}>
          <td className="flight-id">{f.flightNumber}</td>
          <td>{f.airline}</td>
          <td>{(f.origin || '').match(/\((.*?)\)/)?.[1] || f.origin} → {(f.destination || '').match(/\((.*?)\)/)?.[1] || f.destination}</td>
          <td>{f.scheduledDeparture || '—'}</td>
          <td>{f.passengerCount ?? '—'}</td>
          <td><StatusBadge status={f.status}/></td>
          <td><button className="open-link" onClick={() => onOpen(f)}>Открыть рейс →</button></td>
        </tr>)}</tbody>
      </table></div>
      <div className="table-pagination"><span>Показано {filtered.length} из {flights.length} рейсов</span><button onClick={onRefresh}>Обновить список</button></div>
    </div>
  </section>;
}