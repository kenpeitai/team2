"use client";

import Image from "next/image";
import helpImage from "./image_help.png"; // 同じフォルダの画像をimport

export default function OrderCompletePage() {
  return (
    <div className="wrapper">
      <div className="content">
        <h1 className="thank-you">支援いただき、ありがとうございます。</h1>

        <p style={{ textAlign: 'center', fontSize: '16px', color: '#333', whiteSpace: 'nowrap' }}>
        被災地の皆さまに代わり、心より感謝申し上げます。皆さまのご支援は大きな力になります。
        </p>

        <p className="notice">
          支援いただいた商品は変更・キャンセルできませんのでご了承ください。
        </p>

        <div className="image-container">
          <Image
            src={helpImage}
            alt="支援イメージ"
            width={300}  // ← 小さめに変更
            height={180}
            className="help-image"
          />
        </div>

        <div className="button-container">
          <button className="home-button">ホームに戻る</button>
        </div>
      </div>

      <style jsx>{`
        .wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100%;
        }
        .content {
          text-align: center;
          max-width: 600px;
          padding: 20px;
        }
        .thank-you {
          color: orange;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .message {
          font-size: 16px;
          margin-bottom: 20px;
        }
        .notice {
          color: #b22222;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .image-container {
          margin: 20px 0;
           display: flex;
           justify-content: center; /* 左右中央 */
        }
        .help-image {
          border-radius: 10px;
        }
        .button-container {
          margin-top: 30px;
        }
        .home-button {
          padding: 10px 20px;
          background: white;
          border: 2px solid #b22222;
          color: #b22222;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
        }
        .home-button:hover {
          background: #b22222;
          color: white;
        }
      `}</style>
    </div>
  );
}
