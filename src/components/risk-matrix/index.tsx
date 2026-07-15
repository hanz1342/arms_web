import React from "react";

interface RiskMatrixCellProps {
   riskScoreCount?: number;
   status?: string;
   className?: string;
   onClick: () => void;
}

export function RiskMatrixCell(props: RiskMatrixCellProps) {
   return <div style={{ cursor: 'pointer' }} className={props.className} onClick={() => props.onClick()}>
   <div style={{ marginBottom: 10 }}>{props.status}</div>
   <div>Risk Count: {props.riskScoreCount}</div>
</div>
}