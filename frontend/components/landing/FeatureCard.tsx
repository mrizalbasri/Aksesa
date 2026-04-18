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
    <article className="group relative flex h-full flex-col rounded-xl border border-[#e2ddd6] bg-white p-6 shadow-[0_2px_0_rgba(17,17,17,0.02)] transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#ff5600] hover:shadow-[0_16px_30px_rgba(17,17,17,0.1)] motion-reduce:transform-none motion-reduce:transition-none">
      <div className="mb-7 inline-flex w-fit rounded-md border border-[#e2ddd6] bg-[#faf9f6] p-3.5 text-[#111111] transition-all duration-200 group-hover:border-[#ff5600] group-hover:bg-[#fff4ee] group-hover:text-[#d74a00]">
        <Icon className="size-6 stroke-[1.5]" />
      </div>

      <h3 className="mb-3 text-xl font-semibold leading-tight tracking-tight text-[#111111]">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-[#626260]">
        {description}
      </p>

      <div className="absolute inset-x-6 bottom-0 h-px bg-[#ece8e2] transition-colors duration-200 group-hover:bg-[#ffd5bf]" />
    </article>
  );
};

export default FeatureCard;
