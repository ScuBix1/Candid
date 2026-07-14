type StatProps = {
  label: string;
  value: string | number;
  highlight?: boolean;
  onClick?: () => void;
  active?: boolean;
};

export default function StatCard(props: StatProps) {
  const { label, value, highlight, onClick, active } = props;

  return (
    <div className={`flex flex-col gap-1 ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <span
        className={`text-2xl font-semibold transition-colors ${
          highlight ? 'text-destructive' : 'text-foreground'
        } ${active ? 'underline' : ''}`}
      >
        {value}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
