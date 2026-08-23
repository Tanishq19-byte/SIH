import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[React ErrorBoundary Caught Error]:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-white border border-[#DC2626]/40 rounded-2xl space-y-3 shadow-2xs">
          <div className="flex items-center gap-2 text-[#DC2626]">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <h3 className="text-sm font-extrabold font-sans">
              {this.props.fallbackTitle || 'Component Temporarily Unavailable'}
            </h3>
          </div>
          <p className="text-xs text-[#64748B] font-sans leading-relaxed">
            An isolated error occurred rendering this section. The rest of the platform remains functional.
          </p>
          <div className="pt-1">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={this.handleRetry}
            >
              Retry Component
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
