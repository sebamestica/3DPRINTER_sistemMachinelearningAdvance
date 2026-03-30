export type GeometryType = 
  | 'solid' 
  | 'gyroid' 
  | 'honeycomb' 
  | 'rectilinear' 
  | 'cubic' 
  | 'diamond' 
  | 'lattice' 
  | 'octet';

export interface GeometryBehaviorProfile {
  isotropy: number; // 0 to 1
  energyAbsorption: number; // 0 to 1
  verticalStrengthRatio: number; // multiplier
  printability: number; // 0 to 1
}

export interface GeometryCardData {
  type: GeometryType;
  name: string;
  description: string;
  strengths: string[];
  tradeOffs: string[];
  profile: GeometryBehaviorProfile;
}
