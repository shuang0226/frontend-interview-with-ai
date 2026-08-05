import { Component } from 'react';
import type { ErrorInfo, PropsWithChildren, ReactNode } from 'react';

import './app.scss';

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 保留错误边界，业务接入时可在此连接跨端监控。
    console.error('Address list failed to render', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

export default function App({ children }: PropsWithChildren): ReactNode {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
