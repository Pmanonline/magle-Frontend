import React from "react";
import magloLogo from "../../assets/images/logo.png";

const AuthLayout = ({ children, image, title, subtitle, features = [] }) => {
  return (
    <div className="min-h-screen flex font-sans">
      {/* ── Left — Form Panel ─────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 py-12 bg-white animate-fade-up">
        {/* Logo */}
        <div className="mb-10">
          <a href="/" className="flex items-center gap-2 w-fit group">
            <img src={magloLogo} alt="Maglo Logo" />
          </a>
        </div>

        {/* Form content */}
        <div className="max-w-md w-full mx-auto">{children}</div>
      </div>

      {/* ── Right — Decorative Panel ───────────────────── */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center relative overflow-hidden bg-surface">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-brand/10 blur-3xl translate-y-1/3 -translate-x-1/3" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231A1A1A' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-12 max-w-md">
          {/* Dynamic Image */}
          {image && (
            <div className="mb-10 flex justify-center">
              <img
                src={image}
                alt={title || "Maglo Illustration"}
                className="w-64 h-64 object-contain"
              />
            </div>
          )}

          {/* Dynamic Title */}
          {title && (
            <h2 className="text-3xl font-bold text-ink mb-4 leading-tight">
              {title}
            </h2>
          )}

          {/* Dynamic Subtitle */}
          {subtitle && (
            <p className="text-ink-muted text-sm leading-relaxed mb-8">
              {subtitle}
            </p>
          )}

          {/* Feature tags */}
          {features.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {features.map((feature) => (
                <span
                  key={feature}
                  className="text-xs px-3 py-1.5 rounded-full font-medium bg-primary-light text-brand"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
