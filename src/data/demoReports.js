// Демонстрационные отчёты. Каждая запись заказа — отдельный пассажир
// и отдельное погашение одного ваучера. Количество товара в заказе всегда 1.
// Суммы условные и используются только для демонстрации интерфейса.

const CAFE_NAME = 'SkyFood · Кафе терминала';
const WATER_PRICE = 150;
const MEAL_PRICE = 600;

function makePassengerOrders(flightNumber, { waterUsed, mealUsed = 0 }) {
  const orders = [];

  for (let i = 1; i <= waterUsed; i += 1) {
    orders.push({
      id: `${flightNumber}-ORDER-W-${String(i).padStart(3, '0')}`,
      orderNumber: `${flightNumber}-ORDER-W-${String(i).padStart(3, '0')}`,
      passenger: `Пассажир ${String(i).padStart(3, '0')}`,
      voucherType: 'WATER',
      cafeName: CAFE_NAME,
      totalAmount: WATER_PRICE,
      items: [{ name: 'Вода', quantity: 1 }]
    });
  }

  for (let i = 1; i <= mealUsed; i += 1) {
    orders.push({
      id: `${flightNumber}-ORDER-M-${String(i).padStart(3, '0')}`,
      orderNumber: `${flightNumber}-ORDER-M-${String(i).padStart(3, '0')}`,
      passenger: `Пассажир ${String(i).padStart(3, '0')}`,
      voucherType: 'MEAL',
      cafeName: CAFE_NAME,
      totalAmount: MEAL_PRICE,
      items: [{ name: 'Питание (MEAL)', quantity: 1 }]
    });
  }

  return orders;
}

const makeReport = ({
  flightId,
  flightNumber,
  airline,
  route,
  date,
  delayMinutes,
  waterIssued,
  mealIssued,
  waterUsed,
  mealUsed = 0
}) => {
  const orders = makePassengerOrders(flightNumber, { waterUsed, mealUsed });
  const issuedVouchers = waterIssued + mealIssued;
  const usedVouchers = waterUsed + mealUsed;
  const voucherWriteOffTotal = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const unusedVoucherBalance = Math.max(0, issuedVouchers - usedVouchers) * 500;

  return {
    id: `mock-report-${flightId}`,
    flightId,
    flightNumber,
    airline,
    route,
    date,
    departureTime: date,
    passengerCount: 15,
    delayMinutes,
    status: 'FINAL',
    statusLabel: 'Демонстрационный отчёт',
    isMock: true,
    issuedVouchers,
    usedVouchers,
    waterVouchersIssued: waterIssued,
    mealVouchersIssued: mealIssued,
    waterVouchersUsed: waterUsed,
    mealVouchersUsed: mealUsed,
    voucherWriteOffTotal,
    unusedVoucherBalance,
    reimbursementAmount: voucherWriteOffTotal,
    cafes: [{
      id: `cafe-${flightId}-1`,
      name: CAFE_NAME,
      ordersCount: orders.length,
      totalAmount: voucherWriteOffTotal
    }],
    orders
  };
};

export const DEMO_REPORTS = [
  makeReport({
    flightId: 'demo-1', flightNumber: 'SU1001', airline: 'Аэрофлот',
    route: 'SVO → KZN', date: '2026-12-01 07:30', delayMinutes: 150,
    waterIssued: 15, mealIssued: 0, waterUsed: 12
  }),
  makeReport({
    flightId: 'demo-8', flightNumber: 'S71001', airline: 'S7 Airlines',
    route: 'SVO → KZN', date: '2026-12-02 09:30', delayMinutes: 270,
    waterIssued: 15, mealIssued: 15, waterUsed: 12, mealUsed: 10
  }),
  makeReport({
    flightId: 'demo-15', flightNumber: 'U61001', airline: 'Уральские авиалинии',
    route: 'SVO → KZN', date: '2026-12-03 11:30', delayMinutes: 390,
    waterIssued: 15, mealIssued: 15, waterUsed: 13, mealUsed: 12
  })
];
