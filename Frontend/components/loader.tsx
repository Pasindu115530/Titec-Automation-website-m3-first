export default function Loader() {
    return (
        <div className="w-full h-screen fixed top-0 left-0 bg-black/40 flex items-center justify-center z-[99999]">

            <div className="relative w-[130px] h-[130px] flex items-center justify-center">

                {/* Animated Gradient Ring */}
                <div className="
                    absolute w-full h-full rounded-full animate-spin
                    bg-conic-gradient from-blue-500 via-red-500 to-blue-500
                    p-[4px]
                ">
                    <div className="w-full h-full bg-transparent rounded-full"></div>
                </div>

                {/* Logo with gentle pulse */}
                <img
                    src="/logo.jpg"
                    alt="Logo"
                    className="w-[70px] h-[70px] object-contain rounded-lg animate-pulse"
                />
            </div>

        </div>
    );
}
