import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, Globe, Copy, Check } from 'lucide-react';

interface QRCodeModalProps {
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ onClose }) => {
  const currentUrl = window.location.href;
  const [copied, setCopied] = React.useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-6 text-center space-y-6 animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold text-blue-700 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
            <Smartphone className="w-4 h-4" /> Acceso Directo Móvil
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Escanee para Vista en Vivo (Jurado)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Utilice la cámara de su teléfono inteligente para acceder instantáneamente a la plataforma durante la exposición oral.
          </p>
        </div>

        {/* QR Code Graphic Container */}
        <div className="bg-gradient-to-br from-blue-50 to-amber-50 p-6 rounded-2xl border border-slate-200 inline-block shadow-inner mx-auto">
          <QRCodeSVG
            value={currentUrl}
            size={200}
            bgColor={"#ffffff"}
            fgColor={"#002868"}
            level={"H"}
            includeMargin={true}
          />
        </div>

        {/* Copy Link Action */}
        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200 text-xs font-mono">
          <Globe className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          <span className="truncate flex-1 text-left text-slate-700">{currentUrl}</span>
          <button
            onClick={copyLink}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold rounded-lg transition-colors shrink-0 flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
