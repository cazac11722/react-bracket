import React, { useState } from 'react';
import '../styles/Selection.css';
import { Shape } from '../modules/Shape';
import { useShapes } from '../context/ShapesContext';

import { ReactComponent as Menu } from "../assets/svg/Menu.svg";
import { ReactComponent as Sort } from "../assets/svg/sort.svg";

export const Selection: React.FC = () => {
  const { shapes, selectedShapes, setSelectedShapes, lineshapes } = useShapes();
  const [active, setActive] = useState<boolean>(false); // 현재 선택된 항목 인덱스

  const handleShapeToggle = (shape: Shape) => {
    setSelectedShapes((prev) => {
      // ✅ 현재 shape가 selectedShapes에 존재하는지 확인
      const isSelected = prev.some((selected) => selected.id === shape.id);

      // ✅ 존재하면 제거, 없으면 추가 (토글)
      return isSelected ? prev.filter((selected) => selected.id !== shape.id) : [...prev, shape];
    });
  };

  return (
    <div className="Selection">
      <ul className='flex'>
        <li>
          <Menu className={active ? `hidden` : ''} onClick={(e) => setActive(!active)} />
          <Sort className={!active ? `hidden` : ''} onClick={(e) => setActive(!active)} />
        </li>
        <li>
          <select>
            <option>경기 종류</option>
          </select>
        </li>
      </ul>
      <ul className={active ? `hidden` : ''}>
        {shapes.map((shape) => (
          <li
            key={shape.id}
            className={selectedShapes.some((e) => e.id === shape.id) ? "active" : ""}
            onClick={() => handleShapeToggle(shape)}
          >
            <div className='flex'>
              <strong>{shape.name}</strong>
            </div>
            <ul>
              {lineshapes.map((line, index) => {

                if(line.startShapeId == shape.id)
                return (
                  <li
                    key={index}
                  >
                    <strong>- {line.startType} 선</strong>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};
