import React from 'react';

const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.125-2.31 9.584 9.584 0 0 0-2.625-3.75m-16.5 0a9.003 9.003 0 0 0 5.25 2.372M9 12.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM18.75 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" 
    />
  </svg>
);

export default UsersIcon;