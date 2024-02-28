"use client";

import Image from "next/image";
import Link from "next/link";
import { HardHatIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useModal } from "@/hooks/use-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { redirectStripe } from "@/actions/stripe";

export const ProModal = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const modal = useModal((state) => state);

  const isOpen = modal.isOpen && modal.type === "pro";

  const onClick = async () => {
    try {
      setIsLoading(true);

      const url = await redirectStripe();

      window.location.href = url;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={modal.onClose}>
      <DialogContent className="bg-white overflow-hidden text-black w-full flex flex-col items-center justify-center">
        <div className="h-40 w-40 relative text-center">
          <Image
            src="/pro-hero.jpg"
            alt="Hero"
            className="object-cover rounded-full"
            fill
          />
          <div className="absolute bottom-0 -right-20">
            <Badge variant="outline" className="bg-black">
              <Link
                href="https://www.pinterest.com.mx/oscarleoxd"
                className="text-xs text-muted-foreground truncate">
                By Oscar Leonardo
              </Link>
            </Badge>
          </div>
        </div>
        <Link
          href="https://www.pinterest.com.mx/pin/69454019227437803"
          className="text-sm text-muted-foreground justify-start">
          Visit Source
        </Link>
        <div className="space-y-6 p-6 pb-1 text-zinc-700">
          <h2 className="font-semibold text-xl flex items-center">
            <HardHatIcon className="h-4 w-4 mr-2" />
            Upgrade Marksman Now!
          </h2>
        </div>
        <div className="pl-3">
          <ul className="list-disc text-sm">
            <li>Unlimited boards</li>
            <li>Meeting calls</li>
            <li>Inventory management</li>
          </ul>
        </div>
        <Button
          onClick={onClick}
          className="border border-black hover:bg-neutral-200 transition"
          disabled={isLoading}>
          Upgrade now!
        </Button>
      </DialogContent>
    </Dialog>
  );
};
