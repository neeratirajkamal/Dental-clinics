import { ShoppingBag, ChevronRight, Star, Clock, ShieldCheck, Zap } from 'lucide-react';
import { HeroBanner } from '../components/HeroBanner';
import { api } from '../services/api';
import { useState, useEffect } from 'react';

const ServiceCard = ({ name, category, price, duration, rating, image, description }) => (
    <div className="service-vignette glass-card hover-lift animate-pop">
        <div className="vignette-image-container">
            <div
                className="vignette-image"
                style={{ backgroundImage: `url('${image}')` }}
            ></div>
            <div className="vignette-badge">{category}</div>
        </div>

        <div className="vignette-content">
            <div className="vignette-header">
                <h3>{name}</h3>
                <div className="vignette-rating">
                    <Star size={12} fill="var(--accent)" color="var(--accent)" />
                    <span>{rating}</span>
                </div>
            </div>

            <p className="vignette-desc">{description}</p>

            <div className="vignette-meta">
                <div className="meta-item">
                    <Clock size={14} />
                    <span>{duration}</span>
                </div>
                <div className="meta-item">
                    <ShieldCheck size={14} />
                    <span>Certified</span>
                </div>
            </div>

            <div className="vignette-footer">
                <div className="vignette-price">
                    <span className="currency">$</span>
                    <span className="amount">{price}</span>
                </div>
                <button className="book-service-btn" onClick={() => window.location.href = '/book'}>
                    <span>Book Now</span>
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    </div>
);

export const ClinicalServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await api.getServices();
                setServices(data);
            } catch (err) {
                console.error("Failed to fetch services", err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="clinical-services-page">
            <div
                className="dashboard-bg-overlay"
                style={{ backgroundImage: `url('/assets/images/dental-hero-3.jpg')` }}
            ></div>

            <HeroBanner
                title="Clinical Excellence Catalog"
                subtitle="Browse our high-end dental treatments and aesthetic procedures."
                backgroundImages={[
                    "/assets/images/dental-hero-3.jpg",
                    "/assets/images/dental-hero-4.jpg"
                ]}
            />

            <div className="services-content-area">
                <div className="catalog-header glass-card">
                    <div className="header-icon">
                        <ShoppingBag size={24} className="text-primary" />
                    </div>
                    <div className="header-info">
                        <h2>Luxury Care Portfolio</h2>
                        <p>Select a treatment to view clinical details and book your session.</p>
                    </div>
                    <div className="header-search hide-mobile">
                        <input type="text" placeholder="Search treatments..." className="glass-input" />
                    </div>
                </div>

                <div className="services-grid">
                    {loading ? (
                        <div className="loading-state">
                            <Zap className="animate-pulse" size={48} />
                            <p>Loading Clinical Catalog...</p>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="empty-state">
                            <p>No services found in our catalog.</p>
                        </div>
                    ) : (
                        services.map(service => (
                            <ServiceCard key={service.id} {...service} />
                        ))
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .clinical-services-page { display: flex; flex-direction: column; gap: 32px; width: 100%; position: relative; }
        .services-content-area { display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px; }
        
        .catalog-header { display: flex; align-items: center; gap: 20px; padding: 24px; }
        .header-icon { width: 48px; height: 48px; background: rgba(13, 148, 136, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .header-info h2 { font-size: 20px; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
        .header-info p { font-size: 14px; color: var(--text-muted); }
        .header-search { margin-left: auto; width: 250px; }
        .glass-input { width: 100%; padding: 10px 16px; background: rgba(255,255,255,0.5); border: 1px solid var(--glass-border); border-radius: 10px; font-size: 14px; outline: none; transition: border 0.2s; }
        .glass-input:focus { border-color: var(--primary); }

        .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        
        .service-vignette { display: flex; flex-direction: column; overflow: hidden; border-radius: 20px; background: white; }
        .vignette-image-container { position: relative; height: 180px; width: 100%; overflow: hidden; }
        .vignette-image { height: 100%; width: 100%; background-size: cover; background-position: center; transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .service-vignette:hover .vignette-image { transform: scale(1.1); }
        .vignette-badge { position: absolute; top: 12px; left: 12px; padding: 4px 10px; background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); border-radius: 20px; font-size: 11px; font-weight: 700; color: var(--primary); box-shadow: var(--shadow-sm); text-transform: uppercase; letter-spacing: 0.5px; }
        
        .vignette-content { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .vignette-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .vignette-header h3 { font-size: 17px; font-weight: 700; color: var(--text-main); }
        .vignette-rating { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; color: var(--text-main); }
        
        .vignette-desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; min-height: 40px; }
        
        .vignette-meta { display: flex; gap: 16px; padding-top: 8px; border-top: 1px solid #f1f5f9; }
        .meta-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
        
        .vignette-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
        .vignette-price { display: flex; align-items: baseline; }
        .vignette-price .currency { font-size: 14px; font-weight: 600; color: var(--primary); }
        .vignette-price .amount { font-size: 20px; font-weight: 800; color: var(--text-main); }
        
        .book-service-btn { display: flex; align-items: center; gap: 8px; background: #f1f5f9; color: var(--text-main); padding: 8px 16px; border-radius: 12px; font-weight: 700; font-size: 13px; transition: all 0.2s; }
        .book-service-btn:hover { background: var(--primary); color: white; }

        @media (max-width: 640px) {
          .catalog-header { flex-direction: column; align-items: flex-start; text-align: left; }
          .header-search { width: 100%; margin-top: 12px; }
          .services-grid { grid-template-columns: 1fr; }
        }
      `}} />
        </div>
    );
};
