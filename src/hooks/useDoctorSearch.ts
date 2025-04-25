
import { useState, useEffect, useMemo } from "react";
import { Doctor, ConsultationMode, SortOption } from "@/types/doctor";
import { useSearchParams } from "react-router-dom";

interface UseDoctorSearchOptions {
  doctors: Doctor[];
}

interface UseDoctorSearchResult {
  filteredDoctors: Doctor[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  consultationMode: ConsultationMode | null;
  setConsultationMode: (mode: ConsultationMode | null) => void;
  selectedSpecialties: string[];
  toggleSpecialty: (specialty: string) => void;
  sortOption: SortOption | null;
  setSortOption: (option: SortOption | null) => void;
  suggestions: Doctor[];
  allSpecialties: string[];
  clearAllFilters: () => void;
}

export function useDoctorSearch({ doctors = [] }: UseDoctorSearchOptions = { doctors: [] }): UseDoctorSearchResult {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("search") || "");
  const [consultationMode, setConsultationMode] = useState<ConsultationMode | null>(
    (searchParams.get("mode") as ConsultationMode | null)
  );
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    searchParams.get("specialties") ? searchParams.get("specialties")!.split(",") : []
  );
  const [sortOption, setSortOption] = useState<SortOption | null>(
    (searchParams.get("sort") as SortOption | null)
  );

  // Extract all unique specialties from doctors
  const allSpecialties = useMemo(() => {
    const specialtiesSet = new Set<string>();
    
    // Check if doctors array exists and has items before trying to iterate
    if (doctors && Array.isArray(doctors) && doctors.length > 0) {
      doctors.forEach(doctor => {
        if (doctor && doctor.specialty && Array.isArray(doctor.specialty)) {
          doctor.specialty.forEach(specialty => {
            if (specialty) {
              specialtiesSet.add(specialty);
            }
          });
        }
      });
    }
    
    return Array.from(specialtiesSet).sort();
  }, [doctors]);

  // Update URL params when filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    
    if (searchTerm) params.search = searchTerm;
    if (consultationMode) params.mode = consultationMode;
    if (selectedSpecialties.length > 0) params.specialties = selectedSpecialties.join(",");
    if (sortOption) params.sort = sortOption;
    
    setSearchParams(params);
  }, [searchTerm, consultationMode, selectedSpecialties, sortOption, setSearchParams]);

  // Toggle specialty selection
  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev => {
      if (prev.includes(specialty)) {
        return prev.filter(s => s !== specialty);
      } else {
        return [...prev, specialty];
      }
    });
  };

  // Filter and sort doctors based on all criteria
  const filteredDoctors = useMemo(() => {
    // If doctors is undefined or empty, return empty array
    if (!doctors || !Array.isArray(doctors) || doctors.length === 0) {
      return [];
    }
    
    let filtered = [...doctors];
    
    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(doctor =>
        doctor && doctor.name && doctor.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    
    // Filter by consultation mode
    if (consultationMode) {
      filtered = filtered.filter(doctor =>
        doctor && doctor.consultationModes && Array.isArray(doctor.consultationModes) && 
        doctor.consultationModes.includes(consultationMode)
      );
    }
    
    // Filter by specialties
    if (selectedSpecialties.length > 0) {
      filtered = filtered.filter(doctor =>
        doctor && doctor.specialty && Array.isArray(doctor.specialty) &&
        doctor.specialty.some(specialty => specialty && selectedSpecialties.includes(specialty))
      );
    }
    
    // Sort results
    if (sortOption) {
      filtered.sort((a, b) => {
        if (!a || !b) return 0;
        
        if (sortOption === 'fees') {
          return (a.fees || 0) - (b.fees || 0); // ascending
        } else if (sortOption === 'experience') {
          return (b.experience || 0) - (a.experience || 0); // descending
        }
        return 0;
      });
    }
    
    return filtered;
  }, [doctors, searchTerm, consultationMode, selectedSpecialties, sortOption]);

  // Generate suggestions based on the search term
  const suggestions = useMemo(() => {
    if (!searchTerm || !doctors || !Array.isArray(doctors) || doctors.length === 0) return [];
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matches = doctors.filter(doctor =>
      doctor && doctor.name && doctor.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
    
    // Return top 3 matches
    return matches.slice(0, 3);
  }, [doctors, searchTerm]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setConsultationMode(null);
    setSelectedSpecialties([]);
    setSortOption(null);
    setSearchParams({});
  };

  return {
    filteredDoctors,
    searchTerm,
    setSearchTerm,
    consultationMode,
    setConsultationMode,
    selectedSpecialties,
    toggleSpecialty,
    sortOption,
    setSortOption,
    suggestions,
    allSpecialties,
    clearAllFilters
  };
}
