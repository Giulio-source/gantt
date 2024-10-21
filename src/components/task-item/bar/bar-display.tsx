import React from "react";
import style from "./bar.module.css";

type BarDisplayProps = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  /* progress start point */
  progressX: number;
  progressWidth: number;
  barCornerRadius: number;
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
  };
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
  crossList?: { x1: number; x2: number; start: Date; end: Date; color: string; label?: string }[];
};
export const BarDisplay: React.FC<BarDisplayProps> = ({
  id,
  x,
  y,
  width,
  height,
  isSelected,
  progressX,
  progressWidth,
  barCornerRadius,
  styles,
  onMouseDown,
  crossList,
}) => {
  const getProcessColor = () => {
    return isSelected ? styles.progressSelectedColor : styles.progressColor;
  };

  const getBarColor = () => {
    return isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };

  return (
    <g onMouseDown={onMouseDown}>
      <rect
        key={`${id}_bar`}
        x={x}
        width={width}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getBarColor()}
        className={style.barBackground}
      />
      <rect
        key={`${id}_bar_progress`}
        x={progressX}
        width={progressWidth}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getProcessColor()}
      />
      {crossList?.map(cross => (
        <rect
          key={`${id}_cross_${cross.x1}_${cross.x2}`}
          x={cross.x1}
          width={cross.x2 - cross.x1}
          y={y}
          height={height}
          ry={barCornerRadius}
          rx={barCornerRadius}
          fill={cross.color}
        />
      ))}
    </g>
  );
};
