// src/pages/Dashboard/WalletsPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Wallet, Plus, X, Loader2, Trash2, Edit } from "lucide-react";
import {
  fetchWallets,
  createWallet,
  updateWallet,
  deleteWallet,
  selectAllWallets,
  selectTotalBalance,
} from "../../Redux/Slice/WalletSlice/WalletSlice";
import { formatCurrency } from "../../utils/helpers";

const WalletsPage = () => {
  const dispatch = useDispatch();
  const wallets = useSelector(selectAllWallets);
  const totalBalance = useSelector(selectTotalBalance);
  const { loading, createLoading, deleteLoading, updateLoading } = useSelector(
    (s) => s.wallets,
  );
  const [showModal, setShowModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    balance: "",
    currency: "NGN",
    color: "bg-gradient-to-r from-green-50 to-emerald-50",
  });

  useEffect(() => {
    dispatch(fetchWallets());
  }, [dispatch]);

  const handleOpenModal = (wallet = null) => {
    if (wallet) {
      setEditingWallet(wallet);
      setFormData({
        name: wallet.name,
        balance: wallet.balance,
        currency: wallet.currency,
        color: wallet.color || "bg-gradient-to-r from-green-50 to-emerald-50",
      });
    } else {
      setEditingWallet(null);
      setFormData({
        name: "",
        balance: "",
        currency: "NGN",
        color: "bg-gradient-to-r from-green-50 to-emerald-50",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingWallet(null);
    setFormData({
      name: "",
      balance: "",
      currency: "NGN",
      color: "bg-gradient-to-r from-green-50 to-emerald-50",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Wallet name is required");
      return;
    }

    const walletData = {
      name: formData.name,
      balance: parseFloat(formData.balance) || 0,
      currency: formData.currency,
      color: formData.color,
    };

    let action;
    if (editingWallet) {
      action = await dispatch(
        updateWallet({ id: editingWallet._id, ...walletData }),
      );
      if (updateWallet.fulfilled.match(action)) {
        toast.success("Wallet updated successfully!");
        handleCloseModal();
        dispatch(fetchWallets());
      } else {
        toast.error("Failed to update wallet");
      }
    } else {
      action = await dispatch(createWallet(walletData));
      if (createWallet.fulfilled.match(action)) {
        toast.success("Wallet created successfully!");
        handleCloseModal();
        dispatch(fetchWallets());
      } else {
        toast.error("Failed to create wallet");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this wallet? This action cannot be undone."))
      return;
    const action = await dispatch(deleteWallet(id));
    if (deleteWallet.fulfilled.match(action)) {
      toast.success("Wallet deleted");
      dispatch(fetchWallets());
    } else {
      toast.error("Failed to delete wallet");
    }
  };

  const colorOptions = [
    {
      name: "Green",
      class: "bg-gradient-to-r from-green-50 to-emerald-50",
      border: "border-green-200",
    },
    {
      name: "Blue",
      class: "bg-gradient-to-r from-blue-50 to-indigo-50",
      border: "border-blue-200",
    },
    {
      name: "Purple",
      class: "bg-gradient-to-r from-purple-50 to-pink-50",
      border: "border-purple-200",
    },
    {
      name: "Orange",
      class: "bg-gradient-to-r from-orange-50 to-amber-50",
      border: "border-orange-200",
    },
    {
      name: "Teal",
      class: "bg-gradient-to-r from-teal-50 to-cyan-50",
      border: "border-teal-200",
    },
    {
      name: "Rose",
      class: "bg-gradient-to-r from-rose-50 to-red-50",
      border: "border-rose-200",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wallets</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your funds and transactions
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#C8F000] text-gray-900 font-semibold px-4 py-2 rounded-xl hover:bg-[#b8e000] transition-colors"
        >
          <Plus size={16} />
          Add Wallet
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="bg-gradient-to-r from-[#C8F000] to-[#b8e000] rounded-2xl p-6 shadow-sm">
        <p className="text-gray-700 text-sm mb-1">Total Balance</p>
        <p className="text-3xl font-bold text-gray-900">
          {formatCurrency(totalBalance)}
        </p>
        <p className="text-gray-600 text-xs mt-2">
          Across {wallets.length} {wallets.length === 1 ? "wallet" : "wallets"}
        </p>
      </div>

      {/* Wallets Grid */}
      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="w-7 h-7 border-2 border-[#C8F000] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : wallets.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <Wallet size={48} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">No wallets yet</p>
          <p className="text-xs mt-1">
            Create your first wallet to start managing funds
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <div
              key={wallet._id}
              className={`${wallet.color || colorOptions[0].class} rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all relative overflow-hidden group`}
            >
              {/* Action buttons - visible on hover */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenModal(wallet)}
                  className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                  title="Edit Wallet"
                >
                  <Edit size={14} className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(wallet._id)}
                  disabled={deleteLoading === wallet._id}
                  className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                  title="Delete Wallet"
                >
                  {deleteLoading === wallet._id ? (
                    <Loader2 size={14} className="animate-spin text-gray-600" />
                  ) : (
                    <Trash2 size={14} className="text-red-500" />
                  )}
                </button>
              </div>

              {/* Wallet Icon */}
              <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center mb-4">
                <Wallet size={24} className="text-gray-700" />
              </div>

              {/* Wallet Details */}
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {wallet.name}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {formatCurrency(wallet.balance)}
              </p>
              <p className="text-xs text-gray-500">{wallet.currency} Account</p>

              {/* Progress indicator (optional) */}
              {wallet.balance > 0 && (
                <div className="mt-4 pt-3 border-t border-white/30">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Available</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C8F000] rounded-full transition-all duration-500"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Wallet Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {editingWallet ? "Edit Wallet" : "Create New Wallet"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Wallet Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="e.g., Business Account, Savings, Main Wallet"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8F000] focus:ring-2 focus:ring-[#C8F000]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Initial Balance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ₦
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) =>
                      setFormData({ ...formData, balance: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8F000] focus:ring-2 focus:ring-[#C8F000]/20 transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  You can add more funds later from transactions
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8F000] focus:ring-2 focus:ring-[#C8F000]/20 transition-all"
                >
                  <option value="NGN">₦ NGN - Nigerian Naira</option>
                  <option value="USD">$ USD - US Dollar</option>
                  <option value="EUR">€ EUR - Euro</option>
                  <option value="GBP">£ GBP - British Pound</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Color
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, color: color.class })
                      }
                      className={`h-12 rounded-lg ${color.class} border-2 transition-all ${
                        formData.color === color.class
                          ? "border-[#C8F000] shadow-md"
                          : `border-transparent hover:${color.border}`
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading || updateLoading}
                  className="flex-1 bg-[#C8F000] text-gray-900 font-semibold py-2.5 rounded-lg hover:bg-[#b8e000] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  {createLoading || updateLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />{" "}
                      {editingWallet ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editingWallet ? "Update Wallet" : "Create Wallet"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletsPage;
