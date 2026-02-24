"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Headphones,
  MessageCircle,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supportApi } from "@/services/support-api";
import { useUserSupportStore } from "@/store/user-support-store";
import { connectUserSupportSocket } from "@/lib/user-support-socket";
import type {
  SupportTicketListItem,
  CreateTicketPayload,
} from "@/types/support";
import {
  SUPPORT_TYPES,
  TICKET_STATUS_DISPLAY,
} from "@/types/support";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
  });
}

const STATUS_COLOR_CLASSES: Record<string, string> = {
  amber: "bg-amber-100 text-amber-800 border-amber-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  green: "bg-emerald-100 text-emerald-800 border-emerald-200",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
};

function TicketCard({ ticket }: { ticket: SupportTicketListItem }) {
  const router = useRouter();
  const statusInfo = TICKET_STATUS_DISPLAY[ticket.status] ?? {
    label: ticket.status,
    color: "slate",
  };
  const statusClasses =
    STATUS_COLOR_CLASSES[statusInfo.color] ?? STATUS_COLOR_CLASSES.slate;
  const supportTypeLabel =
    SUPPORT_TYPES.find((t) => t.value === ticket.support_type)?.label ??
    ticket.support_type;
  const lastPreview = ticket.last_message?.message ?? "No messages yet";
  const isFromSupport = ticket.last_message?.is_from_user === false;

  return (
    <button
      type="button"
      onClick={() => router.push(`/dashboard/support/${ticket.ticket_number}`)}
      className="w-full text-left rounded-xl border border-dashboard-border/60 bg-dashboard-surface p-3 sm:p-4 hover:bg-dashboard-surface/90 hover:border-dashboard-border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bg-primary/30"
    >
      <div className="flex gap-2 sm:gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h3 className="font-semibold text-dashboard-heading text-xs sm:text-sm truncate">
              {ticket.subject}
            </h3>
            {ticket.has_unread && (
              <span className="shrink-0 h-2 w-2 rounded-full bg-blue-500" />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium border ${statusClasses}`}
            >
              {statusInfo.label}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium bg-dashboard-bg text-dashboard-muted border border-dashboard-border/50">
              {supportTypeLabel}
            </span>
          </div>
          <p
            className={`text-[11px] sm:text-xs text-dashboard-muted truncate ${
              isFromSupport ? "italic" : ""
            }`}
          >
            {lastPreview}
          </p>
          <div className="flex items-center gap-2 mt-2 text-[10px] sm:text-xs text-dashboard-muted">
            <span>{relativeTime(ticket.updated_at)}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              {ticket.message_count} {ticket.message_count === 1 ? "msg" : "msgs"}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-dashboard-border/60 bg-dashboard-surface p-3 sm:p-4 animate-pulse">
      <div className="h-3.5 w-3/4 bg-dashboard-border/50 rounded mb-2" />
      <div className="flex gap-2 mb-2">
        <div className="h-5 w-20 bg-dashboard-border/40 rounded" />
        <div className="h-5 w-24 bg-dashboard-border/40 rounded" />
      </div>
      <div className="h-3 w-full bg-dashboard-border/40 rounded mb-2" />
      <div className="h-2.5 w-16 bg-dashboard-border/40 rounded" />
    </div>
  );
}

interface CreateTicketModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: (ticketNumber: string) => void;
}

function CreateTicketModal({
  open,
  onClose,
  onSubmitSuccess,
}: CreateTicketModalProps) {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [supportType, setSupportType] = useState<string>("GENERAL_INQUIRY");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setSubject("");
    setDescription("");
    setSupportType("GENERAL_INQUIRY");
    setError(null);
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) {
      setError("You must be logged in to create a ticket.");
      return;
    }
    const sub = subject.trim();
    const desc = description.trim();
    if (!sub || !desc) {
      setError("Please fill in subject and description.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload: CreateTicketPayload = {
        subject: sub,
        description: desc,
        email: user.email,
        phone_number: user.phone_number ?? undefined,
        support_type: supportType,
      };
      const res = await supportApi.createTicket(payload);
      if (res.success && res.data?.ticket) {
        onClose();
        onSubmitSuccess(res.data.ticket.ticket_number);
      } else {
        setError(res.message ?? "Failed to create ticket");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-dashboard-surface rounded-xl border border-dashboard-border/60 shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-dashboard-border/60">
          <h2 className="text-base sm:text-lg font-bold text-dashboard-heading">
            New Ticket
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -m-1.5 rounded-lg hover:bg-dashboard-bg text-dashboard-muted hover:text-dashboard-heading transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 min-h-0 overflow-auto"
        >
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs sm:text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="subject"
                className="block text-xs sm:text-sm font-medium text-dashboard-heading mb-1"
              >
                Subject <span className="text-red-500">*</span>
              </label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your issue"
                className="bg-dashboard-bg border-dashboard-border/60 text-dashboard-heading placeholder:text-dashboard-muted"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-xs sm:text-sm font-medium text-dashboard-heading mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details so we can help you"
                rows={4}
                required
                className="w-full px-3 py-2.5 text-sm bg-dashboard-bg border border-dashboard-border/60 rounded-md text-dashboard-heading placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-brand-bg-primary/20 resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="support_type"
                className="block text-xs sm:text-sm font-medium text-dashboard-heading mb-1"
              >
                Support Type
              </label>
              <select
                id="support_type"
                value={supportType}
                onChange={(e) => setSupportType(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-dashboard-bg border border-dashboard-border/60 rounded-md text-dashboard-heading focus:outline-none focus:ring-2 focus:ring-brand-bg-primary/20"
              >
                {SUPPORT_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 p-3 sm:p-4 border-t border-dashboard-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-brand-bg-primary hover:bg-brand-bg-primary/90"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Ticket
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function SupportPage() {
  const router = useRouter();
  const {
    tickets,
    listLoading: loading,
    listError: error,
    fetchTickets,
    invalidateList,
  } = useUserSupportStore();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleRetry = useCallback(() => {
    fetchTickets(true);
  }, [fetchTickets]);

  // Socket.IO: listen for real-time ticket updates (new reply, status change)
  const socketConnected = useRef(false);
  useEffect(() => {
    if (socketConnected.current) return;
    socketConnected.current = true;

    const socket = connectUserSupportSocket();

    const handleTicketUpdated = (data: {
      ticket_id: string;
      event: string;
    }) => {
      if (data.event === "new_reply" || data.event === "status_changed") {
        invalidateList();
        fetchTickets(true);
      }
    };

    socket.on("ticket_updated", handleTicketUpdated);

    return () => {
      socket.off("ticket_updated", handleTicketUpdated);
      socketConnected.current = false;
    };
  }, [fetchTickets, invalidateList]);

  const handleCreateSuccess = (ticketNumber: string) => {
    invalidateList();
    router.push(`/dashboard/support/${ticketNumber}`);
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      {/* Header */}
      <header className="bg-dashboard-surface border-b border-dashboard-border sticky top-0 z-10">
        <div className="flex items-center justify-between gap-2 sm:gap-3 px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/dashboard"
              className="p-1.5 -m-1.5 rounded-lg hover:bg-dashboard-bg text-dashboard-muted hover:text-dashboard-heading transition-colors shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-base sm:text-lg font-semibold text-dashboard-heading truncate">
              Help & Support
            </h1>
          </div>
          <Button
            onClick={() => setModalOpen(true)}
            className="shrink-0 bg-brand-bg-primary hover:bg-brand-bg-primary/90 text-xs sm:text-sm gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            New Ticket
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="px-3 py-4 sm:px-4 sm:py-6">
        {loading ? (
          <div className="space-y-2 sm:space-y-3">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-3">
              <RefreshCw className="h-6 w-6" />
            </div>
            <p className="text-sm sm:text-base font-medium text-dashboard-heading mb-2">
              Something went wrong
            </p>
            <p className="text-xs sm:text-sm text-dashboard-muted mb-4 max-w-[240px]">
              {error}
            </p>
            <Button
              onClick={handleRetry}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        ) : tickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 sm:py-16 text-center"
          >
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-dashboard-surface border border-dashboard-border/60 text-dashboard-muted mb-4">
              <Headphones className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <p className="text-sm sm:text-base font-semibold text-dashboard-heading mb-1">
              No tickets yet
            </p>
            <p className="text-xs sm:text-sm text-dashboard-muted mb-4 max-w-[260px]">
              Need help? Create a ticket and our team will get back to you soon.
            </p>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-brand-bg-primary hover:bg-brand-bg-primary/90 gap-2"
            >
              <Plus className="h-4 w-4" />
              Create your first ticket
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2 sm:space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {tickets.map((ticket, i) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <TicketCard ticket={ticket} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        <CreateTicketModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmitSuccess={handleCreateSuccess}
        />
      </AnimatePresence>
    </div>
  );
}
