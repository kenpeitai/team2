import type { ShelterStatusDto } from '@/types/api';
import { request } from './base';

// 避難所状況取得
export const getShelterStatus = (shelterId: number) =>
  request<ShelterStatusDto>(`/api/shelter-status/${shelterId}`);

// 避難所状況更新
export const updateShelterStatusRecord = (shelterId: number, body: ShelterStatusDto) =>
  request<ShelterStatusDto>(`/api/shelter-status/${shelterId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

// 避難所状況履歴取得
export const getShelterStatusHistory = (shelterId: number, limit = 10) =>
  request<ShelterStatusDto[]>(`/api/shelter-status/${shelterId}/history?limit=${limit}`);

// 全避難所状況概要
export const getAllSheltersStatusSummary = () =>
  request<ShelterStatusDto[]>('/api/shelter-status/summary');


