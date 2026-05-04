// src/pages/Dashboard/TransactionsPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Plus,
  X,
  Loader2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  fetchTransactions,
  createTransaction,
  deleteTransaction,
  setTransactionFilter,
  selectAllTransactions,
} from "../../Redux/Slice/TransactionSlice/TransactionSlice";
import { formatCurrency, formatDate } from "../../utils/helpers";

const TransactionsPage = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectAllTransactions);
  const { loading, deleteLoading, createLoading } = useSelector(
    (s) => s.transactions,
  );
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [formData, setFormData] = useState({
    type: "income",
    amount: "",
    client: "",
    description: "",
    status: "completed",
  });

  useEffect(() => {
    dispatch(fetchTransactions({}));
  }, [dispatch]);

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;

    const action = await dispatch(deleteTransaction(transactionToDelete._id));
    if (deleteTransaction.fulfilled.match(action)) {
      toast.success("Transaction deleted successfully");
      dispatch(fetchTransactions({}));
    } else {
      toast.error("Failed to delete transaction");
    }
    setShowDeleteConfirm(false);
    setTransactionToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setTransactionToDelete(null);
  };

  const handleFilterChange = (type) => {
    setSelectedType(type);
    dispatch(setTransactionFilter({ type: type === "all" ? null : type }));
    dispatch(fetchTransactions({ type: type === "all" ? null : type }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.client || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const action = await dispatch(
      createTransaction({
        type: formData.type,
        amount: parseFloat(formData.amount),
        client: formData.client,
        description: formData.description,
        status: formData.status,
      }),
    );

    if (createTransaction.fulfilled.match(action)) {
      toast.success("Transaction created successfully!");
      setShowModal(false);
      setFormData({
        type: "income",
        amount: "",
        client: "",
        description: "",
        status: "completed",
      });
      dispatch(fetchTransactions({}));
    } else {
      toast.error("Failed to create transaction");
    }
  };

  const filteredBySearch = transactions.filter((tx) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      tx.client?.toLowerCase().includes(q) ||
      tx.description?.toLowerCase().includes(q) ||
      tx._id?.toLowerCase().includes(q)
    );
  });

  const totalIncome = filteredBySearch
    .filter((t) => t.type === "income" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredBySearch
    .filter((t) => t.type === "expense" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track all your financial activities
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#C8F000] text-gray-900 font-semibold px-4 py-2 rounded-xl hover:bg-[#b8e000] transition-colors"
        >
          <Plus size={16} />
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Income</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-5 border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-red-700 mt-1">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8F000] focus:ring-2 focus:ring-[#C8F000]/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {["all", "income", "expense"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange(type)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${
                    selectedType === type
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-[#C8F000] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredBySearch.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <ArrowLeftRight size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No transactions found</p>
            <p className="text-xs mt-1">
              Click "Add Transaction" to create your first transaction
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                    Client
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                    Date
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500">
                    Amount
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                    Status
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBySearch.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                            tx.type === "income" ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          {tx.type === "income" ? (
                            <TrendingUp size={12} className="text-green-600" />
                          ) : (
                            <TrendingDown size={12} className="text-red-600" />
                          )}
                        </div>
                        <span className="capitalize text-gray-700">
                          {tx.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="font-medium text-gray-800">{tx.client}</p>
                        {tx.description && (
                          <p className="text-xs text-gray-400">
                            {tx.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td
                      className={`px-5 py-3.5 font-semibold text-right ${
                        tx.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          tx.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : tx.status === "pending"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-red-50 text-red-700"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteClick(tx)}
                        disabled={deleteLoading === tx._id}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-xs font-medium"
                      >
                        {deleteLoading === tx._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Transaction Modal */}
      {showModal && (
        <div className="sticky inset-0 z-50 flex items-center justify-center p-4  bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                Add Transaction
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="hover:bg-gray-100 p-1 rounded-lg"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Transaction Type *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "income" })}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                      formData.type === "income"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, type: "expense" })
                    }
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                      formData.type === "expense"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Expense
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Client/Recipient *
                </label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) =>
                    setFormData({ ...formData, client: e.target.value })
                  }
                  required
                  placeholder="e.g., Gadget Gallery LTD"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8F000] focus:ring-2 focus:ring-[#C8F000]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Amount (₦) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8F000] focus:ring-2 focus:ring-[#C8F000]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="2"
                  placeholder="Additional details about this transaction..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8F000] focus:ring-2 focus:ring-[#C8F000]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8F000] focus:ring-2 focus:ring-[#C8F000]/20"
                >
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 bg-[#C8F000] text-gray-900 font-semibold py-2 rounded-lg hover:bg-[#b8e000] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {createLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create Transaction"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && transactionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Delete Transaction
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
                Are you sure you want to delete this transaction?
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mt-3 mb-4">
                <p className="text-sm font-medium text-gray-900">
                  {transactionToDelete.client}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Amount: {formatCurrency(transactionToDelete.amount)}
                </p>
                <p className="text-xs text-gray-500">
                  Date: {formatDate(transactionToDelete.createdAt)}
                </p>
                {transactionToDelete.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    Description: {transactionToDelete.description}
                  </p>
                )}
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
                  disabled={deleteLoading === transactionToDelete._id}
                  className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleteLoading === transactionToDelete._id ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>Delete Transaction</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
