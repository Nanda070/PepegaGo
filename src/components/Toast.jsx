import { CheckCircle2, AlertCircle, Bell } from 'lucide-react';

export default function ToastContainer({ toasts }) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none w-[90%] max-w-sm">
      {toasts.map(toast => (
        <div key={toast.id} className="animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto">
          <div className={`rounded-2xl p-3 shadow-2xl border flex items-start gap-3 backdrop-blur-xl ${
            toast.type === 'success' ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900 shadow-emerald-500/20' :
            toast.type === 'error' ? 'bg-red-50/95 border-red-200 text-red-900 shadow-red-500/20' :
            'bg-white/95 border-slate-200 text-slate-900 shadow-slate-500/20'
          }`}>
            <div className="mt-0.5 flex-shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
              {toast.type === 'info' && <Bell className="w-5 h-5 text-blue-500" />}
            </div>
            <div className="flex-1 text-sm font-bold leading-tight">
              {toast.message}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
