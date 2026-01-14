import React, { useState, useEffect } from 'react';
import { DOWNLOAD_LINKS } from '../constants';

declare global {
  interface Window {
    paypal: any;
  }
}

interface PaymentPageProps {
  provinceName: string | null;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ provinceName }) => {
  const downloadUrl = provinceName ? DOWNLOAD_LINKS[provinceName.toUpperCase()] : null;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // PayPal SDK Integration
    const scriptId = 'paypal-sdk-script';
    const containerId = '#paypal-container-8ULPDGTMY73CQ';
    
    const initPayPal = () => {
      if (window.paypal && window.paypal.HostedButtons) {
        // Clear container first if it was already rendered to prevent duplicates
        const container = document.querySelector(containerId);
        if (container) container.innerHTML = '';
        
        window.paypal.HostedButtons({
          hostedButtonId: "8ULPDGTMY73CQ"
        }).render(containerId);
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://www.paypal.com/sdk/js?client-id=BAA-timiw8NiQJrO_f0A46X1-Ad8umypNF8c0gKUHHbr3qqXUzVLrXHZQJ6yAfE-1PYalzZjPPKP_fxje8&components=hosted-buttons&disable-funding=venmo&currency=EUR";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = initPayPal;
      document.body.appendChild(script);
    } else {
      initPayPal();
    }
  }, []);

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
      {/* External CSS Dependencies */}
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700,900&display=swap" rel="stylesheet" />

      <style>{`
        .payment-page-root { font-family: 'Roboto', sans-serif; }
        
        .site-header {
          background: linear-gradient(135deg, #d97706, #1e40af);
          padding: 2rem;
          color: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .logo-box {
          background: white;
          width: 55px;
          height: 55px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          overflow: hidden;
          padding: 0;
        }

        .payment-card { 
          width: 92%; max-width: 780px; margin: 30px auto; background: #fff; 
          border-radius: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.06); 
          overflow: hidden; border: 1px solid rgba(0,0,0,0.02);
        }
        
        .payment-body { padding: 40px 30px; text-align: center; }

        .arabic-banner {
          font-size: 1.5rem; font-weight: 900; color: #1e40af; 
          margin-bottom: 20px; direction: rtl; display: block;
          background: linear-gradient(to left, #1e40af, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .bank-grid { 
          display: grid; grid-template-columns: repeat(5, 1fr); 
          gap: 15px; margin: 10px auto 25px; max-width: 550px; 
          align-items: center;
        }
        .bank-grid img { 
          max-height: 35px; width: 100%; object-fit: contain; 
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05));
          transition: transform 0.3s;
        }
        .bank-grid img:hover { transform: scale(1.1); }

        .price-badge {
          display: inline-flex; align-items: center; background: #fffbeb; color: #92400e; 
          border: 1px solid #fde68a; padding: 10px 30px; border-radius: 50px; 
          font-weight: 900; font-size: 1.35rem; box-shadow: 0 8px 15px rgba(251, 191, 36, 0.12);
          margin-bottom: 30px;
        }

        .section-header { 
          font-weight: 900; color: #0f172a; margin: 45px 0 20px; 
          font-size: 1.05rem; text-transform: uppercase; letter-spacing: 2px;
          position: relative; display: inline-block; padding-bottom: 12px;
        }
        .section-header::after {
          content: ''; position: absolute; bottom: 0; left: 25%; width: 50%; height: 3px; background: #3b82f6; border-radius: 10px;
        }

        .info-card {
          background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px;
          padding: 22px; margin-bottom: 25px;
        }
        .info-card .label { font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 4px; }
        .info-card .value { font-size: 1.2rem; font-weight: 900; color: #1e293b; letter-spacing: 0.5px; }

        .contact-group { display: flex; justify-content: center; gap: 15px; margin-top: 40px; flex-wrap: wrap; }
        .btn-whatsapp {
          background: #22c55e; color: white !important; padding: 15px 30px; border-radius: 18px;
          font-weight: 800; text-decoration: none !important; transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(34,197,94,0.2); display: inline-flex; align-items: center; gap: 10px;
        }
        .btn-whatsapp:hover { background: #16a34a; transform: translateY(-3px); box-shadow: 0 8px 25px rgba(34,197,94,0.3); }
        
        .email-card {
          display: inline-flex; align-items: center; background: #f1f5f9; padding: 12px 24px; 
          border-radius: 18px; border: 1px solid #e2e8f0; margin-top: 15px;
        }
        .copy-btn { 
          background: #ef4444; color: white; border: none; padding: 6px 14px; 
          border-radius: 10px; font-size: 0.8rem; font-weight: 700; margin-left: 15px; transition: 0.2s;
        }
        .copy-btn:hover { background: #dc2626; }

        .status-panel {
          background: #f0f7ff; border: 1px solid #dbeafe; border-radius: 22px; padding: 25px; margin-bottom: 40px;
        }

        .back-nav-btn {
          background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0;
          padding: 12px 30px; border-radius: 16px; font-weight: 700; font-size: 0.95rem; transition: 0.3s;
          display: inline-flex; align-items: center; gap: 10px; cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .back-nav-btn:hover { 
          background: #dcfce7; 
          color: #14532d; 
          border-color: #86efac; 
          transform: translateX(-5px); 
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .cih-tiny { height: 28px !important; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

        .paypal-wrapper {
          margin: 30px auto;
          max-width: 400px;
          min-height: 50px;
        }

        @media (max-width: 640px) {
          .bank-grid { grid-template-columns: repeat(3, 1fr); gap: 10px; }
          .payment-body { padding: 30px 15px; }
          .btn-whatsapp { width: 100%; justify-content: center; }
        }
      `}</style>

      <header className="site-header">
        <div className="logo-box">
          <img 
            src="https://www.esrifrance.fr/content/dam/distributor-share/esrifrance-fr/produits/en-savoir-plus/produits-apps/arcgis-for-autocad/vue-d%27ensemble/arcgis-for-autocad-220.png" 
            alt="Logo" 
            className="w-full h-full object-cover p-1"
          />
        </div>
        <h1 className="h4 mb-1 font-weight-bold">CadGIS Morocco</h1>
        <p className="small mb-0 opacity-80">Titres fonciers | Bornes | Zonage | Limites ADM</p>
      </header>

      <div className="payment-card animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="payment-body">
          <div className="text-left mb-5">
            <button onClick={handleReturn} className="back-nav-btn">
              <i className="fas fa-chevron-left"></i>
              <span>Retour à la carte</span>
            </button>
          </div>

          <div className="bank-grid">
            <img src="https://wraqi.ma/ui/Images/PaymentCashLogo/tashilat_logo.png" alt="Tashilat" />
            <img src="https://wraqi.ma/ui/Images/PaymentCashLogo/barid_cash_logo.png" alt="Barid Cash" />
            <img src="https://wraqi.ma/ui/Images/cash_plus_logo.jpg" alt="Cash Plus" />
            <img src="https://wraqi.ma/ui/Images/PaymentCashLogo/wafa_cash_logo.png" alt="Wafa Cash" />
            <img src="https://wraqi.ma/ui/Images/PaymentCashLogo/daman_cach_logo.png" alt="Damane Cash" />
          </div>

          <span className="arabic-banner">المبلغ الرمزي للحصول على بيانات إقليم {provinceName} : </span>
          
          <div className="price-badge">
            <i className="fas fa-wallet mr-3 opacity-30"></i> 500 DH
          </div>

          {provinceName && (
            <div className="status-panel">
              <h6 className="text-primary font-weight-bold text-uppercase mb-3 tracking-widest">
                <i className="fas fa-map-marker-alt mr-2"></i> PROVINCE : {provinceName}
              </h6>
              {downloadUrl ? (
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary px-5 py-2 font-weight-bold rounded-pill shadow-sm">
                  <i className="fas fa-cloud-download-alt mr-2"></i> Télécharger la Base
                </a>
              ) : (
                <div className="text-muted font-weight-bold py-2 px-3 bg-white/60 rounded border border-blue-100">
                   Base de données en cours de mise à jour pour cette zone.
                </div>
              )}
            </div>
          )}

          <section>
            <h2 className="section-header">Virement CIH ➜ CIH</h2>
            <div className="d-flex align-items-center justify-content-center mb-4 gap-3">
              <img src="https://credilibre.ma/asset/img/logo-cih.webp" className="cih-tiny" alt="CIH" />
              <i className="fas fa-arrow-right text-muted opacity-30 mx-2"></i>
              <img src="https://credilibre.ma/asset/img/logo-cih.webp" className="cih-tiny" alt="CIH" />
            </div>
            <div className="info-card shadow-sm">
              <div className="row">
                <div className="col-md-7 border-right mb-3 mb-md-0">
                  <span className="label">Numéro de compte</span>
                  <span className="value">2806724211029200</span>
                </div>
                <div className="col-md-5">
                  <span className="label">Bénéficiaire</span>
                  <span className="value">Elmostafa JILIT</span>
                </div>
              </div>
            </div>
          </section>

          <hr className="my-2 opacity-10" />

          <section>
            <h2 className="section-header">Virement depuis autres banques</h2>
            <div className="mb-4">
              <img src="https://topox.ma/other-bank.png" height="20" className="opacity-80" alt="Bank Logo" />
            </div>
            <div className="info-card text-left mx-auto" style={{maxWidth: '600px'}}>
              <span className="label">RIB National (24 chiffres)</span>
              <div className="bg-white p-3 rounded-xl border border-blue-200 text-primary font-weight-bold text-break mb-2 shadow-sm" style={{fontSize: '1.2rem', letterSpacing: '0.8px'}}>
                230010280672421102920011
              </div>
              <div className="text-muted small text-center">Titulaire : <strong>Elmostafa JILIT</strong></div>
            </div>
          </section>

          <div className="contact-group">
            <a href="https://wa.me/212668090285" target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <i className="fab fa-whatsapp fa-xl"></i>
              <span>+212 6 68 09 02 85</span>
            </a>
          </div>

          <div className="email-card">
            <i className="fas fa-at text-danger mr-3"></i>
            <span className="font-weight-bold text-dark">jilitsig@gmail.com</span>
            <button onClick={copyEmail} className="copy-btn">
              {copied ? 'Copié!' : 'Copier'}
            </button>
          </div>

          {/* PayPal Hosted Button Integration */}
          <div className="paypal-wrapper">
            <div id="paypal-container-8ULPDGTMY73CQ"></div>
          </div>

          <p className="mt-5 text-muted small">
            <i className="fas fa-shield-alt text-success mr-1"></i> Transaction sécurisée • Activation rapide.
          </p>

          <div className="mt-4">
            <button onClick={handleReturn} className="back-nav-btn">
              <i className="fas fa-chevron-left"></i>
              <span>Retour à la carte</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;