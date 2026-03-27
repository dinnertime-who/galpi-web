import ky from "ky";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";

const NAVER_BOOKS_URL = "https://openapi.naver.com/v1/search/book.json";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const response = await ky.get<NaverBookResponse>(NAVER_BOOKS_URL, {
    searchParams: { query },
    headers: {
      "X-Naver-Client-Id": env.NAVER_API_CLIENT_ID,
      "X-Naver-Client-Secret": env.NAVER_API_CLIENT_SECRET,
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}

type NaverBookResponse = {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: {
    title: string;
    link: string;
    image: string;
    author: string;
    discount: string;
    publisher: string;
    pubdate: string;
    isbn: string;
    description: string;
  }[];
};
