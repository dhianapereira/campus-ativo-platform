import { styled } from "@/styles/stitches";

export const Container = styled("div", {
  display: "flex",
  gap: "18px",
  margin: "$3 0",

  variants: {
    orientation: {
      horizontal: {
        flexDirection: "row",
        flexWrap: "wrap",
      },
      vertical: {
        flexDirection: "column",
        gap: "$2",
      },
    },
  },

  defaultVariants: {
    orientation: "horizontal",
  },
});

export const Title = styled("p", {
  fontFamily: "$default",
  fontSize: "$md",
  fontWeight: "$bold",
  color: "$gray",
  margin: 0,
  marginBottom: "$2",

  variants: {
    hasError: {
      true: {
        color: "$red",
      },
    },
  },
});

export const ErrorMessage = styled("span", {
  fontFamily: "$default",
  fontSize: "$xs",
  color: "$red",
  marginTop: "$1",
  display: "block",
});
