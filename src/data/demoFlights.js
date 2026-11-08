// Демонстрационные данные: 21 рейс из исходного набора проекта.
// Изменены только задержки SU1001, S71001 и U61001.
const rows = [
  // Аэрофлот — 1 декабря
  ['SU1001', 'Аэрофлот', 'SVO', 'KZN', '2026-12-01T05:00:00.000Z', 'DEPARTED', 150],
  ['SU1002', 'Аэрофлот', 'KZN', 'SVO', '2026-12-01T07:00:00.000Z', 'DEPARTED', 0],
  ['SU1003', 'Аэрофлот', 'SVO', 'LED', '2026-12-01T09:00:00.000Z', 'SCHEDULED', 0],
  ['SU1004', 'Аэрофлот', 'LED', 'SVO', '2026-12-01T11:00:00.000Z', 'SCHEDULED', 0],
  ['SU1005', 'Аэрофлот', 'KZN', 'LED', '2026-12-01T13:00:00.000Z', 'SCHEDULED', 0],
  ['SU1006', 'Аэрофлот', 'LED', 'KZN', '2026-12-01T15:00:00.000Z', 'SCHEDULED', 0],
  ['SU1007', 'Аэрофлот', 'SVO', 'KZN', '2026-12-01T17:00:00.000Z', 'SCHEDULED', 0],

  // S7 Airlines — 2 декабря
  ['S71001', 'S7 Airlines', 'SVO', 'KZN', '2026-12-02T05:00:00.000Z', 'DEPARTED', 270],
  ['S71002', 'S7 Airlines', 'KZN', 'SVO', '2026-12-02T07:00:00.000Z', 'SCHEDULED', 0],
  ['S71003', 'S7 Airlines', 'SVO', 'LED', '2026-12-02T09:00:00.000Z', 'SCHEDULED', 0],
  ['S71004', 'S7 Airlines', 'LED', 'SVO', '2026-12-02T11:00:00.000Z', 'SCHEDULED', 0],
  ['S71005', 'S7 Airlines', 'KZN', 'LED', '2026-12-02T13:00:00.000Z', 'SCHEDULED', 0],
  ['S71006', 'S7 Airlines', 'LED', 'KZN', '2026-12-02T15:00:00.000Z', 'SCHEDULED', 0],
  ['S71007', 'S7 Airlines', 'SVO', 'KZN', '2026-12-02T17:00:00.000Z', 'SCHEDULED', 0],

  // Уральские авиалинии — 3 декабря
  ['U61001', 'Уральские авиалинии', 'SVO', 'KZN', '2026-12-03T05:00:00.000Z', 'DEPARTED', 390],
  ['U61002', 'Уральские авиалинии', 'KZN', 'SVO', '2026-12-03T07:00:00.000Z', 'SCHEDULED', 0],
  ['U61003', 'Уральские авиалинии', 'SVO', 'LED', '2026-12-03T09:00:00.000Z', 'SCHEDULED', 0],
  ['U61004', 'Уральские авиалинии', 'LED', 'SVO', '2026-12-03T11:00:00.000Z', 'SCHEDULED', 0],
  ['U61005', 'Уральские авиалинии', 'KZN', 'LED', '2026-12-03T13:00:00.000Z', 'SCHEDULED', 0],
  ['U61006', 'Уральские авиалинии', 'LED', 'KZN', '2026-12-03T15:00:00.000Z', 'SCHEDULED', 0],
  ['U61007', 'Уральские авиалинии', 'SVO', 'KZN', '2026-12-03T17:00:00.000Z', 'SCHEDULED', 0]
];

export const DEMO_FLIGHTS = rows.map((row, index) => {
  const [flightNumber, airline, origin, destination, scheduledDeparture, status, delayMinutes] = row;
  const actualDeparture = delayMinutes > 0
    ? new Date(new Date(scheduledDeparture).getTime() + delayMinutes * 60000).toISOString()
    : status === 'DEPARTED' ? scheduledDeparture : null;
  return {
    id: `demo-${index + 1}`, flightNumber, airline,
    airlineCode: flightNumber.match(/^[A-Z0-9]+/)[0],
    origin, destination, scheduledDeparture, actualDeparture, status, delayMinutes,
    delayReason: delayMinutes > 0 ? 'Задержка рейса (демонстрационные данные)' : '—',
    passengerCount: 15, date: scheduledDeparture.slice(0, 10)
  };
});
