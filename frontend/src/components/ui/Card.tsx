interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverLift?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hoverLift = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-xl p-4 ${hoverLift ? 'interactive hover-lift hover:shadow-lg hover:shadow-cyan-500/5' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
