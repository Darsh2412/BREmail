import { useEffect } from "react";

interface EmailNotificationProps {
  type: 'success' | 'error' | '';
  message: string;
  onClose: () => void;
}

export default function EmailNotification({ type, message, onClose }: EmailNotificationProps) {
  useEffect(() => {
    if (type) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);
  
  if (!type) return null;
  
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  const icon = type === 'success' ? 'ri-check-line' : 'ri-error-warning-line';
  
  return (
    <div 
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-md transform transition-all duration-300 ${bgColor} text-white`}
    >
      <div className="flex items-center">
        <i className={`${icon} text-xl mr-2`}></i>
        <p>{message}</p>
        <button 
          onClick={onClose}
          className="ml-4 text-white/80 hover:text-white"
          aria-label="Close notification"
        >
          <i className="ri-close-line"></i>
        </button>
      </div>
    </div>
  );
}
