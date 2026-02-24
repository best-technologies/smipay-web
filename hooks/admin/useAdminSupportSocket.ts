"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import {
  connectAdminSupportSocket,
  joinTicketRoom,
  leaveTicketRoom,
  emitAdminTyping,
  emitAdminStopTyping,
} from "@/lib/admin-support-socket";
import { useAdminSupportStore } from "@/store/admin/admin-support-store";

interface TicketCreatedEvent {
  id: string;
  ticket_number: string;
  subject: string;
  support_type: string;
  priority: string;
  email: string;
  created_at: string;
}

interface TicketUpdatedEvent {
  ticket_id: string;
  event: "new_user_message" | "assigned" | "status_changed";
  ticket_number?: string;
  message?: { id: string; preview: string; sender_name: string; created_at: string };
  assigned_to?: string;
  assigned_admin_name?: string;
  old_status?: string;
  new_status?: string;
  resolution_notes?: string;
}

interface NewMessageEvent {
  ticket_id: string;
  message: {
    id: string;
    message: string;
    is_from_user: boolean;
    is_internal: boolean;
    sender_name: string;
    sender_email: string;
    createdAt: string;
  };
}

interface StatusChangedEvent {
  ticket_id: string;
  old_status: string;
  new_status: string;
  ticket_number: string;
  resolution_notes?: string;
}

interface TicketAssignedEvent {
  ticket_id: string;
  ticket_number: string;
  assigned_to: string;
  assigned_admin_name: string;
}

interface TypingEvent {
  ticket_id: string;
  user_id: string;
  is_admin?: boolean;
}

/**
 * Connects to Socket.IO for the admin support list page.
 * Listens for `ticket_created` and `ticket_updated` to trigger refetch.
 */
export function useAdminSupportListSocket() {
  const { fetchTickets } = useAdminSupportStore();
  const connectedRef = useRef(false);

  useEffect(() => {
    if (connectedRef.current) return;
    connectedRef.current = true;

    const socket = connectAdminSupportSocket();

    const handleTicketCreated = (_data: TicketCreatedEvent) => {
      fetchTickets(true);
    };

    const handleTicketUpdated = (_data: TicketUpdatedEvent) => {
      fetchTickets(true);
    };

    socket.on("ticket_created", handleTicketCreated);
    socket.on("ticket_updated", handleTicketUpdated);

    return () => {
      socket.off("ticket_created", handleTicketCreated);
      socket.off("ticket_updated", handleTicketUpdated);
      connectedRef.current = false;
    };
  }, [fetchTickets]);
}

/**
 * Connects to Socket.IO for a specific ticket detail page.
 * Joins the ticket room, listens for messages, status changes, assignments, typing.
 */
export function useAdminSupportDetailSocket(
  ticketId: string,
  onNewMessage?: (msg: NewMessageEvent["message"]) => void,
  onStatusChanged?: (data: StatusChangedEvent) => void,
  onAssigned?: (data: TicketAssignedEvent) => void,
) {
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!ticketId) return;

    const socket = connectAdminSupportSocket();
    joinTicketRoom(ticketId);

    const handleNewMessage = (data: NewMessageEvent) => {
      if (data.ticket_id === ticketId) {
        onNewMessage?.(data.message);
      }
    };

    const handleStatusChanged = (data: StatusChangedEvent) => {
      if (data.ticket_id === ticketId) {
        onStatusChanged?.(data);
      }
    };

    const handleAssigned = (data: TicketAssignedEvent) => {
      if (data.ticket_id === ticketId) {
        onAssigned?.(data);
      }
    };

    const handleTyping = (data: TypingEvent) => {
      if (data.ticket_id === ticketId && !data.is_admin) {
        setUserTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setUserTyping(false), 3000);
      }
    };

    const handleStopTyping = (data: TypingEvent) => {
      if (data.ticket_id === ticketId) {
        setUserTyping(false);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("status_changed", handleStatusChanged);
    socket.on("ticket_assigned", handleAssigned);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      leaveTicketRoom(ticketId);
      socket.off("new_message", handleNewMessage);
      socket.off("status_changed", handleStatusChanged);
      socket.off("ticket_assigned", handleAssigned);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [ticketId, onNewMessage, onStatusChanged, onAssigned]);

  const sendTyping = useCallback(() => {
    emitAdminTyping(ticketId);
  }, [ticketId]);

  const sendStopTyping = useCallback(() => {
    emitAdminStopTyping(ticketId);
  }, [ticketId]);

  return { userTyping, sendTyping, sendStopTyping };
}
