import { Component } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-surface px-4">
          <div className="text-center max-w-sm">
            <ExclamationTriangleIcon className="h-10 w-10 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-serif font-semibold text-slate-900">
              Something went wrong
            </h2>
            <p className="text-slate-light text-sm mt-2">
              Try refreshing the page. If the problem continues, come back later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-emerald text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-emerald-dark transition-colors"
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}