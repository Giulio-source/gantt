import React, { createContext, useContext, useState } from "react";

type TooltipContextType = {
  x: number;
  y: number;
  visible: boolean;
  setTooltipPosition: (x: number, y: number) => void;
  setTooltipVisible: (visible: boolean) => void;
};

// Create the TooltipContext
const TooltipContext = createContext<TooltipContextType>({
  x: 0,
  y: 0,
  visible: false,
  setTooltipPosition: () => {},
  setTooltipVisible: () => {},
});

// Create a provider component
export const TooltipProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  // Function to update tooltip position
  const setTooltipPosition = (x: number, y: number) => {
    setPosition({ x, y });
  };

  const setTooltipVisible = (visible: boolean) => {
    setVisible(visible);
  };

  return (
    <TooltipContext.Provider
      value={{
        x: position.x,
        y: position.y,
        visible,
        setTooltipPosition,
        setTooltipVisible,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
};

// Create a custom hook for consuming the context
export const useTooltip = () => useContext(TooltipContext);
