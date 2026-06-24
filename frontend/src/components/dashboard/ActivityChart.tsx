import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import type { DailyActivity } from '../../types'

interface Props {
  data: DailyActivity[]
}

export default function ActivityChart({ data }: Props) {
  // Format dates as "Jun 14" instead of "2026-06-14" for readability
  const formatted = data.map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }))

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
  <h3
    className="
      text-sm
      font-medium
      text-slate-700
      dark:text-slate-300
      mb-4
    "
  >
    Messages sent — last 14 days
  </h3>

  <ResponsiveContainer width="100%" height={220}>
    <LineChart data={formatted}>
      <CartesianGrid
        strokeDasharray="3 3"
        stroke="#CBD5E1"
      />

      <XAxis
        dataKey="label"
        stroke="#64748B"
        fontSize={11}
      />

      <YAxis
        stroke="#64748B"
        fontSize={11}
        allowDecimals={false}
      />

      <Tooltip
        contentStyle={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '8px',
          fontSize: 12,
          color: '#0F172A',
        }}
      />

      <Line
        type="monotone"
        dataKey="messages"
        stroke="#3B82F6"
        strokeWidth={3}
        dot={{
          fill: '#3B82F6',
          r: 4,
        }}
        activeDot={{
          r: 6,
        }}
      />
    </LineChart>
  </ResponsiveContainer>
</div>
  )
}