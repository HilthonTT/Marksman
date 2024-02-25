"use client";

import { useQuery } from "convex/react";
import { UserButton, useUser, useOrganization } from "@clerk/nextjs";
import {
  Box,
  ChevronsLeft,
  KanbanSquare,
  MenuIcon,
  Settings,
} from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { ElementRef, useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { api } from "@/convex/_generated/api";
import { Separator } from "@/components/ui/separator";

import { OrgItem } from "./org-item";
import { Item } from "./item";
import { BoardNavbar } from "./board-navbar";

export const Navigation = () => {
  const { user } = useUser();
  const { organization } = useOrganization();

  const params = useParams();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const boards = useQuery(api.boards.getAll, {
    orgId: organization?.id as string,
  });

  const isResizingRef = useRef<boolean>(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);

  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isMobile);

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) {
      return;
    }

    let newWidth = event.clientX;

    if (newWidth < 240) {
      newWidth = 240;
    }

    if (newWidth > 480) {
      newWidth = 480;
    }

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;

      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = useCallback(() => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);

      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );

      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");

      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  }, [isMobile, setIsCollapsed, setIsResetting, sidebarRef, navbarRef]);

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");

      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile, resetWidth]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary dark:bg-gradient-to-b dark:from-secondary dark:to-neutral-800/85 overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}>
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}>
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <OrgItem />
        </div>
        <div className="mt-4">
          <Item
            label="Boards"
            icon={KanbanSquare}
            href={`/organizations/${organization?.id}`}
          />
          <Item
            label="Inventory"
            icon={Box}
            href={`/organizations/${organization?.id}/inventory`}
          />
          <Item
            label="Settings"
            icon={Settings}
            href={`/organizations/${organization?.id}/settings`}
          />

          <Separator className="my-1 bg-primary/30" />

          {boards?.map((board) => (
            <Item
              key={board._id}
              label={board.title}
              imageUrl={board.imageFullUrl}
              href={`/board/${board._id}`}
            />
          ))}
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
        <div className="mt-auto flex items-center p-2 z-[999999]">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonPopoverCard: {
                  zIndex: 999999,
                },
                userButtonAvatarBox: {
                  width: 40,
                  height: 40,
                },
              },
            }}
          />
          <p className="font-medium capitalize pl-2 text-sm">
            {user?.username}
          </p>
          <div className="ml-auto z-[99999]">
            <ModeToggle />
          </div>
        </div>
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}>
        {!!params.boardId ? (
          <BoardNavbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="h-6 w-6 text-md text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};
