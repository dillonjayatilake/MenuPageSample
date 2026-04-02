import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import QRScannerPage from "./pages/QRScannerPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChefDashboard from "./pages/ChefDashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("landing"); // landing, qr, home, login, signup, chef
  const [tableId, setTableId] = useState(null);
  const [staffUser, setStaffUser] = useState(null);

  // Customer Mode - QR Scanner
  const handleCustomerMode = () => {
    setCurrentPage("qr");
  };

  const handleTableIdScanned = (id) => {
    setTableId(id);
    setCurrentPage("home");
  };

  const handleChangeTable = () => {
    setTableId(null);
    setCurrentPage("landing");
  };

  // Staff Mode - Login
  const handleStaffMode = () => {
    setCurrentPage("login");
  };

  const handleLoginSuccess = (user) => {
    setStaffUser(user);
    setCurrentPage("chef");
  };

  const handleSignupSuccess = (user) => {
    setStaffUser(user);
    setCurrentPage("chef");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setStaffUser(null);
    setCurrentPage("landing");
  };

  return (
    <>
      {currentPage === "landing" && (
        <LandingPage onCustomerMode={handleCustomerMode} onStaffMode={handleStaffMode} />
      )}

      {currentPage === "qr" && (
        <QRScannerPage onTableIdScanned={handleTableIdScanned} />
      )}

      {currentPage === "home" && (
        <HomePage tableId={tableId} onChangeTable={handleChangeTable} />
      )}

      {currentPage === "login" && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onBackClick={() => setCurrentPage("landing")}
          onSignupClick={() => setCurrentPage("signup")}
        />
      )}

      {currentPage === "signup" && (
        <SignupPage
          onSignupSuccess={handleSignupSuccess}
          onBackClick={() => setCurrentPage("login")}
        />
      )}

      {currentPage === "chef" && staffUser && (
        <div>
          <div className="bg-stone-800 text-amber-50 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-xl">👨‍🍳</span>
              <div>
                <p className="text-sm">Logged in as</p>
                <p className="font-bold">{staffUser.name} ({staffUser.role})</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              Logout
            </button>
          </div>
          <ChefDashboard userRole={staffUser.role} />
        </div>
      )}
    </>
  );
}

export default App;