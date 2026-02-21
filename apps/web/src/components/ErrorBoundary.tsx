import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { ErrorMessagePanel } from "./ErrorMessagePanel";
import { withDefaultPagePadding } from "@/hooks/withDefaultPagePadding";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ||
        withDefaultPagePadding(
          <ErrorMessagePanel
            message="Something went wrong with this component."
            onRetry={() => window.location.reload()}
          />
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
