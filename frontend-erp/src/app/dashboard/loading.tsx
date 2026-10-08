import Loader from "@/components/loader";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[60vh] w-full">
            <Loader variant="inline" size={100} text="Loading..." />
        </div>
    );
}
