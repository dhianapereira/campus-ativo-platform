import { styled } from "@/styles";

export const MainContainer = styled("div", {
  width: "100%",
  maxWidth: "100%",
  margin: "0 auto",
  padding: "0 $4",

  "@media(min-width: 1400px)": {
    maxWidth: "1200px",
  },

  "@media(max-width: 640px)": {
    padding: "0 $2",
  },

  "@media(max-width: 480px)": {
    padding: "0 $1",
  },
});
