interface LoaderProps {
    size?: number | string;
    speed?: number;
    variant?: 'fullscreen' | 'inline';
    className?: string; // Allow additional classes
}

export default function Loader({ size = 400, speed = 3, variant = 'fullscreen', className = '' }: LoaderProps) {
    // Ensure size is a valid CSS value
    const sizeValue = typeof size === 'number' ? `${size}px` : size;

    // Fullscreen vs Inline
    const containerClasses = variant === 'fullscreen'
        ? "w-full h-screen fixed top-0 left-0 bg-black/40 flex items-center justify-center z-[99999]"
        : "w-full h-full min-h-[200px] flex items-center justify-center bg-white/50"; // Inline defaults

    return (
        <div className={`${containerClasses} ${className}`}>
            <div
                className="relative flex items-center justify-center max-w-[250px] max-h-[250px] md:max-w-none md:max-h-none"
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
        </div>
    );
}
