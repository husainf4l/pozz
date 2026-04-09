"use client"

interface DataPoint {
  label: string
  value: number
}

interface LineChartProps {
  data: DataPoint[]
  height?: number
  color?: string
}

export function LineChart({ data, height = 200, color = "#dc2626" }: LineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue
  const padding = 20

  // Calculate points for the line
  const width = 100 // percentage
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * width
    const y = ((maxValue - point.value) / range) * (100 - padding * 2) + padding
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="relative" style={{ height }}>
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 w-12">
        <span>{maxValue.toLocaleString()}</span>
        <span>{Math.round((maxValue + minValue) / 2).toLocaleString()}</span>
        <span>{minValue.toLocaleString()}</span>
      </div>

      {/* Chart */}
      <div className="ml-12 h-full relative">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid lines */}
          <line
            x1="0"
            y1="25"
            x2="100"
            y2="25"
            stroke="currentColor"
            strokeWidth="0.2"
            className="text-gray-200 dark:text-gray-800"
          />
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="currentColor"
            strokeWidth="0.2"
            className="text-gray-200 dark:text-gray-800"
          />
          <line
            x1="0"
            y1="75"
            x2="100"
            y2="75"
            stroke="currentColor"
            strokeWidth="0.2"
            className="text-gray-200 dark:text-gray-800"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area under the line */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill="url(#lineGradient)"
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = ((maxValue - point.value) / range) * (100 - padding * 2) + padding
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1"
                fill={color}
                className="hover:r-2 transition-all"
              />
            )
          })}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          {data.map((point, index) => (
            <span key={index} className="flex-1 text-center">
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
