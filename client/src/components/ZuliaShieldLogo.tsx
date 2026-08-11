import React from 'react';

interface ZuliaShieldLogoProps {
  className?: string;
}

export const ZuliaShieldLogo: React.FC<ZuliaShieldLogoProps> = ({
  className = "h-24 md:h-32",
}) => {
  return (
    <div className={`inline-flex items-center shrink-0 ${className}`}>
      {/* Official Logo PNG from public/logo.png */}
      <img
        src="/logo.png"
        alt="Estado Zulia Gobernación Bolivariana"
        className="h-full w-auto object-contain drop-shadow-md transition-all hover:scale-105"
      />
    </div>
  );
};
