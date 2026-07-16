import { useEffect, useState } from "react";
import { PlusIcon, CheckCircleIcon, PencilIcon, TrashIcon, ArrowUpTrayIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import {
  getPaymentsForLandlord,
  getPaymentsForTenant,
  createPayment,
  updatePayment,
  confirmPayment,
  deletePayment,
  uploadPaymentProof,
  getPaymentProofUrl,
  calculateMonthlyIncome,
  calculateYearlyIncome,
  calculateOutstanding,
} from "../services/paymentService";
import { getActiveLeasesForLandlord } from "../services/leaseService";
import PaymentForm from "../components/PaymentForm";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import { MONTHS } from "../constants/paymentOptions";

export default function Payments() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  if (profileLoading || !profile) {
    return <p className="text-slate-light text-sm">Loading...</p>;
  }

  return profile.role === "landlord" ? (
    <LandlordPayments landlordId={user.id} />
  ) : (
    <TenantPayments tenantId={user.id} />
  );
}

function LandlordPayments({ landlordId }) {
  const [payments, setPayments] = useState([]);
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [selectedLeaseId, setSelectedLeaseId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [paymentsData, leasesData] = await Promise.all([
        getPaymentsForLandlord(landlordId),
        getActiveLeasesForLandlord(landlordId),
      ]);
      setPayments(paymentsData);
      setLeases(leasesData);
    } catch (error) {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [landlordId]);

  const openCreateModal = () => {
    setEditingPayment(null);
    setSelectedLeaseId(leases[0]?.id || "");
    setIsModalOpen(true);
  };

  const openEditModal = (payment) => {
    setEditingPayment(payment);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingPayment) {
        await updatePayment(editingPayment.id, formData);
        toast.success("Payment updated");
      } else {
        const lease = leases.find((l) => l.id === selectedLeaseId);
        if (!lease) {
          toast.error("Select a tenant first");
          setSubmitting(false);
          return;
        }
        await createPayment(landlordId, lease, formData);
        toast.success("Payment recorded");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async (payment) => {
    try {
      await confirmPayment(payment.id);
      toast.success("Payment confirmed as paid");
      loadData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (payment) => {
    if (!confirm("Delete this payment record?")) return;
    try {
      await deletePayment(payment.id);
      toast.success("Payment deleted");
      loadData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleViewProof = async (payment) => {
    try {
      const url = await getPaymentProofUrl(payment.proof_storage_path);
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Could not load proof of payment");
    }
  };

  const now = new Date();
  const monthlyIncome = calculateMonthlyIncome(payments, now.getMonth() + 1, now.getFullYear());
  const yearlyIncome = calculateYearlyIncome(payments, now.getFullYear());
  const outstanding = calculateOutstanding(payments);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-slate-900">Payments</h2>
          <p className="text-slate-light mt-1">
            Know who has paid rent and what's still outstanding.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={leases.length === 0}
          className="flex items-center gap-2 bg-emerald text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-emerald-dark transition-colors disabled:opacity-50"
        >
          <PlusIcon className="h-4 w-4" />
          Record payment
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-slate-light">This month</p>
          <p className="text-2xl font-serif font-semibold text-slate-900 mt-1">
            R{monthlyIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-slate-light">This year</p>
          <p className="text-2xl font-serif font-semibold text-slate-900 mt-1">
            R{yearlyIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-slate-light">Outstanding</p>
          <p className="text-2xl font-serif font-semibold text-danger mt-1">
            R{outstanding.toLocaleString()}
          </p>
        </div>
      </div>

      {leases.length === 0 && (
        <p className="text-sm text-slate-light mb-4">
          Assign an active tenant to a property before recording payments.
        </p>
      )}

      {loading ? (
        <p className="text-slate-light text-sm">Loading...</p>
      ) : payments.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <p className="text-slate-light">No payments recorded yet.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr className="text-left text-slate-light">
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Proof</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{payment.properties?.title}</td>
                  <td className="px-4 py-3">{MONTHS[payment.month - 1]} {payment.year}</td>
                  <td className="px-4 py-3 font-medium">R{Number(payment.amount).toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={payment.status} /></td>
                  <td className="px-4 py-3">
                    {payment.proof_storage_path ? (
                      <button
                        onClick={() => handleViewProof(payment)}
                        className="text-emerald text-xs font-medium hover:underline"
                      >
                        View
                      </button>
                    ) : (
                      <span className="text-slate-light text-xs">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {payment.status !== "paid" && (
                        <button
                          onClick={() => handleConfirm(payment)}
                          title="Confirm as paid"
                          className="text-success hover:bg-success/10 p-1.5 rounded-md transition-colors"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(payment)}
                        className="text-slate hover:bg-surface p-1.5 rounded-md transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(payment)}
                        className="text-danger hover:bg-danger/5 p-1.5 rounded-md transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPayment ? "Edit payment" : "Record payment"}
      >
        {!editingPayment && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-900 mb-1">Tenant / Property</label>
            <select
              value={selectedLeaseId}
              onChange={(e) => setSelectedLeaseId(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
            >
              {leases.map((lease) => (
                <option key={lease.id} value={lease.id}>
                  {lease.properties?.title} — {lease.tenant_email}
                </option>
              ))}
            </select>
          </div>
        )}
        <PaymentForm
          defaultValues={editingPayment}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
}

function TenantPayments({ tenantId }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await getPaymentsForTenant(tenantId);
      setPayments(data);
    } catch (error) {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [tenantId]);

  const handleUploadProof = async (paymentId, file) => {
    setUploadingId(paymentId);
    try {
      await uploadPaymentProof(tenantId, paymentId, file);
      toast.success("Proof of payment uploaded");
      loadPayments();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploadingId(null);
    }
  };

  const handleViewProof = async (payment) => {
    try {
      const url = await getPaymentProofUrl(payment.proof_storage_path);
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Could not load proof of payment");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-semibold text-slate-900">Payments</h2>
      <p className="text-slate-light mt-1 mb-6">
        Your rent payment history and status.
      </p>

      {loading ? (
        <p className="text-slate-light text-sm">Loading...</p>
      ) : payments.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <p className="text-slate-light">No payment records yet.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {payment.properties?.title}
                </p>
                <p className="text-sm text-slate-light">
                  {MONTHS[payment.month - 1]} {payment.year}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-slate-900">
                  R{Number(payment.amount).toLocaleString()}
                </p>
                <StatusBadge status={payment.status} />
              </div>

              <div className="flex items-center gap-2 ml-4">
                {payment.proof_storage_path ? (
                  <button
                    onClick={() => handleViewProof(payment)}
                    className="flex items-center gap-1 text-sm text-emerald hover:underline"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    View proof
                  </button>
                ) : (
                  <label className="flex items-center gap-1 text-sm text-slate hover:text-emerald cursor-pointer">
                    <ArrowUpTrayIcon className="h-4 w-4" />
                    {uploadingId === payment.id ? "Uploading..." : "Upload proof"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="hidden"
                      disabled={uploadingId === payment.id}
                      onChange={(e) => {
                        if (e.target.files[0]) handleUploadProof(payment.id, e.target.files[0]);
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}