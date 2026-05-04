// src/components/Dashboard/InvoiceModal.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { X, Loader2 } from "lucide-react";
import {
  createInvoice,
  updateInvoice,
} from "../../Redux/Slice/InvoiceSlice/InvoiceSlice";

const InvoiceModal = ({ onClose, editingInvoice }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    amount: "",
    vat: "0",
    dueDate: "",
    status: "unpaid",
    description: "",
  });

  useEffect(() => {
    if (editingInvoice) {
      setFormData({
        clientName: editingInvoice.clientName || "",
        clientEmail: editingInvoice.clientEmail || "",
        clientAddress: editingInvoice.clientAddress || "",
        amount: editingInvoice.amount || "",
        vat: editingInvoice.vat || "0",
        dueDate: editingInvoice.dueDate
          ? editingInvoice.dueDate.split("T")[0]
          : "",
        status: editingInvoice.status || "unpaid",
        description: editingInvoice.description || "",
      });
    }
  }, [editingInvoice]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const vatPercent = parseFloat(formData.vat) || 0;
    const vatAmount = (amount * vatPercent) / 100;
    return amount + vatAmount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.clientName ||
      !formData.clientEmail ||
      !formData.amount ||
      !formData.dueDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    const invoiceData = {
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientAddress: formData.clientAddress,
      amount: parseFloat(formData.amount),
      vat: parseFloat(formData.vat),
      vatAmount: (parseFloat(formData.amount) * parseFloat(formData.vat)) / 100,
      total: calculateTotal(),
      dueDate: formData.dueDate,
      status: formData.status,
      description: formData.description,
    };

    try {
      let action;
      if (editingInvoice) {
        action = await dispatch(
          updateInvoice({ id: editingInvoice._id, ...invoiceData }),
        );
        if (updateInvoice.fulfilled.match(action)) {
          toast.success("Invoice updated successfully!");
          onClose();
        } else {
          toast.error("Failed to update invoice");
        }
      } else {
        action = await dispatch(createInvoice(invoiceData));
        if (createInvoice.fulfilled.match(action)) {
          toast.success("Invoice created successfully!");
          onClose();
        } else {
          toast.error("Failed to create invoice");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {editingInvoice ? "Edit Invoice" : "Create New Invoice"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Client Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Client Name *
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                placeholder="Enter client name"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8F000] focus:ring-2 focus:ring-[#C8F000]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Client Email *
              </label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                required
                placeholder="client@example.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8F000] focus:ring-2 focus:ring-[#C8F000]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Client Address
              </label>
              <textarea
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleChange}
                rows="2"
                placeholder="Enter client address"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8F000] focus:ring-2 focus:ring-[#C8F000]/20 transition-all"
              />
            </div>
          </div>

          {/* Invoice Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Invoice Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8F000] focus:ring-2 focus:ring-[#C8F000]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  VAT (%)
                </label>
                <input
                  type="number"
                  name="vat"
                  value={formData.vat}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8F000] focus:ring-2 focus:ring-[#C8F000]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8F000] focus:ring-2 focus:ring-[#C8F000]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Enter invoice description or items..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8F000] focus:ring-2 focus:ring-[#C8F000]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8F000] focus:ring-2 focus:ring-[#C8F000]/20 transition-all"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900">
                ${(parseFloat(formData.amount) || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">VAT ({formData.vat}%):</span>
              <span className="font-medium text-gray-900">
                $
                {(
                  (parseFloat(formData.amount) * parseFloat(formData.vat)) /
                    100 || 0
                ).toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
              <span className="text-gray-900">Total:</span>
              <span className="text-gray-900">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#C8F000] text-gray-900 font-semibold py-2.5 rounded-lg hover:bg-[#b8e000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {editingInvoice ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{editingInvoice ? "Update Invoice" : "Create Invoice"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceModal;
