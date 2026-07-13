import { useEffect, useRef, useState } from 'react';
import { XCircle, Zap } from 'lucide-react';
import { PEPEGA_TYPES, ITEMS } from '../constants';
import { playThrow } from '../utils/sounds';

export default function CatchScreen({ pepega, items, onCatch, onFlee, onUseItem, onClose }) {
  const videoRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [error, setError] = useState(null);

  const [selectedBall, setSelectedBall] = useState('pokeball');
  const [status, setStatus] = useState('idle'); // idle, throwing, shaking, caught, escaped
  const [shakeCount, setShakeCount] = useState(0);
  const [message, setMessage] = useState('');

  const typeInfo = PEPEGA_TYPES[pepega.typeId] || PEPEGA_TYPES.common;

  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setError("Не удалось получить доступ к камере.");
      }
    };
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const breakOut = () => {
    setStatus('escaped');
    setMessage('Пепега вырвался!');
    setTimeout(() => {
      if (Math.random() < 0.3) {
        setMessage('Пепега сбежал...');
        setTimeout(() => onFlee(), 1500);
      } else {
        setStatus('idle');
        setShakeCount(0);
        setMessage('');
      }
    }, 1500);
  };

  const handleThrow = () => {
    if (status !== 'idle') return;
    if (items[selectedBall] <= 0) {
      setMessage("Нет покеболов этого типа!");
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    
    onUseItem(selectedBall);
    playThrow();
    setStatus('throwing');
    
    const ballMult = ITEMS[selectedBall].catchMultiplier;
    // finalChance reduces as CP increases
    const finalChance = typeInfo.catchRate * ballMult * Math.max(0.15, (1 - pepega.cp / 4000));
    
    setTimeout(() => {
      setStatus('shaking');
      setShakeCount(1);
      setTimeout(() => {
        if (Math.random() > finalChance + 0.3) return breakOut();
        setShakeCount(2);
        setTimeout(() => {
          if (Math.random() > finalChance + 0.15) return breakOut();
          setShakeCount(3);
          setTimeout(() => {
            if (Math.random() > finalChance) return breakOut();
            setStatus('caught');
            setMessage('Пойман!');
            setTimeout(() => onCatch(), 1500);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 500); // 500ms throw animation time
  };

  const [dragStartY, setDragStartY] = useState(null);
  const handleDragStart = (e) => setDragStartY(e.touches ? e.touches[0].clientY : e.clientY);
  const handleDragEnd = (e) => {
    if (dragStartY === null) return;
    const endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    if (dragStartY - endY > 80) handleThrow();
    setDragStartY(null);
  };

  const ballColor = ITEMS[selectedBall].color;

  return (
    <div className="absolute inset-0 bg-slate-900 flex flex-col z-[2000] overflow-hidden animate-in fade-in duration-500 camera-vignette">
      {hasCamera ? (
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-70" />
      ) : (
        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center p-4 text-center">
          <p className="text-white opacity-50">{error || "Инициализация камеры..."}</p>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 flex justify-between p-4 pt-8">
        <button onClick={onClose} className="bg-white/20 p-2 rounded-full backdrop-blur-md">
          <XCircle className="w-8 h-8 text-white" />
        </button>
        <div className="bg-black/60 px-4 py-2 rounded-full text-white font-bold backdrop-blur-md flex items-center gap-2">
          {typeInfo.name} <span className="bg-blue-600 px-2 py-0.5 rounded-md flex items-center text-xs"><Zap className="w-3 h-3"/> {pepega.cp} CP</span>
        </div>
      </div>

      {/* Message Overlay */}
      {message && (
        <div className="absolute top-1/4 w-full flex justify-center z-50">
          <div className="bg-black/70 text-white px-6 py-3 rounded-full font-bold animate-in fade-in zoom-in">{message}</div>
        </div>
      )}

      {/* Target (Pepega) */}
      <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none">
        {status === 'idle' || status === 'throwing' || status === 'escaped' ? (
          <img 
            src={typeInfo.sprite} 
            alt={typeInfo.name} 
            className={`w-48 h-48 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transition-all duration-300 ${status === 'idle' ? 'animate-bounce' : 'opacity-0 scale-50'}`} 
          />
        ) : null}

        {/* Shaking Pokeball overlaying Pepega location */}
        {(status === 'shaking' || status === 'caught') && (
          <div className={`w-16 h-16 rounded-full border-[3px] border-slate-800 relative overflow-hidden shadow-2xl ${ballColor} ${status === 'shaking' ? (shakeCount % 2 === 0 ? '-rotate-12' : 'rotate-12') : 'scale-110 grayscale-50'} transition-transform duration-300`}>
            <div className="absolute w-full h-[50%] bottom-0 bg-white"></div>
            <div className="absolute w-full h-1 bg-slate-800 z-20 top-1/2 -mt-[2px]"></div>
            <div className={`absolute left-1/2 top-1/2 -ml-2 -mt-2 w-4 h-4 bg-white border-[3px] border-slate-800 rounded-full z-30 ${status === 'caught' ? 'bg-emerald-400' : ''}`}></div>
          </div>
        )}
      </div>

      {/* Ball Selector & Throw Area */}
      {status === 'idle' && (
        <div className="relative z-20 flex flex-col items-center pb-12 w-full">
          <div className="flex gap-4 mb-8">
            {Object.keys(ITEMS).map(id => (
              <button 
                key={id}
                onClick={() => setSelectedBall(id)}
                className={`relative w-12 h-12 rounded-full border-4 flex items-center justify-center overflow-hidden transition-all ${selectedBall === id ? 'border-yellow-400 scale-110 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'border-slate-800/50 grayscale hover:grayscale-0'}`}
              >
                <div className={`absolute inset-0 ${ITEMS[id].color}`}></div>
                <div className="absolute w-full h-[50%] bottom-0 bg-white"></div>
                <div className="absolute w-full h-1 bg-slate-800 z-20 top-1/2 -mt-[2px]"></div>
                <div className="absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 w-3 h-3 bg-white border-2 border-slate-800 rounded-full z-30"></div>
                <div className="absolute -bottom-2 -right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-40">{items[id]}</div>
              </button>
            ))}
          </div>

          <div 
            className="w-full flex justify-center pb-8 pt-4 cursor-pointer"
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onClick={handleThrow}
          >
            <div className={`w-20 h-20 rounded-full border-4 border-slate-800 relative overflow-hidden shadow-2xl ${ballColor} hover:scale-105 active:scale-95 transition-transform`}>
              <div className="absolute w-full h-[50%] bottom-0 bg-white"></div>
              <div className="absolute w-full h-1.5 bg-slate-800 z-20 top-1/2 -mt-[3px]"></div>
              <div className="absolute left-1/2 top-1/2 -ml-2.5 -mt-2.5 w-5 h-5 bg-white border-4 border-slate-800 rounded-full z-30"></div>
            </div>
          </div>
          <p className="text-white/50 text-sm font-bold animate-pulse pointer-events-none">Свайпни вверх или Кликни, чтобы бросить!</p>
        </div>
      )}
    </div>
  );
}
