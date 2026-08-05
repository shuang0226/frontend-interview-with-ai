import { Component } from 'react';
import type { CSSProperties, PropsWithChildren, ReactElement, ReactNode } from 'react';

const H5_URL = process.env.EXPO_PUBLIC_H5_URL?.trim() || 'http://localhost:10086';

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebPreviewErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error): void {
    console.error('Web preview failed to render', error);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main role='alert' style={styles.feedbackPage}>
          <h1 style={styles.feedbackTitle}>Web 预览壳发生错误</h1>
          <p style={styles.feedbackMessage}>请刷新页面后重试。</p>
        </main>
      );
    }

    return this.props.children;
  }
}

function WebPreview(): ReactElement {
  return (
    <main style={styles.page}>
      <iframe
        allow='clipboard-read; clipboard-write'
        src={H5_URL}
        style={styles.frame}
        title='优惠中心 H5 预览'
      />
    </main>
  );
}

export default function App(): ReactElement {
  return (
    <WebPreviewErrorBoundary>
      <WebPreview />
    </WebPreviewErrorBoundary>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    width: '100vw',
    height: '100dvh',
    margin: 0,
    overflow: 'hidden',
    backgroundColor: '#f6f7f9',
  },
  frame: {
    display: 'block',
    width: '100%',
    height: '100%',
    border: 0,
    backgroundColor: '#f6f7f9',
  },
  feedbackPage: {
    display: 'flex',
    width: '100vw',
    height: '100dvh',
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 28,
    boxSizing: 'border-box',
    backgroundColor: '#f6f7f9',
  },
  feedbackTitle: {
    margin: 0,
    color: '#1f2329',
    fontSize: 20,
  },
  feedbackMessage: {
    marginTop: 12,
    color: '#6c727a',
    fontSize: 14,
  },
};
