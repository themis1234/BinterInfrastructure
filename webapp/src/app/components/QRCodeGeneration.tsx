import { useState } from 'react';
import { X } from 'lucide-react';

interface QRCodeRegisterModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const QRCodeRegisterModal: React.FC<QRCodeRegisterModalProps> = ({
  isModalOpen,
  setIsModalOpen
}) => {
  const [qrCodes, setQrCodes] = useState('');
  const [autoGenCount, setAutoGenCount] = useState(1);

  const generateRandomQRCode = () => {
    // Generate a random alphanumeric string for QR code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleAutoGenerate = () => {
    const count = Math.min(Math.max(1, autoGenCount), 10); 
    const newQRCodes = [];
    
    for (let i = 0; i < count; i++) {
      newQRCodes.push(generateRandomQRCode());
    }
    
    const currentCodes = qrCodes.trim();
    const separator = currentCodes ? '\n' : '';
    setQrCodes(currentCodes + separator + newQRCodes.join('\n'));
  };

  const handleSubmit = () => {
    const codesArray = qrCodes
      .split('\n')
      .map(code => code.trim())
      .filter(code => code.length > 0);
    
    if (codesArray.length === 0) {
      alert('Please add at least one QR code');
      return;
    }
    
    // Section to send the QR codes to the backend
    //NOT IMPLEMENTED YET
    console.log('Registering QR codes:', codesArray);
    alert(`Successfully registered ${codesArray.length} QR codes!`);
    
    setQrCodes('');
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setQrCodes('');
    setIsModalOpen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const qrCodeCount = qrCodes
    .split('\n')
    .map(code => code.trim())
    .filter(code => code.length > 0).length;

  if (!isModalOpen) return null;

  return (
    <div 
      className="fixed inset-0  bg-opacity-20 flex items-center justify-center z-999 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Register QR Codes
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition duration-200 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Auto Generate Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3 ">
              Auto Generate QR Codes
            </h3>
            <div className="flex items-center space-x-3">
              <label htmlFor="count" className="text-sm font-medium text-gray-700">
                Number of codes:
              </label>
              <input
                id="count"
                type="number"
                min="1"
                max="10"
                value={autoGenCount}
                onChange={(e) => setAutoGenCount(parseInt(e.target.value) || 1)}
                className="border border-gray-300 rounded-md px-3 py-1 w-20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAutoGenerate}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 cursor-pointer"
              >
                Auto Generate
              </button>
            </div>
          </div>

          {/* Manual Input Section */}
          <div>
            <label htmlFor="qrcodes" className="block text-sm font-medium text-gray-700 mb-2">
              QR Codes (one per line, no spaces)
            </label>
            <textarea
              id="qrcodes"
              value={qrCodes}
              onChange={(e) => setQrCodes(e.target.value)}
              placeholder="Enter QR codes here, one per line..."
              rows={10}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            {qrCodeCount > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {qrCodeCount} QR code{qrCodeCount !== 1 ? 's' : ''} ready to register
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex space-x-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={handleSubmit}
            disabled={qrCodeCount === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition duration-200 cursor-pointer"
          >
            Register {qrCodeCount} QR Code{qrCodeCount !== 1 ? 's' : ''}
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeRegisterModal;