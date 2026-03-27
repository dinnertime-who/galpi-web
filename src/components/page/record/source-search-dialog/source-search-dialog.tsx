"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import { useEffect, useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { type BookItem, useSearchBooks } from "@/hooks/page/record/use-search-books";
import { type SourceSearchSelectedBook, SourceSearchDialogProvider, useSourceSearchDialog } from "./source-search-dialog.context";

type SourceSearchDialogRootProps = {
  children: React.ReactNode;
  onSelect: (values: SourceSearchSelectedBook) => void;
};

export function SourceSearchDialogRoot({ children, onSelect }: SourceSearchDialogRootProps) {
  const [open, setOpen] = useState(false);

  return (
    <SourceSearchDialogProvider context={{ open, setOpen, onSelect }}>
      {children}
      <SourceSearchDialogView />
    </SourceSearchDialogProvider>
  );
}

export function SourceSearchDialogTrigger() {
  const { setOpen } = useSourceSearchDialog();
  return (
    <Button variant="outline" className="flex-1" type="button" onClick={() => setOpen(true)}>
      <MagnifyingGlassIcon />
      <span>출처 찾아보기</span>
    </Button>
  );
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

function SourceSearchDialogView() {
  const { open, setOpen, onSelect } = useSourceSearchDialog();
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(inputValue), 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    if (!open) {
      setInputValue("");
      setDebouncedQuery("");
    }
  }, [open]);

  const { data: books, isLoading } = useSearchBooks(debouncedQuery);

  const handleSelect = (book: BookItem) => {
    onSelect({
      title: stripHtmlTags(book.title),
      author: book.author,
      isbn: book.isbn,
      image: book.image,
      link: book.link,
      pubdate: book.pubdate,
      publisher: book.publisher,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton className="flex flex-col gap-0 p-0 overflow-hidden max-h-[80vh]">
        <DialogHeader className="p-4 pb-3 border-b border-border shrink-0">
          <DialogTitle>출처 찾아보기</DialogTitle>
          <Input
            placeholder="책 제목 또는 저자 검색"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
        </DialogHeader>

        <div className="overflow-y-auto flex-1">
          {debouncedQuery.trim().length === 0 && (
            <p className="p-4 text-center text-xs text-muted-foreground">검색어를 입력하세요.</p>
          )}

          {debouncedQuery.trim().length > 0 && isLoading && (
            <p className="p-4 text-center text-xs text-muted-foreground">검색 중...</p>
          )}

          {debouncedQuery.trim().length > 0 && !isLoading && books?.length === 0 && (
            <p className="p-4 text-center text-xs text-muted-foreground">검색 결과가 없습니다.</p>
          )}

          {books && books.length > 0 && (
            <ul className="divide-y divide-border max-h-[35vh] overflow-y-auto">
              {books.map((book) => (
                <li key={book.isbn}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors"
                    onClick={() => handleSelect(book)}
                  >
                    {book.image ? (
                      <img
                        src={book.image}
                        alt={stripHtmlTags(book.title)}
                        className="shrink-0 rounded-sm object-cover w-[40px] h-[56px]"
                      />
                    ) : (
                      <div className="shrink-0 w-10 h-14 bg-muted rounded-sm" />
                    )}
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="text-xs font-medium truncate">{stripHtmlTags(book.title)}</p>
                      <p className="text-xs font-medium truncate">{stripHtmlTags(book.publisher)}</p>
                      <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
