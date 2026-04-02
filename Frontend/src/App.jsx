import { useState } from "react";
import QRScannerPage from "./pages/QRScannerPage";
import HomePage from "./pages/HomePage";

function App() {
  const [tableId, setTableId] = useState(null);

  const handleTableIdScanned = (id) => {
    setTableId(id);
  };

  const handleChangeTable = () => {
    setTableId(null);
  };

  return (
    <>
      {!tableId ? (
        <QRScannerPage onTableIdScanned={handleTableIdScanned} />
      ) : (
        <HomePage tableId={tableId} onChangeTable={handleChangeTable} />
      )}
    </>
  );
}

export default App;