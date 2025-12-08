interface LoaderProps {
    size?: number | string;
    speed?: number;
}

export default function Loader({ size = 400, speed = 3 }: LoaderProps) {
    // Ensure size is a valid CSS value
    const sizeValue = typeof size === 'number' ? `${size}px` : size;

    return (
        <div className="w-full h-screen fixed top-0 left-0 bg-black/40 flex items-center justify-center z-[99999]">
            <div
                className="relative flex items-center justify-center"
                style={{ width: sizeValue, height: sizeValue }}
            >
                {/* Static Logo */}
                <img
                    src="/loader-logo.png"
                    alt="Logo"
                    className="absolute w-[500px] h-[500px] object-contain"
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
