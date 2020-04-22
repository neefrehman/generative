/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";

import LargeTextOverlay from "./LargeTextOverlay";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <LargeTextOverlay>error</LargeTextOverlay>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
