"use client";

import { io, Socket } from "socket.io-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

let socket: Socket | null = null;
let currentTicketId: string | null = null;

export function getUserSupportSocket(): Socket | null {
  return socket;
}

export function connectUserSupportSocket(): Socket {
  if (socket && (socket.connected || socket.active)) return socket;

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
  }

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("smipay-access-token")
      : null;

  socket = io(`${API_BASE_URL}/support`, {
    auth: { token: token ?? "" },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on("connect", () => {
    console.log("[UserSupportSocket] connected, sid:", socket?.id);
    if (currentTicketId) {
      console.log("[UserSupportSocket] re-joining ticket room:", currentTicketId);
      socket?.emit("join_ticket", { ticket_id: currentTicketId });
    }
  });

  socket.on("connect_error", (err) => {
    console.error("[UserSupportSocket] connection error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("[UserSupportSocket] disconnected:", reason);
  });

  return socket;
}

export function disconnectUserSupportSocket() {
  currentTicketId = null;
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

export function joinTicketRoom(ticketId: string) {
  currentTicketId = ticketId;
  socket?.emit("join_ticket", { ticket_id: ticketId });
}

export function leaveTicketRoom(ticketId: string) {
  if (currentTicketId === ticketId) currentTicketId = null;
  socket?.emit("leave_ticket", { ticket_id: ticketId });
}

let typingTimer: ReturnType<typeof setTimeout> | null = null;
let isCurrentlyTyping = false;

export function emitUserTyping(ticketId: string) {
  if (!isCurrentlyTyping) {
    isCurrentlyTyping = true;
    socket?.emit("typing", { ticket_id: ticketId });
  }
  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    isCurrentlyTyping = false;
    socket?.emit("stop_typing", { ticket_id: ticketId });
  }, 3000);
}

export function emitUserStopTyping(ticketId: string) {
  if (typingTimer) clearTimeout(typingTimer);
  isCurrentlyTyping = false;
  socket?.emit("stop_typing", { ticket_id: ticketId });
}
