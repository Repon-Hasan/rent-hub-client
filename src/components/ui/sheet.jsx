"use client";

import React, { forwardRef } from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

// Root components
export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;

// Overlay
export const SheetOverlay = forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

// Content
export const SheetContent = forwardRef(
  ({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 gap-4 bg-white dark:bg-gray-900 p-6 shadow-lg transition-all",
          side === "right" && "inset-y-0 right-0 w-3/4 max-w-sm border-l",
          side === "left" && "inset-y-0 left-0 w-3/4 max-w-sm border-r",
          side === "top" && "inset-x-0 top-0 h-1/2 border-b",
          side === "bottom" && "inset-x-0 bottom-0 h-1/2 border-t",
          className
        )}
        {...props}
      >
        {children}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
);
SheetContent.displayName = "SheetContent";