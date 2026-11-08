export default function Layout({ active, breadcrumbs, children, onNavigate, testMode = true }) {
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-name">SkyFood</div>
        <div className="brand-subtitle">AIRPORT SIMULATOR</div>
      </div>
      <div className="sidebar-divider" />
      <div className="sidebar-caption">РАБОЧЕЕ ПРОСТРАНСТВО</div>
      <nav className="sidebar-nav">
        <button className={active === 'flights' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('/flights')}><span className="nav-symbol">✈</span>Рейсы</button>
        <button className={active === 'reports' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('/reports')}><span className="nav-symbol">▤</span>Отчёты</button>
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-footer-line" />
        <div className="sidebar-footer-title">SkyFood Airport</div>
        <div className="sidebar-footer-sub">Панель управления аэропортом</div>
      </div>
    </aside>
    <main className="main-area">
      <header className="topbar">
        <div className="breadcrumbs">{breadcrumbs.map((crumb, i) => <span key={i} className={i === breadcrumbs.length - 1 ? 'crumb current' : 'crumb'}>{i > 0 && <span className="crumb-separator">/</span>}{crumb.onClick ? <button className="breadcrumb-button" onClick={crumb.onClick}>{crumb.label}</button> : crumb.label}</span>)}</div>
        <div className="topbar-meta">
          {testMode && <span className="test-badge">ТЕСТОВЫЙ РЕЖИМ</span>}
          <span className="timezone">UTC+3</span>
        </div>
      </header>
      <div className="page-content">{children}</div>
    </main>
  </div>;
}