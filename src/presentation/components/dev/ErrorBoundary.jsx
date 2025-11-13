import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props){ super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error){ return { hasError: true, error }; }
  componentDidCatch(error, info){ console.error("UI error:", error, info); }
  render(){
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h1 style={{ fontSize: 20, marginBottom: 12 }}>Помилка інтерфейсу</h1>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
