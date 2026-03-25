import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRGeneratorPage = () => {
  const [qrType, setQrType] = useState('text');
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
    let value = qrData;
    switch (qrType) {
      case 'url':
        value = qrData.startsWith('http') ? qrData : 'https://' + qrData;
        break;
      case 'email':
        value = `mailto:${qrData}`;
        break;
      case 'phone':
        value = `tel:${qrData}`;
        break;
      case 'wifi':
        value = `WIFI:S:${qrData.split(';')[0] || ''};T:WPA;P:${qrData.split(';')[1] || ''};;`;
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

  const getInputPlaceholder = () => {
    switch (qrType) {
      case 'url': return 'https://example.com';
      case 'email': return 'user@example.com';
      case 'phone': return '+1-234-567-8900';
      case 'wifi': return 'SSID;password';
      default: return 'Enter text...';
    }
  };

  return (
    <div className="container mt-5 min-vh-100 d-flex align-items-center">
      <div className="row justify-content-center w-100">
        <div className="col-lg-8 col-xl-6">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-gradient-primary text-white text-center py-4">
              <h1 className="display-5 fw-bold mb-0">
                <i className="fas fa-qrcode me-3"></i>
                Smart QR Generator
              </h1>
              <p className="mb-0 opacity-90 mt-2">Generate custom QR codes instantly</p>
            </div>
            <div className="card-body p-5">
              {/* Type Selector */}
              <div className="mb-4">
                <label className="form-label fw-bold fs-5 mb-3">QR Type</label>
                <div className="row g-2">
                  {['text', 'url', 'email', 'phone', 'wifi'].map(type => (
                    <div key={type} className="col-6 col-md-4 col-lg-3">
                      <button
                        className={`btn py-3 w-100 rounded-3 ${qrType === type ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleTypeChange(type)}
                      >
                        {type.toUpperCase()}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Input */}
              <div className="mb-4">
                <label className="form-label fw-semibold fs-6 mb-3">
                  {qrType.charAt(0).toUpperCase() + qrType.slice(1)} Data
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg border-0 shadow-sm"
                  placeholder={getInputPlaceholder()}
                  value={qrData}
                  onChange={(e) => setQrData(e.target.value)}
                />
              </div>

              {/* Generate Button */}
              <div className="text-center mb-4">
                <button className="btn btn-success btn-lg px-5 py-3 fs-5 fw-bold shadow-lg" onClick={generateQR} disabled={!qrData.trim()}>
                  <i className="fas fa-magic me-2"></i>
                  Generate QR Code
                </button>
              </div>

              {/* QR Display */}
              {qrValue && (
                <div className="text-center mb-4">
                  <div className="bg-light p-4 rounded-4 shadow">
                    <div className="mb-3">
                      <QRCodeCanvas
                        canvasRef={canvasRef}
                        value={qrValue}
                        size={256}
                        fgColor="#000000"
                        bgColor="#ffffff"
                      />
                    </div>
                    <code className="small text-muted d-block mb-2">{qrValue.substring(0, 50)}...</code>
                    <button className="btn btn-primary px-4 py-2 shadow" onClick={downloadQR}>
                      <i className="fas fa-download me-2"></i>
                      Download PNG
                    </button>
                  </div>
                  <canvas ref={canvasRef} style={{display: 'none'}} />
                  <a ref={downloadLinkRef} style={{display: 'none'}}>Download</a>
                </div>
              )}

              {/* Examples */}
              {!qrValue && (
                <div className="text-center mt-5">
                  <h5 className="text-muted mb-4">Try these examples:</h5>
                  <div className="row g-3 justify-content-center">
                    <div className="col-auto">
                      <button className="btn btn-outline-secondary" onClick={() => {setQrType('url'); setQrData('campusfind.com');}}>
                        campusfind.com
                      </button>
                    </div>
                    <div className="col-auto">
                      <button className="btn btn-outline-secondary" onClick={() => {setQrType('phone'); setQrData('+1234567890');}}>
                        Call +1-234
                      </button>
                    </div>
                    <div className="col-auto">
                      <button className="btn btn-outline-secondary" onClick={() => {setQrType('email'); setQrData('hello@campusfind.com');}}>
                        Email hello@
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="card-footer bg-light text-center py-4">
              <small className="text-muted">
                Powered by qrcode.react | CampusFind QR Generator © 2024
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGeneratorPage;

