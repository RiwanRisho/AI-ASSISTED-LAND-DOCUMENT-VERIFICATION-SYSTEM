export type Parcel = {
  id: string;
  district: string;
  taluk: string;
  village: string;
  survey: string;
  subdivision: string;
  owner: string;
  extentAcres: number;
  center: [number, number];
  polygon: [number, number][];
  confidence: number;
};

export const demoParcels: Parcel[] = [
  {
    id: 'TN-CBE-PER-KVP-128-4B', district: 'Coimbatore', taluk: 'Perur', village: 'Kovai Pudur', survey: '128', subdivision: '4B', owner: 'K. Meenakshi', extentAcres: 1.42, center: [10.9368, 76.9091], confidence: 96.8,
    polygon: [[10.9380,76.9078],[10.9382,76.9102],[10.9359,76.9108],[10.9355,76.9082]]
  },
  {
    id: 'TN-CBE-PER-KVP-128-4A', district: 'Coimbatore', taluk: 'Perur', village: 'Kovai Pudur', survey: '128', subdivision: '4A', owner: 'S. Kumar', extentAcres: 1.24, center: [10.9362, 76.9116], confidence: 95.4,
    polygon: [[10.9372,76.9104],[10.9374,76.9126],[10.9352,76.9130],[10.9349,76.9110]]
  },
  {
    id: 'TN-SLM-YRC-AGM-77-2C', district: 'Salem', taluk: 'Yercaud', village: 'Adivaram', survey: '77', subdivision: '2C', owner: 'R. Arul', extentAcres: 2.08, center: [11.7702, 78.1940], confidence: 94.2,
    polygon: [[11.7712,78.1927],[11.7718,78.1945],[11.7697,78.1954],[11.7690,78.1932]]
  },
  {
    id: 'TN-MDU-MEL-VLP-42-7A', district: 'Madurai', taluk: 'Melur', village: 'Vellalur', survey: '42', subdivision: '7A', owner: 'P. Kavitha', extentAcres: 0.88, center: [10.0320, 78.3420], confidence: 97.1,
    polygon: [[10.0330,78.3408],[10.0335,78.3425],[10.0311,78.3431],[10.0307,78.3414]]
  },
  {
    id: 'TN-TNJ-KMB-PNR-19-3D', district: 'Thanjavur', taluk: 'Kumbakonam', village: 'Papanasam Road', survey: '19', subdivision: '3D', owner: 'M. Rajendran', extentAcres: 1.11, center: [10.9546, 79.3858], confidence: 93.6,
    polygon: [[10.9556,79.3846],[10.9560,79.3863],[10.9538,79.3870],[10.9534,79.3850]]
  }
];

export function normalizeSurvey(survey: string, subdivision: string) {
  return `${survey}`.replace(/\s+/g, '').toUpperCase() + '/' + `${subdivision}`.replace(/\s+/g, '').toUpperCase();
}

export function findParcel(input: { district?: string; taluk?: string; village?: string; survey?: string; subdivision?: string }) {
  const norm = normalizeSurvey(input.survey || '', input.subdivision || '');
  return demoParcels.find(p =>
    normalizeSurvey(p.survey, p.subdivision) === norm &&
    (!input.district || p.district.toLowerCase() === input.district.toLowerCase()) &&
    (!input.taluk || p.taluk.toLowerCase() === input.taluk.toLowerCase()) &&
    (!input.village || p.village.toLowerCase() === input.village.toLowerCase())
  );
}
