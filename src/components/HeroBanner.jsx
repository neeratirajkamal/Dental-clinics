import React, { memo } from 'react';
import { Calendar, Plus } from 'lucide-react';

export const HeroBanner = memo(({ title, subtitle, onBook, buttonText = "Book Appointment", backgroundImageUrl }) => (
    <div
        className="hero-banner card glass"
        style={{
            ...(backgroundImageUrl ? {
                backgroundImage: `url('${backgroundImageUrl}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            } : {}),
            willChange: 'opacity, transform'
        }}
    >
        <div className="hero-overlay"></div>
        <div className="hero-content">
            <h1>{title}</h1>
            <p>{subtitle}</p>
            {onBook && (
                <button className="btn-primary pulse" onClick={onBook}>
                    <Plus size={18} />
                    <span>{buttonText}</span>
                </button>
            )}
        </div>
    </div>
));

// CSS should be added in index.css for .hero-banner and .hero-content
