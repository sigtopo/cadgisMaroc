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
    const scriptId = 'paypal-sdk-script';
    const containerId = '#paypal-container-8ULPDGTMY73CQ';
    
    const initPayPal = () => {
      if (window.paypal && window.paypal.HostedButtons) {
        const container = document.querySelector(containerId);
        if (container) container.innerHTML = '';
        window.paypal.HostedButtons({ hostedButtonId: "8ULPDGTMY73CQ" }).render(containerId);
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
    <div className="payment-page-root bg-[#f8fafc] min-h-screen pb-12 overflow-y-auto">
      <style>{`
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
        }
        .payment-card { 
          width: 92%; max-width: 780px; margin: 30px auto; background: #fff; 
          border-radius: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.06); 
          overflow: hidden; border: 1px solid rgba(0,0,0,0.02);
        }
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
        .cih-tiny { height: 28px !important; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        @media (max-width: 640px) {
          .bank-grid { grid-template-columns: repeat(3, 1fr); gap: 10px; }
        }
      `}</style>

      <header className="site-header">
        <div className="logo-box">
          <img 
            src="https://www.esrifrance.fr/content/dam/distributor-share/esrifrance-fr/produits/en-savoir-plus/produits-apps/arcgis-for-autocad/vue-d%27ensemble/arcgis-for-autocad-220.png" 
            alt="Logo" className="w-full h-full object-cover p-1"
          />
        </div>
        <h1 className="text-2xl font-black mb-1">CadGIS Morocco</h1>
        <p className="text-sm opacity-80">Titres fonciers | Bornes | Zonage | Limites ADM</p>
      </header>

      <div className="payment-card animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="p-8 md:p-10 text-center">
          <div className="text-left mb-5">
            <button onClick={handleReturn} className="bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#dcfce7] transition-all shadow-sm">
              <i className="fas fa-chevron-left"></i> Retour à la carte
            </button>
          </div>

          <div className="bank-grid">
            <img src="https://wraqi.ma/ui/Images/PaymentCashLogo/tashilat_logo.png" className="max-h-8 w-full object-contain" alt="Tashilat" />
            <img src="https://wraqi.ma/ui/Images/PaymentCashLogo/barid_cash_logo.png" className="max-h-8 w-full object-contain" alt="Barid Cash" />
            <img src="https://wraqi.ma/ui/Images/cash_plus_logo.jpg" className="max-h-8 w-full object-contain" alt="Cash Plus" />
            <img src="https://wraqi.ma/ui/Images/PaymentCashLogo/wafa_cash_logo.png" className="max-h-8 w-full object-contain" alt="Wafa Cash" />
            <img src="https://wraqi.ma/ui/Images/PaymentCashLogo/daman_cach_logo.png" className="max-h-8 w-full object-contain" alt="Damane Cash" />
          </div>

          <span className="arabic-banner">المبلغ الرمزي للحصول على بيانات إقليم {provinceName} : </span>
          
          <div className="price-badge">
            <i className="fas fa-wallet mr-3 opacity-30"></i> 500 DH
          </div>

          {provinceName && (
            <div className="bg-[#f0f7ff] border border-[#dbeafe] rounded-[22px] p-6 mb-10">
              <h6 className="text-blue-700 font-black uppercase mb-3 tracking-widest text-sm">
                <i className="fas fa-map-marker-alt mr-2"></i> PROVINCE : {provinceName}
              </h6>
              {downloadUrl ? (
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-12 py-3 font-bold rounded-full shadow-lg hover:bg-blue-700 transition-all inline-flex items-center gap-2">
                  <i className="fas fa-cloud-download-alt"></i> Télécharger la Base
                </a>
              ) : (
                <div className="text-slate-500 font-bold py-2 px-4 bg-white/60 rounded border border-blue-100 text-sm">
                   Base de données en cours de mise à jour.
                </div>
              )}
            </div>
          )}

          <section>
            <h2 className="section-header">Virement CIH ➜ CIH</h2>
            <div className="flex items-center justify-center mb-4 gap-3">
              <img src="https://credilibre.ma/asset/img/logo-cih.webp" className="cih-tiny" alt="CIH" />
              <i className="fas fa-arrow-right text-slate-300 mx-2"></i>
              <img src="https://credilibre.ma/asset/img/logo-cih.webp" className="cih-tiny" alt="CIH" />
            </div>
            <div className="bg-[#f8fafc] border border-slate-200 rounded-[20px] p-5 shadow-sm mb-6 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
              <div className="flex-1 pb-3 md:pb-0 md:pr-4 text-left">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Numéro de compte</span>
                <span className="text-xl font-black text-slate-800">2806724211029200</span>
              </div>
              <div className="flex-1 pt-3 md:pt-0 md:pl-4 text-left">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Bénéficiaire</span>
                <span className="text-xl font-black text-slate-800">Elmostafa JILIT</span>
              </div>
            </div>
          </section>

          <hr className="my-6 border-slate-100" />

          <section>
            <h2 className="section-header">Virement autres banques</h2>
            <div className="bg-[#f8fafc] border border-slate-200 rounded-[20px] p-6 text-left mx-auto max-w-[600px] shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2">RIB National (24 chiffres)</span>
              <div className="bg-white p-4 rounded-xl border border-blue-200 text-blue-700 font-black text-lg break-all mb-2 shadow-inner tracking-wider">
                230010280672421102920011
              </div>
              <div className="text-slate-500 text-xs text-center font-bold">Titulaire : Elmostafa JILIT</div>
            </div>
          </section>

          <div className="flex justify-center gap-4 mt-10 flex-wrap">
            <a href="https://wa.me/212668090285" target="_blank" rel="noopener noreferrer" className="bg-[#22c55e] text-white px-8 py-4 rounded-[18px] font-black flex items-center gap-3 shadow-lg hover:bg-[#16a34a] transition-all">
              <i className="fab fa-whatsapp text-2xl"></i> +212 6 68 09 02 85
            </a>
          </div>

          <div className="inline-flex items-center bg-slate-100 px-6 py-3 rounded-[18px] border border-slate-200 mt-4 gap-4">
            <i className="fas fa-at text-red-500 text-lg"></i>
            <span className="font-bold text-slate-700">jilitsig@gmail.com</span>
            <button onClick={copyEmail} className="bg-red-500 text-white px-4 py-1.5 rounded-xl text-xs font-black hover:bg-red-600 transition-colors">
              {copied ? 'Copié!' : 'Copier'}
            </button>
          </div>

          <div className="my-8 max-w-[400px] mx-auto min-h-[50px]">
            <div id="paypal-container-8ULPDGTMY73CQ"></div>
          </div>

          <p className="mt-8 text-slate-400 text-sm font-bold flex items-center justify-center gap-2">
            <i className="fas fa-shield-alt text-green-500"></i> Transaction sécurisée • Activation rapide.
          </p>

          <div className="mt-6">
            <button onClick={handleReturn} className="bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#dcfce7] transition-all shadow-sm">
              <i className="fas fa-chevron-left"></i> Retour à la carte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;