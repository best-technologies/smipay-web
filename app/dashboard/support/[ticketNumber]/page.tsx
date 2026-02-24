"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Send,
  Loader2,
  RefreshCw,
  Star,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/hooks/useAuth";
import { supportApi } from "@/services/support-api";
import type { SupportTicketDetail, SupportMessage } from "@/types/support";
import { TICKET_STATUS_DISPLAY } from "@/types/support";

// --- Helpers ---
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function isSameDay(a: string, b: string): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function getMsgTime(msg: SupportMessage): string {
  return msg.createdAt ?? msg.created_at ?? "";
}

const STATUS_COLOR_CLASSES: Record<string, string> = {
  amber: "bg-amber-100 text-amber-800 border-amber-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  green: "bg-emerald-100 text-emerald-800 border-emerald-200",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
};

// Local message type for optimistic updates
interface LocalMessage extends SupportMessage {
  _tempId?: string;
  _sending?: boolean;
  _error?: string;
}

export default function TicketDetailPage() {
  const params = useParams();
  const ticketNumber = String(params.ticketNumber ?? "");
  const { user } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [ticket, setTicket] = useState<SupportTicketDetail | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingFeedback, setRatingFeedback] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchTicket = useCallback(async () => {
    if (!ticketNumber) return;
    setLoading(true);
    setError(null);
    try {
      const res = await supportApi.getTicket(ticketNumber);
      if (res.success && res.data?.ticket) {
        const t = res.data.ticket;
        setTicket(t);
        setMessages(
          (t.messages ?? []).map((m) => ({ ...m, _tempId: undefined }))
        );
        if (t.satisfaction_rating != null) {
          setHasRated(true);
        }
      } else {
        setError(res.message ?? "Failed to load ticket");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversation"
      );
    } finally {
      setLoading(false);
    }
  }, [ticketNumber]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  useEffect(() => {
    if (!loading && messages.length > 0) {
      scrollToBottom();
    }
  }, [loading, messages.length, scrollToBottom]);

  // Auto-grow textarea (min 1 line, max 4 lines)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = 24;
    const maxHeight = lineHeight * 4;
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 40), maxHeight)}px`;
  }, [inputValue]);

  const isClosed = ticket?.status === "resolved" || ticket?.status === "closed";
  const showRatingForm =
    ticket?.status === "resolved" &&
    !hasRated &&
    !ratingSubmitted &&
    !ratingSubmitting;
  const canSend = !isClosed && !!user?.email;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = inputValue.trim();
    if (!msg || sending || !user?.email || !ticketNumber) return;

    const tempId = `opt-${Date.now()}`;
    const displayName =
      [user.first_name, user.last_name].filter(Boolean).join(" ") || "You";
    const optimistic: LocalMessage = {
      id: tempId,
      message: msg,
      is_from_user: true,
      sender_name: displayName,
      sender_email: user.email,
      attachments: null,
      created_at: new Date().toISOString(),
      _tempId: tempId,
      _sending: true,
    };

    setMessages((prev) => [...prev, optimistic]);
    setInputValue("");
    setSending(true);

    try {
      const res = await supportApi.sendMessage({
        ticket_number: ticketNumber,
        message: msg,
        email: user.email,
      });

      if (res.success && res.data?.message) {
        const serverMsg = res.data.message;
        setMessages((prev) =>
          prev.map((m) =>
            m._tempId === tempId
              ? {
                  ...serverMsg,
                  created_at: serverMsg.created_at ?? serverMsg.createdAt ?? "",
                  createdAt: serverMsg.createdAt ?? serverMsg.created_at ?? "",
                }
              : m
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m._tempId === tempId
              ? { ...m, _sending: false, _error: res.message ?? "Failed" }
              : m
          )
        );
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m._tempId === tempId
            ? {
                ...m,
                _sending: false,
                _error:
                  err instanceof Error ? err.message : "Failed to send message",
              }
            : m
        )
      );
    } finally {
      setSending(false);
      scrollToBottom();
    }
  };

  const handleRetryMessage = (tempId: string) => {
    const m = messages.find((x) => x._tempId === tempId);
    if (!m || !user?.email) return;
    setInputValue(m.message);
    setMessages((prev) => prev.filter((x) => x._tempId !== tempId));
  };

  const handleRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ratingValue < 1 || ratingValue > 5) return;
    setRatingSubmitting(true);
    try {
      await supportApi.rateTicket(ticketNumber, {
        rating: ratingValue,
        feedback: ratingFeedback.trim() || undefined,
      });
      setHasRated(true);
      setRatingSubmitted(true);
    } catch {
      // Could show error; spec says show "Thank you" after success
    } finally {
      setRatingSubmitting(false);
    }
  };

  if (!ticketNumber) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <p className="text-dashboard-muted">Invalid ticket</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex flex-col">
        <header className="bg-dashboard-surface border-b border-dashboard-border sticky top-0 z-10">
          <div className="flex items-center gap-2 px-3 py-3 sm:px-4 sm:py-4">
            <Link
              href="/dashboard/support"
              className="p-1.5 -m-1.5 rounded-lg hover:bg-dashboard-bg text-dashboard-muted hover:text-dashboard-heading transition-colors shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1 min-w-0 animate-pulse">
              <div className="h-4 w-32 bg-dashboard-border/50 rounded mb-2" />
              <div className="h-3 w-24 bg-dashboard-border/40 rounded" />
            </div>
          </div>
        </header>
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 space-y-4"
        >
          {[true, false, true, false].map((right, i) => (
            <div
              key={i}
              className={`flex ${right ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 animate-pulse ${
                  right
                    ? "rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-brand-bg-primary/30 w-48"
                    : "rounded-tl-2xl rounded-tr-2xl rounded-br-2xl bg-dashboard-surface w-40"
                }`}
              >
                <div className="h-3 bg-white/20 rounded" />
                <div className="h-3 bg-white/20 rounded mt-2 w-3/4" />
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex flex-col">
        <header className="bg-dashboard-surface border-b border-dashboard-border sticky top-0 z-10">
          <div className="flex items-center gap-2 px-3 py-3 sm:px-4 sm:py-4">
            <Link
              href="/dashboard/support"
              className="p-1.5 -m-1.5 rounded-lg hover:bg-dashboard-bg text-dashboard-muted hover:text-dashboard-heading transition-colors shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-base font-semibold text-dashboard-heading truncate">
              {ticketNumber}
            </h1>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-3">
            <AlertCircle className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-dashboard-heading mb-2">
            Something went wrong
          </p>
          <p className="text-xs text-dashboard-muted mb-4 max-w-[280px]">
            {error}
          </p>
          <button
            type="button"
            onClick={fetchTicket}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashboard-border bg-dashboard-surface text-dashboard-heading hover:bg-dashboard-surface/90 transition-colors text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const t = ticket!;
  const statusInfo =
    (TICKET_STATUS_DISPLAY as Record<string, { label: string; color: string }>)[
      t.status
    ] ?? { label: t.status, color: "slate" };
  const statusClasses =
    STATUS_COLOR_CLASSES[statusInfo.color] ?? STATUS_COLOR_CLASSES.slate;

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "You";

  return (
    <div className="min-h-screen bg-dashboard-bg flex flex-col">
      {/* Header */}
      <header className="bg-dashboard-surface border-b border-dashboard-border sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-2 px-3 py-3 sm:px-4 sm:py-4">
          <Link
            href="/dashboard/support"
            className="p-1.5 -m-1.5 rounded-lg hover:bg-dashboard-bg text-dashboard-muted hover:text-dashboard-heading transition-colors shrink-0"
            aria-label="Back to support"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold text-dashboard-heading truncate">
                {t.ticket_number}
              </h1>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border shrink-0 ${statusClasses}`}
              >
                {statusInfo.label}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-dashboard-muted truncate mt-0.5">
              {t.subject}
            </p>
          </div>
        </div>
      </header>

      {/* Chat thread */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto min-h-0 px-3 py-4 sm:px-4"
      >
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.length === 0 ? (
            <p className="text-center text-sm text-dashboard-muted py-8">
              No messages yet.
            </p>
          ) : (
            <>
              {t.description && (
                <div className="rounded-xl bg-dashboard-surface border border-dashboard-border/60 px-3 py-2.5 mb-2">
                  <p className="text-[10px] sm:text-xs font-medium text-dashboard-muted uppercase tracking-wide mb-1">
                    Ticket description
                  </p>
                  <p className="text-xs sm:text-sm text-dashboard-heading whitespace-pre-wrap break-words">
                    {t.description}
                  </p>
                </div>
              )}
              {messages.map((msg, idx) => {
                const time = getMsgTime(msg);
                const prevTime = idx > 0 ? getMsgTime(messages[idx - 1]!) : "";
                const showDateSep =
                  idx === 0 || !isSameDay(prevTime, time);
                const isUser = msg.is_from_user;
                const sender =
                  msg.sender_name ??
                  (isUser ? displayName : "Support");

                return (
                  <div key={msg.id} className="space-y-2">
                    {showDateSep && (
                      <p className="text-center text-xs text-dashboard-muted py-2">
                        {formatDate(time)}
                      </p>
                    )}
                    <div
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] ${
                          isUser
                            ? "rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-brand-bg-primary text-white"
                            : "rounded-tl-2xl rounded-tr-2xl rounded-br-2xl bg-dashboard-surface text-dashboard-heading border border-dashboard-border/60"
                        } px-3 py-2.5 sm:px-4 sm:py-3`}
                      >
                        <p className="text-[10px] sm:text-xs opacity-80 mb-1">
                          {sender}
                        </p>
                        <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">
                          {msg.message}
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <span
                            className={`text-[10px] ${
                              isUser ? "opacity-75" : "text-dashboard-muted"
                            }`}
                          >
                            {relativeTime(time)}
                          </span>
                          {msg._sending && (
                            <Loader2 className="h-3 w-3 animate-spin opacity-75" />
                          )}
                          {msg._error && (
                            <button
                              type="button"
                              onClick={() =>
                                msg._tempId && handleRetryMessage(msg._tempId)
                              }
                              className="text-[10px] text-red-400 hover:text-red-300 underline"
                            >
                              Retry
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Resolved/Closed banner */}
      {isClosed && (
        <div className="shrink-0 px-3 py-2 sm:px-4 bg-dashboard-surface border-t border-dashboard-border">
          <p className="text-xs sm:text-sm text-dashboard-muted text-center">
            {t.status === "resolved"
              ? "This ticket has been resolved"
              : "This ticket is closed"}
          </p>
        </div>
      )}

      {/* Rating UI */}
      <AnimatePresence>
        {showRatingForm && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="shrink-0 px-3 py-4 sm:px-4 bg-dashboard-surface border-t border-dashboard-border"
          >
            <form onSubmit={handleRateSubmit} className="max-w-md mx-auto">
              <p className="text-sm font-medium text-dashboard-heading mb-3 text-center">
                How was your experience?
              </p>
              <div className="flex justify-center gap-1 sm:gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingValue(star)}
                    className="p-1 -m-1 rounded-full hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bg-primary/50"
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`h-8 w-8 sm:h-9 sm:w-9 ${
                        star <= ratingValue
                          ? "fill-amber-400 text-amber-400"
                          : "text-dashboard-muted"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={ratingFeedback}
                onChange={(e) => setRatingFeedback(e.target.value)}
                placeholder="Optional feedback..."
                rows={2}
                className="w-full px-3 py-2.5 text-sm bg-dashboard-bg border border-dashboard-border rounded-lg text-dashboard-heading placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-brand-bg-primary/20 resize-none mb-3"
              />
              <button
                type="submit"
                disabled={ratingValue < 1 || ratingSubmitting}
                className="w-full py-2.5 rounded-lg bg-brand-bg-primary text-white font-medium text-sm hover:bg-brand-bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {ratingSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Submit feedback"
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thank you message after rating */}
      {ratingSubmitted && (
        <div className="shrink-0 px-3 py-4 sm:px-4 bg-dashboard-surface border-t border-dashboard-border">
          <p className="text-sm font-medium text-dashboard-heading text-center text-emerald-600">
            Thank you for your feedback
          </p>
        </div>
      )}

      {/* Message input */}
      {canSend && (
        <div
          className={`shrink-0 px-3 py-3 sm:px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-3 bg-dashboard-surface border-t border-dashboard-border`}
        >
          <form
            onSubmit={handleSendMessage}
            className="flex gap-2 items-end max-w-2xl mx-auto"
          >
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Type a message..."
              rows={1}
              maxLength={5000}
              className="flex-1 min-h-[40px] px-3 py-2.5 text-sm bg-dashboard-bg border border-dashboard-border rounded-xl text-dashboard-heading placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-brand-bg-primary/20 resize-none overflow-y-auto"
            />
            <button
              type="submit"
              disabled={
                !inputValue.trim() || sending
              }
              className="shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-brand-bg-primary text-white hover:bg-brand-bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              aria-label="Send message"
            >
              {sending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
