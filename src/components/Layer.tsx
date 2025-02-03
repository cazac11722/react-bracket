import React, { useRef, useEffect, useState } from 'react';
import { EventHandler } from '../utils/EventUtils';
import { ConnectionManager } from '../modules/ConnectionManager';
import { useShapes } from '../context/ShapesContext';
import { StateManager } from '../modules/StateManager';
import { DrawingHandler } from '../utils/DrawingUtils';
import { LineShapes } from '../modules/LineShapes';

interface LayerProps {
  manager: React.RefObject<ConnectionManager>;
  width: number;
  height: number;
}

export const Layer: React.FC<LayerProps> = ({ manager, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { shapes, setShapes, selectedShapes, setSelectedShapes, selectedOffset, setSelectedOffset, lineshapes, setLineshapes, selectedLines, setSelectedLines } = useShapes();

  const stateManager = new StateManager(canvasRef, shapes, setShapes, selectedShapes, setSelectedShapes, lineshapes, setLineshapes, selectedLines, setSelectedLines, selectedOffset, setSelectedOffset);
  const eventHandler = new EventHandler(stateManager);
  const drawingHandler = new DrawingHandler(stateManager);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawingHandler.drawShapes();
    drawingHandler.drawSelectionBox();
    drawingHandler.drawLine();
    
    drawingHandler.getBoundingBoxs();
    drawingHandler.selectLine();

    if (stateManager.selectedOffset.type != 'move' && stateManager.selectedShapes.length <= 1) {
      drawingHandler.radiusMarkers();
    }
  }, [shapes, selectedShapes, selectedOffset, lineshapes, selectedLines]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ border: '1px solid black' }}
        onMouseDown={(e) => eventHandler.handleMouseDown(e.nativeEvent)}
        onMouseMove={(e) => eventHandler.handleMouseMove(e.nativeEvent)}
        onMouseUp={(e) => eventHandler.handleMouseUp()}
        onDrop={(e) => eventHandler.handleDrop(e)}
        onDragOver={(e) => e.preventDefault()}
      />
    </>
  );
};
