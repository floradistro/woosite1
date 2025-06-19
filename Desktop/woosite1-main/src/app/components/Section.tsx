import React from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  dataSection?: boolean;
}

const Section: React.FC<SectionProps> = ({
  id,
  className = '',
  style,
  children,
  dataSection = true
}) => {
  const defaultStyle = {
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.07)',
    ...style
  };

  return (
    <section
      id={id}
      data-section={dataSection ? '' : undefined}
      className={`relative bg-[#4a4a4a] overflow-hidden -mt-px ${className}`}
      style={defaultStyle}
    >
      {children}
    </section>
  );
};

export default Section; 