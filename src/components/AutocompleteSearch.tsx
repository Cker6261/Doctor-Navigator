
import React, { useState, useEffect, useRef } from "react";
import { Doctor } from "@/types/doctor";
import { Search } from "lucide-react";

interface AutocompleteSearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  suggestions: Doctor[];
  onSuggestionClick: (doctor: Doctor) => void;
}

const AutocompleteSearch: React.FC<AutocompleteSearchProps> = ({
  searchTerm,
  onSearch,
  suggestions,
  onSuggestionClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsOpen(suggestions.length > 0 && searchTerm.length > 0);
  }, [suggestions, searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleSuggestionClick = (doctor: Doctor) => {
    onSearch(doctor.name);
    onSuggestionClick(doctor);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto" ref={containerRef}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search for doctors..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          data-testid="autocomplete-input"
        />
      </div>
      
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((doctor) => (
            <li
              key={doctor.id}
              onClick={() => handleSuggestionClick(doctor)}
              className="p-3 hover:bg-gray-100 cursor-pointer"
              data-testid="suggestion-item"
            >
              {doctor.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteSearch;
