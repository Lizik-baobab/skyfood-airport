import { useState } from 'react';
import { useFlights } from './hooks/useFlights';
import { resetFlights } from './services/airportService';
import FlightTable from './components/FlightTable';
import Toast from './components/Toast';

export default function App() {
  const { flights, loading, error, pendingId, reload, runCommand } = useFlights();
  const [toast, setToast] = useState(null);

  const handleCommand = async (id, commandKey) => {
    const res = await runCommand(id, commandKey);
    setToast(
      res.ok
        ? { message: 'Команда выполнена', type: 'success' }
        : { message: res.message, type: 'error' }
    );
  };

  const handleReset = async () => {
    await resetFlights();
    reload();
    setToast({ message: 'Данные сброшены', type: 'success' });
  };

  return (
    <main className="app">
      <header className="app__header">
        <h1>SkyFood — эмулятор аэропортовой системы</h1>
        <div className="app__actions">
          <button onClick={reload} disabled={loading}>Обновить список</button>
          <button className="btn--ghost" onClick={handleReset} disabled={loading}>
            Сбросить данные
          </button>
        </div>
      </header>

      {loading && <p className="hint">Загрузка…</p>}
      {error && !loading && <p className="error">{error}</p>}
      {!loading && !error && (
        <FlightTable flights={flights} pendingId={pendingId} onCommand={handleCommand} />
      )}

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </main>
  );
}