import { ComponentProps, ElementType } from "react";
import { styled } from "@/styles/stitches";

export const LinkButton = styled("a", {
  borderRadius: "$sm",
  fontSize: "$sm",
  fontFamily: "$default",
  textAlign: "left",
  padding: "0 $4",
  minWidth: 120,
  boxSizing: "border-box",
  textDecoration: "none",
  fontWeight: "$medium",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "$2",
  cursor: "pointer",

  svg: {
    width: "$4",
    height: "$4",
    flexShrink: 0,
  },

  "&:hover": {
    textDecoration: "underline",
  },

  variants: {
    variant: {
      green: {
        color: "$green",
      },
      white: {
        color: "$white",
      },
    },
  },

  defaultVariants: {
    variant: "green",
  },
});

export interface LinkButtonProps extends ComponentProps<typeof LinkButton> {
  as?: ElementType;
}

LinkButton.displayName = "LinkButton";
