import React from 'react';

interface SectionHeaderProps {
    title: string;
    highlightedText?: string;
    highlightPosition?: 'prefix' | 'suffix';
    subtitle?: string;
}

export default function SectionHeader({ title, highlightedText, highlightPosition = 'suffix', subtitle }: SectionHeaderProps) {
    return (
        <div className="text-center pb-6">
            <h2 className="section-title">
                {highlightPosition === 'prefix' && highlightedText && <span className="text-gradient-tech font-extrabold">{highlightedText} </span>}
                {title}
                {highlightPosition === 'suffix' && highlightedText && <span className="text-gradient-tech font-extrabold"> {highlightedText}</span>}
            </h2>
            <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-transparent mx-auto mt-4 rounded-full"></div>
            {subtitle && <p className="mt-2 text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
    );
}
