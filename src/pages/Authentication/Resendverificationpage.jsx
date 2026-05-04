import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import {
  resendVerificationEmail,
  clearError,
} from "../../Redux/Slice/AuthSlice/AuthSlice";
import AuthLayout from "./AuthLayout";
import resendIllustration from "../../assets/images/auth-illustration.png.png";

const ResendVerificationPage = () => {
  const dispatch = useDispatch();
  const { resendLoading, error } = useSelector((state) => state.auth);

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
    const action = await dispatch(resendVerificationEmail({ email }));
    if (resendVerificationEmail.fulfilled.match(action)) {
      setSent(true);
      toast.success("Verification email sent!");
    }
  };

  if (sent) {
    return (
      <AuthLayout
        image={resendIllustration}
        title="Email sent!"
        subtitle="Check your inbox for the verification link"
        features={["Check Spam", "Valid for 24h", "Quick Setup"]}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-ink mb-3">Email sent! 📧</h1>
          <p className="text-sm text-ink-muted mb-2 leading-relaxed">
            A new verification link was sent to{" "}
            <span className="font-semibold text-ink">{email}</span>.
          </p>
          <p className="text-sm text-ink-muted mb-8">
            Check your inbox (and spam folder just in case).
          </p>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Sign In
          </Link>

          <button
            onClick={() => setSent(false)}
            className="block w-full mt-4 py-3 rounded-lg text-sm font-semibold text-ink text-center hover:opacity-90 transition-all bg-primary"
          >
            Try a different email
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      image={resendIllustration}
      title="Resend verification"
      subtitle="Enter your email to receive a new verification link"
      features={["Quick Resend", "Check Spam", "24h Validity"]}
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
          <Mail size={22} className="text-brand" />
        </div>

        <h1 className="text-3xl font-bold text-ink mb-1">
          Resend verification
        </h1>
        <p className="text-sm text-ink-muted mb-8 leading-relaxed">
          Enter the email address you registered with and we'll send you a fresh
          verification link.
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
            disabled={resendLoading}
            className="btn-primary"
          >
            {resendLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending verification email…
              </>
            ) : (
              "Send verification email"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-ink-muted mt-6">
          Already verified?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResendVerificationPage;
