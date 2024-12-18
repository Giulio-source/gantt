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
  stickyHeader: boolean;
};
export const TaskGantt: React.FC<TaskGanttProps> = ({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight,
  tooltipData,
  scrollY,
  scrollX,
  stickyHeader,
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
    const headerNode = document.getElementById("gantt-header-calendar");
    let initialHeaderTopPosition = 0;
    let initialWindowScrollY = window.scrollY;

    if (stickyHeader && headerNode) {
      if (initialHeaderTopPosition === 0) {
        initialHeaderTopPosition = headerNode.getBoundingClientRect().top;
      }

      const handleScroll = () => {
        const scrollTop = window.scrollY;

        const headerOffset =
          scrollTop - initialHeaderTopPosition - initialWindowScrollY;

        if (headerOffset > 0) {
          headerNode.style.transform = `translateY(${headerOffset}px)`;
        } else {
          headerNode.style.transform = "translateY(0px)";
        }
      };

      const handleResize = () => {
        initialHeaderTopPosition = headerNode.getBoundingClientRect().top;
        initialWindowScrollY = window.scrollY;
        headerNode.style.transform = "translateY(0px)";
      };

      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }

    return;
  }, [stickyHeader]);

  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY, stickyHeader]);

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
      <div id="gantt-header-calendar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={gridProps.svgWidth}
          height={calendarProps.headerHeight}
          fontFamily={barProps.fontFamily}
        >
          <Calendar {...calendarProps} />
        </svg>
      </div>
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
