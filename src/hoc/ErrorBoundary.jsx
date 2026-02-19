import { Component } from "react";
import { FaExclamationCircle } from "react-icons/fa";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.errorInfo) {
      // Error path

      return (
        <div
          style={{
            color: "#5D5D5D",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            marginBottom: "-60px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <FaExclamationCircle
              style={{
                fontSize: "4rem",
                marginRight: "1rem",
                color: "#E53E3E",
              }}
            />
            <h2 style={{ fontWeight: "bold", fontSize: "2rem" }}>
              Uh oh! Something went wrong...
            </h2>
          </div>
          <details
            style={{
              whiteSpace: "pre-wrap",
              marginTop: "0.5rem",
              border: "1px solid #E53E3E",
              borderRadius: "4px",
              padding: "1rem",
              textAlign: "left",
              overflow: "auto",
            }}
          >
            <summary
              style={{
                marginBottom: "0.5rem",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Error details
            </summary>
            <div style={{ padding: "0.5rem" }}>
              <p
                style={{
                  marginBottom: "0.5rem",
                  fontSize: "1rem",
                }}
              >
                {this.state.error && this.state.error.toString()}
              </p>
              <details
                style={{
                  whiteSpace: "pre-wrap",
                  border: "1px solid #FCE7E7",
                  borderRadius: "4px",
                  padding: "0.5rem",
                }}
              >
                <summary
                  style={{
                    marginBottom: "0.5rem",
                    fontSize: "1rem",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Component stack trace
                </summary>
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "1rem",
                  }}
                >
                  {this.state.errorInfo.componentStack}
                </p>
              </details>
            </div>
          </details>
          <p
            style={{ marginTop: "1rem", fontSize: "1rem", textAlign: "center" }}
          >
            Don&apos;t worry, our developers have been notified and are
            frantically working to fix it!
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
