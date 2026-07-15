import Tag from "antd/es/tag";

interface RiskStatusProps {
   status?: string;
}

export function RiskStatus(props: RiskStatusProps) {
   const { status } = props;
   if (status === "Active") return <Tag color="#87d068" style={{ minWidth: 70, textAlign: "center" }}>{status}</Tag>;
   if (status === "Cancelled") return <Tag color="#ff0000" style={{ minWidth: 70, textAlign: "center" }}>{status}</Tag>;
   if (status === "Draft") return <Tag style={{ minWidth: 70, textAlign: "center" }}>{status}</Tag>;
   return <></>;
}

export function RiskStatusRaduis(props: RiskStatusProps) {
   const { status } = props;
   if (status === "Active") return <Tag color="#87d068" style={{ minWidth: 70, borderRadius: 100, marginLeft: 10, textAlign: "center", }}>{status}</Tag>;
   if (status === "Cancelled") return <Tag color="#ff0000" style={{ minWidth: 70, borderRadius: 100, marginLeft: 10, textAlign: "center" }}>{status}</Tag>;
   if (status === "Draft") return <Tag style={{ minWidth: 70, borderRadius: 100, marginLeft: 10, textAlign: "center" }}>{status}</Tag>;
   return <></>;
}