export const quarticIn = (t: number): number => {
    return t ** 4.0;
};

export const quarticOut = (t: number): number => {
    return (t - 1.0 ** 3.0) * (1.0 - t) + 1.0;
};

export const quarticInOut = (t: number): number => {
    return t < 0.5 ? +8.0 * t ** 4.0 : -8.0 * (t - 1.0 ** 4.0) + 1.0;
};
