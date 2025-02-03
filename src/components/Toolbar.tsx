import React, { useEffect, useState } from "react";
import "../styles/Toolbar.css";

import Shape1 from "../assets/images/shape1.png";

import { ReactComponent as Tool } from "../assets/svg/Tool.svg";
import { ReactComponent as Box } from "../assets/svg/Box.svg";
import { ReactComponent as Edit } from "../assets/svg/Edit.svg";
import { ReactComponent as LibraryAdd } from "../assets/svg/LibraryAdd.svg";
import { ReactComponent as Download } from "../assets/svg/Download.svg";
import { useShapes } from "../context/ShapesContext";

interface ToolbarProps {
  onShapeDragStart: (shapeType: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onShapeDragStart }) => {
  const { selectedShapes } = useShapes();
  const [activeIndex, setActiveIndex] = useState<number>(0); // 현재 선택된 항목 인덱스

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, shapeType: string) => {
    e.dataTransfer.setData("shapeType", shapeType); // 드래그 데이터 설정
    onShapeDragStart(shapeType);
  };

  const handleClick = (index: number) => {
    setActiveIndex(index); // 클릭한 항목의 인덱스로 변경
  };

  useEffect(() => {

    if(selectedShapes.length > 0) {
      setActiveIndex(0);
    }

  }, [selectedShapes]);



  return (
    <>
      {/* 📌 activeIndex === 1일 때 'active' 클래스 추가 */}
      <div className={`toolbar-box ${activeIndex === 1 ? "active" : ""}`}>
        <button draggable onDragStart={(e) => handleDragStart(e, "Rect")}>
          <img src={Shape1} alt="Shape" />
        </button>
      </div>

      <ul className="toolbar">
        <li className={activeIndex === 0 ? "active" : ""} onClick={() => handleClick(0)}>
          <Tool />
        </li>
        <li className={activeIndex === 1 ? "active" : ""} onClick={() => handleClick(1)}>
          <Box />
        </li>
        <li className={activeIndex === 2 ? "active" : ""} onClick={() => handleClick(2)}>
          <Edit />
        </li>
        <li className={activeIndex === 3 ? "active" : ""} onClick={() => handleClick(3)}>
          <LibraryAdd />
        </li>
        <li className={activeIndex === 4 ? "active" : ""} onClick={() => handleClick(4)}>
          <Download />
        </li>
      </ul>
    </>
  );
};
