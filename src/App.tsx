import React, { useRef, useState } from 'react';
import { Toolbar } from './components/Toolbar';
import { Layer } from './components/Layer';
import { ConnectionManager } from './modules/ConnectionManager';
import { Selection } from './components/Selection';
import { SelectedShapes } from './modules/SelectedShapes';
import { Shape } from './modules/Shape';
import { ShapesProvider } from './context/ShapesContext';

const App: React.FC = () => {
  const connectionManager = useRef(new ConnectionManager());

  const handleShapeDragStart = (shapeType: string) => {

  };

  return (
    <ShapesProvider>
      <Selection />
      <Toolbar onShapeDragStart={handleShapeDragStart} />
      <Layer manager={connectionManager} width={window.innerWidth} height={window.innerHeight} />
    </ShapesProvider>
  );
};

export default App;
