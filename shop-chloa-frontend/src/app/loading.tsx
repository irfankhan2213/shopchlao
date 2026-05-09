import { Skeleton } from "@/components/ui/skeleton";

export default function LayoutLoading() {
  return (
    <div className=" h-screen w-screen flex  justify-center items-center  ">
      <div className="flex items-center text-base text-muted-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-6 w-6 animate-spin"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        Loading...
      </div>
    </div>
  );
}
