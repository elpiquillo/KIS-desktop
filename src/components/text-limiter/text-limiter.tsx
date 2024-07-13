import React, { useState } from 'react';
import { Button } from '@mui/material';

interface TextLimiterProps {
  text: string;
  maxChars: number;
  showMoreBtn?: boolean;
  showDots?: boolean;
}

export default function TextLimiter({ text, maxChars, showMoreBtn, showDots }: TextLimiterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleIsExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const displayText = isExpanded ? text : text.substring(0, maxChars);

  return (
    <>
      {displayText}
      {showDots && text.length > maxChars && (
        isExpanded ? '' : '...'
      )}
      {showMoreBtn && text.length > maxChars && (
        <Button
          size="small"
          onClick={toggleIsExpanded}
          aria-label='Show more text / Show less text'
        >
          {isExpanded ? '- Less' : '+ More'}
        </Button>
      )}
    </>
  );
};
