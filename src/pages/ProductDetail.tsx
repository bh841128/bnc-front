import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Product, api, formatMoney, pickI18n } from "../api";
import { useAuth } from "../auth";

export default function ProductDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { token } = useAuth();
  const nav = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Product>(`/api/products/${id}`)
      .then(setProduct)
      .catch((e) => setError(e?.message || "Not found"));
  }, [id]);

  const add = async () => {
    if (!token) {
      nav("/login");
      return;
    }
    try {
      await api(
        "/api/cart/items",
        { method: "POST", body: JSON.stringify({ product_id: Number(id), quantity: qty }) },
        token
      );
      nav("/cart");
    } catch (e: any) {
      setError(e?.message || e?.code || "Add failed");
    }
  };

  if (!product) {
    return (
      <div className="page narrow">
        <div className="panel">{error || "..."}</div>
      </div>
    );
  }

  return (
    <>
      <div className="product-hero">
        <h1>{pickI18n(product.name_i18n, i18n.language)}</h1>
        <p className="price">
          {formatMoney(product.price_cents, i18n.language)} · {t("stock")} {product.stock}
        </p>
        <div className="product-stage" aria-hidden />
      </div>
      <div className="page narrow">
        <div className="panel stack">
          <p className="lede">{pickI18n(product.description_i18n, i18n.language)}</p>
          <label>
            {t("quantity")}
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button className="btn" onClick={add}>
            {t("addToCart")}
          </button>
        </div>
      </div>
    </>
  );
}
