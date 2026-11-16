import { Capacitor } from '@capacitor/core';
import bundledData from '../../../../shared/demo-data.json';
import type { Data } from './types';
export const API_BASE=(import.meta.env.VITE_API_BASE_URL||'/api/v1').replace(/\/$/,'');
export async function loadData(signal?:AbortSignal):Promise<Data>{
 if(Capacitor.isNativePlatform()&&!import.meta.env.VITE_API_BASE_URL)return bundledData as Data;
 const response=await fetch(`${API_BASE}/bootstrap`,{signal,headers:{Accept:'application/json'}});
 if(!response.ok)throw new Error('The match centre could not connect. Please try again.');
 const data=await response.json();
 if(!Array.isArray(data.matches)||!Array.isArray(data.teams))throw new Error('The API returned an unexpected response.');
 return data;
}
export function kickoff(value:string){return new Date(value).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',hour12:false});}
export function dayLabel(date:string){return new Date(date+'T12:00:00').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});}
export function dateOffset(date:string,offset:number){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+offset);return d.toISOString().slice(0,10);}
