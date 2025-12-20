import React, { memo } from 'react';
import { CheckCircle } from 'lucide-react';

export const StatCard = memo(({ icon, label, value }) => {
    const Icon = icon;
    return (
        <div className="stat-card card glass">
            <div className="stat-icon-bg">
                <Icon size={24} color="var(--primary)" />
            </div>
            <div className="stat-info">
                <span className="label">{label}</span>
                <h3 className="value">{value}</h3>
            </div>
        </div>
    );
});

// CSS classes .stat-card, .stat-icon-bg, .stat-info should be defined in index.css
