import React from "react";

export const Button = React.forwardRef(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      disabled = false,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
      primary:
        "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-sm",
      secondary:
        "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-xs",
      outline:
        "bg-transparent hover:bg-emerald-50/50 text-emerald-700 border border-emerald-300",
      ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
      danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-xs",
      dark: "bg-slate-900 hover:bg-slate-800 text-white shadow-xs",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2.5 text-sm gap-2",
      lg: "px-6 py-3.5 text-base gap-2.5",
      icon: "p-2 text-sm",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant] || variants.primary} ${
          sizes[size] || sizes.md
        } ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
