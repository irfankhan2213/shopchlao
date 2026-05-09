// app/providers.jsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import axiosInstance from "../../services/ApiServices/axiosInstance";
import DashboardSkeleton from "@/ViewComponents/Skeletons/DashboardSkeleton";

export function Providers(props: { children: React.ReactNode; token: string }) {
  const { token } = props;
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            enabled: true,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Use useEffect instead of useLayoutEffect to avoid hydration mismatches
  React.useLayoutEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {props.children}
      </ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
