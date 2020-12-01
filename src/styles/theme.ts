export const theme = {
    colors: {
        white: "#ffffff",
        offWhite: "#eeeeee",
        offWhiteHover: "#cacaca",
        grey: "#4a4a4a",
        offBlack: "#212121",
    },
};

declare module "@emotion/react" {
    export interface Theme {
        colors: {
            [color in keyof typeof theme.colors]: string;
        };
    }
}
