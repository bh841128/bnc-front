import { NavLink, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "./auth";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MockPay from "./pages/MockPay";
import Orders from "./pages/Orders";
import ProductDetail from "./pages/ProductDetail";

export default function App() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  const setLang = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("bnc_lang", lng);
  };

  return (
    <div className="shell">
      <nav className="nav">
        <div className="brand">{t("brand")}</div>
        <div className="nav-links">
          <NavLink to="/" end>
            {t("home")}
          </NavLink>
          <NavLink to="/cart">{t("cart")}</NavLink>
          <NavLink to="/orders">{t("orders")}</NavLink>
          {user ? (
            <button className="btn secondary" onClick={logout}>
              {t("logout")} ({user.email})
            </button>
          ) : (
            <NavLink to="/login">{t("login")}</NavLink>
          )}
          <select
            value={i18n.language}
            onChange={(e) => setLang(e.target.value)}
            style={{ width: "auto" }}
          >
            <option value="zh">{t("lang_zh")}</option>
            <option value="en">{t("lang_en")}</option>
            <option value="id">{t("lang_id")}</option>
          </select>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pay/:paymentId" element={<MockPay />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
