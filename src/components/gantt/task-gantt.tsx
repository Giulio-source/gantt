import React, { useEffect, useMemo, useRef } from "react";
import { useTooltip } from "../../context/TooltipContext";
import { GanttProps } from "../../types/public-types";
import { Calendar, CalendarProps } from "../calendar/calendar";
import { Grid, GridProps } from "../grid/grid";
import { GridTooltip } from "../grid/grid-tooltip";
import styles from "./gantt.module.css";
import { TaskGanttContent, TaskGanttContentProps } from "./task-gantt-content";

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
  tooltipData: GanttProps["tooltipData"];
  scrollY: number;
  scrollX: number;
};
export const TaskGantt: React.FC<TaskGanttProps> = ({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight,
  tooltipData,
  scrollY,
  scrollX,
}) => {
  const { setTooltipVisible } = useTooltip();
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
  const newBarProps = { ...barProps, svg: ganttSVGRef };
  const rowsCount = useMemo(() => {
    const count = barProps.tasks.every(
      task => typeof task.overrideRowNumber === "number"
    )
      ? Math.max(...barProps.tasks.map(task => task.overrideRowNumber!)) + 1
      : barProps.tasks.length;

    return count > 0 ? count : 1;
  }, [barProps]);

  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  useEffect(() => {
    if (verticalGanttContainerRef.current) {
      verticalGanttContainerRef.current.scrollLeft = scrollX;
    }
  }, [scrollX]);

  return (
    <div
      className={styles.ganttVerticalContainer}
      ref={verticalGanttContainerRef}
      dir="ltr"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={gridProps.svgWidth}
        height={calendarProps.headerHeight}
        fontFamily={barProps.fontFamily}
      >
        <Calendar {...calendarProps} />
      </svg>
      <div
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        ref={horizontalContainerRef}
        className={styles.horizontalContainer}
        style={
          ganttHeight
            ? { height: ganttHeight, width: gridProps.svgWidth }
            : { width: gridProps.svgWidth }
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={gridProps.svgWidth}
          height={barProps.rowHeight * rowsCount}
          fontFamily={barProps.fontFamily}
          ref={ganttSVGRef}
        >
          <Grid {...gridProps} />
          <TaskGanttContent {...newBarProps} />
        </svg>
        <GridTooltip tooltipData={tooltipData} />
      </div>
    </div>
  );
};
