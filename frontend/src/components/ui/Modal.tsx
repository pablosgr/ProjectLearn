import type { FC, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: (e?: React.MouseEvent) => void;
  onConfirm?: (e?: React.MouseEvent) => void;
  title: string;
  actionColor?: string;
  type?: string;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, actionColor, type, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <article 
        className="modal-content bg-white rounded-xl p-6 text-neutral-600 max-w-lg mx-4 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium text-cyan-600">{title}</h3>
        {children}
        <footer className="flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="
              px-4 py-2 rounded-lg border-1 border-cyan-600 text-cyan-600 font-medium
              hover:text-white hover:bg-cyan-500 hover:cursor-pointer transition-colors
            "
          >
            Cancel
          </button>
          {
            type !== 'add' && (
              <button 
                onClick={onConfirm}
                className={`
                  ${actionColor === 'green' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500/90 hover:bg-red-600'}
                  px-4 py-2 text-white font-medium rounded-lg 
                  hover:cursor-pointer transition-colors
                `}
              >
                Confirm
              </button>
            )
          }
        </footer>
      </article>
    </div>,
    document.body
  );
};

export default Modal;
