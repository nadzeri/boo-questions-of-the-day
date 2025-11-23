"use client";

import { createContext, useContext, useRef, ReactNode } from "react";

type CommentFocusContextType = {
  focusTextarea: () => void;
  registerFocus: (focusFn: () => void) => void;
};

const CommentFocusContext = createContext<CommentFocusContextType | null>(null);

export function CommentFocusProvider({ children }: { children: ReactNode }) {
  const focusFnRef = useRef<(() => void) | null>(null);

  const registerFocus = (focusFn: () => void) => {
    focusFnRef.current = focusFn;
  };

  const focusTextarea = () => {
    if (focusFnRef.current) {
      focusFnRef.current();
    }
  };

  return (
    <CommentFocusContext.Provider value={{ focusTextarea, registerFocus }}>
      {children}
    </CommentFocusContext.Provider>
  );
}

export function useCommentFocus() {
  const context = useContext(CommentFocusContext);
  if (!context) {
    throw new Error("useCommentFocus must be used within CommentFocusProvider");
  }
  return context;
}

