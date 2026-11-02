import { STATUS_LABELS, STATUS_CLASS } from '../constants/flights';

export default function FlightDetails({ flight }) {
  return (
    <dl className="details">
      <dt>Номер рейса</dt>          <dd>{flight.flightNumber}</dd>
      <dt>Маршрут</dt>              <dd>{flight.departureAirport} → {flight.arrivalAirport}</dd>
      <dt>Плановое время вылета</dt><dd>{new Date(flight.scheduledDeparture).toLocaleString('ru-RU')}</dd>
      <dt>Текущий статус</dt>       <dd>
        <span className={`status ${STATUS_CLASS[flight.status]}`}>
          {STATUS_LABELS[flight.status]}
        </span>
      </dd>
    </dl>
  );
}