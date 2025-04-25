
export interface Doctor {
  id: string;
  name: string;
  specialty: string[];
  experience: number;
  fees: number;
  consultationModes: ConsultationMode[];
  rating: number;
  location: string;
  picture?: string;
}

export type ConsultationMode = "Video Consult" | "In Clinic";

export type SortOption = "fees" | "experience";
