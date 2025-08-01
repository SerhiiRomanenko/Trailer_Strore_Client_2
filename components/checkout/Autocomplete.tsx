import React, { useState, useEffect, useRef } from 'react';
import SpinnerIcon from '../icons/SpinnerIcon';

interface Suggestion {
  Description: string;
  [key: string]: any;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: Suggestion) => void;
  getSuggestions: (query: string) => Promise<Suggestion[]>;
  placeholder?: string;
}

const Autocomplete: React.FC<Props> = ({ value, onChange, onSelect, getSuggestions, placeholder }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const result = await getSuggestions(value);
        setSuggestions(result);
        setIsOpen(result.length > 0);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch suggestions');
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timeoutId = setTimeout(() => {
        fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value, getSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion: Suggestion) => {
    onSelect(suggestion);
    setIsOpen(false);
  };

  const inputClasses = "w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors";

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setIsOpen(suggestions.length > 0 || !!error)}
        autoComplete="off"
        className={inputClasses}
      />
      {isLoading && <SpinnerIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />}
      
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {error && <li className="px-4 py-2 text-red-500">{error}</li>}
          {!error && suggestions.length === 0 && !isLoading && (
            <li className="px-4 py-2 text-slate-500">Нічого не знайдено.</li>
          )}
          {!error && suggestions.map((suggestion) => (
            <li
              key={suggestion.Ref}
              onClick={() => handleSelect(suggestion)}
              className="px-4 py-2 cursor-pointer hover:bg-orange-100 text-slate-800"
            >
              {suggestion.Description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;