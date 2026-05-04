import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import {
  forgotPassword,
  clearError,
} from "../../Redux/Slice/AuthSlice/AuthSlice";
import AuthLayout from "./AuthLayout";
import forgotIllustration from "../../assets/images/auth-illustration.png.png";

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const { forgotLoading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = await dispatch(forgotPassword({ email }));
    if (forgotPassword.fulfilled.match(action)) {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <AuthLayout
        image={forgotIllustration}
        title="Check your email"
        subtitle="We've sent you a password reset link"
        features={["Check Spam", "Valid for 10 min", "Secure Link"]}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-ink mb-3">Email sent! 📧</h1>
          <p className="text-sm text-ink-muted mb-2 leading-relaxed">
            We sent a password reset link to{" "}
            <span className="font-semibold text-ink">{email}</span>.
          </p>
          <p className="text-sm text-ink-muted mb-8">
            The link expires in 10 minutes. Check your spam folder if you don't
            see it.
          </p>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Sign In
          </Link>

          <button
            onClick={() => {
              setSent(false);
            }}
            className="block w-full mt-4 py-3 rounded-lg text-sm font-semibold text-ink text-center transition-all hover:opacity-90 bg-primary"
          >
            Try a different email
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      image={forgotIllustration}
      title="Forgot password?"
      subtitle="Don't worry, we'll help you reset it"
      features={["Quick Recovery", "Secure Process", "24/7 Support"]}
    >
      <div>
        {/* Back link */}
        <Link
          to="/login"
          className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink w-fit transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-6">
          <Mail size={22} className="text-brand" />
        </div>

        <h1 className="text-3xl font-bold text-ink mb-1">Forgot password?</h1>
        <p className="text-sm text-ink-muted mb-8 leading-relaxed">
          No worries! Enter your email and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="auth-input"
            />
          </div>

          <button
            type="submit"
            disabled={forgotLoading}
            className="btn-primary"
          >
            {forgotLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending reset link…
              </>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
