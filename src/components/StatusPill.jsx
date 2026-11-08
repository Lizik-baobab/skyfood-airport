const labels = {
  SCHEDULED: 'Запланирован',
  DELAYED: 'Задержан',
  BOARDING: 'Посадка',
  DEPARTED: 'Вылетел',
  CANCELLED: 'Отменён',
  ARRIVED: 'Прибыл'
};

export default function StatusPill({ status }) {
  const key = String(status || '').toUpperCase();
  return <span className={`status-pill status-${key.toLowerCase()}`}>{labels[key] || status || 'Неизвестно'}</span>;
}