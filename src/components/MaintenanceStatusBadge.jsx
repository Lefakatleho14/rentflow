const styles = {
  open: "bg-warning/10 text-warning",
  assigned: "bg-emerald/10 text-emerald",
  in_progress: "bg-emerald/10 text-emerald",
  completed: "bg-success/10 text-success",
  cancelled: "bg-slate/10 text-slate",
};

const labels = {
  open: "Open",
  assigned: "Assigned",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function MaintenanceStatusBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}