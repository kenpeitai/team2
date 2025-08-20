"use client"; // Next.jsのApp Router環境で必要になる場合があります

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';

// --- モックデータ（画面に表示する見本データ）---
const mockSubmittedData = {
  evacueeCount: '150',
  injuredCount: '5',
  electricity: '利用可能',
  gas: '停止中',
  water: '利用可能',
  traffic: '一部規制あり',
};

// --- コンポーネント本体 ---
export default function MockConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const shelterId = params.id as string;

  // 「修正する」ボタンが押されたときの動作
  const handleEditClick = () => {
    // 避難所入力ページに遷移
    router.push(`/shelter/${shelterId}/shelter-input`);
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-start justify-center p-6 sm:p-10">
        <div className="w-full max-w-2xl">
          {/* ヘッダー */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">避難所の状況</h1>
            <p className="text-sm text-foreground/70 mt-1">
              避難所ID: {shelterId} の現在の状況です。
            </p>
          </div>

          {/* --- 表示エリア --- */}
          <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
            
            {/* 避難状況 */}
            <section>
              <h2 className="text-lg font-medium text-muted-foreground mb-3">避難状況</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">避難人数</p>
                  <p className="text-xl font-bold">{mockSubmittedData.evacueeCount} 人</p>
                </div>
                <div>
                  <p className="text-sm font-medium">けが人数</p>
                  <p className="text-xl font-bold">{mockSubmittedData.injuredCount} 人</p>
                </div>
              </div>
            </section>

            <hr />

            {/* ライフラインの状況 */}
            <section>
              <h2 className="text-lg font-medium text-muted-foreground mb-3">ライフラインの状況</h2>
              <div className="space-y-2 text-base">
                <p>電気：<span className="font-bold ml-2">{mockSubmittedData.electricity}</span></p>
                <p>ガス：<span className="font-bold ml-2">{mockSubmittedData.gas}</span></p>
                <p>水道：<span className="font-bold ml-2">{mockSubmittedData.water}</span></p>
              </div>
            </section>

            <hr />

            {/* 交通情報 */}
            <section>
              <h2 className="text-lg font-medium text-muted-foreground mb-2">周囲の交通情報</h2>
              <p className="text-base font-bold">{mockSubmittedData.traffic}</p>
            </section>
          </div>
          
          {/* 更新ボタン */}
          <div className="pt-2">
            <button 
              type="button" 
              className="btn btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full"
              onClick={handleEditClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>内容を修正する</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
