"use client";

import { useState } from "react";

export default function OrderConfirmationPage() {
  // 仮のデータ
  const [cardInfo] = useState("1234567812345678"); // 12桁カード
  const [products] = useState([
    { name: "m-acetaminophen", quantity: 2, unit: "個", price: 500 },
    { name: "p-water-2l", quantity: 1, unit: "本", price: 120 },
  ]);

  // カード情報を下4桁以外隠す
  const maskedCard =
    cardInfo.slice(0, -4).replace(/./g, "*") + cardInfo.slice(-4);

  // 合計金額
  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  // ダミー：注文確定押したとき
  const confirmOrder = () => {
    alert("注文を確定しました！");
  };

  return (
    <div className="container">
      {/* タイトル */}
      <h1 className="title">注文確認</h1>

      <p className="warning">
        ＊ まだ注文は確定しておりません ＊ <br />
        内容をご確認の上、ページ下部の『注文確定』をタップお願いいたします。
      </p>

      {/* カード情報 */}
      <div className="card">
        <h2>カード情報</h2>
        <p>{maskedCard}</p>
      </div>

      {/* 商品情報 */}
      <div className="card">
        <h2>商品情報</h2>
        <table className="product-table">
          <thead>
            <tr>
              <th>商品</th>
              <th>数量</th>
              <th>金額</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td className="product-name">
                  <img
                    src={`/products/${product.name}.png`}
                    alt={product.name}
                    className="product-image"
                  />
                  {product.name}
                </td>
                <td>
                  {product.quantity}
                  {product.unit}
                </td>
                <td>¥{product.price * product.quantity}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={2}
                style={{ textAlign: "right", fontWeight: "bold" }}
              >
                合計
              </td>
              <td style={{ fontWeight: "bold" }}>¥{total}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 注文確定ボタン（固定） */}
      <div
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
          width: "100%",
          backgroundColor: "#fff",
          borderTop: "1px solid #ccc",
          padding: "10px 0",
          textAlign: "center",
          boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={confirmOrder}
          style={{
            padding: "10px 20px",
            background: "#fff",
            color: "firebrick",
            border: "2px solid firebrick",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          注文確定
        </button>
      </div>

      <style jsx>{`
        .container {
          max-width: 700px;
          margin: 0 auto;
          padding: 16px;
          padding-bottom: 80px; /* 下のボタン領域分 */
        }
        .title {
          text-align: left;
          font-size: 28px;
          margin: 16px 0;
          margin-left: 12px; /* 少し右に */
          font-weight: bold;
        }
        .warning {
          color: firebrick;
          text-align: center;
          margin-bottom: 20px;
          font-size: 18px; /* 少し大きめ */
          line-height: 1.6;
          font-weight: bold;
        }
        .card {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        .card h2 {
          margin-bottom: 12px;
          font-size: 18px;
          border-bottom: 1px solid #eee;
          padding-bottom: 6px;
        }
        .product-table {
          width: 100%;
          border-collapse: collapse;
        }
        .product-table th,
        .product-table td {
          border-bottom: 1px solid #eee;
          padding: 8px;
          text-align: left;
        }
        .product-name {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .product-image {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
}
