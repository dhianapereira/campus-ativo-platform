import { styled } from "@/styles";

export const SearchContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  width: "100%",
  gap: "$0",
});

export const SearchInputContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  flex: 1,
  position: "relative",

  backgroundColor: "#ffffff",
  border: "1px solid #e9ecef",
  transition: "all 0.2s ease",
  maxWidth: "33.5rem",
  borderRadius: "$md",

  "&:focus-within": {
    borderColor: "#4a9960",
  },
});

export const SearchIcon = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#6c757d",
  paddingLeft: "$4",
  marginRight: "$3",
  flexShrink: 0,
});

export const SearchInput = styled("input", {
  all: "unset",
  boxSizing: "border-box",
  fontFamily: "$default",
  fontSize: "$md",
  color: "#212529",
  width: "100%",
  height: "46px",
  padding: "$3 0",

  "&::placeholder": {
    color: "#6c757d",
    fontWeight: "$normal",
  },
});

export const FilterButton = styled("button", {
  all: "unset",
  boxSizing: "border-box",
  fontFamily: "$default",
  fontSize: "$md",
  fontWeight: "$medium",
  color: "#6c757d",
  backgroundColor: "#ffffff",
  padding: "$3 $4",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "$2",
  height: "48px",
  borderRadius: "$md",
  border: "1px solid #e9ecef",
  transition: "all 0.2s ease",

  marginLeft: "$3",

  "&:hover": {
    backgroundColor: "#f8f9fa",
    borderColor: "#dee2e6",
  },

  "&:focus": {
    outline: "2px solid #4a9960",
    outlineOffset: "2px",
  },
});
