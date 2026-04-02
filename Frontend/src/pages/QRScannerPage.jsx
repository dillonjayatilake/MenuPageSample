import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScannerPage({ onTableIdScanned }) {
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    if (!scannerActive) return;

    const startScanner = async () => {
      try {
        const html5QrcodeScanner = new Html5QrcodeScanner(
          "qr-reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );

        html5QrcodeScanner.render(
          (decodedText) => {
            // Successfully scanned QR code
            setScannedData(decodedText);
            html5QrcodeScanner.clear();
            setScannerActive(false);
            onTableIdScanned(decodedText);
          },
          (error) => {
            // Error during scanning - ignore continuous scanning errors
          }
        );
      } catch (err) {
        console.error("Error starting scanner:", err);
      }
    };

    startScanner();
  }, [scannerActive, onTableIdScanned]);

  const handleStartScanning = () => {
    setScannerActive(true);
  };

  const handleManualEntry = () => {
    const tableId = prompt("Enter table ID (e.g., t1, t2):");
    if (tableId) {
      onTableIdScanned(tableId);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#ccb06a" }}>
      <div className="max-w-md mx-auto text-center p-8 bg-amber-50 rounded-lg shadow-lg">
        <div className="text-6xl mb-4">📱</div>
        <h1 className="text-3xl font-bold text-stone-800 mb-4">Welcome!</h1>
        <p className="text-stone-600 mb-6">Scan the QR code on your table to get started</p>

        {!scannerActive ? (
          <div className="space-y-4">
            <button
              onClick={handleStartScanning}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>📷</span>
              Start Scanning
            </button>

            <div className="flex items-center gap-2">
              <div className="flex-1 border-t border-stone-300"></div>
              <span className="text-stone-500 text-sm">Or</span>
              <div className="flex-1 border-t border-stone-300"></div>
            </div>

            <button
              onClick={handleManualEntry}
              className="w-full bg-stone-600 hover:bg-stone-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
            >
              Enter Table ID Manually
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div id="qr-reader" className="rounded-lg overflow-hidden border-2 border-stone-400"></div>
            <p className="text-stone-500 text-sm">Point your camera at the QR code</p>
            <button
              onClick={() => setScannerActive(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
          </div>
        )}

        {scannedData && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
            <p className="text-sm">Scanned: <strong>{scannedData}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}
