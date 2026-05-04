import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slice/AuthSlice/AuthSlice";
import invoiceReducer from "./Slice/InvoiceSlice/InvoiceSlice";
import transactionReducer from "./Slice/TransactionSlice/TransactionSlice";
import walletReducer from "./Slice/WalletSlice/WalletSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    invoices: invoiceReducer,
    transactions: transactionReducer,
    wallets: walletReducer,
  },
});

export default store;
