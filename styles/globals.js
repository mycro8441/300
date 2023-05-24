import {createGlobalStyle} from "styled-components";

const GlobalStyle = createGlobalStyle`
@font-face {
  font-family: 'Pretendard-Regular';
  src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}
html, body {
  top:0;
  left: 0;
  width:100vw;
  height:100vh;
  padding:0;
  margin:0;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: ${p=>p.theme.colors.bgColor};
}
h1, h2, h3, h4, h5, h6, text, label, button, div, input{
  font-family:"Pretendard-Regular";
}
* {
  box-sizing: border-box;
  user-select: none;
}
`;
export default GlobalStyle;
