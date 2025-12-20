import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <div className="about-page">
            <div className="container">
                <button onClick={() => navigate('/')} className="back-btn">
                    <ChevronLeft size={20} /> Back to Home
                </button>

                <div className="content-card animate-fade-in">
                    <h1>About Our Clinic</h1>
                    <div className="text-content">
                        <p>
                            A dental clinic is a healthcare facility that provides comprehensive oral care services to patients of all age groups.
                            It focuses on the prevention, diagnosis, and treatment of dental and oral health issues such as tooth decay, gum diseases,
                            misalignment, and cosmetic concerns.
                        </p>
                        <p>
                            Modern dental clinics are equipped with advanced technology and experienced dental professionals to ensure safe,
                            painless, and effective treatments. Services usually include routine checkups, cleanings, fillings, root canal treatments,
                            extractions, orthodontics, and cosmetic dentistry.
                        </p>
                        <p>
                            A well-organized dental clinic prioritizes patient comfort, hygiene, and timely care while maintaining accurate records
                            and appointment scheduling.
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
        .about-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 40px 20px;
          font-family: 'Outfit', sans-serif;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: #64748b;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 32px;
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: #0891b2;
        }

        .content-card {
          background: white;
          padding: 48px;
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        h1 {
            color: #1e293b;
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 32px;
            text-align: center;
        }

        .text-content p {
            color: #334155;
            font-size: 18px;
            line-height: 1.8;
            margin-bottom: 24px;
        }

        .text-content p:last-child {
            margin-bottom: 0;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
            animation: fadeIn 0.6s ease-out forwards;
        }

        @media (max-width: 640px) {
            .content-card { padding: 24px; }
            h1 { font-size: 24px; }
            .text-content p { font-size: 16px; }
        }
      `}</style>
        </div>
    );
};
