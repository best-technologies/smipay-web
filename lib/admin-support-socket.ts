"use client";

import { io, Socket } from "socket.io-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

let socket: Socket | null = null;

export function getAdminSupportSocket(): Socket | null {
  return socket;
}

export function connectAdminSupportSocket(): Socket {
  if (socket?.connected) return socket;

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
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => {
    console.log("[AdminSupportSocket] connected");
  });

  socket.on("connect_error", (err) => {
    console.error("[AdminSupportSocket] connection error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("[AdminSupportSocket] disconnected:", reason);
  });

  return socket;
}

export function disconnectAdminSupportSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

export function joinTicketRoom(ticketId: string) {
  socket?.emit("join_ticket", { ticket_id: ticketId });
}

export function leaveTicketRoom(ticketId: string) {
  socket?.emit("leave_ticket", { ticket_id: ticketId });
}

let typingTimer: ReturnType<typeof setTimeout> | null = null;
let isCurrentlyTyping = false;

export function emitAdminTyping(ticketId: string) {
  if (!isCurrentlyTyping) {
    isCurrentlyTyping = true;
    socket?.emit("typing", { ticket_id: ticketId });
  }
  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    isCurrentlyTyping = false;
    socket?.emit("stop_typing", { ticket_id: ticketId });
  }, 2000);
}

export function emitAdminStopTyping(ticketId: string) {
  if (typingTimer) clearTimeout(typingTimer);
  isCurrentlyTyping = false;
  socket?.emit("stop_typing", { ticket_id: ticketId });
}
