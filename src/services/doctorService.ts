
import { Doctor } from "@/types/doctor";

const API_URL = "https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json";

export const fetchDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch doctors");
    }
    const data = await response.json();
    
    // Process the data to ensure it matches our expected format
    if (Array.isArray(data)) {
      return data.map(item => {
        const doctor: Doctor = {
          id: item.id || String(Math.random()),
          name: item.name || "Unknown Doctor",
          specialty: processSpecialties(item),
          experience: processExperience(item.experience),
          fees: processFees(item.fees),
          consultationModes: processConsultationModes(item),
          rating: 4.5, // Default rating if not provided
          location: item.clinic?.address?.city || "Unknown location",
          picture: item.photo || undefined
        };
        return doctor;
      });
    }
    return [];
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

// Helper functions to process API data

function processSpecialties(item: any): string[] {
  if (item.specialities && Array.isArray(item.specialities)) {
    return item.specialities.map((spec: any) => spec.name || "").filter(Boolean);
  }
  return [];
}

function processExperience(exp: any): number {
  if (typeof exp === "string") {
    const match = exp.match(/(\d+)/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  } else if (typeof exp === "number") {
    return exp;
  }
  return 0;
}

function processFees(fees: any): number {
  if (typeof fees === "string") {
    const match = fees.match(/(\d+)/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  } else if (typeof fees === "number") {
    return fees;
  }
  return 0;
}

function processConsultationModes(item: any): ("Video Consult" | "In Clinic")[] {
  const modes: ("Video Consult" | "In Clinic")[] = [];
  if (item.video_consult) {
    modes.push("Video Consult");
  }
  if (item.in_clinic) {
    modes.push("In Clinic");
  }
  return modes;
}
