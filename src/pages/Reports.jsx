import React from 'react';
import { Download, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const ReportMetric = ({ label, value, trend, isPositive }) => (
  <div className="metric-card card">
    <div className="metric-header">
      <span className="metric-label">{label}</span>
      <div className={`trend-icon ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      </div>
    </div>
    <div className="metric-body">
      <h3>{value}</h3>
      <span className={`trend-value ${isPositive ? 'positive' : 'negative'}`}>
        {trend} vs last month
      </span>
    </div>
  </div>
);

export const Reports = ({ appointments, patientsCount }) => {
  const revenue = appointments.length * 150;

  const downloadCSV = () => {
    const headers = ["ID", "Patient", "Doctor", "Time", "Type", "Status"];
    const csvRows = appointments.map(a => `${a.id},${a.patient},${a.doctor},${a.time},${a.type},${a.status}`);
    const csvContent = [headers.join(","), ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `clinic_report_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  const chartData = [
    { month: 'Current', revenue: revenue, patients: patientsCount }
  ];

  return (
    <div className="reports-page">
      <div
        className="dashboard-bg-overlay"
        style={{ backgroundImage: `url('/assets/images/dental-hero-5.jpg')` }}
      ></div>
      <div className="page-header">
        <div className="header-text">
          <h1>Clinical Reports & Analytics</h1>
          <p>Analyze performance, revenue, and demographics</p>
        </div>
        <div className="header-actions">
          <button className="date-picker glass hide-mobile">
            <Calendar size={18} />
            <span>Today</span>
          </button>
          <button className="download-btn" onClick={downloadCSV} disabled={appointments.length === 0}>
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <ReportMetric label="Net Revenue" value={`$${revenue.toLocaleString()}`} trend="+0%" isPositive={true} />
        <ReportMetric label="Total Patients" value={patientsCount.toString()} trend="+0%" isPositive={true} />
        <ReportMetric label="Appt Count" value={appointments.length.toString()} trend="+0%" isPositive={true} />
        <ReportMetric label="Avg. Order" value={`$${appointments.length > 0 ? 150 : 0}`} trend="+0%" isPositive={true} />
      </div>

      <div className="reports-charts card">
        <div className="chart-header">
          <h3>Real-time Growth</h3>
          <div className="chart-legend hide-mobile">
            <div className="legend-item"><span className="dot revenue"></span> Revenue</div>
            <div className="legend-item"><span className="dot patients"></span> Patients</div>
          </div>
        </div>
        <div className="chart-body">
          {appointments.length === 0 ? (
            <div className="empty-reports">
              <Download size={48} color="#e2e8f0" />
              <p>Add data to generate analytics.</p>
            </div>
          ) : (
            <div className="chart-container-responsive">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="patients" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .reports-page { display: flex; flex-direction: column; gap: 24px; width: 100%; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
        .date-picker { display: flex; align-items: center; gap: 10px; padding: 10px 18px; border-radius: 12px; font-size: 14px; color: var(--text-muted); }
        .download-btn { display: flex; align-items: center; gap: 8px; background: var(--primary); color: white; padding: 10px 20px; border-radius: 12px; font-weight: 600; font-size: 14px; transition: transform 0.2s; white-space: nowrap; }
        .download-btn:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; transform: none; }
        .download-btn:not(:disabled):hover { background: var(--primary-hover); transform: scale(1.02); }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; }
        .metric-card { padding: 20px; }
        .metric-header { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .metric-label { font-size: 13px; color: var(--text-muted); font-weight: 500; }
        .trend-icon { width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
        .trend-icon.positive { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .trend-icon.negative { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .metric-body h3 { font-size: 24px; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
        .trend-value { font-size: 12px; font-weight: 600; }
        .trend-value.positive { color: #10b981; }
        .trend-value.negative { color: #ef4444; }
        .reports-charts { padding: 24px; overflow: hidden; }
        .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .chart-legend { display: flex; gap: 16px; }
        .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.revenue { background: var(--primary); }
        .dot.patients { background: var(--accent); }
        .chart-body { overflow-x: auto; }
        .empty-reports { height: 350px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; color: var(--text-muted); text-align: center; }
        .hide-mobile { display: flex; }

        @media (max-width: 768px) {
          .metrics-grid { grid-template-columns: 1fr 1fr; }
          .reports-charts { padding: 16px; }
        }

        @media (max-width: 640px) {
          .page-header { flex-direction: column; align-items: flex-start; }
          .download-btn { width: 100%; justify-content: center; }
          .metrics-grid { grid-template-columns: 1fr; }
          .hide-mobile { display: none !important; }
        }
      ` }} />
    </div>
  );
};
