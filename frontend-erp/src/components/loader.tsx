interface LoaderProps {
    size?: number | string;
    speed?: number;
    variant?: 'fullscreen' | 'inline';
    className?: string; // Allow additional classes
    text?: string; // Optional loading caption
}

export default function Loader({
    size,
    speed = 3,
    variant = 'fullscreen',
    className = '',
    text,
}: LoaderProps) {
    // Intelligent default size: 400 for fullscreen overlay, 80 for inline tables/cards
    const defaultSize = variant === 'fullscreen' ? 400 : 80;
    const effectiveSize = size ?? defaultSize;
    const sizeValue = typeof effectiveSize === 'number' ? `${effectiveSize}px` : effectiveSize;

    // Fullscreen vs Inline container styling
    const containerClasses = variant === 'fullscreen'
        ? "w-full h-screen fixed top-0 left-0 bg-black/40 flex items-center justify-center z-[99999]"
        : "w-full flex items-center justify-center";

    return (
        <div className={`${containerClasses} ${className}`}>
            <div className="flex flex-col items-center justify-center">
                <div
                    className="relative flex items-center justify-center max-w-[250px] max-h-[250px] md:max-w-none md:max-h-none shrink-0"
                    style={{ width: sizeValue, height: sizeValue }}
                >
                    {/* Static Logo */}
                    <img
                        src="/loader-logo.png"
                        alt="Logo"
                        className="absolute w-full h-full object-contain"
                    />

                    {/* Spinning Gear */}
                    <div className="absolute left-0 top-[47%] -translate-y-1/2 w-[20%] h-[20%]">
                        <img
                            src="/loader-gear.png"
                            alt="Loading..."
                            className="w-full h-full object-contain animate-spin"
                            style={{ animationDuration: `${speed}s` }}
                        />
                    </div>
                </div>

                {text && (
                    <p className="text-neutral-500 font-semibold text-sm mt-3 animate-pulse">
                        {text}
                    </p>
                )}
            </div>
        </div>
    );
}
