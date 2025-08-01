import React from 'react';

const WrenchScrewdriverIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l.354-.354a3.75 3.75 0 0 0-5.303-5.303l-.354.353M3 3l3.03 3.03m0 0L9 9a5.25 5.25 0 0 1 7.425 0l3.03 3.03M3 3h3.75v3.75" 
    />
  </svg>
);

export default WrenchScrewdriverIcon;
