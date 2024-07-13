import React, { ComponentType, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  bugSnag: any;
}

export default function ErrorBoundary({ children, bugSnag }: ErrorBoundaryProps) {
  const ErrorBoundaryComponent = bugSnag?.getPlugin('react')?.createErrorBoundary(React)

  return ErrorBoundaryComponent ? (
    <ErrorBoundaryComponent>
      {children}
    </ErrorBoundaryComponent>
  ) : (
    children
  );
}