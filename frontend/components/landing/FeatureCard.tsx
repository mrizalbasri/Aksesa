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
    <article className="group relative flex flex-col border-2 border-slate-900 bg-white p-6 transition-all hover:bg-slate-900 hover:text-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(194,65,12,1)]">
      <div className="mb-8 p-3 inline-flex w-fit border-2 border-slate-900 bg-[#F9F8F6] text-slate-900 transition-colors group-hover:border-white group-hover:bg-slate-800 group-hover:text-white">
        <Icon className="size-6 stroke-[1.5]" />
      </div>

      <h3 className="mb-3 text-xl font-serif font-bold leading-tight">{title}</h3>

      <p className="text-sm font-medium leading-relaxed text-slate-600 transition-colors group-hover:text-slate-300">
        {description}
      </p>
      
      {/* Decorative dot */}
      <div className="absolute bottom-4 right-4 h-2 w-2 rounded-full bg-slate-300 group-hover:bg-[#C2410C]"></div>
    </article>
  );
};

export default FeatureCard;
