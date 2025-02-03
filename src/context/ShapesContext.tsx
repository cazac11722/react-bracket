import React, { createContext, useContext, useState } from "react";
import { Shape } from "../modules/Shape";
import { SelectedOffset, SelectedShapes } from "../modules/SelectedShapes";
import { LineConfig, LineShapes } from "../modules/LineShapes";

interface ShapesContextProps {
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  selectedShapes: SelectedShapes[];
  setSelectedShapes: React.Dispatch<React.SetStateAction<SelectedShapes[]>>;
  selectedOffset: SelectedOffset;
  setSelectedOffset: React.Dispatch<React.SetStateAction<SelectedOffset>>;
  lineshapes: LineShapes[];
  setLineshapes: React.Dispatch<React.SetStateAction<LineShapes[]>>;
  selectedLines: LineShapes[];
  setSelectedLines: React.Dispatch<React.SetStateAction<LineShapes[]>>;
}

const ShapesContext = createContext<ShapesContextProps | undefined>(undefined);

export const ShapesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<SelectedShapes[]>([]);
  const [selectedOffset, setSelectedOffset] = useState<SelectedOffset>({
    id: "",
    isDragging: false,
    dragStart: { startX: 0, startY: 0 },
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    type: '',
    shapeType: '',
  });
  const [lineshapes, setLineshapes] = useState<LineShapes[]>([]);
  const [selectedLines, setSelectedLines] = useState<LineShapes[]>([]);

  return (
    <ShapesContext.Provider value={{ shapes, setShapes, selectedShapes, setSelectedShapes, selectedOffset, setSelectedOffset, lineshapes, setLineshapes, selectedLines, setSelectedLines }}>
      {children}
    </ShapesContext.Provider>
  );
};

export const useShapes = (): ShapesContextProps => {
  const context = useContext(ShapesContext);
  if (!context) {
    throw new Error("useShapes must be used within a ShapesProvider");
  }
  return context;
};
