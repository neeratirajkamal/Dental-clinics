import React, { useState, useEffect } from 'react';
import { Activity, MessageCircle, Calendar, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const SystemHealthMonitor = () => {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchHealth = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/system/health');
            const data = await response.json();
            setHealth(data);
        } catch (error) {
            console.error('Failed to fetch system health:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
        const interval = setInterval(fetchHealth, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, []);

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'Activity': return <Activity size={18} />;
            case 'MessageCircle': return <MessageCircle size={18} />;
            case 'Calendar': return <Calendar size={18} />;
            case 'FileText': return <FileText size={18} />;
            default: return <Activity size={18} />;
        }
    };

    if (loading) return null;

    return (
        <div className="system-health-card glass-card">
            <div className="card-header">
                <div className="title-group">
                    <Activity className="health-icon-main" size={20} />
                    <h3>Clinical Multi-Agent OS</h3>
                </div>
                <div className="status-badge-main">
                    <CheckCircle2 size={12} />
                    <span>OPERATIONAL</span>
                </div>
            </div>

            <div className="agents-grid">
                {health?.agents.map(agent => (
                    <div key={agent.id} className="agent-health-item">
                        <div className="agent-icon-wrapper">
                            {getIcon(agent.icon)}
                            <div className="dot-online" />
                        </div>
                        <div className="agent-info-mini">
                            <span className="agent-name">{agent.name}</span>
                            <span className="agent-status">{agent.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="recent-logs-section">
                <h4>Clinical Audit Trail (Agent Logs)</h4>
                <div className="logs-list">
                    {health?.logs.map((log, idx) => (
                        <div key={idx} className={`log-item ${log.level.toLowerCase()}`}>
                            <span className="log-agent">[{log.agent}]</span>
                            <span className="log-msg">{log.message}</span>
                            <span className="log-time">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .system-health-card {
                    padding: 24px;
                    background: white;
                    border-radius: 20px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
                }
                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                .title-group {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .title-group h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 800;
                    color: #0f172a;
                }
                .health-icon-main { color: #0d9488; }
                .status-badge-main {
                    background: #f0fdf4;
                    color: #10b981;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    letter-spacing: 0.5px;
                }
                .agents-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .agent-health-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: #f8fafc;
                    border-radius: 12px;
                }
                .agent-icon-wrapper {
                    position: relative;
                    width: 36px;
                    height: 36px;
                    background: white;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .dot-online {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 8px;
                    height: 8px;
                    background: #10b981;
                    border-radius: 50%;
                    border: 2px solid white;
                }
                .agent-info-mini {
                    display: flex;
                    flex-direction: column;
                }
                .agent-name {
                    font-size: 12px;
                    font-weight: 700;
                    color: #1e293b;
                }
                .agent-status {
                    font-size: 10px;
                    color: #94a3b8;
                    font-weight: 600;
                }
                .recent-logs-section h4 {
                    font-size: 11px;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    margin: 0 0 12px 0;
                    letter-spacing: 0.5px;
                }
                .logs-list {
                    background: #1e293b;
                    border-radius: 12px;
                    padding: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    max-height: 150px;
                    overflow-y: auto;
                }
                .log-item {
                    display: flex;
                    gap: 8px;
                    font-family: 'Courier New', monospace;
                    font-size: 10px;
                    line-height: 1.4;
                }
                .log-agent { color: #38bdf8; font-weight: 700; }
                .log-msg { color: #e2e8f0; flex: 1; }
                .log-time { color: #64748b; }
                .log-item.error .log-msg { color: #f87171; }
                .log-item.critical .log-msg { color: #ef4444; font-weight: 800; }
            `}} />
        </div>
    );
};
