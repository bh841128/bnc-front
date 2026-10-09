import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Order, api, formatMoney } from "../api";
import { useAuth } from "../auth";

export default function Orders() {
  const { t, i18n } = useTranslation();
  const { token } = useAuth();
  const nav = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!token) {
      nav("/login");
      return;
    }
    api<Order[]>("/api/orders", {}, token).then(setOrders).catch(() => setOrders([]));
  }, [token]);

  return (
    <div className="stack">
      <h2>{t("orders")}</h2>
      {orders.map((o) => (
        <div className="card" key={o.id}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <strong>{o.order_no}</strong>
            <span className={`badge ${o.status}`}>{o.status}</span>
          </div>
          <div className="muted">
            {t("total")}: {formatMoney(o.total_cents, i18n.language)}
          </div>
          <ul>
            {o.items?.map((it) => (
              <li key={it.id}>
                {it.product_name_snapshot} × {it.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
