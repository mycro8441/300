import styled from "styled-components";

const pixelToRem = size => `${size / 16}rem`;

const fontSizes = {
    title:pixelToRem(60),
    subtitle:pixelToRem(30),
    paragraph:pixelToRem(18),
}

const colors = {
    yellow:"#EDE51E"
}

export const dark = {
    fontSizes,
    colors : {
        ...colors,
        titleColor:'#B0C7EA',
        textColor:'#B0C7EA',
        bgColor:'#F5E2F8',
        textMild:'#fff',
    }
}
export const light = {
    fontSizes,
    colors : {
        ...colors,
        titleColor: "#0B2068",
        textColor: "#0B2068",
        bgColor:'#35a2F832',
        textMild:'#000',
    }
}