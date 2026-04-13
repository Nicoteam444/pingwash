import type { ReactNode } from "react";

interface StepCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function StepCard({ title, subtitle, children }: StepCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <h2 className="text-2xl font-black text-pingwash-navy">{title}</h2>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}
