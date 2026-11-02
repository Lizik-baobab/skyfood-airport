import { useState } from 'react';
import FlightRow from './FlightRow';

export default function FlightTable({ flights, pendingId, onCommand }) {
  const [openId, setOpenId] = useState(null);

  if (!flights.length) return <p className="empty-state">Рейсов нет</p>;

  return (
    <div className="table-container">
      <table className="flights-table">
        <thead>
          <tr>
            <th>Рейс</th>
            <th>Авиакомпания</th>
            <th>Маршрут</th>
            <th>Вылет</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((f) => (
            <FlightRow
              key={f.id}
              flight={f}
              pending={pendingId === f.id}
              expanded={openId === f.id}
              onToggle={() => setOpenId(openId === f.id ? null : f.id)}
              onCommand={onCommand}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}