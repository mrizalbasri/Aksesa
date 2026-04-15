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
    <article className="group relative flex flex-col rounded-lg border border-[#dedbd6] bg-white p-6 transition-colors hover:border-[#ff5600]">
      <div className="mb-8 inline-flex w-fit rounded border border-[#dedbd6] bg-[#faf9f6] p-3 text-[#111111] transition-colors group-hover:border-[#ff5600] group-hover:bg-[#fff4ee]">
        <Icon className="size-6 stroke-[1.5]" />
      </div>

      <h3 className="mb-3 text-xl font-semibold leading-tight text-[#111111]">{title}</h3>

      <p className="text-sm leading-relaxed text-[#626260]">
        {description}
      </p>

      <div className="absolute bottom-4 right-4 h-2 w-2 rounded-full bg-[#d3cec6] group-hover:bg-[#ff5600]"></div>
    </article>
  );
};

export default FeatureCard;
