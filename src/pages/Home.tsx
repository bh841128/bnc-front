import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Product, api, formatMoney, pickI18n } from "../api";

export default function Home() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const q = category ? `?category=${encodeURIComponent(category)}` : "";
    api<Product[]>(`/api/products${q}`)
      .then(setProducts)
      .catch((e) => setError(e?.message || "Failed to load"));
  }, [category]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  return (
    <div className="stack">
      <div className="row">
        <label style={{ margin: 0, width: "auto" }}>
          {t("category")}
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">{t("all")}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="grid">
        {products.map((p) => (
          <Link key={p.id} to={`/products/${p.id}`} className="card">
            <h3>{pickI18n(p.name_i18n, i18n.language)}</h3>
            <div className="muted">{p.category}</div>
            <div>
              {t("price")}: {formatMoney(p.price_cents, i18n.language)}
            </div>
            <div className="muted">
              {t("stock")}: {p.stock}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
