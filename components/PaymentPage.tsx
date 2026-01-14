import React, { useState, useEffect } from 'react';
import { DOWNLOAD_LINKS } from '../constants';

interface PaymentPageProps {
  provinceName: string | null;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ provinceName }) => {
  const downloadUrl = provinceName ? DOWNLOAD_LINKS[provinceName.toUpperCase()] : null;
  const [copied, setCopied] = useState(false);

  const displayTitle = provinceName 
    ? `Données Topographiques – Province de ${provinceName}` 
    : "télécharger données topographique Maroc ©";

  useEffect(() => {
    document.title = displayTitle;
    return () => {
      document.title = "télécharger données topographique Maroc ©";
    };
  }, [displayTitle]);

  const copyEmail = () => {
    navigator.clipboard.writeText("jilitsig@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReturn = () => {
    window.location.href = '/';
  };

  return (
    <div className="payment-page-root bg-[#f8fafc] min-h-screen pb-12">
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
      <style>{`
        .payment-page-root { font-family: 'Inter', sans-serif; }
        .site-header {
          background: linear-gradient(135deg, #d97706, #1e40af);
          padding: 2rem 1rem; color: white; text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .logo-box {
          background: white;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          overflow: hidden;
        }
        .payment-card { 
          width: 92%; max-width: 780px; margin: -20px auto 30px; background: #fff; 
          border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); 
          padding: 30px;
        }
        .price-badge {
          display: inline-block; background: #fffbeb; color: #92400e; 
          border: 1px solid #fde68a; padding: 10px 25px; border-radius: 50px; 
          font-weight: 800; font-size: 1.2rem; margin: 20px 0;
        }
        .info-card {
          background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 15px;
          padding: 15px; margin-bottom: 20px; text-align: left;
        }
        .back-nav-btn {
          background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0;
          padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer;
        }
      `}</style>

      <header className="site-header">
        <div className="logo-box">
          <img 
            src="https://p7.hiclipart.com/preview/838/297/128/computer-icons-check-mark-cross-clip-art-x-thumbnail.jpg" 
            alt="Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="h4 font-weight-bold uppercase">{displayTitle}</h1>
      </header>

      <div className="payment-card">
        <div className="text-left mb-4">
          <button onClick={handleReturn} className="back-nav-btn">Retour à la carte</button>
        </div>

        <h5 className="font-weight-bold text-primary mb-3">Virement Bancaire</h5>
        <div className="price-badge">500 DH</div>

        <div className="info-card">
          <small className="text-muted d-block uppercase font-weight-bold">Numéro de compte (CIH)</small>
          <div className="h5 font-weight-bold text-dark">2806724211029200</div>
          <small className="text-muted d-block uppercase font-weight-bold mt-2">Bénéficiaire</small>
          <div className="h6 font-weight-bold">Elmostafa JILIT</div>
        </div>

        <div className="info-card">
          <small className="text-muted d-block uppercase font-weight-bold">RIB National (24 chiffres)</small>
          <div className="font-weight-bold text-primary text-break" style={{fontSize: '1rem'}}>
            230010280672421102920011
          </div>
        </div>

        <div className="mt-4">
          <p className="small text-muted mb-3">Veuillez envoyer le reçu sur WhatsApp pour activer le téléchargement.</p>
          <a href="https://wa.me/212668090285" target="_blank" className="btn btn-success btn-block py-3 font-weight-bold rounded-pill">
            <i className="fab fa-whatsapp mr-2"></i> Envoyer sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;