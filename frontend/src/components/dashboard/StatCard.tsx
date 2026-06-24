interface Props {
  label: string
  value: number | string
  icon: string
}

export default function StatCard({ label, value, icon }: Props) {
  return (
    <div
  className="
    border
    border-slate-200
    dark:border-slate-700

    bg-white
    dark:bg-slate-900/50

    rounded-xl
    p-4

    shadow-sm
    hover:shadow-lg

    hover:border-slate-300
    dark:hover:border-slate-600

    transition-all
    duration-200
  "
>
  <div className="flex items-center justify-between mb-3">
    <span
      className="
        text-xs
        font-medium
        uppercase
        tracking-wider

        text-slate-500
        dark:text-slate-400
      "
    >
      {label}
    </span>

    <span
      className="
        text-xl
        opacity-80
      "
    >
      {icon}
    </span>
  </div>

  <div
    className="
      text-2xl
      font-bold

      text-slate-900
      dark:text-white
    "
  >
    {typeof value === 'number'
      ? value.toLocaleString()
      : value}
  </div>
</div>
  )
}