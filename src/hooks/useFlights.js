import { useCallback, useEffect, useState } from 'react';
import { fetchFlights, sendFlightCommand } from '../services/airportService';

export function useFlights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingId, setPendingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFlights();
      setFlights(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const runCommand = useCallback(async (flightId, commandKey) => {
    setPendingId(flightId);
    setError(null);
    try {
      const { flight } = await sendFlightCommand(flightId, commandKey);
      setFlights((prev) => prev.map((f) => (f.id === flight.id ? flight : f)));
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message };
    } finally {
      setPendingId(null);
    }
  }, []);

  return { flights, loading, error, pendingId, reload: load, runCommand };
}