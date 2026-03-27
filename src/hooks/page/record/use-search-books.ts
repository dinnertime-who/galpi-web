"use client";

import { useQuery } from "@tanstack/react-query";
import ky from "ky";

export type BookItem = {
  title: string;
  author: string;
  image: string;
  isbn: string;
  publisher: string;
  link: string;
  pubdate: string;
};

type NaverBookResponse = {
  items: BookItem[];
};

async function fetchBooks(query: string): Promise<BookItem[]> {
  const data = await ky.get("/api/books", { searchParams: { query } }).json<NaverBookResponse>();
  return data.items;
}

export function useSearchBooks(query: string) {
  return useQuery({
    queryKey: ["books", "search", query],
    queryFn: () => fetchBooks(query),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });
}
