import React from 'react';
import { Result, Button } from 'antd';

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="页面加载出错"
          subTitle={this.state.error?.message}
          extra={<Button type="primary" onClick={() => this.setState({ hasError: false, error: null })}>重试</Button>}
        />
      );
    }
    return this.props.children;
  }
}
