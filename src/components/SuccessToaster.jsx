
import { useEffect } from "react";

export default function SuccessToaster({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-blue-50 border border-blue-300 rounded-xl px-4 py-3 shadow-md flex items-center gap-3 hover:shadow-lg transition-all">
        
        {/* Icon */}
        <div className="bg-blue-400 text-white rounded-full p-1 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        
        {/* Message */}
        <p className="text-blue-800 text-sm font-medium">{message}</p>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="text-blue-800 hover:text-blue-600 ml-4 font-bold p-1 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}