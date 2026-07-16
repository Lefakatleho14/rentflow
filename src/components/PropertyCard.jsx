import {
  MapPinIcon,
  HomeModernIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

const statusStyles = {
  available: "bg-success/10 text-success",
  occupied: "bg-emerald/10 text-emerald",
  maintenance: "bg-warning/10 text-warning",
};

export default function PropertyCard({ property, onEdit, onDelete, onManageTenant }) {
  const coverImage = property.property_images?.find((img) => img.is_cover)
    || property.property_images?.[0];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 bg-surface flex items-center justify-center">
        {coverImage ? (
          <img
            src={coverImage.publicUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <HomeModernIcon className="h-10 w-10 text-slate-light" />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif font-semibold text-slate-900 leading-tight">
            {property.title}
          </h3>
          <span
            className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyles[property.status]}`}
          >
            {property.status}
          </span>
        </div>

        <p className="flex items-center gap-1 text-sm text-slate-light mt-1">
          <MapPinIcon className="h-4 w-4" />
          {property.city}, {property.province}
        </p>

        <p className="text-lg font-semibold text-emerald mt-3">
          R{Number(property.monthly_rent).toLocaleString()}
          <span className="text-sm font-normal text-slate-light"> /month</span>
        </p>

        <div className="flex items-center gap-3 text-xs text-slate-light mt-2">
          <span>{property.bedrooms ?? "-"} bed</span>
          <span>{property.bathrooms ?? "-"} bath</span>
          <span>{property.parking ?? 0} parking</span>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
          <button
            onClick={() => onManageTenant(property)}
            className="flex-1 flex items-center justify-center gap-1 text-sm font-medium text-emerald hover:bg-emerald/5 rounded-md py-1.5 transition-colors"
          >
            <UserPlusIcon className="h-4 w-4" />
            Tenant
          </button>
          <button
            onClick={() => onEdit(property)}
            className="flex-1 flex items-center justify-center gap-1 text-sm font-medium text-slate hover:bg-surface rounded-md py-1.5 transition-colors"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(property)}
            className="flex-1 flex items-center justify-center gap-1 text-sm font-medium text-danger hover:bg-danger/5 rounded-md py-1.5 transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}