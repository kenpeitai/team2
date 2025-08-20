import type { Shelter, ShelterDto } from '@/types/api';
import { request } from './base';

// 避難所
export const createShelter = (body: ShelterDto) =>
  request<Shelter>('/api/shelters', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const updateShelterStatus = (id: number, body: ShelterDto) =>
  request<Shelter>(`/api/shelters/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

export const getAllShelters = () => request<Shelter[]>('/api/shelters');
export const getShelterById = (id: number) => request<Shelter>(`/api/shelters/${id}`);
export const searchShelters = (params: { shelterName?: string; address?: string; isActive?: boolean }) => {
  const q = new URLSearchParams();
  if (params.shelterName) q.set('shelterName', params.shelterName);
  if (params.address) q.set('address', params.address);
  if (typeof params.isActive === 'boolean') q.set('isActive', String(params.isActive));
  return request<Shelter[]>(`/api/shelters/search?${q.toString()}`);
};
export const searchShelterByName = (shelterName: string) => request<Shelter[]>(`/api/shelters/search/name?shelterName=${encodeURIComponent(shelterName)}`);
export const searchShelterByAddress = (address: string) => request<Shelter[]>(`/api/shelters/search/address?address=${encodeURIComponent(address)}`);
export const searchShelterByRepresentative = (lastName: string, firstName: string) => request<Shelter[]>(`/api/shelters/search/representative?lastName=${encodeURIComponent(lastName)}&firstName=${encodeURIComponent(firstName)}`);
export const searchShelterByEvacueeCount = (count: number) => request<Shelter[]>(`/api/shelters/search/evacuees?count=${count}`);
export const searchShelterByInjuredCount = (count: number) => request<Shelter[]>(`/api/shelters/search/injured?count=${count}`);
export const deleteShelter = (id: number) => request<void>(`/api/shelters/${id}`, { method: 'DELETE' });
