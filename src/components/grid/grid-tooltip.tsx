import React from "react";
import { useTooltip } from "../../context/TooltipContext";
import { GanttProps } from "../../types/public-types";
import styles from "./grid.module.css";

const tooltipHeight = 200;

export const GridTooltip = ({
  tooltipData,
}: {
  tooltipData: GanttProps["tooltipData"];
}) => {
  const { x, y, visible } = useTooltip();

  if (!visible) {
    return null;
  }

  return (
    <div
      style={{
        height: `${tooltipHeight}px`,
        transform: `translate(${x + 10}px, ${y - tooltipHeight - 10}px)`,
      }}
      className={styles.gridTooltip}
    >
      <p>{tooltipData?.hour.toString().padStart(2, "0") + ":00"}</p>
      <li>00-15: {tooltipData?.firstQuarter}</li>
      <li>15-30: {tooltipData?.secondQuarter}</li>
      <li>30-45: {tooltipData?.thirdQuarter}</li>
      <li>45-60: {tooltipData?.fourthQuarter}</li>
      <p className={styles.gridTooltipHighlight}>
        Fabbisogno: {tooltipData?.hourlyNeed}
      </p>
    </div>
  );
};
