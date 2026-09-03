import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type = 'danger'
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      onConfirm();
      setIsClosing(false);
    }, 200);
  };

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      onCancel();
      setIsClosing(false);
    }, 200);
  };

  const typeStyles = {
    danger: 'border-red-500',
    warning: 'border-yellow-500',
    info: 'border-blue-500'
  };

  const buttonStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-xl p-6 max-w-md w-full border-l-4 ${typeStyles[type]} ${
          isClosing ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
        } transition-all duration-200`}
      >
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            {cancelText || t('common.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded transition-colors ${buttonStyles[type]}`}
          >
            {confirmText || t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
}