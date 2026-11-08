import { X, Plane, Clock3, Building2, MapPin } from 'lucide-react';
import StatusPill from './StatusPill';

export default function FlightDetails({ flight, onClose }) {
  if (!flight) return null;
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="flight-title">
      <div className="modal-head"><div><div className="eyebrow">КАРТОЧКА РЕЙСА</div><h2 id="flight-title">{flight.flightNumber}</h2></div><button className="icon-button" onClick={onClose} aria-label="Закрыть"><X size={20}/></button></div>
      <div className="detail-status"><StatusPill status={flight.status}/>{flight.delayMinutes > 0 && <span className="delay-value">{flight.delayMinutes} минут задержки</span>}</div>
      <div className="detail-grid">
        <div className="detail-item"><Building2/><span>Авиакомпания</span><b>{flight.airline}</b></div>
        <div className="detail-item"><Clock3/><span>Дата</span><b>{flight.date || '—'}</b></div>
        <div className="detail-item"><MapPin/><span>Пункт отправления</span><b>{flight.origin}</b></div>
        <div className="detail-item"><MapPin/><span>Пункт назначения</span><b>{flight.destination}</b></div>
        <div className="detail-item"><Plane/><span>Плановое время вылета</span><b>{flight.scheduledDeparture}</b></div>
        <div className="detail-item"><Clock3/><span>Плановое время прибытия</span><b>{flight.scheduledArrival}</b></div>
      </div>
      <div className="modal-note">Выдача ваучеров, определение права на компенсацию и расчёт задолженности выполняются backend. Карточка рейса не изменяет финансовые данные.</div>
      <div className="modal-actions"><button className="button button-primary" onClick={onClose}>Готово</button></div>
    </section>
  </div>;
}