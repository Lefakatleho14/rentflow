const styles = {
  low: "bg-slate/10 text-slate",
  medium: "bg-warning/10 text-warning",
  high: "bg-danger/10 text-danger",
  emergency: "bg-danger text-white",
};

export default function PriorityBadge({ priority }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[priority]}`}>
      {priority}
    </span>
  );
}