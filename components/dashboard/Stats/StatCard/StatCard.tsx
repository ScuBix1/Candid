type StatProps = {
  label: string;
  value: string | number;
  highlight?: boolean;
};

export default function StatCard(props: StatProps) {
  const { label, value, highlight } = props;

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`text-2xl font-semibold ${highlight ? 'text-destructive' : 'text-foreground'}`}
      >
        {value}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
