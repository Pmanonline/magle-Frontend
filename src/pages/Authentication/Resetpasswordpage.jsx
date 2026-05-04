import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import {
  resetPassword,
  clearError,
} from "../../Redux/Slice/AuthSlice/AuthSlice";
import AuthLayout from "./AuthLayout";
import resetIllustration from "../../assets/images/auth-illustration.png.png";

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { resetLoading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ password: "", confirm_password: "" });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return null;
    const score = [
      p.length >= 8,
      /[A-Z]/.test(p),
      /[0-9]/.test(p),
      /[^A-Za-z0-9]/.test(p),
    ].filter(Boolean).length;
    if (score <= 1) return { label: "Weak", color: "#ef4444", width: "25%" };
    if (score === 2) return { label: "Fair", color: "#f97316", width: "50%" };
    if (score === 3) return { label: "Good", color: "#B5E41A", width: "75%" };
    return { label: "Strong", color: "#2D7A4F", width: "100%" };
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    const action = await dispatch(
      resetPassword({
        token,
        password: form.password,
        confirm_password: form.confirm_password,
      }),
    );
    if (resetPassword.fulfilled.match(action)) {
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  // No token in URL
  if (!token) {
    return (
      <AuthLayout
        image={resetIllustration}
        title="Invalid reset link"
        subtitle="This link is invalid or has expired"
        features={["Request New Link", "Secure Reset", "10 Min Expiry"]}
      >
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={22} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-ink mb-3">Invalid link</h1>
          <p className="text-sm text-ink-muted mb-6">
            This reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="block w-full py-3 rounded-lg text-sm font-semibold text-ink text-center hover:opacity-90 transition-all bg-primary"
          >
            Request new link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout
        image={resetIllustration}
        title="Password updated!"
        subtitle="Your password has been changed successfully"
        features={["Secure", "Protected", "Redirecting Soon"]}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} className="text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-ink mb-3">
            Password updated! ✅
          </h1>
          <p className="text-sm text-ink-muted mb-8">
            Your password has been changed. Redirecting you to sign in…
          </p>
          <Link
            to="/login"
            className="block w-full py-3 rounded-lg text-sm font-semibold text-ink text-center hover:opacity-90 transition-all bg-primary"
          >
            Sign in now
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      image={resetIllustration}
      title="Reset password"
      subtitle="Choose a strong new password for your account"
      features={["Strong Password", "Secure", "Easy to Remember"]}
    >
      <div>
        <Link
          to="/login"
          className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink w-fit transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>

        <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-6">
          <ShieldCheck size={22} className="text-brand" />
        </div>

        <h1 className="text-3xl font-bold text-ink mb-1">Reset password</h1>
        <p className="text-sm text-ink-muted mb-8">
          Choose a strong new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New password */}
          <div>
            <label className="form-label">New password</label>
            <div className="relative">
              <input
                type={show.password ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="auth-input pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShow((s) => ({ ...s, password: !s.password }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted transition-colors"
              >
                {show.password ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordStrength && (
              <div className="mt-2">
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: passwordStrength.width,
                      backgroundColor: passwordStrength.color,
                    }}
                  />
                </div>
                <p
                  className="text-xs mt-1"
                  style={{ color: passwordStrength.color }}
                >
                  {passwordStrength.label}
                </p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="form-label">Confirm new password</label>
            <div className="relative">
              <input
                type={show.confirm ? "text" : "password"}
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className={`auth-input pr-10 ${
                  form.confirm_password &&
                  form.password !== form.confirm_password
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted transition-colors"
              >
                {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.confirm_password &&
              form.password !== form.confirm_password && (
                <p className="text-xs text-red-500 mt-1">
                  Passwords do not match
                </p>
              )}
          </div>

          <button type="submit" disabled={resetLoading} className="btn-primary">
            {resetLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Updating password…
              </>
            ) : (
              "Update password"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
