import React, { useState } from "react";
import styled from "@emotion/styled";

import { useIsomorphicLayoutEffect } from "hooks/useIsomorphicLayouteffect";

const AlertModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: calc(100vh - var(--edgeButtonMargin) * 2);
    width: calc(100vw - var(--edgeButtonMargin) * 2);
    transform: translate(
        calc(var(--edgeButtonMargin)),
        calc(var(--edgeButtonMargin))
    );
    background-color: ${({ theme }) => theme.colors.offBlack};
    border: 3px solid ${({ theme }) => theme.colors.offWhite};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const AlertModalInner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1.124em;
    padding: 20px;
    text-align: center;

    h1 {
        font-size: clamp(2.4rem, 4vw, 3.4rem);
    }

    p {
        max-width: 60ch;
        line-height: 1.35;
    }

    > :not(:last-child) {
        margin-bottom: 10vh;
    }
`;

export const ReducedMotionAlert = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useIsomorphicLayoutEffect(() => {
        const QUERY = "(prefers-reduced-motion: reduce)";
        const mediaQueryList = window.matchMedia(QUERY);
        const listener = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        try {
            mediaQueryList.addEventListener("change", listener); // Chrome & FF
        } catch {
            mediaQueryList.addListener(listener); // Safari
        }

        if (localStorage.getItem("reducedMotionAlert.dismissed") === "true") {
            setIsDismissed(true);
        }

        return () => {
            try {
                mediaQueryList.removeEventListener("change", listener);
            } catch {
                mediaQueryList.removeListener(listener);
            }
        };
    }, []);

    const handleDismiss = () => {
        setIsDismissed(true);
        localStorage.setItem("reducedMotionAlert.dismissed", "true");
    };

    return !prefersReducedMotion && !isDismissed ? (
        <AlertModal>
            <AlertModalInner>
                <h1>Reduced motion preference detected</h1>

                <p>
                    It looks like you have set a preference for reduced motion on
                    your device. This site is a collection of motion-heavy sketches
                    and graphics, so I thought I should add this warning before
                    displaying them. If you are okay with this, click the button
                    below to continue.
                </p>

                <button type="button" onClick={handleDismiss}>
                    I understand
                </button>
            </AlertModalInner>
        </AlertModal>
    ) : null;
};
