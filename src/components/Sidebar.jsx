import { NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  BuildingOffice2Icon,
  BanknotesIcon,
  WrenchScrewdriverIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { supabase } from "../lib/supabase";
import { useProfile } from "../hooks/useProfile";
import toast from "react-hot-toast";
import NotificationBell from "./NotificationBell";

const navItems = [
  { to: "/", label: "Dashboard", icon: HomeIcon },
  { to: "/properties", label: "Properties", icon: BuildingOffice2Icon },
  { to: "/payments", label: "Payments", icon: BanknotesIcon },
  { to: "/maintenance", label: "Maintenance", icon: WrenchScrewdriverIcon },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { profile } = useProfile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-card flex flex-col">
      <div className="px-6 py-5 border-b border-border flex items-center justify-between">
        <h1 className="text-xl font-serif font-semibold text-emerald">RentFlow</h1>
        <NotificationBell />
      </div>

      <nav className="p-3 space-y-1 flex-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald/10 text-emerald"
                  : "text-slate hover:bg-surface"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        {profile && (
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-medium text-slate-900 truncate">
              {profile.full_name || "Unnamed user"}
            </p>
            <p className="text-xs text-slate-light capitalize">{profile.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate hover:bg-surface transition-colors"
        >
          <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
          Log out
        </button>
      </div>
    </aside>
  );
}