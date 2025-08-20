"use client";
import type { NeedsListPayload, StoredNeeds } from "@/types/needs";

export interface IOrdersService {
  getCurrentDraft(): Promise<StoredNeeds | null>;
  saveCurrentDraft(payload: NeedsListPayload): Promise<StoredNeeds>;
  clearCurrentDraft(): Promise<void>;
  subscribeCurrentDraft(cb: (d: StoredNeeds | null) => void): () => void;
}

/** 開発用モック（localStorage）。バックエンド接続時はHTTP実装に差し替え */
const LS_KEY = "needs:latestPayload:v1";

class MockOrdersService implements IOrdersService {
  async getCurrentDraft(): Promise<StoredNeeds | null> {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as StoredNeeds) : null;
  }
  async saveCurrentDraft(payload: NeedsListPayload): Promise<StoredNeeds> {
    const data: StoredNeeds = { savedAtISO: new Date().toISOString(), payload };
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    window.dispatchEvent(
      new StorageEvent("storage", { key: LS_KEY, newValue: JSON.stringify(data) }),
    );
    return data;
  }
  async clearCurrentDraft(): Promise<void> {
    localStorage.removeItem(LS_KEY);
    window.dispatchEvent(new StorageEvent("storage", { key: LS_KEY, newValue: null }));
  }
  subscribeCurrentDraft(cb: (d: StoredNeeds | null) => void): () => void {
    const h = (e: StorageEvent) => {
      if (e.key === LS_KEY) cb(e.newValue ? (JSON.parse(e.newValue) as StoredNeeds) : null);
    };
    window.addEventListener("storage", h);
    // 初回通知
    this.getCurrentDraft().then(cb).catch(() => cb(null));
    return () => window.removeEventListener("storage", h);
  }
}

let svc: IOrdersService | null = null;
export function getOrdersService(): IOrdersService {
  if (svc) return svc;
  // 将来クラウドに切替えるときはここで HTTP 実装に差替え
  svc = new MockOrdersService();
  return svc;
}
