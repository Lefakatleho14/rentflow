import { useEffect, useRef, useState } from "react";
import {
  PlusIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import {
  getRequestsForTenant,
  getRequestsForLandlord,
  createRequest,
  updateRequestStatus,
  deleteRequest,
  uploadMaintenanceImage,
  getMaintenanceImageUrl,
} from "../services/maintenanceService";
import { getActiveLeaseForTenant } from "../services/leaseService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { maintenanceSchema } from "../lib/maintenanceSchema";
import { PRIORITIES, MAINTENANCE_STATUSES } from "../constants/maintenanceOptions";
import PriorityBadge from "../components/PriorityBadge";
import MaintenanceStatusBadge from "../components/MaintenanceStatusBadge";
import Modal from "../components/Modal";

export default function Maintenance() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  if (profileLoading || !profile) {
    return <p className="text-slate-light text-sm">Loading...</p>;
  }

  return profile.role === "landlord" ? (
    <LandlordMaintenance landlordId={user.id} />
  ) : (
    <TenantMaintenance tenantId={user.id} />
  );
}

// ---------- TENANT VIEW ----------

function TenantMaintenance({ tenantId }) {
  const [requests, setRequests] = useState([]);
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: { priority: "medium" },
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [requestsData, leaseData] = await Promise.all([
        getRequestsForTenant(tenantId),
        getActiveLeaseForTenant(tenantId),
      ]);
      setRequests(requestsData);
      setLease(leaseData);
    } catch (error) {
      toast.error("Failed to load maintenance requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const openModal = () => {
    reset({ priority: "medium", issue: "", description: "" });
    setPendingFiles([]);
    setIsModalOpen(true);
  };

  const onSubmit = async (formData) => {
    if (!lease) {
      toast.error("No active lease found");
      return;
    }
    setSubmitting(true);
    try {
      const request = await createRequest(
        tenantId,
        lease.properties.id,
        lease.landlord_id,
        formData
      );

      for (const file of pendingFiles) {
        await uploadMaintenanceImage(tenantId, request.id, file);
      }

      toast.success("Maintenance request submitted");
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setPendingFiles((prev) => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleViewImage = async (image) => {
    try {
      const url = await getMaintenanceImageUrl(image.storage_path);
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Could not load image");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-slate-900">Maintenance</h2>
          <p className="text-slate-light mt-1">
            Report an issue and track it through to completion.
          </p>
        </div>
        <button
          onClick={openModal}
          disabled={!lease}
          className="flex items-center gap-2 bg-emerald text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-emerald-dark transition-colors disabled:opacity-50"
        >
          <PlusIcon className="h-4 w-4" />
          New request
        </button>
      </div>

      {!lease && (
        <p className="text-sm text-slate-light mb-4">
          You need an active lease before submitting a maintenance request.
        </p>
      )}

      {loading ? (
        <p className="text-slate-light text-sm">Loading...</p>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <p className="text-slate-light">No maintenance requests yet.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {requests.map((request) => (
            <div key={request.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-900">{request.issue}</p>
                  <p className="text-sm text-slate-light mt-0.5">{request.properties?.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={request.priority} />
                  <MaintenanceStatusBadge status={request.status} />
                </div>
              </div>
              {request.description && (
                <p className="text-sm text-slate-light mt-2">{request.description}</p>
              )}
              {request.maintenance_images?.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {request.maintenance_images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => handleViewImage(img)}
                      className="h-14 w-14 rounded-md bg-surface border border-border flex items-center justify-center hover:border-emerald transition-colors"
                    >
                      <PhotoIcon className="h-5 w-5 text-slate-light" />
                    </button>
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-light mt-3">
                Submitted {new Date(request.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New maintenance request">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Issue</label>
            <input
              {...register("issue")}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
              placeholder="Leaking kitchen tap"
            />
            {errors.issue && <p className="text-danger text-xs mt-1">{errors.issue.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Priority</label>
            <select
              {...register("priority")}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Photos (optional)</label>
            <div className="flex flex-wrap gap-2">
              {pendingFiles.map((file, i) => (
                <div key={i} className="relative h-16 w-16 rounded-md overflow-hidden border border-border">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPendingFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-0.5 right-0.5 bg-slate-900/70 text-white rounded-full p-0.5"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-16 w-16 rounded-md border-2 border-dashed border-border flex items-center justify-center text-slate-light hover:border-emerald hover:text-emerald transition-colors"
              >
                <PhotoIcon className="h-6 w-6" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald text-white rounded-md py-2 text-sm font-medium hover:bg-emerald-dark transition-colors disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit request"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

// ---------- LANDLORD VIEW ----------

function LandlordMaintenance({ landlordId }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getRequestsForLandlord(landlordId);
      setRequests(data);
    } catch (error) {
      toast.error("Failed to load maintenance requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [landlordId]);

  const handleStatusChange = async (request, newStatus) => {
    try {
      await updateRequestStatus(request.id, newStatus);
      toast.success("Status updated");
      loadRequests();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (request) => {
    if (!confirm("Remove this maintenance request?")) return;
    try {
      await deleteRequest(request.id);
      toast.success("Request removed");
      loadRequests();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleViewImage = async (image) => {
    try {
      const url = await getMaintenanceImageUrl(image.storage_path);
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Could not load image");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-semibold text-slate-900">Maintenance</h2>
      <p className="text-slate-light mt-1 mb-6">
        Track and resolve requests across your properties.
      </p>

      {loading ? (
        <p className="text-slate-light text-sm">Loading...</p>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <p className="text-slate-light">No maintenance requests yet.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {requests.map((request) => (
            <div key={request.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-900">{request.issue}</p>
                  <p className="text-sm text-slate-light mt-0.5">
                    {request.properties?.title} — {request.profiles?.full_name || request.profiles?.email}
                  </p>
                </div>
                <PriorityBadge priority={request.priority} />
              </div>

              {request.description && (
                <p className="text-sm text-slate-light mt-2">{request.description}</p>
              )}

              {request.maintenance_images?.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {request.maintenance_images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => handleViewImage(img)}
                      className="h-14 w-14 rounded-md bg-surface border border-border flex items-center justify-center hover:border-emerald transition-colors"
                    >
                      <PhotoIcon className="h-5 w-5 text-slate-light" />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <select
                  value={request.status}
                  onChange={(e) => handleStatusChange(request, e.target.value)}
                  className="rounded-md border border-border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
                >
                  {MAINTENANCE_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>

                <button
                  onClick={() => handleDelete(request)}
                  className="text-sm text-danger hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}