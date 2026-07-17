import { useEffect, useState } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../services/propertyService";
import {
  getLeasesForProperty,
  createLease,
  updateLease,
  deleteLease,
} from "../services/leaseService";
import PropertyCard from "../components/PropertyCard";
import PropertyForm from "../components/PropertyForm";
import ImageUploader from "../components/ImageUploader";
import LeaseForm from "../components/LeaseForm";
import Modal from "../components/Modal";
import { SkeletonCard } from "../components/Skeleton";

export default function Properties() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);

  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [tenantModalProperty, setTenantModalProperty] = useState(null);
  const [existingLease, setExistingLease] = useState(null);
  const [leaseSubmitting, setLeaseSubmitting] = useState(false);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await getProperties(user.id);
      setProperties(data);
    } catch (error) {
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadProperties();
  }, [user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortBy]);

  const openCreateModal = () => {
    setEditingProperty(null);
    setImages([]);
    setIsModalOpen(true);
  };

  const openEditModal = (property) => {
    setEditingProperty(property);
    setImages(
      property.property_images?.map((img) => ({
        ...img,
        publicUrl: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/property-images/${img.storage_path}`,
      })) || []
    );
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingProperty) {
        await updateProperty(editingProperty.id, formData);
        toast.success("Property updated");
      } else {
        await createProperty(user.id, formData);
        toast.success("Property created");
      }
      setIsModalOpen(false);
      loadProperties();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (property) => {
    if (!confirm(`Delete "${property.title}"? This cannot be undone.`)) return;
    try {
      await deleteProperty(property.id);
      toast.success("Property deleted");
      loadProperties();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openTenantModal = async (property) => {
    setTenantModalProperty(property);
    setExistingLease(null);
    try {
      const leases = await getLeasesForProperty(property.id);
      if (leases.length > 0) setExistingLease(leases[0]);
    } catch (error) {
      toast.error("Failed to load lease info");
    }
    setIsTenantModalOpen(true);
  };

  const handleLeaseSubmit = async (formData) => {
    setLeaseSubmitting(true);
    try {
      if (existingLease) {
        await updateLease(existingLease.id, formData);
        toast.success("Lease updated");
      } else {
        await createLease(user.id, tenantModalProperty.id, formData);
        toast.success("Tenant assigned");
      }
      setIsTenantModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLeaseSubmitting(false);
    }
  };

  const handleLeaseDelete = async () => {
    if (!confirm("Remove this tenant from the property?")) return;
    try {
      await deleteLease(existingLease.id);
      toast.success("Tenant removed");
      setIsTenantModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredProperties = properties
    .filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rent_high":
          return b.monthly_rent - a.monthly_rent;
        case "rent_low":
          return a.monthly_rent - b.monthly_rent;
        case "name_az":
          return a.title.localeCompare(b.title);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "newest":
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

  const totalPages = Math.ceil(filteredProperties.length / PAGE_SIZE);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-slate-900">Properties</h2>
          <p className="text-slate-light mt-1">
            Track every property, payment, and maintenance request from one place.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-emerald text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-emerald-dark transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Add property
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="h-4 w-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or city..."
            className="w-full pl-9 pr-3 py-2 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
        >
          <option value="all">All statuses</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="rent_high">Rent: high to low</option>
          <option value="rent_low">Rent: low to high</option>
          <option value="name_az">Name: A–Z</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <p className="text-slate-light">No properties yet. Add your first one to get started.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={{
                  ...property,
                  property_images: property.property_images?.map((img) => ({
                    ...img,
                    publicUrl: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/property-images/${img.storage_path}`,
                  })),
                }}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onManageTenant={openTenantModal}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-border text-slate hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>

              <span className="text-sm text-slate-light px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-border text-slate hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProperty ? "Edit property" : "Add property"}
      >
        <PropertyForm
          defaultValues={editingProperty}
          onSubmit={handleSubmit}
          submitting={submitting}
        />

        {editingProperty && (
          <div className="mt-6 pt-6 border-t border-border">
            <ImageUploader
              landlordId={user.id}
              propertyId={editingProperty.id}
              images={images}
              onImagesChange={setImages}
            />
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isTenantModalOpen}
        onClose={() => setIsTenantModalOpen(false)}
        title={existingLease ? "Manage tenant" : "Assign tenant"}
      >
        <LeaseForm
          defaultValues={existingLease}
          onSubmit={handleLeaseSubmit}
          submitting={leaseSubmitting}
        />
        {existingLease && (
          <button
            onClick={handleLeaseDelete}
            className="w-full mt-3 text-sm font-medium text-danger hover:bg-danger/5 rounded-md py-2 transition-colors"
          >
            Remove tenant
          </button>
        )}
      </Modal>
    </div>
  );
}