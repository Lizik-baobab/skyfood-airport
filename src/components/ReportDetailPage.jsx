import { useEffect, useState } from 'react';

const money = v => v === null || v === undefined || v === '' ? '—' : `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(Number(v))} ₽`;
const pick = (o, camel, snake) => o?.[camel] ?? o?.[snake];

export default function ReportDetailPage({ report, onBack }) {
  const status = String(report.status || report.reportStatus || 'FINAL').toUpperCase();
  const pending = ['PENDING','WAITING','PRELIMINARY'].includes(status);
  const noDebt = ['NO_DEBT','NO_REPORT'].includes(status);
  const orders = report.orders || report.passengerOrders || [];
  const cafes = report.cafes || [];
  const flight = report.flight || {};
  return <section>
    <button className="back-link" onClick={onBack}>← Назад к отчётам</button>
    <div className="page-title">Отчёт по рейсу {report.flightNumber || flight.flightNumber || ''}</div>
    <p className="page-description">Финансовая сводка по ваучерам, заказам пассажиров и возмещению авиакомпанией.</p>
    <div className="report-header-card"><h2>{report.flightNumber || flight.flightNumber || 'Рейс'} · {report.route || `${flight.origin || ''} → ${flight.destination || ''}`}</h2><p>{report.airline || report.airlineName || 'Авиакомпания'} · {report.date || flight.date || ''}</p><span className={`report-status ${pending ? 'pending' : noDebt ? 'neutral' : 'final'}`}>{pending ? 'Ожидает формирования' : noDebt ? 'Задолженность отсутствует' : 'Итоговый отчёт'}</span></div>
    {pending ? <div className="state-panel pending-panel"><b>Отчёт ожидает формирования</b><p>Рейс ещё не вылетел. Итоговый финансовый отчёт будет сформирован backend после вылета.</p></div> :
    noDebt ? <div className="state-panel"><b>Задолженность отсутствует</b><p>Backend не передал сумму к возмещению по этому рейсу.</p></div> :
    <>
      <div className="financial-metrics">
        <div><span>ВЫДАНО ВАУЧЕРОВ</span><strong>{pick(report,'issuedVouchers','issued_vouchers') ?? '—'}</strong></div>
        <div><span>ИСПОЛЬЗОВАНО</span><strong>{pick(report,'usedVouchers','used_vouchers') ?? '—'}</strong></div>
        <div><span>СПИСАНО ПО ВАУЧЕРАМ</span><strong>{money(pick(report,'voucherWriteOffTotal','voucher_write_off_total'))}</strong></div>
        <div className="reimbursement"><span>К ВОЗМЕЩЕНИЮ АВИАКОМПАНИЕЙ</span><strong>{money(pick(report,'reimbursementAmount','reimbursement_amount'))}</strong></div>
      </div>
      <div className="report-content-card"><h2>Кафе и обслуживание</h2>{cafes.length ? <div className="table-scroll"><table className="flight-table"><thead><tr><th>Кафе</th><th>Количество заказов</th><th>Сумма заказов</th></tr></thead><tbody>{cafes.map((c,i)=><tr key={c.id || i}><td>{c.name || c.cafeName || '—'}</td><td>{c.ordersCount ?? c.orders_count ?? '—'}</td><td>{money(c.totalAmount ?? c.total_amount)}</td></tr>)}</tbody></table></div> : <p className="muted">Данные о кафе отсутствуют в ответе backend.</p>}</div>
      <div className="report-content-card"><h2>Заказы пассажиров</h2>{orders.length ? <div className="table-scroll"><table className="flight-table"><thead><tr><th>Заказ</th><th>Пассажир</th><th>Кафе</th><th>Состав и количество</th><th>Сумма</th></tr></thead><tbody>{orders.map((o,i)=><tr key={o.id || i}><td>{o.orderNumber || o.id || `Заказ ${i+1}`}</td><td>{o.passenger || o.passengerName || o.passenger_name || '—'}</td><td>{o.cafeName || o.cafe?.name || '—'}</td><td>{(o.items || o.details || []).map(x => `${x.name || x.itemName || 'Позиция'} × ${x.quantity ?? 1}`).join(', ') || '—'}</td><td>{money(o.totalAmount ?? o.total_amount)}</td></tr>)}</tbody></table></div> : <p className="muted">Детализация заказов отсутствует в ответе backend.</p>}</div>
      <div className="report-summary-card"><h2>Итог по рейсу</h2><div><span>Неиспользованный остаток ваучеров</span><b>{money(pick(report,'unusedVoucherBalance','unused_voucher_balance'))}</b></div><div><span>Сумма списаний</span><b>{money(pick(report,'voucherWriteOffTotal','voucher_write_off_total'))}</b></div><div><span>Сумма к возмещению</span><b>{money(pick(report,'reimbursementAmount','reimbursement_amount'))}</b></div></div>
    </>}
  </section>;
}