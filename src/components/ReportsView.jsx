import { useEffect, useMemo, useState } from 'react';
import { FileText, Search, RefreshCw, CircleDollarSign, Ticket, Utensils, Clock3, Info, AlertCircle } from 'lucide-react';
import { getFlightReport, getFlightReportList } from '../services/api';

function money(value, currency = '₽') {
  if (value === null || value === undefined || value === '') return '—';
  return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(Number(value))} ${currency}`;
}

function ReportDetail({ report }) {
  if (!report) return null;
  const status = report.status || report.reportStatus || 'FINAL';
  const pending = ['PENDING', 'WAITING', 'PRELIMINARY', 'ОЖИДАЕТ_ФОРМИРОВАНИЯ'].includes(String(status).toUpperCase());
  const noDebt = ['NO_DEBT', 'NO_REPORT', 'ЗАДОЛЖЕННОСТЬ_ОТСУТСТВУЕТ'].includes(String(status).toUpperCase());
  const orders = report.orders || report.passengerOrders || [];
  const cafes = report.cafes || [];
  return <div className="report-detail">
    <div className="report-detail-head">
      <div><div className="eyebrow">ФИНАНСОВЫЙ ОТЧЁТ ПО РЕЙСУ</div><h2>{report.flightNumber || report.flight?.flightNumber || 'Рейс'}</h2><p>{report.airline || report.airlineName || ''}</p></div>
      <span className={`report-state ${pending ? 'state-pending' : noDebt ? 'state-neutral' : 'state-final'}`}>{pending ? 'Ожидает формирования' : noDebt ? 'Задолженность отсутствует' : 'Итоговый отчёт'}</span>
    </div>
    {pending ? <div className="notice notice-info"><Clock3 size={18}/> Рейс ещё не вылетел. Итоговый финансовый отчёт будет сформирован backend после вылета.</div> :
      noDebt ? <div className="empty-report"><Info size={24}/><b>Задолженность отсутствует</b><span>Backend не передал сумму к возмещению по этому рейсу.</span></div> :
      <>
        <div className="metric-grid">
          <div className="metric-card"><Ticket/><span>Выдано ваучеров</span><b>{report.issuedVouchers ?? report.issued_vouchers ?? '—'}</b></div>
          <div className="metric-card"><Ticket/><span>Использовано</span><b>{report.usedVouchers ?? report.used_vouchers ?? '—'}</b></div>
          <div className="metric-card"><CircleDollarSign/><span>Списано по ваучерам</span><b>{money(report.voucherWriteOffTotal ?? report.voucher_write_off_total)}</b></div>
          <div className="metric-card metric-emphasis"><CircleDollarSign/><span>К возмещению авиакомпанией</span><b>{money(report.reimbursementAmount ?? report.reimbursement_amount)}</b></div>
        </div>
        <div className="report-section"><h3><Utensils size={18}/> Кафе и обслуживание</h3>
          {cafes.length ? <div className="cafe-list">{cafes.map((c, i) => <div className="cafe-row" key={c.id || i}><b>{c.name || c.cafeName || 'Кафе'}</b><span>{c.ordersCount ?? c.orders_count ?? '—'} заказов</span><span>{money(c.totalAmount ?? c.total_amount)}</span></div>)}</div> : <p className="muted">Backend пока не передал детализацию кафе.</p>}
        </div>
        <div className="report-section"><h3><FileText size={18}/> Заказы пассажиров</h3>
          {orders.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Заказ</th><th>Кафе</th><th>Состав и количество</th><th>Сумма</th></tr></thead><tbody>{orders.map((o, i) => <tr key={o.id || i}><td>{o.orderNumber || o.id || `Заказ ${i + 1}`}</td><td>{o.cafeName || o.cafe?.name || '—'}</td><td>{(o.items || o.details || []).map((it, j) => `${it.name || it.itemName || 'Позиция'} × ${it.quantity ?? 1}`).join(', ') || '—'}</td><td>{money(o.totalAmount ?? o.total_amount)}</td></tr>)}</tbody></table></div> : <p className="muted">Детализация заказов отсутствует в ответе backend.</p>}
        </div>
        <div className="report-bottom-grid">
          <div><span>Неиспользованный остаток ваучеров</span><b>{money(report.unusedVoucherBalance ?? report.unused_voucher_balance)}</b></div>
          <div><span>Сумма списаний</span><b>{money(report.voucherWriteOffTotal ?? report.voucher_write_off_total)}</b></div>
          <div><span>Итог к возмещению</span><b>{money(report.reimbursementAmount ?? report.reimbursement_amount)}</b></div>
        </div>
      </>}
  </div>;
}

export default function ReportsView() {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try { setReports(await getFlightReportList()); }
    catch (e) { setError(`Не удалось загрузить финансовые отчёты: ${e.message}`); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => reports.filter(r => `${r.flightNumber || ''} ${r.airline || r.airlineName || ''}`.toLowerCase().includes(query.toLowerCase())), [reports, query]);

  const openReport = async row => {
    setSelected(row); setDetail(null); setDetailLoading(true);
    try {
      const id = row.flightId ?? row.flight?.id ?? row.id;
      const full = await getFlightReport(id);
      setDetail(full || row);
    } catch (e) { setError(`Не удалось открыть отчёт: ${e.message}`); setDetail(row); }
    finally { setDetailLoading(false); }
  };

  return <section className="page-section">
    <div className="page-heading">
      <div><div className="eyebrow">ФИНАНСОВАЯ АНАЛИТИКА</div><h1>Отчёты</h1><p>Возмещение стоимости питания по ваучерам, выданным из-за задержек рейсов.</p></div>
      <button className="button button-secondary" onClick={load} disabled={loading}><RefreshCw size={16}/> Обновить</button>
    </div>
    <div className="rules-banner"><Info size={19}/><div><b>Какие данные попадают в отчёт</b><span>Только ваучеры, выданные пассажирам из-за задержки конкретного рейса, и связанные с ними заказы. Право на выдачу ваучера и сумму возмещения определяет backend.</span></div></div>
    <label className="search-box report-search"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск по номеру рейса или авиакомпании"/></label>
    {error && <div className="notice notice-error"><AlertCircle size={18}/>{error}</div>}
    {loading ? <div className="empty-state">Загружаем отчёты…</div> : filtered.length === 0 ? <div className="empty-state report-empty"><FileText size={30}/><b>Финансовых отчётов пока нет</b><span>Здесь появятся рейсы, по которым backend подтвердил выдачу ваучеров из-за задержки.</span><small>Рейсы без выданных ваучеров в финансовый список не включаются.</small></div> :
      <div className="reports-layout">
        <div className="report-list">{filtered.map((r, i) => <button key={r.flightId || r.id || i} className={`report-list-item ${selected === r ? 'selected' : ''}`} onClick={() => openReport(r)}>
          <span className="report-list-icon"><FileText size={18}/></span><span className="report-list-text"><b>{r.flightNumber || r.flight?.flightNumber || 'Рейс'}</b><small>{r.airline || r.airlineName || 'Авиакомпания не указана'}</small></span><span className="report-list-amount">{money(r.reimbursementAmount ?? r.reimbursement_amount)}</span>
        </button>)}</div>
        <div className="report-content">{detailLoading ? <div className="empty-state">Формируем карточку отчёта…</div> : detail ? <ReportDetail report={detail}/> : <div className="empty-state"><FileText size={26}/><span>Выберите рейс, чтобы открыть отчёт.</span></div>}</div>
      </div>}
  </section>;
}