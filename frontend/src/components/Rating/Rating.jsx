import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value = 5, onChange, readonly = true, size = 'w-4 h-4' }) => {
  return (
    <div className="flex items-center space-x-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange && onChange(star)}
          className={`focus:outline-none transition-transform ${
            !readonly ? 'hover:scale-125 cursor-pointer' : 'cursor-default'
          }`}
        >
          <Star
            className={`${size} ${
              star <= Math.round(value)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-200 fill-slate-100'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default Rating;
