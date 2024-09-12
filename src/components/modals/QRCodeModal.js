import React from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";

const QRCodeModal = ({ isOpen, onClose, data, name }) => {
  const handleDownload = async () => {
    const qrCodeElement = document.getElementById("qr-code");
    if (!qrCodeElement) return;

    const canvas = await html2canvas(qrCodeElement);
    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${name ? name : "qrcode"}.png`;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">QR Code</h2>
        {data && (
          <div className="flex flex-col items-center">
            <div id="qr-code" className="mb-4">
              <QRCodeSVG value={JSON.stringify(data.id)} size={256} />
            </div>
            {name && <p className="text-lg font-medium mb-4">{name}</p>}
            <div className="flex justify-between w-full">
              <button
                onClick={handleDownload}
                className="bg-green-500 text-white py-2 px-4 rounded flex-1 mr-2"
              >
                Download PNG
              </button>
              <button
                onClick={onClose}
                className="bg-blue-500 text-white py-2 px-4 rounded flex-1 ml-2"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeModal;
