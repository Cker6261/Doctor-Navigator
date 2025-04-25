
import React from "react";
import { ConsultationMode, SortOption } from "@/types/doctor";

interface FilterPanelProps {
  allSpecialties: string[];
  selectedSpecialties: string[];
  toggleSpecialty: (specialty: string) => void;
  consultationMode: ConsultationMode | null;
  setConsultationMode: (mode: ConsultationMode | null) => void;
  sortOption: SortOption | null;
  setSortOption: (option: SortOption | null) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  allSpecialties,
  selectedSpecialties,
  toggleSpecialty,
  consultationMode,
  setConsultationMode,
  sortOption,
  setSortOption
}) => {
  // Ensure allSpecialties is always an array
  const specialties = Array.isArray(allSpecialties) ? allSpecialties : [];

  return (
    <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow">
      {/* Consultation Mode Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3" data-testid="filter-header-moc">
          Consultation Mode
        </h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={consultationMode === "Video Consult"}
              onChange={() => setConsultationMode("Video Consult")}
              className="rounded text-primary focus:ring-primary"
              data-testid="filter-video-consult"
            />
            <span>Video Consult</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={consultationMode === "In Clinic"}
              onChange={() => setConsultationMode("In Clinic")}
              className="rounded text-primary focus:ring-primary"
              data-testid="filter-in-clinic"
            />
            <span>In Clinic</span>
          </label>
        </div>
      </div>

      {/* Specialties Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3" data-testid="filter-header-speciality">
          Speciality
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {specialties.map(specialty => {
            // Convert specialty to kebab-case format for data-testid
            const specialtyId = specialty.replace(/\s+/g, '-').replace('/', '-');
            
            return (
              <label key={specialty} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedSpecialties.includes(specialty)}
                  onChange={() => toggleSpecialty(specialty)}
                  className="rounded text-primary focus:ring-primary"
                  data-testid={`filter-specialty-${specialtyId}`}
                />
                <span>{specialty}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Sort Filter */}
      <div>
        <h3 className="font-semibold text-lg mb-3" data-testid="filter-header-sort">
          Sort By
        </h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={sortOption === "fees"}
              onChange={() => setSortOption("fees")}
              className="rounded text-primary focus:ring-primary"
              data-testid="sort-fees"
            />
            <span>Fees (Low to High)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={sortOption === "experience"}
              onChange={() => setSortOption("experience")}
              className="rounded text-primary focus:ring-primary"
              data-testid="sort-experience"
            />
            <span>Experience (High to Low)</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
