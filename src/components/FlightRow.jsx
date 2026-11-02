import { STATUS_LABELS, STATUS_CLASS, COMMANDS } from '../constants/flights';
import FlightDetails from './FlightDetails';

export default function FlightRow({ flight, pending, expanded, onToggle, onCommand }) {
  return (
    <>
      <tr
        className={`flight-row ${expanded ? 'flight-row--open' : ''}`}
        onClick={onToggle}
      >
        <td>{flight.id}</td>
        <td>{flight.flightNumber}</td>
        <td>{flight.departureAirport}</td>
        <td>{flight.arrivalAirport}</td>
        <td>{new Date(flight.scheduledDeparture).toLocaleString('ru-RU')}</td>
        <td>
          <span className={`status ${STATUS_CLASS[flight.status]}`}>
            {STATUS_LABELS[flight.status]}
          </span>
        </td>
        <td className="actions" onClick={(e) => e.stopPropagation()}>
          <button disabled={pending} onClick={() => onCommand(flight.id, 'DELAY')}>
            {COMMANDS.DELAY.label}
          </button>
          <button disabled={pending} onClick={() => onCommand(flight.id, 'DELAY_FOUR_HOURS')}>
            {COMMANDS.DELAY_FOUR_HOURS.label}
          </button>
          <button disabled={pending} onClick={() => onCommand(flight.id, 'CANCEL_DELAY')}>
            {COMMANDS.CANCEL_DELAY.label}
          </button>
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