import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Order, Payment, api } from "../api";
import { useAuth } from "../auth";

export default function Checkout() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("Demo User");
  const [phone, setPhone] = useState("10086");
  const [address, setAddress] = useState("Jakarta");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      nav("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const order = await api<Order>(
        "/api/orders",
        {
          method: "POST",
          body: JSON.stringify({
            shipping_name: name,
            shipping_phone: phone,
            shipping_address: address,
          }),
        },
        token
      );
      const pay = await api<Payment>(
        "/api/payments/mock",
        { method: "POST", body: JSON.stringify({ order_id: order.id }) },
        token
      );
      nav(`/pay/${pay.id}`);
    } catch (err: any) {
      setError(err?.message || err?.code || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page narrow">
      <form className="panel stack" onSubmit={submit}>
        <h2>{t("checkout")}</h2>
        <p className="lede">{t("placeOrder")}</p>
        <label>
          {t("shippingName")}
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          {t("shippingPhone")}
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label>
          {t("shippingAddress")}
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} required rows={3} />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn" disabled={loading}>
          {t("placeOrder")}
        </button>
      </form>
    </div>
  );
}
