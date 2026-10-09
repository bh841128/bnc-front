import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api";
import { useAuth } from "../auth";

export default function Login() {
  const { t } = useTranslation();
  const { setAuth } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("customer@demo.com");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api<{ access_token: string; user: any }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAuth(res.access_token, res.user);
      nav("/");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  };

  return (
    <div className="page narrow">
      <form className="panel stack" onSubmit={submit}>
        <h2>{t("login")}</h2>
        <p className="lede">customer@demo.com / demo1234</p>
        <label>
          {t("email")}
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          {t("password")}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn">{t("login")}</button>
      </form>
    </div>
  );
}
