
import React from "react";
import { Doctor } from "@/types/doctor";
import { cn } from "@/lib/utils";

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden mb-4 card-shadow hover:shadow-lg transition-shadow"
      data-testid="doctor-card"
    >
      <div className="p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {doctor.picture ? (
              <img src={doctor.picture} alt={doctor.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-gray-400">
                {doctor.name ? doctor.name.charAt(0) : "?"}
              </span>
            )}
          </div>
        </div>
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-gray-800" data-testid="doctor-name">
            {doctor.name || "Unknown Doctor"}
          </h2>
          <div className="mt-1 flex flex-wrap gap-1" data-testid="doctor-specialty">
            {doctor.specialty && Array.isArray(doctor.specialty) ? 
              doctor.specialty.map((spec, index) => (
                <span 
                  key={index}
                  className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {spec}
                </span>
              )) : 
              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">No specialties</span>
            }
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Experience:</span>
              <span className="font-medium" data-testid="doctor-experience">{doctor.experience || 0} years</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Fees:</span>
              <span className="font-medium" data-testid="doctor-fee">₹{doctor.fees || 0}</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {doctor.consultationModes && Array.isArray(doctor.consultationModes) ? 
              doctor.consultationModes.map((mode, index) => (
                <span 
                  key={index} 
                  className={cn(
                    "text-xs px-3 py-1 rounded-full",
                    mode === "Video Consult" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-orange-100 text-orange-700"
                  )}
                >
                  {mode}
                </span>
              )) :
              <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">No consultation modes</span>
            }
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end justify-between">
          <div className="bg-green-100 text-green-700 px-2 py-1 rounded flex items-center">
            <span className="font-bold">{doctor.rating || 0}</span>
            <span className="text-xs ml-1">★</span>
          </div>
          <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg mt-2">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
