// src/pages/Dashboard/Invoicetable.jsx
import React, { useState } from "react";
import {
  CheckCircle,
  Pencil,
  Trash2,
  Loader2,
  X,
  AlertTriangle,
  FileText,
} from "lucide-react";
import StatusBadge from "../../pages/Dashboard/StatusBadge";
import {
  formatCurrency,
  formatDate,
  getDaysUntilDue,
} from "../../utils/helpers";

const InvoiceTable = ({
  invoices = [],
  onDelete,
  onEdit,
  onMarkPaid,
  deleteLoading,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  // Safety check - if no invoices, show empty state
  if (!Array.isArray(invoices) || invoices.length === 0) {
    return (
      <div className="py-20 text-center text-gray-400">
        <FileText size={36} className="mx-auto mb-3 opacity-20" />
        <p className="text-sm font-medium">No invoices found</p>
        <p className="text-xs mt-1">Create your first invoice to get started</p>
      </div>
    );
  }

  const handleDeleteClick = (invoice) => {
    setInvoiceToDelete(invoice);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (invoiceToDelete) {
      onDelete(invoiceToDelete._id);
      setShowDeleteConfirm(false);
      setInvoiceToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setInvoiceToDelete(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Name/Client
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Due Date
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Amount
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                VAT
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Total
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Status
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoices.map((inv) => {
              const daysUntil = getDaysUntilDue(inv.dueDate);
              const isOverdue = daysUntil < 0 && inv.status === "unpaid";

              return (
                <tr
                  key={inv._id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  {/* Client */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-600">
                        {inv.clientName?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {inv.clientName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {inv.clientEmail}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="px-4 py-3.5">
                    <p className="text-gray-600">{formatDate(inv.dueDate)}</p>
                    {isOverdue && (
                      <p className="text-xs text-red-500 font-medium">
                        {Math.abs(daysUntil)}d overdue
                      </p>
                    )}
                    {!isOverdue &&
                      inv.status === "unpaid" &&
                      daysUntil <= 7 && (
                        <p className="text-xs text-orange-500 font-medium">
                          {daysUntil}d left
                        </p>
                      )}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3.5 text-gray-700">
                    {formatCurrency(inv.amount)}
                  </td>

                  {/* VAT */}
                  <td className="px-4 py-3.5 text-gray-500 text-xs">
                    <span>{inv.vat}%</span>
                    <span className="block text-gray-400">
                      {formatCurrency(inv.vatAmount)}
                    </span>
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3.5 font-semibold text-gray-900">
                    {formatCurrency(inv.total)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <StatusBadge status={inv.status} />
                  </td>

                  {/* Actions - Always visible */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status !== "paid" && (
                        <button
                          onClick={() => onMarkPaid(inv._id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-green-600 hover:bg-green-50 transition-colors text-xs font-medium"
                          title="Mark as Paid"
                        >
                          <CheckCircle size={14} />
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(inv)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors text-xs font-medium"
                        title="Edit Invoice"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(inv)}
                        disabled={deleteLoading === inv._id}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-xs font-medium"
                        title="Delete Invoice"
                      >
                        {deleteLoading === inv._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && invoiceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Delete Invoice
                </h2>
              </div>
              <button
                onClick={cancelDelete}
                className="hover:bg-gray-100 p-1 rounded-lg"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete this invoice?
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mt-3 mb-4">
                <p className="text-sm font-medium text-gray-900">
                  {invoiceToDelete.clientName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Amount: {formatCurrency(invoiceToDelete.total)}
                </p>
                <p className="text-xs text-gray-500">
                  Due Date: {formatDate(invoiceToDelete.dueDate)}
                </p>
                <p className="text-xs text-gray-500">
                  Status:{" "}
                  <span className="capitalize">{invoiceToDelete.status}</span>
                </p>
              </div>
              <p className="text-sm text-red-600 mb-4">
                This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteLoading === invoiceToDelete._id}
                  className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleteLoading === invoiceToDelete._id ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>Delete Invoice</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceTable;
