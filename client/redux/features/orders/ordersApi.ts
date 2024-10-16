import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (type) => ({
        url: "get-orders",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: "create-order",
        method: "POST",
        credentials: "include" as const,
        body: data,
      }),
    }),
  }),
});

export const { useGetAllOrdersQuery, useCreateOrderMutation } = ordersApi;
