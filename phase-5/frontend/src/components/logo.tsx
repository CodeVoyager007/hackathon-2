import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6 text-primary", className)}
      {...props}
    >
      {/* Abstract "M" / Momentum Wave */}
      <path d="M2 12s3-7 7-7 5 14 8 14 5-7 5-7" />
      <path d="M7 12l5 5 5-5" />
    </svg>
  );
}
