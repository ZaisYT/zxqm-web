import React, { ReactNode, useEffect } from 'react';
import './css/Card.css';

interface CardProps {
  onclicke?: () => void;
  color: string;
  children?: ReactNode;
}

const Card: React.FC<CardProps> = ({ onclicke, color, children }) => {
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLDivElement>('.card');
    cards.forEach((card) => {
      card.onmousemove = function (e) {
        const x = e.pageX - card.offsetLeft;
        const y = e.pageY - card.offsetTop;

        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
      };
    });

    // Clean up function
    return () => {
      cards.forEach((card) => {
        card.onmousemove = null;
      });
    };
  }, []);

  return (
    <div className="card" onClick={onclicke ? onclicke : () => {}} style={{ '--clr': color } as React.CSSProperties}>
      <div className="cardContent" >
        {children}
      </div>
    </div>
  );
};

export default Card;
