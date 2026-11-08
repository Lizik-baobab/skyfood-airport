import { useMemo, useState } from 'react';
import { Search, Plane, RefreshCw, AlertCircle } from 'lucide-react';
import StatusPill from './StatusPill';

export default function FlightsView({ flights, loading, error, onRefresh, onSelect }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');

  const filtered = useMemo(() => flights.filter(f => {
    const haystack = `${f.flightNumber} ${f.airline} ${f.origin} ${f.destination}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (status === 'ALL' || f.status === status);
  }), [flights, query, status]);

  return <section className="page-section">
    <div className="page-heading">
      <div>
        <div className="eyebrow">ОПЕРАЦИОННАЯ ИНФОРМАЦИЯ</div>
        <h1>Рейсы</h1>
        <p>Список рейсов и текущие статусы вылета.</p>
      </div>
      <button className="button button-secondary" onClick={onRefresh} disabled={loading}><RefreshCw size={16}/> Обновить</button>
    </div>
    <div className="toolbar">
      <label className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Номер рейса, авиакомпания или направление"/></label>
      <select value={status} onChange={e => setStatus(e.target.value)} aria-label="Фильтр по статусу">
        <option value="ALL">Все статусы</option>
        <option value="SCHEDULED">Запланирован</option>
        <option value="DELAYED">Задержан</option>
        <option value="BOARDING">Посадка</option>
        <option value="DEPARTED">Вылетел</option>
        <option value="CANCELLED">Отменён</option>
      </select>
      <span className="result-count">{filtered.length} из {flights.length}</span>
    </div>
    {error && <div className="notice notice-error"><AlertCircle size={18}/>{error}</div>}
    {loading ? <div className="empty-state">Загружаем рейсы…</div> : filtered.length === 0 ? <div className="empty-state"><Plane size={28}/><b>Рейсы не найдены</b><span>Измени поисковый запрос или фильтр.</span></div> :
      <div className="table-wrap"><table className="data-table">
        <thead><tr><th>Рейс</th><th>Авиакомпания</th><th>Маршрут</th><th>Вылет</th><th>Задержка</th><th>Статус</th><th></th></tr></thead>
        <tbody>{filtered.map(f => <tr key={f.id}>
          <td><b className="flight-number">{f.flightNumber}</b><small>{f.date || '—'}</small></td>
          <td>{f.airline}</td>
          <td><div className="route-cell"><span>{f.origin}</span><span className="route-arrow">→</span><span>{f.destination}</span></div></td>
          <td>{f.scheduledDeparture}</td>
          <td>{f.delayMinutes > 0 ? <span className="delay-value">{f.delayMinutes} мин</span> : '—'}</td>
          <td><StatusPill status={f.status}/></td>
          <td><button className="text-button" onClick={() => onSelect(f)}>Подробнее</button></td>
        </tr>)}</tbody>
      </table></div>}
    <div className="table-footnote">Демонстрационные рейсы помечены в режиме разработки. Фактическое расписание загружается из backend.</div>
  </section>;
}