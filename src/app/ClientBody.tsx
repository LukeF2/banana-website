"use client";

import { useEffect } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Apply body classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.classList.add("antialiased");
  }, []);

  return <>{children}</>;
}
