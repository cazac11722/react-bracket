import { LineShapes } from "./LineShapes";
import { SelectedOffset, SelectedShapes } from "./SelectedShapes";
import { Shape } from "./Shape";
import { Line } from "../shapes/Line";

export class StateManager {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    shapes: Shape[];
    selectedShapes: SelectedShapes[];
    lineshapes: LineShapes[];
    selectedLines: LineShapes[];
    selectedOffset: SelectedOffset;
    setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
    setSelectedShapes: React.Dispatch<React.SetStateAction<SelectedShapes[]>>;
    setLineshapes: React.Dispatch<React.SetStateAction<LineShapes[]>>;
    setSelectedOffset: React.Dispatch<React.SetStateAction<SelectedOffset>>;
    setSelectedLines: React.Dispatch<React.SetStateAction<LineShapes[]>>;

    constructor(
        canvasRef: React.RefObject<HTMLCanvasElement | null>,
        shapes: Shape[],
        setShapes: React.Dispatch<React.SetStateAction<Shape[]>>,
        selectedShapes: SelectedShapes[],
        setSelectedShapes: React.Dispatch<React.SetStateAction<SelectedShapes[]>>,
        lineshapes: LineShapes[],
        setLineshapes: React.Dispatch<React.SetStateAction<LineShapes[]>>,
        selectedLines: LineShapes[],
        setSelectedLines: React.Dispatch<React.SetStateAction<LineShapes[]>>,
        selectedOffset: SelectedOffset,
        setSelectedOffset: React.Dispatch<React.SetStateAction<SelectedOffset>>,

    ) {
        this.canvasRef = canvasRef;
        this.shapes = shapes;
        this.setShapes = setShapes;
        this.selectedShapes = selectedShapes;
        this.setSelectedShapes = setSelectedShapes;
        this.lineshapes = lineshapes;
        this.setLineshapes = setLineshapes;
        this.selectedLines = selectedLines;
        this.setSelectedLines = setSelectedLines;
        this.selectedOffset = selectedOffset;
        this.setSelectedOffset = setSelectedOffset;
    }

    selectedFilter() {
        // console.log(this.selectedShapes)
        return this.selectedShapes.reduce(
            (bounds, shape) => {
                const left = shape.x;
                const right = shape.x + shape.width;
                const top = shape.y;
                const bottom = shape.y + shape.height;

                return {
                    id: shape.id,
                    minX: Math.min(bounds.minX, left),
                    maxX: Math.max(bounds.maxX, right),
                    minY: Math.min(bounds.minY, top),
                    maxY: Math.max(bounds.maxY, bottom),
                };
            },
            {
                id: '',
                minX: Infinity,
                maxX: -Infinity,
                minY: Infinity,
                maxY: -Infinity,
            }
        );
    }

    updateShapes(newShapes: Shape[]) {
        this.setShapes(newShapes);
    }

    updateSelectedShapes(newSelectedShapes: SelectedShapes[]) {
        this.setSelectedShapes(newSelectedShapes);
    }

    updateLineshapes(newLineshapes: LineShapes[]) {
        this.setLineshapes(newLineshapes);
    }

    updateSelectedOffset(newOffset: SelectedOffset) {
        this.setSelectedOffset(newOffset);
    }

}
