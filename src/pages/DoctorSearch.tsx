
import React, { useEffect, useState } from "react";
import { Doctor } from "@/types/doctor";
import { fetchDoctors } from "@/services/doctorService";
import { useDoctorSearch } from "@/hooks/useDoctorSearch";
import AutocompleteSearch from "@/components/AutocompleteSearch";
import FilterPanel from "@/components/FilterPanel";
import DoctorCard from "@/components/DoctorCard";
import { toast } from "@/components/ui/sonner";

const DoctorSearch: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
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
  } = useDoctorSearch({ doctors });

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDoctors();
        if (data && Array.isArray(data)) {
          setDoctors(data);
        } else {
          setDoctors([]);
          setError("Invalid data format received from API");
          toast.error("Invalid data format received from API");
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setDoctors([]);
        setError("Failed to load doctors. Please try again.");
        toast.error("Failed to load doctors. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const handleSuggestionClick = (doctor: Doctor) => {
    if (doctor && doctor.name) {
      setSearchTerm(doctor.name);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Find Doctors</h1>
          <AutocompleteSearch
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Panel */}
          <aside className="md:sticky md:top-6 self-start">
            <FilterPanel
              allSpecialties={allSpecialties}
              selectedSpecialties={selectedSpecialties}
              toggleSpecialty={toggleSpecialty}
              consultationMode={consultationMode}
              setConsultationMode={setConsultationMode}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
          </aside>

          {/* Doctor List */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <h2 className="text-xl font-semibold text-gray-700">No doctors found</h2>
                <p className="text-gray-500 mt-2">
                  Try adjusting your search or filters to find more results.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-gray-600">
                    Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="space-y-4">
                  {filteredDoctors.map(doctor => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorSearch;
