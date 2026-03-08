import { styled } from "@/styles";

export const MenuContainer = styled("div", {
  width: 250,
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  background: "$green",
  padding: "$8 $4 $6",
  top: 0,
  left: 0,
  flexShrink: 0,

  "@media(max-width: 820px)": {
    display: "none",
  },
});

export const LogoWrapper = styled("div", {
  marginBottom: "$8",
  flexShrink: 0,
});

export const MenuNav = styled("nav", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "$1",
  width: "100%",
});

export const MenuItem = styled("button", {
  all: "unset",
  boxSizing: "border-box",
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "$3",
  padding: "$3 $4",
  borderRadius: "$card",
  fontSize: "1rem",
  fontWeight: 500,
  color: "$white",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  textAlign: "left",

  svg: {
    width: "1.25rem",
    height: "1.25rem",
    flexShrink: 0,
  },

  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  variants: {
    active: {
      true: {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
      },
      false: {},
    },
  },
});

export const MenuFooter = styled("div", {
  marginTop: "auto",
  paddingTop: "$6",
  borderTop: "1px solid rgba(255, 255, 255, 0.2)",
  width: "100%",
});

export const LogoutButton = styled("button", {
  all: "unset",
  boxSizing: "border-box",
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "$3",
  padding: "$3 $4",
  borderRadius: "$card",
  fontSize: "1rem",
  fontWeight: 500,
  color: "$white",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  textAlign: "left",

  svg: {
    width: "1.25rem",
    height: "1.25rem",
    flexShrink: 0,
  },

  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});
