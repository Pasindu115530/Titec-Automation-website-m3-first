import React from 'react';

interface ReportChartProps {
    data: { label: string; value: number }[];
    height?: number;
    color?: string;
}

export default function ReportChart({ data, height = 250, color = 'bg-blue-500' }: ReportChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200" style={{ height }}>
                <span className="text-gray-400 text-sm">No data available</span>
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
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 text-xs font-semibold text-gray-700 whitespace-nowrap bg-white px-2 py-1 rounded shadow-sm border border-gray-100 absolute -mt-10 z-10 pointer-events-none">
                                Rs. {item.value.toLocaleString()}
                            </div>
                            
                            {/* Bar */}
                            <div 
                                className={`w-full max-w-[40px] rounded-t-sm transition-all duration-500 ${color} opacity-80 group-hover:opacity-100`}
                                style={{ height: `${Math.max(barHeight, 2)}%` }}
                            ></div>
                            
                            {/* Label */}
                            <div className="text-[10px] sm:text-xs text-gray-500 mt-2 truncate w-full text-center" title={item.label}>
                                {item.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
