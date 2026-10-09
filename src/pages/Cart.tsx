import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CartItem, api, formatMoney, pickI18n } from "../api";
import { useAuth } from "../auth";

export default function Cart() {
  const { t, i18n } = useTranslation();
  const { token } = useAuth();
  const nav = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [error, setError] = useState("");

  const load = () => {
    if (!token) return;
    api<CartItem[]>("/api/cart/items", {}, token)
      .then(setItems)
      .catch((e) => setError(e?.message || "Failed"));
  };

  useEffect(() => {
    if (!token) {
      nav("/login");
      return;
    }
    load();
  }, [token]);

  const total = items.reduce((s, i) => s + i.quantity * i.product.price_cents, 0);

  if (!items.length) {
    return (
      <div className="card">
        <p>{t("emptyCart")}</p>
        <Link to="/">{t("home")}</Link>
      </div>
    );
  }

  return (
    <div className="stack">
      {error && <div className="error">{error}</div>}
      {items.map((item) => (
        <div className="card row" key={item.id} style={{ justifyContent: "space-between" }}>
          <div>
            <strong>{pickI18n(item.product.name_i18n, i18n.language)}</strong>
            <div className="muted">
              {formatMoney(item.product.price_cents, i18n.language)} × {item.quantity}
            </div>
          </div>
          <div className="row">
            <input
              style={{ width: 80 }}
              type="number"
              min={1}
              value={item.quantity}
              onChange={async (e) => {
                try {
                  await api(
                    `/api/cart/items/${item.id}`,
                    { method: "PATCH", body: JSON.stringify({ quantity: Number(e.target.value) }) },
                    token
                  );
                  load();
                } catch (err: any) {
                  setError(err?.message || err?.code || "Update failed");
                }
              }}
            />
            <button
              className="btn danger"
              onClick={async () => {
                await api(`/api/cart/items/${item.id}`, { method: "DELETE" }, token);
                load();
              }}
            >
              ×
            </button>
          </div>
        </div>
      ))}
      <div className="row" style={{ justifyContent: "space-between" }}>
        <strong>
          {t("total")}: {formatMoney(total, i18n.language)}
        </strong>
        <Link className="btn" to="/checkout">
          {t("checkout")}
        </Link>
      </div>
    </div>
  );
}
