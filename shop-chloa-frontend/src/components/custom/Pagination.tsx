import { PaginationItem } from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
import { TablePaginationProps } from "@mui/material/TablePagination";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  page: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  pageCount: number;
  className?: string;
}
import usePagination from "@mui/material/usePagination";
import { cn } from "@/lib/utils";
// function CustomPagination({
//   page,
//   onPageChange,
//   pageCount,
//   className,
// }: PaginationProps) {
//   //   const apiRef = useGridApiContext();
//   //   const pageCount = useGridSelector(apiRef, gridPageCountSelector);

//   return (
//     <MuiPagination
//       color="primary"
//       className={className}
//       count={pageCount}
//       page={page}
//       onChange={(event, newPage) => {
//         onPageChange(event as any, newPage);
//       }}
//       sx={{
//         width: "100%",
//         "& .MuiPagination-ul": {
//           display: "flex",
//           padding: "20px",
//           justifyContent: "center",
//         },
//         "& .MuiPaginationItem-previousNext": {
//           padding: "0px",
//         },
//       }}

//       renderItem={(item) => (
//         <PaginationItem
//           {...item}
//           classes="w-full"
//           sx={{
//             width: "100%",

//             // margin: "auto",
//             gap: "20px",
//             "&.MuiPagination-ul": {
//               display: "flex",
//               justifyContent: "space-between",
//             },
//           }}
//           shape="rounded"
//           slots={{
//             previous: () => (
//               <div className="flex items-center mb-auto justify-center  rounded-lg border-2 border-gray-300 bg-white gap-2 py-1 px-4">
//                 <ArrowLeft />
//                 Previous
//               </div>
//             ),
//             next: () => (
//               <div className="flex items-center justify-center  rounded-lg border-2 border-gray-300 bg-white gap-2 py-1 px-4">
//                 Next
//                 <ArrowRight />
//               </div>
//             ),
//           }}
//         />
//       )}
//     />
//   );
// }
function CustomPagination({
  page,
  onPageChange,
  pageCount,
  className,
}: PaginationProps) {
  const { items } = usePagination({
    count: pageCount,
    page: page,
    onChange(event, page) {
      onPageChange(event as any, page);
    },
  });
  const previousItem = items.find((item) => item.type === "previous");
  const nextItem = items.find((item) => item.type === "next");
  if (pageCount === 0) {
    return null;
  }
  return (
    <nav className="w-full flex px-2 justify-between">
      {previousItem && (
        <button
          {...previousItem}
          type="button"
          className="flex items-center justify-center font-semibold cursor-pointer rounded-lg border text-[#536179] border-gray-300 bg-white gap-2 py-1 px-4"
        >
          <ArrowLeft size={20} />
          Previous
        </button>
      )}
      <ul className="flex items-center justify-center gap-2">
        {items
          .filter((item) => !["next", "previous"].includes(item.type))
          .map(({ page, type, selected, ...item }, index) => {
            let children = null;

            if (type === "start-ellipsis" || type === "end-ellipsis") {
              children = "…";
            } else if (type === "page") {
              children = (
                <button
                  type="button"
                  className={cn(
                    "flex items-center justify-center rounded-lg text-muted-foreground font-medium  gap-2 h-8 w-8",
                    { "bg-[#E2F0FC] text-black": selected }
                  )}
                  {...item}
                >
                  {page}
                </button>
              );
            } else {
              children = (
                <button type="button" {...item}>
                  {type}
                </button>
              );
            }

            return <li key={index}>{children}</li>;
          })}
      </ul>
      {nextItem && (
        <button
          {...nextItem}
          type="button"
          className="flex items-center justify-center font-semibold cursor-pointer rounded-lg border text-[#536179] border-gray-300 bg-white gap-2 py-1 px-4"
        >
          Next
          <ArrowRight size={20} />
        </button>
      )}
    </nav>
  );
}

export default CustomPagination;

// function CustomPagination(props: any) {
//   return <GridPagination ActionsComponent={Pagination} {...props} />;
// }
