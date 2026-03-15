"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/shadcn/drawer";
import { Button } from "@/components/shadcn/button";
import { useRecordMethodDrawerStore } from "@/app/store/record-method-drawer.store";
import { FileTextIcon, ImageIcon } from "@phosphor-icons/react";

export const RecordMethodDrawer = () => {
  const { isOpen, toggle } = useRecordMethodDrawerStore();

  return (
    <Drawer open={isOpen} onOpenChange={toggle}>
      <DrawerContent className="sm:max-w-md mx-auto">
        <DrawerHeader>
          <DrawerTitle>오늘의 갈피 기록하기</DrawerTitle>
          <DrawerDescription>
            원하는 방법으로 갈피를 기록해주세요.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid grid-cols-2 ">
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center border-r-0"
          >
            <ImageIcon className="text-primary-foreground size-5" />
            <span className="text-center text-primary-foreground">
              사진첩에서 <br /> 가져오기
            </span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center"
          >
            <FileTextIcon className="text-primary-foreground size-5" />
            <span className="text-center text-primary-foreground">
              지금보는 문장 <br /> 기록하기
            </span>
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
