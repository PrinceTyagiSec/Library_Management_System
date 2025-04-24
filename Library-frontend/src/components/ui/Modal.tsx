import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
    const navigate = useNavigate();
    const handleOkClick = () => {
      onClose(); 
      navigate('/login'); 
    };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-xl font-semibold text-center mb-4">Email Verification</h3>
        <p className="text-center">{message}</p>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleOkClick} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
