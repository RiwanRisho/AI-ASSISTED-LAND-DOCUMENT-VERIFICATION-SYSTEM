'use client';
import dynamic from 'next/dynamic';
import type { Parcel } from '@/data/demoParcels';
export type RealLocation = { center:[number,number]; label:string; source:string; confidence?:number; exact?:boolean };
const Map = dynamic(()=>import('./MapViewInner'),{ssr:false,loading:()=> <div className="h-full grid place-items-center text-slate-400">Loading Tamil Nadu spatial engine…</div>});
export default function MapView({parcel,location}:{parcel?:Parcel|null;location?:RealLocation|null}){ return <Map parcel={parcel} location={location}/>; }
