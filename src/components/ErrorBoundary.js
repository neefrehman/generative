/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";

import LargeIndicator from "./LargeIndicator";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(/* error */) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // eslint-disable-next-line no-console
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <LargeIndicator>error</LargeIndicator>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
