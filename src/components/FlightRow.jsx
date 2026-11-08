import { STATUS_LABELS, COMMANDS } from '../constants/flights';
import FlightDetails from './FlightDetails';

function formatDeparture(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || '—';
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function FlightRow({ flight, pending, expanded, onToggle, onCommand }) {
  const status = flight.status || 'UNKNOWN';
  const statusClass = status === 'SCHEDULED'
    ? 'status-badge--scheduled'
    : status === 'DELAYED'
      ? 'status-badge--delayed'
      : 'status-badge--neutral';

  return (
    <>
      <tr
        className={`flight-row ${expanded ? 'flight-row--expanded' : ''}`}
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <td className="flight-id">{flight.id}</td>
        <td>
          <div className="flight-number-cell">
            <span className="flight-number">{flight.flightNumber}</span>
            {flight.airline && <span className="airline-name">{flight.airline}</span>}
          </div>
        </td>
        <td><span className="airport-code">{flight.departureAirport}</span></td>
        <td><span className="airport-code">{flight.arrivalAirport}</span></td>
        <td className="departure-time">{formatDeparture(flight.scheduledDeparture)}</td>
        <td>
          <span className={`status-badge ${statusClass}`}>
            <span className="status-indicator" />
            {STATUS_LABELS[status] || status}
          </span>
        </td>
        <td className="actions-cell" onClick={(event) => event.stopPropagation()}>
          <div className="actions-group">
            <button
              className="button button--action button--delay"
              disabled={pending}
              onClick={() => onCommand(flight.id, 'DELAY')}
              title="Установить обычную задержку"
            >
              Задержать рейс
            </button>
            <button
              className="button button--action button--four-hours"
              disabled={pending}
              onClick={() => onCommand(flight.id, 'DELAY_4H')}
              title="Отправить отдельную команду задержки на 4 часа"
            >
              Задержать на 4 часа
            </button>
            <button
              className="button button--action button--cancel"
              disabled={pending}
              onClick={() => onCommand(flight.id, 'CANCEL_DELAY')}
              title="Отменить задержку"
            >
              Отменить задержку
            </button>
          </div>
          {pending && <span className="row-pending"><span className="mini-spinner" /> Выполняется…</span>}
        </td>
      </tr>
      {expanded && (
        <tr className="details-row">
          <td colSpan={7}>
            <FlightDetails flight={flight} />
          </td>
        </tr>
      )}
    </>
  );
}
