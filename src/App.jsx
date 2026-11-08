import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import FlightsPage from './components/FlightsPage';
import FlightPage from './components/FlightPage';
import ReportsPage from './components/ReportsPage';
import ReportDetailPage from './components/ReportDetailPage';
import { isMockMode, loadFlights, saveFlight, loadReportList, loadFlightReport } from './services/api';

function readRoute() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (!parts.length) return { page: 'flights' };
  if (parts[0] === 'flights' && parts[1]) return { page: 'flight', id: decodeURIComponent(parts[1]) };
  if (parts[0] === 'reports' && parts[1]) return { page: 'report', id: decodeURIComponent(parts[1]) };
  if (parts[0] === 'reports') return { page: 'reports' };
  return { page: 'flights' };
}

export default function App() {
  const [route, setRoute] = useState(readRoute);
  const [flights, setFlights] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportDetail, setReportDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportError, setReportError] = useState('');

  const navigate = path => {
    window.history.pushState({}, '', path);
    setRoute(readRoute());
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const onPop = () => { setRoute(readRoute()); window.scrollTo(0, 0); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const refreshFlights = async () => {
    setLoading(true); setError('');
    try { setFlights(await loadFlights()); }
    catch (e) { setError(e.message || 'Не удалось загрузить рейсы'); }
    finally { setLoading(false); }
  };

  const refreshReports = async () => {
    setReportsLoading(true); setReportError('');
    try { setReports(await loadReportList()); }
    catch (e) { setReportError(e.message || 'Не удалось загрузить отчёты'); }
    finally { setReportsLoading(false); }
  };

  useEffect(() => { refreshFlights(); }, []);
  useEffect(() => { if (route.page === 'reports') refreshReports(); }, [route.page]);

  const activeFlight = flights.find(f => String(f.id) === String(route.id));
  const activeReport = reports.find(r => String(r.flightId ?? r.flight?.id ?? r.id) === String(route.id));

  useEffect(() => {
    let alive = true;
    if (route.page !== 'report') { setReportDetail(null); return; }
    if (isMockMode()) { setReportDetail(null); return; }
    setReportError('');
    loadFlightReport(route.id).then(data => { if (alive) setReportDetail(data); })
      .catch(e => { if (alive) setReportError(e.message || 'Не удалось загрузить отчёт'); });
    return () => { alive = false; };
  }, [route.page, route.id]);

  const save = async updated => {
    await saveFlight(updated);
    setFlights(prev => prev.map(f => f.id === updated.id ? updated : f));
  };

  let active = route.page === 'reports' || route.page === 'report' ? 'reports' : 'flights';
  let breadcrumbs = [{ label: 'SkyFood Airport', path: '/' }];
  if (route.page === 'flights') breadcrumbs.push({ label: 'Рейсы' });
  if (route.page === 'flight') breadcrumbs.push({ label: 'Рейсы', path: '/flights' }, { label: activeFlight?.flightNumber || 'Карточка рейса' });
  if (route.page === 'reports') breadcrumbs.push({ label: 'Отчёты' });
  if (route.page === 'report') breadcrumbs.push({ label: 'Отчёты', path: '/reports' }, { label: `Отчёт ${activeReport?.flightNumber || route.id}` });

  const renderedBreadcrumbs = breadcrumbs.map(c => ({ label: c.label, onClick: c.path ? () => navigate(c.path) : null }));

  return <Layout active={active} breadcrumbs={renderedBreadcrumbs} onNavigate={navigate} testMode={isMockMode()}>
    {route.page === 'flights' && <>{loading ? <div className="loading-state">Загрузка рейсов…</div> : error ? <div className="error-message">{error}<button onClick={refreshFlights}>Повторить</button></div> : <FlightsPage flights={flights} onOpen={f => navigate(`/flights/${encodeURIComponent(f.id)}`)} onRefresh={refreshFlights}/>}</>}
    {route.page === 'flight' && (activeFlight ? <FlightPage flight={activeFlight} onBack={() => navigate('/flights')} onSave={save}/> : <div className="loading-state">Рейс не найден. <button className="open-link" onClick={() => navigate('/flights')}>Вернуться к рейсам</button></div>)}
    {route.page === 'reports' && <ReportsPage reports={reports} loading={reportsLoading} error={reportError} onRefresh={refreshReports} onOpen={r => navigate(`/reports/${encodeURIComponent(r.flightId ?? r.flight?.id ?? r.id)}`)}/>}
    {route.page === 'report' && (reportDetail || activeReport ? <ReportDetailPage report={reportDetail || activeReport} onBack={() => navigate('/reports')}/> : reportError ? <div className="error-message">{reportError}</div> : <div className="loading-state">Загрузка отчёта… <button className="open-link" onClick={() => navigate('/reports')}>Назад к отчётам</button></div>)}
  </Layout>;
}