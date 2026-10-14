import React from 'react';

interface ReportChartProps {
    data: { label: string; value: number }[];
    height?: number;
    color?: string;
}

export default function ReportChart({ data, height = 250, color = 'bg-blue-500' }: ReportChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full flex items-center justify-center bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-dashed border-gray-200 dark:border-white/10" style={{ height }}>
                <span className="text-gray-400 dark:text-neutral-500 text-sm font-medium">No data available</span>
            </div>
        );
    }

    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="w-full" style={{ height }}>
            <div className="flex h-full items-end justify-between gap-2 pt-4">
                {data.map((item, index) => {
                    const barHeight = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                    return (
                        <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group">
                            {/* Tooltip and Value */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 text-xs font-semibold text-gray-700 dark:text-white whitespace-nowrap bg-white dark:bg-[#0F172A] px-2.5 py-1 rounded-lg shadow-md border border-gray-100 dark:border-white/10 absolute -mt-10 z-10 pointer-events-none font-mono">
                                Rs. {item.value.toLocaleString()}
                            </div>

                            {/* Bar */}
                            <div
                                className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ${color} opacity-80 group-hover:opacity-100`}
                                style={{ height: `${Math.max(barHeight, 2)}%` }}
                            ></div>

                            {/* Label */}
                            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-neutral-400 mt-2 truncate w-full text-center font-medium" title={item.label}>
                                {item.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
