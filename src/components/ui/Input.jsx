import React from "react";

export const Input = React.forwardRef(
  ({ className = "", error = false, icon: Icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          className={`w-full ${
            Icon ? "pl-10" : "pl-3.5"
          } pr-3.5 py-2.5 bg-white border ${
            error ? "border-rose-400 focus:ring-rose-500/20" : "border-slate-200/90 focus:border-emerald-600 focus:ring-emerald-500/20"
          } rounded-xl text-slate-900 text-sm placeholder:text-slate-400 outline-none focus:ring-2 transition-all duration-150 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
