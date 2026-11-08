import { useState } from 'react';
import StatusBadge from './StatusBadge';

const fmt = mins => `${Math.floor(mins / 60)} ч ${String(mins % 60).padStart(2, '0')} мин`;

export default function FlightPage({ flight, onBack, onSave }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const update = async patch => {
    setSaving(true); setError('');
    try { await onSave({ ...flight, ...patch }); }
    catch (e) { setError(e.message || 'Не удалось сохранить изменения'); }
    finally { setSaving(false); }
  };
  const addDelay = n => update({ delayMinutes: Number(flight.delayMinutes || 0) + n, status: 'DELAYED' });
  const delay = Number(flight.delayMinutes || 0);
  return <section>
    <button className="back-link" onClick={onBack}>← Назад к рейсам</button>
    <div className="flight-heading">
      <div><h1>{flight.flightNumber} · {flight.origin} → {flight.destination}</h1><p>{flight.airline} · {flight.date} · Рейс {flight.id}</p></div>
      <StatusBadge status={flight.status}/>
    </div>
    <div className="flight-facts">
      <div><span>ОТПРАВЛЕНИЕ</span><b>{flight.origin}</b><small>{flight.scheduledDeparture || '—'} МСК</small></div>
      <div><span>ПРИБЫТИЕ</span><b>{flight.destination}</b><small>{flight.scheduledArrival || '—'} МСК</small></div>
      <div><span>ПАССАЖИРЫ</span><strong>{flight.passengerCount ?? '—'}</strong><small>Пассажиры рейса</small></div>
      <div><span>ДАТА / АВИАКОМПАНИЯ</span><b>{flight.date || '—'}</b><small>{flight.airlineCode || flight.airline}</small></div>
    </div>
    <div className="control-panel">
      <h2>Управление задержкой рейса</h2>
      <p className="section-description">Изменяйте задержку и статус выбранного рейса.</p>
      <div className="current-time-panel"><div><span>ТЕКУЩЕЕ ВРЕМЯ</span><strong>{fmt(delay)}</strong></div><b>Текущая задержка рейса: {fmt(delay)}</b></div>
      <div className="control-label">Добавить ко времени</div>
      <div className="delay-buttons">
        {[120, 240, 360, 480].map(n => <button key={n} disabled={saving || ['DEPARTED','CANCELLED'].includes(flight.status)} onClick={() => addDelay(n)}>+{n/60} ч</button>)}
      </div>
      <p className="hint">Кнопки прибавляют выбранный интервал к текущему времени задержки рейса.</p>
      <div className="control-mode">УПРАВЛЕНИЕ ВРЕМЕНЕМ</div>
      {error && <div className="error-message">{error}</div>}
    </div>
    <div className="actions-panel">
      <h2>Действия по рейсу</h2>
      <p className="section-description">После начала посадки, отмены или вылета рейса обновляется его итоговый статус.</p>
      <div className="flight-actions">
        <button className="btn-blue action-button" disabled={saving || ['DEPARTED','CANCELLED'].includes(flight.status)} onClick={() => update({ status: 'BOARDING' })}>Начать посадку</button>
        <button className="btn-outline-warning action-button" disabled={saving || ['DEPARTED','CANCELLED'].includes(flight.status)} onClick={() => update({ status: 'CANCELLED' })}>Отменить рейс</button>
        <button className="btn-green action-button" disabled={saving || ['DEPARTED','CANCELLED'].includes(flight.status)} onClick={() => update({ status: 'DEPARTED' })}>Рейс вылетел</button>
        <span className="hint">После BOARDING / CANCELLED / DEPARTED фиксируется итоговый статус рейса.</span>
      </div>
    </div>
  </section>;
}