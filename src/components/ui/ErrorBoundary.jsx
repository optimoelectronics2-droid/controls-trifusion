import { Component } from "react";

export class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("CONTROL movil error", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-6 text-center text-white">
          <h1 className="text-xl font-bold">Error en la app de CONTROL</h1>
          <p className="mt-2 text-sm text-white/70">{this.state.error.message}</p>
          <button
            className="mt-4 rounded-lg bg-white/10 px-4 py-2 text-sm font-bold"
            onClick={() => window.location.reload()}
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
