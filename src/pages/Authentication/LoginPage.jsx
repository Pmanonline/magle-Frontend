import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginUser, clearError } from "../../Redux/Slice/AuthSlice/AuthSlice";
import AuthLayout from "./AuthLayout";
import loginIllustration from "../../assets/images/auth-illustration.png.png";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("rememberedEmail");
    if (saved) {
      setForm((f) => ({ ...f, email: saved }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (token) navigate("/dashboard", { replace: true });
  }, [token, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = await dispatch(
      loginUser({ email: form.email, password: form.password }),
    );
    if (loginUser.fulfilled.match(action)) {
      rememberMe
        ? localStorage.setItem("rememberedEmail", form.email)
        : localStorage.removeItem("rememberedEmail");
      toast.success("Welcome back! 👋");
      navigate("/dashboard");
    }
  };

  return (
    <AuthLayout
      image={loginIllustration}
      title="Welcome back"
      subtitle="Track every naira, every day with Maglo"
      features={["Secure Login", "Fast Access", "24/7 Support"]}
    >
      <div>
        <h1 className="text-3xl font-bold text-ink mb-1">Welcome back</h1>
        <p className="text-sm text-ink-muted mb-8">
          Welcome back! Please enter your details.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
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
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-primary"
              />
              <span className="text-sm text-ink-muted">
                Remember for 30 Days
              </span>
            </label>
            <Link to="/forgot-password" className="auth-link text-sm">
              Forgot password
            </Link>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-ink-muted mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link">
            Sign up for free
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
