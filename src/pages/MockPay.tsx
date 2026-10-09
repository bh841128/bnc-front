import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api";
import { useAuth } from "../auth";

export default function MockPay() {
  const { paymentId } = useParams();
  const { t } = useTranslation();
  const { token } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const confirm = async (result: "succeeded" | "failed") => {
    if (!token) return;
    setBusy(true);
    setError("");
    try {
      await api(
        `/api/payments/mock/${paymentId}/confirm`,
        { method: "POST", body: JSON.stringify({ result }) },
        token
      );
      nav("/orders");
    } catch (e: any) {
      setError(e?.message || e?.code || "Pay failed");
      setBusy(false);
    }
  };

  return (
    <div className="card stack" style={{ maxWidth: 480 }}>
      <h2>{t("pay")}</h2>
      <p className="muted">{t("mockPayHint")}</p>
      {error && <div className="error">{error}</div>}
      <div className="row">
        <button className="btn" disabled={busy} onClick={() => confirm("succeeded")}>
          {t("paySuccess")}
        </button>
        <button className="btn danger" disabled={busy} onClick={() => confirm("failed")}>
          {t("payFail")}
        </button>
      </div>
    </div>
  );
}
