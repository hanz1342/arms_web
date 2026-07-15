import React from 'react';

interface FontSizeContextType {
  fontSize: number;
  onChangeFontSize: (fontSize: number) => void;
}

const initialValue: FontSizeContextType = {
  fontSize: 14,
  onChangeFontSize: (fontSize: number) => console.log('fontSize:', fontSize),
};

export const FontSizeContext = React.createContext(initialValue);
export function usePlayListConext() {
  return React.useContext(FontSizeContext);
}
