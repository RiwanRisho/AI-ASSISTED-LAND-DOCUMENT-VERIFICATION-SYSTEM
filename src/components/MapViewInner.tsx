'use client';
import { MapContainer, TileLayer, Polygon, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import type { Parcel } from '@/data/demoParcels';
import type { RealLocation } from './MapView';
const icon=L.divIcon({className:'',html:'<div style="width:18px;height:18px;border-radius:50%;background:#7a1f2b;border:3px solid #fff;box-shadow:0 0 20px #7a1f2b"></div>',iconSize:[18,18],iconAnchor:[9,9]});
const realIcon=L.divIcon({className:'',html:'<div style="width:22px;height:22px;border-radius:50%;background:#c79a32;border:4px solid #fff;box-shadow:0 0 28px #c79a32"></div>',iconSize:[22,22],iconAnchor:[11,11]});
function Fly({parcel,location}:{parcel?:Parcel|null;location?:RealLocation|null}){ const map=useMap(); useEffect(()=>{ const target=location?.center || parcel?.center; if(target) map.flyTo(target, location?.exact?19:15,{duration:2.4}); },[parcel,location,map]); return null; }
export default function MapViewInner({parcel,location}:{parcel?:Parcel|null;location?:RealLocation|null}){
 const center: [number,number]=location?.center || parcel?.center || [11.1271,78.6569];
 return <MapContainer center={center} zoom={location?.exact?17:parcel?15:7} minZoom={5} maxZoom={19} scrollWheelZoom className="h-full w-full rounded-2xl" style={{background:'#f4f1e8'}}>
   <TileLayer attribution="Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community" url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxNativeZoom={18} maxZoom={19} keepBuffer={4} updateWhenZooming={false} updateWhenIdle={true} />
   {parcel && !location && <><Polygon positions={parcel.polygon} pathOptions={{color:'#7a1f2b',weight:4,fillColor:'#7a1f2b',fillOpacity:.28}}/><Marker position={parcel.center} icon={icon}><Popup><b>{parcel.survey}/{parcel.subdivision}</b><br/>{parcel.village}, {parcel.district}<br/>Demo parcel confidence: {parcel.confidence}%</Popup></Marker></>}
   {location && <><Circle center={location.center} radius={location.exact?35:220} pathOptions={{color:'#c79a32',weight:3,fillColor:'#c79a32',fillOpacity:.12}}/><Marker position={location.center} icon={realIcon}><Popup><b>REAL LOCATION RESOLVED</b><br/>{location.label}<br/>Source: {location.source}{location.confidence?`<br/>Confidence: ${location.confidence}%`:''}</Popup></Marker></>}
   <Fly parcel={parcel} location={location}/>
 </MapContainer>;
}
