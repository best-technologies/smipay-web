"use client";

import { motion } from "motion/react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  BarChart3,
  Zap,
} from "lucide-react";
import type { TransactionAnalytics } from "@/types/admin/transactions";

function formatNGN(value: number): string {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(1)}K`;
  return `₦${value.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

function formatCount(n: number): string {
  return n.toLocaleString();
}

interface Props {
  analytics: TransactionAnalytics;
}

export function TransactionsAnalytics({ analytics }: Props) {
  const { overview, activity } = analytics;
  const growth = activity.volume_growth_percent;
  const isPositive = growth >= 0;

  const cards = [
    {
      label: "Total Volume",
      value: formatNGN(overview.total_volume),
      sub: `${formatCount(overview.total_transactions)} txns`,
      icon: DollarSign,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Today's Volume",
      value: formatNGN(activity.today_volume),
      sub: `${formatCount(activity.today_count)} txns`,
      icon: Zap,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Revenue",
      value: formatNGN(overview.total_revenue),
      sub: "from markups",
      icon: BarChart3,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Avg Transaction",
      value: formatNGN(overview.avg_amount),
      sub: (
        <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(growth)}% MoM
        </span>
      ),
      icon: Activity,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-dashboard-surface rounded-xl border border-dashboard-border/40 p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-8 w-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
            <span className="text-[11px] font-medium text-dashboard-muted uppercase tracking-wide">{card.label}</span>
          </div>
          <p className="text-lg font-bold text-dashboard-heading">{card.value}</p>
          <div className="text-xs text-dashboard-muted mt-0.5">{card.sub}</div>
        </motion.div>
      ))}
    </div>
  );
}
