import { Link } from "react-router-dom";
import { LockClosedIcon } from "@heroicons/react/24/outline";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-surface px-4">
      <LockClosedIcon className="h-10 w-10 text-slate-light mb-4" />
      <h2 className="text-2xl font-serif font-semibold text-slate-900">Access restricted</h2>
      <p className="text-slate-light mt-2 max-w-sm">
        You don't have permission to view this page.
      </p>
      <Link to="/app" className="mt-4 text-emerald font-medium text-sm hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}