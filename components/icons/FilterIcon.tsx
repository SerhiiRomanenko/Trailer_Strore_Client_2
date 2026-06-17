
import React from 'react';

const FilterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 3c-1.2 0-2.3.4-3.2 1.1A6.4 6.4 0 0 0 5 8.3V10H3v2h2v1.7a6.4 6.4 0 0 0 3.8 4.2 6.5 6.5 0 0 0 8.4 0 6.4 6.4 0 0 0 3.8-4.2V12h2v-2h-2V8.3a6.4 6.4 0 0 0-3.8-4.2A6.5 6.5 0 0 0 12 3Z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M3 10h18" 
    />
  </svg>
);

export default FilterIcon;
