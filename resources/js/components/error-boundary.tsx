import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
          return this.props.fallback;
      }
      return (
        <div className="p-4 rounded-md bg-red-50 text-red-900 border border-red-200 m-4">
            <h2 className="text-lg font-semibold border-b border-red-200 pb-2 mb-2">UI Component Error</h2>
            <p className="text-sm font-mono whitespace-pre-wrap">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
