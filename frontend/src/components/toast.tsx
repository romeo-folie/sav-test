interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose?: () => void;
}

export const Toast = ({ message, isVisible, onClose }: ToastProps) => {
  return (
    <div
      className={`fixed top-0 left-0 right-0 bg-red-600 text-white py-3 px-4 text-center z-50 transform transition-transform duration-300 ease-in-out max-w-6xl mx-auto ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className=" mx-auto flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-200 focus:outline-none text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

