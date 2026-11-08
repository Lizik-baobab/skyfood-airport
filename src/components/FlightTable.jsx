import { useState } from 'react';
import FlightRow from './FlightRow';

export default function FlightTable({ flights, pendingId, onCommand }) {
  const [openId, setOpenId] = useState(null);

  if (!flights.length) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">✈</span>
        <strong>Рейсов пока нет</strong>
        <span>Когда рейсы появятся в системе, они отобразятся здесь.</span>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="flights-table">
        <thead>
          <tr>
            <th className="column-id">ID</th>
            <th>Номер рейса</th>
            <th>Аэропорт вылета</th>
            <th>Аэропорт назначения</th>
            <th>Плановый вылет</th>
            <th>Статус</th>
            <th className="column-actions">Действия</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <FlightRow
              key={flight.id}
              flight={flight}
              pending={pendingId === flight.id}
              expanded={openId === flight.id}
              onToggle={() => setOpenId(openId === flight.id ? null : flight.id)}
              onCommand={onCommand}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
