type Props = {
  name: string;
  color: string;
};

export function LabelBadge({ name, color }: Props) {
  // Tinted glass with stronger contrast on dark rainbow surfaces.
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all duration-150 hover:brightness-110 hover:shadow-md select-none font-sans"
      style={{
        background: `linear-gradient(120deg, ${color}33, ${color}14)`,
        borderColor: `${color}80`,
        color: "#F8FAFF",
        textShadow: `0 0 10px ${color}55`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
      />
      {name}
    </span>
  );
}
