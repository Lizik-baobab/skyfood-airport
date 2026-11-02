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
        ? { message: 'Команда успешно выполнена', type: 'success' }
        : { message: res.message, type: 'error' }
    );
  };

  const handleReset = async () => {
    await resetFlights();
    reload();
    setToast({ message: 'Данные сброшены к исходным', type: 'success' });
  };

  return (
    <div className="skyfood-admin">
      <header className="admin-header">
        <div className="admin-logo">
          <span className="logo-icon">✈</span> SKYFOOD
          <span className="logo-sub">Панель авиакомпании</span>
        </div>
        <div className="admin-actions">
          <button className="btn-secondary" onClick={reload} disabled={loading}>
            Обновить данные
          </button>
          <button className="btn-primary" onClick={handleReset} disabled={loading}>
            Сбросить всё
          </button>
        </div>
      </header>

      <main className="admin-main">
        {loading && <div className="loading-state">Загрузка рейсов...</div>}
        {error && !loading && <div className="error-state">{error}</div>}
        {!loading && !error && (
          <FlightTable flights={flights} pendingId={pendingId} onCommand={handleCommand} />
        )}
      </main>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}