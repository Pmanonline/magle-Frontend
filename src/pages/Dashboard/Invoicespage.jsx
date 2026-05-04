// src/pages/Dashboard/InvoicesPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Plus, Search, Filter, FileText } from "lucide-react";
import {
  fetchInvoices,
  deleteInvoice,
  markAsPaid,
  setFilter,
  selectFilteredInvoices,
} from "../../Redux/Slice/InvoiceSlice/InvoiceSlice";
import InvoiceTable from "./Invoicetable";
import InvoiceModal from "./InvoiceModal";
import { formatCurrency } from "../../utils/helpers";

const FILTERS = ["all", "paid", "unpaid"];

const InvoicesPage = () => {
  const dispatch = useDispatch();
  const invoices = useSelector(selectFilteredInvoices) || [];
  const { loading, filter, deleteLoading } = useSelector((s) => s.invoices);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;
    const action = await dispatch(deleteInvoice(id));
    if (deleteInvoice.fulfilled.match(action)) {
      toast.success("Invoice deleted");
      dispatch(fetchInvoices());
    } else {
      toast.error("Failed to delete invoice");
    }
  };

  const handleMarkPaid = async (id) => {
    const action = await dispatch(markAsPaid(id));
    if (markAsPaid.fulfilled.match(action)) {
      toast.success("Marked as paid ✓");
      dispatch(fetchInvoices());
    } else {
      toast.error("Failed to update invoice");
    }
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInvoice(null);
  };

  const filtered = invoices.filter((inv) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      inv.clientName?.toLowerCase().includes(q) ||
      inv.clientEmail?.toLowerCase().includes(q) ||
      inv.invoiceNumber?.toLowerCase().includes(q) ||
      inv._id?.toLowerCase().includes(q)
    );
  });

  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalUnpaid = invoices
    .filter((inv) => inv.status === "unpaid")
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {invoices.length} total invoices
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#C8F000] text-gray-900 font-semibold px-4 py-2.5 rounded-xl hover:bg-[#b8e000] transition-colors text-sm shadow-sm"
        >
          <Plus size={16} />
          Create Invoice
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-500 mb-1">Total</p>
          <p className="font-bold text-sm text-gray-900">
            {formatCurrency(totalAmount)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-500 mb-1">Paid</p>
          <p className="font-bold text-sm text-green-600">
            {formatCurrency(totalPaid)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-500 mb-1">Unpaid</p>
          <p className="font-bold text-sm text-orange-500">
            {formatCurrency(totalUnpaid)}
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 border-b border-gray-50">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8F000] focus:ring-2 focus:ring-[#C8F000]/20 transition-all"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => dispatch(setFilter(f))}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-all
                  ${filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-[#C8F000] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <FileText size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No invoices found</p>
            <p className="text-xs mt-1">
              {search
                ? "Try adjusting your search"
                : "Create your first invoice to get started"}
            </p>
          </div>
        ) : (
          <InvoiceTable
            invoices={filtered}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onMarkPaid={handleMarkPaid}
            deleteLoading={deleteLoading}
          />
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <InvoiceModal
          onClose={handleCloseModal}
          editingInvoice={editingInvoice}
        />
      )}
    </div>
  );
};

export default InvoicesPage;
