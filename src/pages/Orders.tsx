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
    <div className="page narrow">
      <div className="panel">
        <h2>{t("orders")}</h2>
        <div className="stack">
          {orders.map((o) => (
            <div className="line-item" key={o.id} style={{ alignItems: "flex-start" }}>
              <div>
                <strong>{o.order_no}</strong>
                <div className="muted">
                  {t("total")}: {formatMoney(o.total_cents, i18n.language)}
                </div>
                <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: "#86868b" }}>
                  {o.items?.map((it) => (
                    <li key={it.id}>
                      {it.product_name_snapshot} × {it.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <span className={`badge ${o.status}`}>{o.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
