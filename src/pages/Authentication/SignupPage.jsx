import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import {
  registerUser,
  clearError,
} from "../../Redux/Slice/AuthSlice/AuthSlice";
import AuthLayout from "./AuthLayout";
import signupIllustration from "../../assets/images/auth-illustration.png.png";

const SignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registerLoading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    const checks = [
      p.length >= 8,
      /[A-Z]/.test(p),
      /[0-9]/.test(p),
      /[^A-Za-z0-9]/.test(p),
    ];
    const score = checks.filter(Boolean).length;
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
      registerUser({
        email: form.email,
        password: form.password,
        confirm_password: form.confirm_password,
      }),
    );

    if (registerUser.fulfilled.match(action)) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <AuthLayout
        image={signupIllustration}
        title="Check your email"
        subtitle="We've sent you a verification link"
        features={["Quick Setup", "Secure Access", "Get Started"]}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-ink mb-3">Check your inbox</h1>
          <p className="text-sm text-ink-muted mb-6 leading-relaxed">
            We sent a verification link to{" "}
            <span className="font-semibold text-ink">{form.email}</span>. Click
            the link to activate your account.
          </p>
          <Link
            to="/login"
            className="block w-full py-3 rounded-lg text-sm font-semibold text-ink text-center transition-all hover:opacity-90 bg-primary"
          >
            Back to Sign In
          </Link>
          <p className="text-sm text-ink-muted mt-4">
            Didn't get it?{" "}
            <Link
              to="/resend-verification"
              className="font-semibold hover:underline text-brand"
            >
              Resend email
            </Link>
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      image={signupIllustration}
      title="Create new account"
      subtitle="Join thousands of businesses managing their finances"
      features={["Free Trial", "No Credit Card", "Cancel Anytime"]}
    >
      <div>
        <h1 className="text-3xl font-bold text-ink mb-1">Create new account</h1>
        <p className="text-sm text-ink-muted mb-8">
          Welcome! Please enter your details.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="auth-input"
            />
          </div>

          {/* Email */}
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="example@gmail.com"
              className="auth-input"
            />
          </div>

          {/* Password */}
          <div>
            <label className="form-label">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="auth-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password strength bar */}
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

          {/* Confirm Password */}
          <div>
            <label className="form-label">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
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
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted transition-colors"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.confirm_password &&
              form.password !== form.confirm_password && (
                <p className="text-xs text-red-500 mt-1">
                  Passwords do not match
                </p>
              )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={registerLoading}
            className="btn-primary"
          >
            {registerLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating account…
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-ink-muted mt-6">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;
