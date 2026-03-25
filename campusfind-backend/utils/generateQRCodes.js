const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const FRONTEND_URL = 'http://localhost:3000';

// Sample locations
const locations = [
  { code: 'library', name: 'Central Library' },
  { code: 'lab1', name: 'Computer Lab 1' },
  { code: 'lab2', name: 'Computer Lab 2' },
  { code: 'canteen', name: 'Main Canteen' },
  { code: 'lecture-hall', name: 'Main Lecture Hall' }
];

// Create qrcodes directory
const qrcodesDir = path.join(__dirname, '../qrcodes');
if (!fs.existsSync(qrcodesDir)) {
  fs.mkdirSync(qrcodesDir);
}

async function generateQRForLocation(location) {
  const qrUrl = `${FRONTEND_URL}/qr/${location.code}`;
  const filePath = path.join(qrcodesDir, `${location.code}.png`);
  
  try {
    await QRCode.toFile(filePath, qrUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    console.log(`✅ Generated QR for ${location.name}: ${filePath}`);
  } catch (err) {
    console.error(`❌ Error generating QR for ${location.code}:`, err);
  }
}

async function generateAll() {
  console.log('🚀 Generating QR codes for campus locations...\n');
  for (const location of locations) {
    await generateQRForLocation(location);
  }
  console.log('\n🎉 All QR codes generated! Files saved in backend/qrcodes/');
  console.log('URLs:');
  locations.forEach(loc => console.log(`  ${FRONTEND_URL}/qr/${loc.code} → ${loc.name}`));
}

// Run if direct
if (require.main === module) {
  generateAll();
}

module.exports = { generateAll, locations };

