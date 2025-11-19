import { ComponentProps, ElementType } from "react";
import { styled } from "@/styles/stitches";

export const Button = styled("button", {
  all: "unset",
  borderRadius: "$sm",
  fontSize: "$sm",
  fontWeight: "$medium",
  fontFamily: "$default",
  textAlign: "center",
  minWidth: 120,
  padding: "0 $4",
  height: 48,
  boxSizing: "border-box",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "$2",

  cursor: "pointer",

  svg: {
    width: "$4",
    height: "$4",
  },

  "&:disabled": {
    cursor: "not-allowed",
  },

  "&:focus": {
    boxShadow: "0 0 0 2px $colors$greenAccent",
  },

  variants: {
    variant: {
      primary: {
        color: "$white",
        background: "$green",

        "&:not(:disabled):hover": {
          opacity: 0.8,
          transition: "background-color 0.1s",
        },

        "&:disabled": {
          backgroundColor: "$lightGray",
        },
      },
      secondary: {
        color: "$green",
        border: "2px solid $green",

        "&:not(:disabled):hover": {
          backgroundColor: "$green",
          color: "$white",
        },

        "&:disabled": {
          color: "$lightGray",
          borderColor: "$lightGray",
        },
      },
    },
  },

  defaultVariants: {
    variant: "primary",
  },
});

export interface ButtonProps extends ComponentProps<typeof Button> {
  as?: ElementType;
}

Button.displayName = "Button";
