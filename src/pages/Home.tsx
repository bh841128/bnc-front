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
    api<Product[]>("/api/products")
      .then(setProducts)
      .catch((e) => setError(e?.message || "Failed to load"));
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  const visible = category ? products.filter((p) => p.category === category) : products;

  return (
    <>
      <section className="hero">
        <p className="eyebrow">BNC</p>
        <h1>{t("heroTitle")}</h1>
        <p className="sub">{t("heroSub")}</p>
        <div className="cta-row">
          <a href="#collection">{t("heroCta")} →</a>
        </div>
      </section>

      <div className="page" id="collection">
        <h2 className="section-title">{t("collection")}</h2>
        <div className="filters">
          <button
            type="button"
            className={`chip ${category === "" ? "active" : ""}`}
            onClick={() => setCategory("")}
          >
            {t("all")}
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        {error && <div className="error">{error}</div>}
        <div className="tile-grid">
          {visible.map((p, idx) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className={`tile ${idx % 3 === 0 ? "dark" : ""}`}
            >
              <h3>{pickI18n(p.name_i18n, i18n.language)}</h3>
              <p className="tagline">{pickI18n(p.description_i18n, i18n.language)}</p>
              <p className="meta">
                {t("from")} {formatMoney(p.price_cents, i18n.language)}
              </p>
              <div className="links">
                <span>{t("learnMore")} ›</span>
                <span>{t("buy")} ›</span>
              </div>
              <div className="tile-visual" aria-hidden />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
