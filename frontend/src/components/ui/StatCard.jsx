export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{value ?? '-'}</p>
        </div>
        {Icon ? (
          <div className="rounded-md bg-brand/10 p-3 text-brand">
            <Icon className="h-6 w-6" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
