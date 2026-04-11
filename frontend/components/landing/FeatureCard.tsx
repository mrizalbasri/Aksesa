import React from "react";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
}) => {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:border-blue-500/40">
      <div className="inline-flex rounded-lg bg-blue-500/10 p-3 text-blue-300">
        <Icon className="size-6" />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>

      <p className="mt-2 text-sm text-slate-300">{description}</p>
    </article>
  );
};

export default FeatureCard;
