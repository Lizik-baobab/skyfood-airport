import { STATUS_LABELS } from '../constants/flights';

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || '—';
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function FlightDetails({ flight }) {
  return (
    <div className="details-box">
      <div className="details-heading">
        <span className="details-plane" aria-hidden="true">✈</span>
        <div>
          <p className="eyebrow">FLIGHT INFORMATION</p>
          <h3>Информация о рейсе {flight.flightNumber}</h3>
        </div>
      </div>
      <div className="details-grid">
        <div className="detail-item">
          <span className="detail-label">Номер рейса</span>
          <strong>{flight.flightNumber || '—'}</strong>
        </div>
        <div className="detail-item">
          <span className="detail-label">Маршрут</span>
          <strong>{flight.departureAirport || '—'} <span className="route-arrow">→</span> {flight.arrivalAirport || '—'}</strong>
        </div>
        <div className="detail-item">
          <span className="detail-label">Плановое время вылета</span>
          <strong>{formatDate(flight.scheduledDeparture)}</strong>
        </div>
        <div className="detail-item">
          <span className="detail-label">Текущий статус</span>
          <strong>{STATUS_LABELS[flight.status] || flight.status || '—'}</strong>
        </div>
        <div className="detail-item">
          <span className="detail-label">ID рейса</span>
          <strong>#{flight.id}</strong>
        </div>
      </div>
    </div>
  );
}
