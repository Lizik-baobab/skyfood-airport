import { useMemo, useState } from 'react';
import { AIRLINES, AIRPORTS, STATUS_LABELS } from './constants/flights';
import { useFlights } from './hooks/useFlights';
import Toast from './components/Toast';

const PAGE_SIZE = 10;
const formatTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
};
const formatDate = (value) => {
  if (!value) return '01.12.2026';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '01.12.2026' : new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};
const statusClass = (status) => ({ SCHEDULED: 'scheduled', DELAYED: 'delayed', BOARDING: 'boarding', DEPARTED: 'departed', CANCELLED: 'cancelled' }[status] || 'scheduled');
const pad = (value) => String(value).padStart(2, '0');
const addMinutes = (time, minutes) => {
  const [hours, mins] = time.split(':').map(Number);
  const total = hours * 60 + mins + minutes;
  return `${pad(Math.floor((total / 60) % 24))}:${pad(total % 60)}`;
};
const delayText = (minutes) => `${Math.floor(minutes / 60)} ч ${minutes % 60} мин`;

function Sidebar({ page, onNavigate }) {
  return <aside className="sidebar">
    <a className="sidebar-brand" href="#top"><span className="brand-plane">✈</span><span>SkyFood</span></a>
    <div className="sidebar-divider" />
    <div className="sidebar-section-label">РАБОЧЕЕ ПРОСТРАНСТВО</div>
    <nav className="sidebar-nav" aria-label="Основная навигация">
      <button className={`nav-item ${page === 'flights' || page === 'flight' ? 'nav-item--active' : ''}`} onClick={() => onNavigate('flights')}><span className="nav-icon">✈</span>Рейсы</button>
      <button className={`nav-item ${page === 'reports' || page === 'report' ? 'nav-item--active' : ''}`} onClick={() => onNavigate('reports')}><span className="nav-icon">▤</span>Отчёты</button>
    </nav>
  </aside>;
}

function Topbar({ page, selectedFlight, onNavigate }) {
  const parentPage = page === 'report' ? 'reports' : page === 'flight' ? 'flights' : page;
  const labels = { flights: 'Рейсы', reports: 'Отчёты', flight: 'Рейсы', report: 'Отчёты' };
  return <header className="topbar"><div className="breadcrumb"><button className="breadcrumb-link breadcrumb-home" onClick={() => onNavigate('flights')}>SkyFood Airport</button><span>/</span>{(page === 'flight' || page === 'report') ? <><button className="breadcrumb-link" onClick={() => onNavigate(parentPage)}>{labels[parentPage]}</button><span>/</span><strong>{selectedFlight?.flightNumber || ''}</strong></> : <strong>{labels[page]}</strong>}</div><div className="topbar-right">UTC+3</div></header>;
}

function Status({ status, detail = false }) {
  const label = detail && status === 'DELAYED' ? 'Активная задержка' : STATUS_LABELS[status] || 'По расписанию';
  return <span className={`status-pill status--${statusClass(status)} ${detail ? 'status-pill--detail' : ''}`}>{label}</span>;
}

function FlightTable({ flights, page, onOpen }) {
  return <div className="table-card">
    <div className="table-scroll"><table className="data-table">
      <thead><tr><th>РЕЙС</th><th>АВИАКОМПАНИЯ</th><th>МАРШРУТ</th><th>ВЫЛЕТ · UTC+3</th><th>ПАССАЖИРЫ</th><th>СТАТУС</th><th>ДЕЙСТВИЕ</th></tr></thead>
      <tbody>{flights.map((flight) => <tr key={flight.id}>
        <td><span className="flight-code">{flight.flightNumber}</span></td>
        <td>{flight.airline}</td>
        <td>{flight.departureAirport} <span className="route-arrow">→</span> {flight.arrivalAirport}</td>
        <td>{formatTime(flight.scheduledDeparture)}</td>
        <td>{flight.passengers}</td>
        <td><Status status={flight.status} /></td>
        <td><button className="open-button" onClick={() => onOpen(flight)}>{page === 'reports' ? 'Открыть отчёт' : 'Открыть рейс'} <span>→</span></button></td>
      </tr>)}</tbody>
    </table></div>
    {!flights.length && <div className="empty-state">Рейсы не найдены. Измените параметры поиска.</div>}
  </div>;
}

