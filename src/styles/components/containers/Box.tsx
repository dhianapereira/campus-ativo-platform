import { ComponentProps, ElementType } from "react";
import { styled } from "@/styles/stitches";

export const Box = styled("div", {
  padding: "$6",
  borderRadius: "$md",
  backgroundColor: "$greenishWhite",
  boxShadow:
    "0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 3px 3px 0px rgba(0, 0, 0, 0.04), 0px 7px 4px 0px rgba(0, 0, 0, 0.03), 0px 12px 5px 0px rgba(0, 0, 0, 0.01), 0px 19px 5px 0px rgba(0, 0, 0, 0.00)",
});

export interface BoxProps extends ComponentProps<typeof Box> {
  as?: ElementType;
}

Box.displayName = "Box";
