"use client";

interface Toast {
  id: number;
  achievement: { name: string; icon: string; description: string };
}

interface ToastNotificationsProps {
  toasts: Toast[];
  theme: "light" | "dark";
}

export function ToastNotifications({ toasts, theme }: ToastNotificationsProps) {
  const isDark = theme === "dark";

  return (
    <div style={{ position: "fixed", top: 80, right: 20, zIndex: 1000, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(30,41,59,0.98), rgba(15,23,42,0.98))"
              : "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
            backdropFilter: "blur(20px)",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(34,197,94,0.3)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 8px 24px rgba(34,197,94,0.2)",
            animation: "slideUp 0.3s ease-out",
            minWidth: 280,
          }}
        >
          <div style={{ fontSize: 24 }}>{toast.achievement.icon}</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--success)" }}>Achievement Unlocked!</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{toast.achievement.name}</div>
            <div style={{ fontSize: 11, color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>{toast.achievement.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
