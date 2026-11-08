import { useEffect, useMemo, useState } from 'react';
import StatusBadge from './StatusBadge';

export default function ReportsPage({ reports, loading, error, onOpen, onRefresh }) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => reports.filter(r => `${r.flightNumber || ''} ${r.airline || r.airlineName || ''}`.toLowerCase().includes(search.toLowerCase())), [reports, search]);
  return <section>
    <div className="page-title">Отчёты</div>
    <p className="page-description">Финансовые отчёты по ваучерам, выданным пассажирам из-за задержек рейсов.</p>
    <div className="report-search-panel"><label>Поиск по номеру рейса<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Введите номер рейса…"/></label></div>
    {error && <div className="error-message">{error}</div>}
    <div className="table-panel report-table-panel">
      {loading ? <div className="empty-reports">Загружаем финансовые отчёты…</div> :
        filtered.length === 0 ? <div className="empty-reports"><div className="empty-report-icon">▤</div><h3>Финансовых отчётов пока нет</h3><p>Здесь отображаются только рейсы, по которым backend подтвердил выдачу ваучеров пассажирам из-за задержки.</p><small>Рейсы без выданных ваучеров в список не включаются.</small><button className="btn-light" onClick={onRefresh}>Обновить</button></div> :
        <div className="table-scroll"><table className="flight-table"><thead><tr><th>Рейс</th><th>Авиакомпания</th><th>Маршрут</th><th>Вылет · UTC+3</th><th>Пассажиры</th><th>Статус отчёта</th><th>Действие</th></tr></thead><tbody>
          {filtered.map((r,i) => <tr key={r.flightId || r.id || i}><td className="flight-id">{r.flightNumber || r.flight?.flightNumber}</td><td>{r.airline || r.airlineName || '—'}</td><td>{r.route || '—'}</td><td>{r.departureTime || '—'}</td><td>{r.passengerCount ?? '—'}</td><td><span className={`report-status ${String(r.status).toLowerCase()}`}>{r.statusLabel || (r.status === 'PENDING' ? 'Ожидает формирования' : 'Итоговый')}</span></td><td><button className="open-link" onClick={() => onOpen(r)}>Открыть отчёт →</button></td></tr>)}
        </tbody></table></div>}
    </div>
  </section>;
}