function Pagination({ page, total, onChange }) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return <div className="pagination-row"><span>Показано {total ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, total)} из {total} рейсов · Страница {page} из {pages}</span><div className="pagination">
    <button disabled={page === 1} onClick={() => onChange(page - 1)}>← Назад</button>
    {Array.from({ length: pages }, (_, i) => i + 1).map((number) => <button key={number} className={number === page ? 'is-current' : ''} onClick={() => onChange(number)}>{number}</button>)}
    <button disabled={page === pages} onClick={() => onChange(page + 1)}>Вперёд →</button>
  </div></div>;
}

function FlightsPage({ flights, onOpen }) {
  const [draft, setDraft] = useState({ search: '', airport: '', airline: '', status: '' });
  const [filters, setFilters] = useState(draft);
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => flights.filter((flight) => {
    const query = filters.search.trim().toLowerCase();
    return (!query || `${flight.flightNumber} ${flight.id} ${flight.departureAirport} ${flight.arrivalAirport}`.toLowerCase().includes(query))
      && (!filters.airport || flight.departureAirport === filters.airport || flight.arrivalAirport === filters.airport)
      && (!filters.airline || flight.airline === filters.airline)
      && (!filters.status || flight.status === filters.status);
  }), [flights, filters]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const changeDraft = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const apply = () => { setFilters(draft); setPage(1); };
  const clear = () => { const empty = { search: '', airport: '', airline: '', status: '' }; setDraft(empty); setFilters(empty); setPage(1); };
  return <>
    <div className="page-heading"><div><h1>Рейсы</h1><p>Список рейсов авиакомпаний. Используйте фильтры и откройте рейс для изменения.</p></div></div>
    <section className="filters-card">
      <label className="filter-control filter-search"><span>Поиск</span><input value={draft.search} onChange={(e) => changeDraft('search', e.target.value)} onKeyDown={(e) => e.key === 'Enter' && apply()} placeholder="Номер рейса, ID или маршрут..." /></label>
      <label className="filter-control"><span>Аэропорт</span><select value={draft.airport} onChange={(e) => changeDraft('airport', e.target.value)}><option value="">Все значения</option>{AIRPORTS.map((airport) => <option key={airport.code} value={airport.code}>{airport.code} · {airport.city}</option>)}</select></label>
      <label className="filter-control"><span>Авиакомпания</span><select value={draft.airline} onChange={(e) => changeDraft('airline', e.target.value)}><option value="">Все значения</option>{AIRLINES.map((airline) => <option key={airline}>{airline}</option>)}</select></label>
      <label className="filter-control"><span>Статус</span><select value={draft.status} onChange={(e) => changeDraft('status', e.target.value)}><option value="">Все значения</option>{Object.entries(STATUS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <button className="apply-button" onClick={apply}>Применить</button><button className="clear-button" onClick={clear}>Сброс</button>
    </section>
    <FlightTable flights={visible} page="flights" onOpen={onOpen} />
    <Pagination page={currentPage} total={filtered.length} onChange={setPage} />
  </>;
}

function ReportsPage({ flights, onOpen }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => flights.filter((flight) => flight.flightNumber.toLowerCase().includes(query.trim().toLowerCase())), [flights, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  return <>
    <div className="page-heading"><div><h1>Отчёты</h1><p>Все рейсы авиакомпаний. Откройте отчёт по выбранному рейсу.</p></div></div>
    <section className="report-search-card"><label htmlFor="report-flight-search">Поиск по номеру рейса</label><input id="report-flight-search" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Например, SU1001" /></section>
    <FlightTable flights={visible} page="reports" onOpen={onOpen} />
    <Pagination page={currentPage} total={filtered.length} onChange={setPage} />
  </>;
}

function FlightDetails({ flight, pending, onAction, onBack }) {
  const departure = formatTime(flight.scheduledDeparture);
  const arrival = formatTime(flight.scheduledArrival);
  const estimate = addMinutes(departure, flight.delayMinutes || 0);
  return <>
    <button className="detail-back-link" onClick={onBack}>← Все рейсы</button>
    <div className="detail-title-row"><div><h1>{flight.flightNumber} · {flight.departureCity} <span>→</span> {flight.arrivalCity}</h1><p>{flight.airline} · {formatDate(flight.scheduledDeparture)} · Рейс № {flight.id}</p></div><Status status={flight.status} detail /></div>
    <section className="flight-summary-card">
      <div><span>ОТПРАВЛЕНИЕ</span><strong>{flight.departureAirport} · {flight.departureAirportName}</strong><small>{departure} МСК</small></div>
      <div><span>ПРИБЫТИЕ</span><strong>{flight.arrivalAirport} · {flight.arrivalAirportName}</strong><small>{arrival} МСК</small></div>
      <div><span>ПАССАЖИРЫ</span><strong className="passenger-count">{flight.passengers}</strong><small>Рейс {flight.flightNumber}</small></div>
      <div><span>ДАТА / АВИАКОМПАНИЯ</span><strong>{formatDate(flight.scheduledDeparture)}</strong><small>{flight.airlineCode} · {flight.airlineIcao}</small></div>
    </section>
    <section className="manage-card">
      <h2>Управление задержкой рейса</h2><p className="section-subtitle">Изменяйте задержку и статус выбранного рейса.</p>
      <div className="delay-status-box"><div><span>ТЕКУЩЕЕ ВРЕМЯ</span><strong>{delayText(flight.delayMinutes || 0)}</strong></div><b>Текущая задержка рейса: {delayText(flight.delayMinutes || 0)}</b></div>
      <div className="delay-controls"><label>Добавить ко времени</label><div>{[2, 4, 6, 8].map((hours) => <button key={hours} disabled={pending} onClick={() => onAction('ADD_DELAY', hours * 60)}>+{hours} ч</button>)}</div><small>Кнопки прибавляют выбранный интервал к текущему времени задержки рейса.</small></div>
      <div className="manage-footnote">УПРАВЛЕНИЕ ВРЕМЕНЕМ</div>
    </section>
    <section className="flight-actions-card"><h2>Действия по рейсу</h2><p className="section-subtitle">После начала посадки, отмены или вылета рейса обновляется его итоговый статус.</p>
      <div className="flight-actions"><button className="action-boarding" disabled={pending || ['BOARDING', 'DEPARTED', 'CANCELLED'].includes(flight.status)} onClick={() => onAction('BOARDING')}>Начать посадку</button><button className="action-cancel" disabled={pending || ['CANCELLED', 'DEPARTED'].includes(flight.status)} onClick={() => onAction('CANCEL')}>Отменить рейс</button><button className="action-depart" disabled={pending || ['DEPARTED', 'CANCELLED'].includes(flight.status)} onClick={() => onAction('DEPART')}>Рейс вылетел</button><small>После BOARDING / CANCELLED / DEPARTED фиксируется итоговый статус рейса.</small></div>
    </section>
  </>;
}

function ReportDetails({ flight, onBack }) {
  const delay = flight.delayMinutes || 0;
  const departure = formatTime(flight.scheduledDeparture);
  const estimate = addMinutes(departure, delay);
  const events = flight.events?.length ? flight.events : [{ time: departure, title: 'Рейс по расписанию', detail: 'Изменения времени не зафиксированы', tone: 'green' }];
  return <>
    <button className="detail-back-link" onClick={onBack}>← Все отчёты</button>
    <div className="report-detail-heading"><h1>Отчёт по рейсу {flight.flightNumber}</h1><p>Сводка по рейсу: время задержки, изменения расписания и итоговый статус.</p></div>
    <section className="report-route-card"><strong>{flight.flightNumber} · {flight.departureAirport} → {flight.arrivalAirport}</strong><span>{flight.airline} · {formatDate(flight.scheduledDeparture)} · {flight.departureCity} (UTC+3)</span></section>
    <section className="report-metrics">
      <article className="metric-card metric-delay"><span>Длительность</span><strong>{delay} мин</strong><small>Задержка рейса</small></article>
      <article className="metric-card metric-passengers"><span>Пассажиры</span><strong>{flight.passengers}</strong><small>На борту рейса</small></article>
      <article className="metric-card metric-scheduled"><span>Плановый вылет</span><strong>{departure}</strong><small>По расписанию</small></article>
      <article className="metric-card metric-estimated"><span>Оценка вылета</span><strong>{estimate}</strong><small>С учётом задержки</small></article>
    </section>
    <section className="timeline-section"><h2>Хронология события</h2><p>Последовательность ключевых этапов</p><div className="timeline-card">{events.map((event, index) => <div className="timeline-item" key={`${event.time}-${index}`}><span className={`timeline-dot dot-${event.tone || 'blue'}`} /><time>{event.time}</time><div><strong>{event.title}</strong><small>{event.detail}</small></div></div>)}</div></section>
    <section className="report-summary-section"><h2>Сводка по рейсу</h2><p>Ключевые параметры и финальный статус рейса.</p><div className="report-summary-card"><h3>Итог по рейсу</h3><dl><div><dt>Плановое время вылета</dt><dd>{departure}</dd></div><div><dt>Оценочное время вылета</dt><dd>{estimate}</dd></div><div><dt>Причина</dt><dd>{flight.delayReason || '—'}</dd></div><div><dt>Статус отчёта</dt><dd className="preview-status">{flight.status === 'CANCELLED' ? 'CANCELLED' : flight.status === 'DEPARTED' ? 'FINAL' : 'PREVIEW'}</dd></div></dl></div></section>
  </>;
}

export default function App() {
  const { flights, pendingId, updateFlight } = useFlights();
  const [page, setPage] = useState('flights');
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState(null);
  const selectedFlight = flights.find((flight) => String(flight.id) === String(selectedId));
  const navigate = (nextPage) => { setPage(nextPage); if (nextPage === 'flights' || nextPage === 'reports') setSelectedId(null); };
  const openFlight = (flight) => { setSelectedId(flight.id); setPage('flight'); };
  const openReport = (flight) => { setSelectedId(flight.id); setPage('report'); };
  const runAction = async (action, value) => {
    const result = await updateFlight(selectedFlight.id, action, value);
    if (result.ok) setToast({ message: action === 'ADD_DELAY' ? `Задержка увеличена на ${value / 60} ч` : action === 'BOARDING' ? 'Посадка начата' : action === 'CANCEL' ? 'Рейс отменён' : 'Рейс отмечен как вылетевший', type: 'success' });
  };
  return <div className="airport-app" id="top">
    <Sidebar page={page} onNavigate={navigate} />
    <div className="main-area"><Topbar page={page} selectedFlight={selectedFlight} onNavigate={navigate} />
      <main className={`content-shell content-${page}`}>
        {page === 'flights' && <FlightsPage flights={flights} onOpen={openFlight} />}
        {page === 'reports' && <ReportsPage flights={flights} onOpen={openReport} />}
        {page === 'flight' && selectedFlight && <FlightDetails flight={selectedFlight} pending={pendingId === selectedFlight.id} onAction={runAction} onBack={() => navigate('flights')} />}
        {page === 'report' && selectedFlight && <ReportDetails flight={selectedFlight} onBack={() => navigate('reports')} />}
      </main>
    </div>
    {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
  </div>;
}
