"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  subtitle?: string;
  subtitleColor?: string;
  index?: number;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  subtitle,
  subtitleColor = "text-dashboard-muted",
  index = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.06 * index }}
      className="bg-dashboard-surface rounded-xl border border-dashboard-border/60 p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-dashboard-muted truncate">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-dashboard-heading mt-1 tabular-nums tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className={`text-[11px] sm:text-xs mt-1 font-medium ${subtitleColor}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div
          className="flex-shrink-0 h-10 w-10 sm:h-11 sm:w-11 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
