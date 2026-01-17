import { Component } from "react";
import type { ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { error } = this.state;

    if (error) {
      return (
        <div className="story-root">
          <div className="story-card">
            <div className="story-kicker">Error</div>
            <h1 className="story-title">Something went wrong</h1>
            <p className="story-subtitle">{error.message}</p>
            <button className="story-button" onClick={this.handleReload}>
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
