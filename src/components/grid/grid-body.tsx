import React, { MouseEvent, ReactNode } from "react";
import { useTooltip } from "../../context/TooltipContext";
import { addToDate } from "../../helpers/date-helper";
import { Task } from "../../types/public-types";
import styles from "./grid.module.css";

export type GridBodyProps = {
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  highlightsHoursColor?: Map<string, string>;
  rtl: boolean;
  onColumnHighlight?: (time: number) => void;
};
export const GridBody: React.FC<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  todayColor,
  highlightsHoursColor,
  rtl,
  onColumnHighlight,
}) => {
  const { setTooltipPosition, setTooltipVisible } = useTooltip();
  let y = 0;

  function onMouseEnterColumn(hour: number) {
    setTooltipVisible(true);
    hour && onColumnHighlight && onColumnHighlight(hour);
  }

  function onMouseMoveColumn(e: MouseEvent) {
    setTooltipPosition(e.clientX, e.clientY);
  }

  const gridRows: ReactNode[] = [];
  const gridColumns: ReactNode[] = [];
  const rowLines: ReactNode[] = [
    <line
      key="RowLineFirst"
      x="0"
      y1={0}
      x2={svgWidth}
      y2={0}
      className={styles.gridRowLine}
    />,
  ];

  for (const task of tasks) {
    gridRows.push(
      <rect
        key={"Row" + task.id}
        x="0"
        y={y}
        width={svgWidth}
        height={rowHeight}
        className={styles.gridRow}
      />
    );
    rowLines.push(
      <line
        key={"RowLine" + task.id}
        x="0"
        y1={y + rowHeight}
        x2={svgWidth}
        y2={y + rowHeight}
        className={styles.gridRowLine}
      />
    );
    y += rowHeight;
  }

  const now = new Date();
  let tickX = 0;
  const ticks: ReactNode[] = [];
  let today: ReactNode = <rect />;
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const isFullHour = date.getMinutes() === 0;

    if (isFullHour) {
      gridColumns.push(
        <rect
          key={"column" + date.getTime()}
          x={tickX}
          y={0}
          width={columnWidth}
          height={tasks.length * rowHeight}
          className={styles.gridColumn}
          onMouseEnter={() => onMouseEnterColumn(date.getHours())}
          onMouseMove={onMouseMoveColumn}
          onMouseLeave={() => setTooltipVisible(false)}
          data-time={`${hh}:${mm}`}
        />
      );
    }

    ticks.push(
      <line
        key={date.getTime()}
        x1={tickX}
        y1={0}
        x2={tickX}
        y2={y}
        className={styles.gridTick}
        style={{
          ...({
            "--highlight-color": highlightsHoursColor?.get(`${hh}:00`) ?? "",
          } as React.CSSProperties),
          strokeDasharray: !!highlightsHoursColor?.get(`${hh}:00`) ? "7 4" : "",
        }}
        data-time={`${hh}:${mm}`}
      />
    );
    ticks.push(
      <line
        key={date.getTime() + "thin"}
        x1={tickX + columnWidth / 2}
        y1={0}
        x2={tickX + columnWidth / 2}
        y2={y}
        className={styles.gridThinTick}
        style={{
          ...({
            "--highlight-color":
              highlightsHoursColor?.get(`${hh}:30`) ?? "",
          } as React.CSSProperties),
          strokeDasharray: !!highlightsHoursColor?.get(`${hh}:30`) ? "7 4" : "",
        }}
        data-time={`${hh}:30`}
      />
    );
    if (
      (i + 1 !== dates.length &&
        date.getTime() < now.getTime() &&
        dates[i + 1].getTime() >= now.getTime()) ||
      // if current date is last
      (i !== 0 &&
        i + 1 === dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(
          date,
          date.getTime() - dates[i - 1].getTime(),
          "millisecond"
        ).getTime() >= now.getTime())
    ) {
      today = (
        <rect
          x={tickX}
          y={0}
          width={columnWidth}
          height={y}
          fill={todayColor}
        />
      );
    }
    // rtl for today
    if (
      rtl &&
      i + 1 !== dates.length &&
      date.getTime() >= now.getTime() &&
      dates[i + 1].getTime() < now.getTime()
    ) {
      today = (
        <rect
          x={tickX + columnWidth}
          y={0}
          width={columnWidth}
          height={y}
          fill={todayColor}
        />
      );
    }
    tickX += columnWidth;
  }
  return (
    <g className="gridBody">
      <g className="rows">{gridRows}</g>
      <g className="columns">{gridColumns}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="ticks">{ticks}</g>
      <g className="today">{today}</g>
    </g>
  );
};
