'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TitecErpLogoProps {
    className?: string;
    logoHeight?: number; // Height in pixels, defaults to 40
    speed?: number; // Spin duration in seconds, defaults to 4
    showBadge?: boolean; // Whether to show ERP badge/text, defaults to true
    badgeVariant?: 'badge' | 'text' | 'subtle'; // Visual variant of 'ERP'
}

export default function TitecErpLogo({
    className = '',
    logoHeight = 40,
    speed = 4,
    showBadge = true,
    badgeVariant = 'badge',
}: TitecErpLogoProps) {
    // loader-logo.png has natural dimensions 1024 x 520 (ratio ~ 1.9692 : 1)
    const logoWidth = Math.round(logoHeight * (1024 / 520));

    return (
        <div className={cn("inline-flex items-center gap-2.5 select-none shrink-0", className)}>
            {/* Animated TiTec Logo Container */}
            <div
                className="relative shrink-0 flex items-center justify-center"
                style={{ width: `${logoWidth}px`, height: `${logoHeight}px` }}
            >
                {/* Static TiTec Brand Logo (Arm + Base + TiTec text) */}
                <img
                    src="/loader-logo.png"
                    alt="TiTec Automation"
                    className="w-full h-full object-contain pointer-events-none"
                    draggable={false}
                />

                {/* Spinning Red Gear */}
                {/* Located at left 0, top 44.1% of logo height, diameter = 20% of logo width */}
                <div
                    className="absolute left-0 top-[44.1%] -translate-y-1/2 pointer-events-none"
                    style={{
                        width: `${logoWidth * 0.20}px`,
                        height: `${logoWidth * 0.20}px`,
                    }}
                >
                    <img
                        src="/loader-gear.png"
                        alt=""
                        className="w-full h-full object-contain animate-spin"
                        style={{ animationDuration: `${speed}s` }}
                        draggable={false}
                    />
                </div>
            </div>

            {/* ERP Identification */}
            {showBadge && (
                <div className="flex items-center self-end mb-1">
                    {badgeVariant === 'badge' && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-black tracking-widest uppercase bg-neutral-950 text-[#D7FC45] shadow-2xs">
                            ERP
                        </span>
                    )}

                    {badgeVariant === 'text' && (
                        <span className="text-xl font-bold tracking-tight text-neutral-900 leading-none">
                            ERP
                        </span>
                    )}

                    {badgeVariant === 'subtle' && (
                        <div className="flex items-center gap-2">
                            <span className="h-4 w-[1px] bg-neutral-300" />
                            <span className="text-xs font-bold tracking-wider uppercase text-neutral-600">
                                ERP
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
