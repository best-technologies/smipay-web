"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  connectAdminSupportSocket,
  disconnectAdminSupportSocket,
} from "@/lib/admin-support-socket";
import { useAdminSupportNotifications } from "@/store/admin/admin-support-notifications-store";

interface TicketUpdatedEvent {
  ticket_id: string;
  event: "new_user_message" | "assigned" | "status_changed" | "new_reply";
  ticket_number?: string;
  message?: {
    id: string;
    preview: string;
    sender_name: string;
    created_at: string;
  };
}

interface TicketCreatedEvent {
  id: string;
  ticket_number: string;
  subject: string;
  email: string;
}

/**
 * Global admin socket that runs in the AdminLayout.
 * Pushes banner notifications for new user messages on any ticket,
 * but suppresses them if the admin is already viewing that ticket.
 */
export function useAdminSupportGlobalSocket() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const push = useAdminSupportNotifications((s) => s.push);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (connectedRef.current) return;
    connectedRef.current = true;

    const socket = connectAdminSupportSocket();

    const handleTicketUpdated = (data: TicketUpdatedEvent) => {
      if (
        data.event !== "new_user_message" &&
        data.event !== "new_reply"
      )
        return;
      if (!data.message) return;

      // Suppress if admin is currently viewing this ticket's detail page
      const currentPath = pathnameRef.current;
      if (currentPath === `/unified-admin/support/${data.ticket_id}`) return;

      push({
        ticketId: data.ticket_id,
        ticketNumber: data.ticket_number ?? "Ticket",
        senderName: data.message.sender_name ?? "User",
        preview: data.message.preview ?? "New message",
      });
    };

    const handleTicketCreated = (data: TicketCreatedEvent) => {
      push({
        ticketId: data.id,
        ticketNumber: data.ticket_number ?? "New Ticket",
        senderName: data.email ?? "User",
        preview: data.subject ?? "New support ticket created",
      });
    };

    socket.on("ticket_updated", handleTicketUpdated);
    socket.on("ticket_created", handleTicketCreated);

    return () => {
      socket.off("ticket_updated", handleTicketUpdated);
      socket.off("ticket_created", handleTicketCreated);
      disconnectAdminSupportSocket();
      connectedRef.current = false;
    };
  }, [push]);
}
