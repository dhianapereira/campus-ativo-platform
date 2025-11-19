import { styled } from "@/styles/stitches";

export const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$2",
});

export const Label = styled("label", {
  marginBottom: "$2",
  color: "$gray",
  fontSize: "$md",
  fontFamily: "$default",
  fontWeight: "$bold",

  variants: {
    hasError: {
      true: {
        color: "$red",
      },
    },
  },
});

export const SelectWrapper = styled("div", {
  position: "relative",
  display: "inline-block",
  width: "100%",
  maxWidth: 280,
  height: 60,
});

export const Select = styled("select", {
  width: "100%",
  height: "100%",
  appearance: "none",
  padding: "$4",
  paddingRight: "$12",
  backgroundColor: "$white",
  color: "$darkGray",
  fontFamily: "$default",
  fontSize: "$md",
  borderRadius: "$md",
  border: "1px solid $lightGray",
  boxSizing: "border-box",
  cursor: "pointer",

  "&:focus": {
    outline: "none",
    borderColor: "$green",
    borderWidth: "2px",
  },

  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
    backgroundColor: "$lightGray",
  },

  "& option": {
    color: "$darkGray",
    background: "$white",
    borderRadius: "$md",

    "&:disabled": {
      color: "$lightGray",
      fontStyle: "italic",
    },
  },

  "&:invalid": {
    color: "$lightGray",
  },

  variants: {
    hasError: {
      true: {
        borderColor: "$red",
        borderWidth: "2px",

        "&:focus": {
          borderColor: "$red",
        },
      },
    },
  },
});

export const Icon = styled("div", {
  position: "absolute",
  top: "50%",
  right: "$4",
  pointerEvents: "none",
  transform: "translateY(-50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$gray",
  fontSize: "$lg",

  variants: {
    disabled: {
      true: {
        opacity: 0.5,
      },
    },
  },
});

export const ErrorMessage = styled("span", {
  fontFamily: "$default",
  fontSize: "$xs",
  color: "$red",
  marginTop: "$1",
});
