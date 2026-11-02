import { STATUS_LABELS, COMMANDS } from '../constants/flights';
import FlightDetails from './FlightDetails';

export default function FlightRow({ flight, pending, expanded, onToggle, onCommand }) {
  const isDelayed = flight.status === 'DELAYED';

  return (
    <>
      <tr 
        className={`flight-row ${expanded ? 'row-open' : ''}`} 
        onClick={onToggle}
      >
        <td className="fw-bold">{flight.flightNumber}</td>
        <td>{flight.airline || 'SkyFood Airways'}</td>
        <td>{flight.departureAirport} → {flight.arrivalAirport}</td>
        <td>{new Date(flight.scheduledDeparture).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
        <td>
          <span className={`status-badge ${isDelayed ? 'warn' : 'ok'}`}>
            {STATUS_LABELS[flight.status]}
          </span>
        </td>
        <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
          <button 
            className="btn-action" 
            disabled={pending} 
            onClick={() => onCommand(flight.id, 'DELAY')}
          >
            Задержать
          </button>
          <button 
            className="btn-action" 
            disabled={pending} 
            onClick={() => onCommand(flight.id, 'DELAY_FOUR_HOURS')}
          >
            +4 часа
          </button>
          <button 
            className="btn-action btn-outline" 
            disabled={pending} 
            onClick={() => onCommand(flight.id, 'CANCEL_DELAY')}
          >
            Отменить
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="details-row">
          <td colSpan={6}>
            <FlightDetails flight={flight} />
          </td>
        </tr>
      )}
    </>
  );
}