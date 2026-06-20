const styles: Record<string, string> = {
  DRAFT: "bg-white/10 text-muted",
  ISSUED: "bg-blue-400/15 text-blue-300",
  PARTIAL: "bg-amber-400/15 text-amber-300",
  PAID: "bg-emerald-400/15 text-emerald-300",
  CANCELLED: "bg-red-400/15 text-red-300",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] ?? "bg-white/10 text-muted"
      }`}
    >
      {status}
    </span>
  );
}
