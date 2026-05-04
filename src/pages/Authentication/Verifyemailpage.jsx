import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { verifyEmail } from "../../Redux/Slice/AuthSlice/AuthSlice";
import AuthLayout from "./AuthLayout";

const VerifyEmailPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { verifyLoading } = useSelector((state) => state.auth);

  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the link.");
      return;
    }

    const run = async () => {
      setStatus("loading");
      const action = await dispatch(verifyEmail({ token }));
      if (verifyEmail.fulfilled.match(action)) {
        setStatus("success");
        setMessage(action.payload.message || "Email verified successfully!");
      } else {
        setStatus("error");
        setMessage(action.payload || "Invalid or expired verification link.");
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthLayout>
      <div className="text-center">
        {/* Loading */}
        {(status === "idle" || status === "loading") && (
          <>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#E8F8C8" }}
            >
              <Loader2
                size={30}
                className="animate-spin"
                style={{ color: "#2D7A4F" }}
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Verifying your email…
            </h1>
            <p className="text-sm text-gray-500">
              Just a moment while we confirm your address.
            </p>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#E8F8C8" }}
            >
              <CheckCircle2 size={32} style={{ color: "#2D7A4F" }} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Email verified!
            </h1>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              {message}
            </p>
            <Link
              to="/login"
              className="block w-full py-2.5 rounded-lg text-sm font-semibold text-gray-900 text-center hover:brightness-110 transition-all"
              style={{ backgroundColor: "#B5E41A" }}
            >
              Sign in to your account
            </Link>
          </>
        )}

        {/* Error */}
        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-50">
              <XCircle size={32} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Verification failed
            </h1>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              {message}
            </p>
            <div className="space-y-3">
              <Link
                to="/resend-verification"
                className="block w-full py-2.5 rounded-lg text-sm font-semibold text-gray-900 text-center hover:brightness-110 transition-all"
                style={{ backgroundColor: "#B5E41A" }}
              >
                Resend verification email
              </Link>
              <Link
                to="/login"
                className="block w-full py-2.5 rounded-lg text-sm font-medium text-gray-700 text-center border border-gray-200 hover:bg-gray-50 transition-all"
              >
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
