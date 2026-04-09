"use client"

interface DataPoint {
  label: string
  value: number
  color?: string
}

interface BarChartProps {
  data: DataPoint[]
  height?: number
  defaultColor?: string
}

export function BarChart({ data, height = 200, defaultColor = "#dc2626" }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="relative" style={{ height }}>
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 w-12">
        <span>{maxValue.toLocaleString()}</span>
        <span>{Math.round(maxValue * 0.5).toLocaleString()}</span>
        <span>0</span>
      </div>

      {/* Chart */}
      <div className="ml-12 h-full flex items-end gap-2 pb-8">
        {data.map((point, index) => {
          const barHeight = (point.value / maxValue) * 100
          const color = point.color || defaultColor

          return (
            <div key={index} className="flex-1 flex flex-col items-center group">
              {/* Bar */}
              <div className="w-full relative" style={{ height: `calc(100% - 2rem)` }}>
                <div className="absolute bottom-0 w-full flex justify-center">
                  <div
                    className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80 relative"
                    style={{
                      height: `${barHeight}%`,
                      backgroundColor: color,
                    }}
                  >
                    {/* Value label on hover */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded whitespace-nowrap">
                      {point.value.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Label */}
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2 line-clamp-2">
                {point.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
