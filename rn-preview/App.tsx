import { Component, useCallback, useMemo, useState } from 'react';
import type { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const CONFIGURED_H5_URL = process.env.EXPO_PUBLIC_H5_URL?.trim();
const DEFAULT_H5_URL = Platform.select({
  android: 'http://10.0.2.2:10086',
  default: 'http://localhost:10086',
});
const H5_URL = CONFIGURED_H5_URL || DEFAULT_H5_URL;

interface ErrorBoundaryState {
  hasError: boolean;
}

class PreviewErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error): void {
    console.error('RN preview failed to render', error);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.feedbackPage}>
          <Text style={styles.feedbackTitle}>预览壳发生错误</Text>
          <Text style={styles.feedbackMessage}>请重新加载 Expo 应用后再试。</Text>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

function EmptyWebViewError(): ReactElement {
  return <View style={styles.webViewErrorPlaceholder} />;
}

function PreviewScreen(): ReactElement {
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const source = useMemo(() => ({ uri: H5_URL }), []);

  const handleLoadStart = useCallback((): void => {
    setHasLoadError(false);
    setIsLoading(true);
  }, []);

  const handleLoadEnd = useCallback((): void => {
    setIsLoading(false);
  }, []);

  const handleLoadError = useCallback((): void => {
    setHasLoadError(true);
    setIsLoading(false);
  }, []);

  const handleRetry = useCallback((): void => {
    setReloadKey((current) => current + 1);
  }, []);

  return (
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={styles.container}>
      <StatusBar style='dark' />
      <WebView
        key={reloadKey}
        allowsBackForwardNavigationGestures
        allowsInlineMediaPlayback
        javaScriptEnabled
        mixedContentMode='always'
        onError={handleLoadError}
        onHttpError={handleLoadError}
        onLoadEnd={handleLoadEnd}
        onLoadStart={handleLoadStart}
        originWhitelist={['http://*', 'https://*']}
        renderError={EmptyWebViewError}
        setSupportMultipleWindows={false}
        source={source}
        style={styles.webView}
      />

      {isLoading && !hasLoadError && (
        <View pointerEvents='none' style={styles.loadingOverlay}>
          <ActivityIndicator color='#e82034' size='large' />
          <Text style={styles.loadingText}>正在加载 H5 预览…</Text>
        </View>
      )}

      {hasLoadError && (
        <View style={styles.feedbackPage}>
          <Text style={styles.feedbackTitle}>无法连接 H5 页面</Text>
          <Text selectable style={styles.urlText}>{H5_URL}</Text>
          <Text style={styles.feedbackMessage}>
            请确认根目录的 npm run dev:h5 已启动。真机预览时，请在 rn-preview/.env.local 中配置电脑的局域网 IP。
          </Text>
          <Pressable accessibilityRole='button' onPress={handleRetry} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>重新加载</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

export default function App(): ReactElement {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PreviewErrorBoundary>
        <PreviewScreen />
      </PreviewErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webView: {
    flex: 1,
    backgroundColor: '#f6f7f9',
  },
  webViewErrorPlaceholder: {
    flex: 1,
    backgroundColor: '#f6f7f9',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#f6f7f9',
  },
  loadingText: {
    color: '#6c727a',
    fontSize: 14,
  },
  feedbackPage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: '#f6f7f9',
  },
  feedbackTitle: {
    color: '#1f2329',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  feedbackMessage: {
    maxWidth: 360,
    marginTop: 12,
    color: '#6c727a',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  urlText: {
    marginTop: 12,
    color: '#a63a47',
    fontSize: 13,
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 132,
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#e82034',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
