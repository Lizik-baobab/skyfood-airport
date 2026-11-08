const names = {
  SCHEDULED: 'По расписанию',
  DELAYED: 'Задержан',
  BOARDING: 'Посадка',
  DEPARTED: 'Вылетел',
  CANCELLED: 'Отменён',
  ARRIVED: 'Прибыл'
};

export default function StatusBadge({ status }) {
  const value = String(status || 'SCHEDULED').toUpperCase();
  return <span className={`status-badge status-${value.toLowerCase()}`}>{names[value] || status}</span>;
}