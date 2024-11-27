import React, { useState, useEffect } from "react";

const PrintSlipModal = ({ isOpen, onClose, selectedRecord, inventoryData }) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  console.log(selectedRecord);

  const issuanceNo =
    selectedRecord.length > 0 ? selectedRecord[0].issuance_no : "N/A";
  const currentDate = new Date().toLocaleDateString();
  const orNumber =
    selectedRecord.length > 0 ? selectedRecord[0].or_number : "N/A";

  const studentName =
    selectedRecord.length > 0 ? selectedRecord[0].student_name : "N/A";

  const studentId =
    selectedRecord.length > 0 ? selectedRecord[0].student_id : "N/A";

  const courseAndSection =
    selectedRecord.length > 0 ? selectedRecord[0].course_and_section : "N/A";

  const grandTotal = selectedRecord.reduce((total, record) => {
    const inventoryItem = inventoryData.find(
      (item) => item.id === record.product_id,
    );
    const itemPrice = inventoryItem ? inventoryItem.price : 0;
    return total + record.item_count * itemPrice;
  }, 0);

  useEffect(() => {
    if (isOpen) {
      setIsPreviewVisible(true);
    }
  }, [isOpen]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
    <html>
      <head>
        <title>Issuance Slip</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h2 { text-align: center; font-size: 18px; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          table, th, td { border: 1px solid #000; }
          th, td { padding: 8px; text-align: left; font-size: 14px; }
          th { background-color: #f2f2f2; }
          .total-row, .footer-row { font-weight: bold; background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h2>STI - SAN PABLO</h2>
        <h2>STOCK ISSUANCE SLIP</h2>
        <div>
          <p><strong>Date:</strong> ${currentDate}</p>
          <p><strong>Issuance No:</strong> ${issuanceNo}</p>
        </div>
        <table>
          <tr>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>Item Count</th>
            <th>Item Description</th>
            <th>Amount</th>
          </tr>
          ${selectedRecord
            .map((record) => {
              const inventoryItem = inventoryData.find(
                (item) => item.id === record.product_id,
              );
              const productName = inventoryItem
                ? inventoryItem.product_name
                : "N/A";
              const itemPrice = inventoryItem ? inventoryItem.price : 0;

              return `
                <tr>
                  <td>${record.product_id}</td>
                  <td>${productName}</td>
                  <td>${record.item_count}</td>
                  <td>${record.item_desc}</td>
                  <td>₱${(record.item_count * itemPrice).toFixed(2)}</td>
                </tr>`;
            })
            .join("")}
          <tr class="total-row">
            <td colspan="4">Total Amount</td>
            <td>₱${grandTotal.toFixed(2)}</td>
          </tr>
        </table>
        <div class="font-bold space">Released by Date:</div>
        <div class="flex">
          <div class="text-center">
            <hr class="border-t w-48" />
            <p>JAKE B. DE JESUS/PAMO</p>
          </div>
          <div class="text-center">
            <hr class="border-t w-48" />
            <p>JUVY ANN GARCIA/CASHIER</p>
          </div>
        </div>
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.print();
    onClose();
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded max-w-4xl overflow-auto">
        {isPreviewVisible && (
          <div className="mb-4">
            <div className="mb-2">
              <strong>Date:</strong> {currentDate}
            </div>
            <div className="mb-4">
              <strong>Issuance No:</strong> {issuanceNo}
            </div>
            <table className="w-full mb-4">
              <tbody>
                <tr>
                  <td className="border px-4 py-2 font-bold">Name:</td>
                  <td className="border px-4 py-2">{studentName}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">
                    Course/Section:
                  </td>
                  <td className="border px-4 py-2">{courseAndSection}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Student No:</td>
                  <td className="border px-4 py-2">{studentId}</td>
                </tr>
              </tbody>
            </table>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Item Code</th>
                  <th className="border px-4 py-2">Item Name</th>
                  <th className="border px-4 py-2">Item Count</th>
                  <th className="border px-4 py-2">Item Description</th>
                  <th className="border px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedRecord.map((record, index) => {
                  const inventoryItem = inventoryData.find(
                    (item) => item.id === record.product_id,
                  );
                  const productName = inventoryItem
                    ? inventoryItem.product_name
                    : "N/A";
                  const itemPrice = inventoryItem ? inventoryItem.price : 0;

                  return (
                    <tr key={index}>
                      <td className="border px-4 py-2">{record.product_id}</td>
                      <td className="border px-4 py-2">{productName}</td>
                      <td className="border px-4 py-2">{record.item_count}</td>
                      <td className="border px-4 py-2">{record.item_desc}</td>
                      <td className="border px-4 py-2">
                        ₱{(record.item_count * itemPrice).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-100">
                  <td className="border px-4 py-2" colSpan="4">
                    <strong>Total Amount</strong>
                  </td>
                  <td className="border px-4 py-2">
                    <strong>₱{grandTotal.toFixed(2)}</strong>
                  </td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border px-4 py-2" colSpan="4">
                    <strong>OR Number</strong>
                  </td>
                  <td className="border px-4 py-2">
                    <strong>{orNumber}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-between mt-4 gap-x-12">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Print Slip
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintSlipModal;
