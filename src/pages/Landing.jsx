import { Link } from "react-router-dom";
import {
  BuildingOffice2Icon,
  BanknotesIcon,
  WrenchScrewdriverIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: BuildingOffice2Icon,
    title: "Properties",
    description: "Track every unit, photo, and lease from one organized view.",
  },
  {
    icon: BanknotesIcon,
    title: "Payments",
    description: "Know who has paid rent, what's outstanding, and confirm proof of payment.",
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "Maintenance",
    description: "Tenants submit requests with photos; you assign, update, and close them.",
  },
  {
    icon: BellAlertIcon,
    title: "Real-time updates",
    description: "Get notified the instant something needs your attention — no refresh needed.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-xl font-serif font-semibold text-emerald">RentFlow</h1>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate hover:text-slate-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="bg-emerald text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-emerald-dark transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <h2 className="text-4xl font-serif font-semibold text-slate-900 leading-tight">
          Know who has paid rent, which properties are vacant, and what needs
          attention — all from one dashboard.
        </h2>
        <p className="text-slate-light mt-4 text-lg">
          RentFlow helps landlords and property managers track properties,
          tenants, payments, and maintenance requests without juggling
          spreadsheets.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link
            to="/register"
            className="bg-emerald text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-emerald-dark transition-colors"
          >
            Create your account
          </Link>
          <Link
            to="/login"
            className="border border-border rounded-md px-6 py-3 text-sm font-medium text-slate hover:bg-card transition-colors"
          >
            Log in
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-card border border-border rounded-lg p-5"
            >
              <Icon className="h-6 w-6 text-emerald mb-3" />
              <h3 className="font-serif font-semibold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-light mt-1">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}