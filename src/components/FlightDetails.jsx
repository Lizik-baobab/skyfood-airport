export default function FlightDetails({ flight }) {
  return (
    <div className="details-box">
      <h4>Детали рейса</h4>
      <div className="details-grid">
        <div><span className="label">Номер:</span> {flight.flightNumber}</div>
        <div><span className="label">Маршрут:</span> {flight.departureAirport} → {flight.arrivalAirport}</div>
        <div><span className="label">Плановый вылет:</span> {new Date(flight.scheduledDeparture).toLocaleString('ru-RU')}</div>
        <div><span className="label">Код рейса:</span> {flight.id}</div>
      </div>
    </div>
  );
}