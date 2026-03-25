import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRGeneratorPage = () => {

  const baseURL = "http://localhost:3000"; // 🔥 change after deployment

  const [qrType, setQrType] = useState('events');
  const [qrData, setQrData] = useState('');
  const [qrValue, setQrValue] = useState('');
  const canvasRef = useRef(null);
  const downloadLinkRef = useRef(null);

  const handleTypeChange = (type) => {
    setQrType(type);
    setQrData('');
    setQrValue('');
  };

  const generateQR = () => {
    let value = "";

    switch (qrType) {
      case 'events':
        value = `${baseURL}/events`;
        break;

      case 'event':
        value = `${baseURL}/event/${qrData}`;
        break;

      case 'url':
        value = qrData.startsWith('http') ? qrData : 'https://' + qrData;
        break;

      case 'email':
        value = `mailto:${qrData}`;
        break;

      case 'phone':
        value = `tel:${qrData}`;
        break;

      default:
        value = qrData;
    }

    setQrValue(value);
  };

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = downloadLinkRef.current;
      link.href = canvas.toDataURL();
      link.download = `qr-${qrType}-${Date.now()}.png`;
      link.click();
    }
  };

  const getPlaceholder = () => {
    switch (qrType) {
      case 'event': return 'Enter Event ID (e.g. 1)';
      case 'url': return 'https://example.com';
      case 'email': return 'user@example.com';
      case 'phone': return '+1234567890';
      default: return '';
    }
  };

  return (
    <div className="container mt-5 text-center">

      <h2 className="mb-4">Smart QR Generator</h2>

      {/* Type Buttons */}
      <div className="mb-4">
        {['events', 'event', 'url', 'email', 'phone'].map(type => (
          <button
            key={type}
            className={`btn m-2 ${qrType === type ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handleTypeChange(type)}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Input */}
      {qrType !== 'events' && (
        <input
          type="text"
          className="form-control w-50 mx-auto mb-3"
          placeholder={getPlaceholder()}
          value={qrData}
          onChange={(e) => setQrData(e.target.value)}
        />
      )}

      {/* Generate Button */}
      <button className="btn btn-success mb-4" onClick={generateQR}>
        Generate QR
      </button>

      {/* QR */}
      {qrValue && (
        <div>
          <QRCodeCanvas value={qrValue} size={200} ref={canvasRef} />
          <p className="mt-2">{qrValue}</p>

          <button className="btn btn-dark mt-2" onClick={downloadQR}>
            Download QR
          </button>
        </div>
      )}

      <a ref={downloadLinkRef} style={{ display: 'none' }}>Download</a>

    </div>
  );
};

export default QRGeneratorPage;