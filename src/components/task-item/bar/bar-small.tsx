import React from "react";
import { getProgressPoint } from "../../../helpers/bar-helper";
import { TaskItemProps } from "../task-item";
import { BarDisplay } from "./bar-display";
import { BarProgressHandle } from "./bar-progress-handle";
import styles from "./bar.module.css";
import { useTooltip } from "../../../context/TooltipContext";

export const BarSmall: React.FC<TaskItemProps> = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  onEventStart,
  isSelected,
}) => {
  const { setTooltipVisible } = useTooltip();
  const progressPoint = getProgressPoint(
    task.progressWidth + task.x1,
    task.y,
    task.height
  );
  return (
    <g
      className={
        task.styles.backgroundColor === "#FFFFFF00"
          ? styles.barInvisible
          : styles.barWrapper
      }
      tabIndex={0}
      onMouseEnter={() => setTooltipVisible(false)}
    >
      <BarDisplay
        id={task.id}
        x={task.x1}
        y={task.y}
        width={task.x2 - task.x1}
        height={task.height}
        progressX={task.progressX}
        progressWidth={task.progressWidth}
        barCornerRadius={task.barCornerRadius}
        styles={task.styles}
        isSelected={isSelected}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />
      <g className="handleGroup">
        {isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e => {
              onEventStart("progress", task, e);
            }}
          />
        )}
      </g>
    </g>
  );
};
