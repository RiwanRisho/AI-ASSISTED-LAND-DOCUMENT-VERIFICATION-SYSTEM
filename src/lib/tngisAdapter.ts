import { findParcel, type Parcel } from '@/data/demoParcels';

export type LandIdentity = { district:string; taluk:string; village:string; survey:string; subdivision:string };

/**
 * Spatial adapter boundary. The demo uses synthetic parcels so it is deterministic and
 * contains no private/government data. In production, replace the resolver below with
 * an authorized TNGIS/TamilNilam connector and keep the same Parcel contract.
 */
export async function resolveLand(identity: LandIdentity): Promise<{ source:'DEMO_CADASTRE'|'TNGIS'; parcel:Parcel|null }> {
  const demo=findParcel(identity);
  return { source:'DEMO_CADASTRE', parcel:demo||null };
}
