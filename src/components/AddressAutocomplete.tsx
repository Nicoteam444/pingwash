"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface AddressDetails {
  display_name: string;
  road?: string;
  house_number?: string;
  postcode?: string;
  city?: string;
  country?: string;
  lat?: string;
  lon?: string;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    road?: string;
    house_number?: string;
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    country?: string;
  };
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (displayName: string, details: AddressDetails | null) => void;
  placeholder?: string;
  className?: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Saisissez votre adresse",
  className = "",
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&addressdetails=1&countrycodes=fr&limit=5`,
        {
          headers: {
            "Accept-Language": "fr",
          },
        }
      );
      const data: NominatimResult[] = await res.json();
      setSuggestions(data);
      setIsOpen(data.length > 0);
      setHighlightIndex(-1);
    } catch {
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val, null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  };

  const handleSelect = (result: NominatimResult) => {
    const city =
      result.address.city ||
      result.address.town ||
      result.address.village ||
      result.address.municipality ||
      "";

    const details: AddressDetails = {
      display_name: result.display_name,
      road: result.address.road,
      house_number: result.address.house_number,
      postcode: result.address.postcode,
      city,
      country: result.address.country,
      lat: result.lat,
      lon: result.lon,
    };

    // Build a clean short address
    const parts = [];
    if (result.address.house_number) parts.push(result.address.house_number);
    if (result.address.road) parts.push(result.address.road);
    if (result.address.postcode || city) {
      parts.push(
        [result.address.postcode, city].filter(Boolean).join(" ")
      );
    }
    const shortAddress = parts.length > 0 ? parts.join(", ") : result.display_name;

    onChange(shortAddress, details);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format suggestion for display
  const formatSuggestion = (result: NominatimResult) => {
    const city =
      result.address.city ||
      result.address.town ||
      result.address.village ||
      result.address.municipality ||
      "";
    const parts = [];
    if (result.address.house_number) parts.push(result.address.house_number);
    if (result.address.road) parts.push(result.address.road);
    const street = parts.join(" ");

    return {
      main: street || city || result.display_name.split(",")[0],
      secondary: [result.address.postcode, city].filter(Boolean).join(" "),
    };
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-pingwash-blue rounded-full animate-spin" />
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true);
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-[15px] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 border border-gray-200 shadow-sm"
      />

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
          {suggestions.map((result, index) => {
            const { main, secondary } = formatSuggestion(result);
            return (
              <button
                key={`${result.lat}-${result.lon}`}
                type="button"
                onClick={() => handleSelect(result)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                  index === highlightIndex
                    ? "bg-pingwash-ice"
                    : "hover:bg-gray-50"
                } ${index > 0 ? "border-t border-gray-100" : ""}`}
              >
                <svg
                  className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-black">{main}</p>
                  {secondary && (
                    <p className="text-xs text-gray-400">{secondary}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
