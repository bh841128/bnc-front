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

  return (
    <div className="page narrow">
      <div className="panel">
        <h2>{t("cart")}</h2>
        {!items.length ? (
          <>
            <p className="lede">{t("emptyCart")}</p>
            <div style={{ textAlign: "center" }}>
              <Link className="btn" to="/">
                {t("home")}
              </Link>
            </div>
          </>
        ) : (
          <div className="stack">
            {error && <div className="error">{error}</div>}
            {items.map((item) => (
              <div className="line-item" key={item.id}>
                <div>
                  <strong>{pickI18n(item.product.name_i18n, i18n.language)}</strong>
                  <div className="muted">
                    {formatMoney(item.product.price_cents, i18n.language)}
                  </div>
                </div>
                <div className="row">
                  <input
                    style={{ width: 72 }}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={async (e) => {
                      try {
                        await api(
                          `/api/cart/items/${item.id}`,
                          {
                            method: "PATCH",
                            body: JSON.stringify({ quantity: Number(e.target.value) }),
                          },
                          token
                        );
                        load();
                      } catch (err: any) {
                        setError(err?.message || err?.code || "Update failed");
                      }
                    }}
                  />
                  <button
                    className="btn secondary"
                    type="button"
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
            <div className="row" style={{ justifyContent: "space-between", marginTop: 12 }}>
              <strong style={{ fontSize: 21 }}>
                {t("total")}: {formatMoney(total, i18n.language)}
              </strong>
              <Link className="btn" to="/checkout">
                {t("checkout")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
