import { styled, Heading } from "@/styles";

export const HeaderContainer = styled("header", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "$6 $8 $4",

  "@media(max-width: 820px)": {
    [`> ${Heading}`]: {
      display: "none",
    },
  },
});

export const DrawerIcon = styled("div", {
  "@media(min-width: 821px)": {
    display: "none",
  },
});

export const UserInfoContainer = styled("div", {
  display: "flex",
  alignItems: "center",
});

export const Info = styled("div", {
  marginLeft: "$3",
  display: "flex",
  flexDirection: "column",

  "& .name": {
    fontWeight: "bold",
  },
});
