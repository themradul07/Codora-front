import React from "react";

export const Card = ({ className = "", children, ...props }) => (
  <div
    className={`bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-sm transition-all duration-200 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className = "", children, ...props }) => (
  <div className={`p-6 border-b border-slate-100/80 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className = "", children, ...props }) => (
  <h3 className={`text-lg font-bold text-slate-900 tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className = "", children, ...props }) => (
  <p className={`text-xs text-slate-500 mt-1 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className = "", children, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className = "", children, ...props }) => (
  <div className={`p-6 border-t border-slate-100/80 flex items-center ${className}`} {...props}>
    {children}
  </div>
);
