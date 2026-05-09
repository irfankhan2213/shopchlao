import { Skeleton } from "@/components/ui/skeleton";

export default function LayoutLoading() {
  return (
    <Skeleton className="flex">
      <div className=" bg-glass h-screen overflow-y-auto w-[300px]  ">
        <div className="h-24 flex justify-center items-center border-b">
          <div className="flex w-[190px]">
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>
        </div>
        <div className="pt-4 flex flex-col items-center gap-4 w-full">
          <Skeleton className="h-10 w-40 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
      </div>
      <div className="w-full  px-10 pb-10  h-screen relative overflow-y-auto">
        <Skeleton className="h-16 my-4 w-full rounded-xl" />
        <Skeleton className="h-[70vh] w-full rounded-xl " />
      </div>
    </Skeleton>
  );
}
