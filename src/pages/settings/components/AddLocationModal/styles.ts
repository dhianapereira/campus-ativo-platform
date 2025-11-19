import { styled } from "@/styles";

export const ModalOverlay = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "1rem",

  "@media (max-width: 48rem)": {
    padding: "1rem",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const ModalContent = styled("div", {
  backgroundColor: "white",
  borderRadius: "24px",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  width: "100%",
  maxWidth: "600px",
  maxHeight: "90vh",
  overflow: "hidden",

  "@media (max-width: 48rem)": {
    width: "calc(100vw - 2rem)",
    maxWidth: "calc(100vw - 2rem)",
    borderRadius: "1rem",
    maxHeight: "none",
    height: "auto",
  },
});

export const ModalHeader = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "2rem 2rem 1rem 2rem",

  "@media (max-width: 48rem)": {
    padding: "1.5rem 1.5rem 1rem 1.5rem",
  },
});

export const ModalTitle = styled("h2", {
  fontSize: "1.5rem",
  fontWeight: 600,
  color: "#111827",
  margin: 0,

  "@media (max-width: 48rem)": {
    fontSize: "1.375rem",
    fontWeight: 700,
  },
});

export const ModalCloseButton = styled("button", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "2.5rem",
  height: "2.5rem",
  borderRadius: "0.5rem",
  border: "none",
  backgroundColor: "transparent",
  color: "#6b7280",
  cursor: "pointer",
  transition: "all 0.2s",
  padding: "0.5rem",
  flexShrink: 0,

  "&:hover:not(:disabled)": {
    color: "#374151",
    backgroundColor: "#f3f4f6",
  },

  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.5,
  },

  svg: {
    width: "24px",
    height: "24px",
  },
});

export const ModalBody = styled("div", {
  padding: "0 2rem",
  maxHeight: "60vh",
  overflow: "auto",

  "@media (max-width: 48rem)": {
    padding: "0 1.5rem",
    maxHeight: "none",
  },
});

export const ModalFooter = styled("div", {
  padding: "2rem",
  borderTop: "none",
  backgroundColor: "white",

  "@media (max-width: 48rem)": {
    padding: "1rem 1.5rem 1.5rem 1.5rem",
  },
});

export const Form = styled("form", {
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",

  "@media (max-width: 48rem)": {
    gap: "1.25rem",
  },
});

export const FormField = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const Label = styled("label", {
  fontSize: "1rem",
  fontWeight: 500,
  color: "#111827",

  "@media (max-width: 48rem)": {
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "0.25rem",
  },
});

export const Input = styled("input", {
  padding: "0.875rem 1rem",
  border: "1px solid #d1d5db",
  borderRadius: "0.5rem",
  fontSize: "1rem",
  transition: "border-color 0.2s",
  backgroundColor: "white",
  color: "#111827",

  "&::placeholder": {
    color: "#9ca3af",
  },

  "&:focus": {
    outline: "none",
    borderColor: "#4a9960",
    boxShadow: "0 0 0 3px rgba(74, 153, 96, 0.1)",
  },

  "&:disabled": {
    backgroundColor: "#f9fafb",
    color: "#6b7280",
    cursor: "not-allowed",
  },

  "@media (max-width: 48rem)": {
    padding: "1rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
  },
});

export const TextArea = styled("textarea", {
  padding: "0.875rem 1rem",
  border: "1px solid #d1d5db",
  borderRadius: "0.5rem",
  fontSize: "1rem",
  transition: "border-color 0.2s",
  backgroundColor: "white",
  color: "#111827",
  fontFamily: "inherit",
  resize: "vertical",
  minHeight: "120px",

  "&:focus": {
    outline: "none",
    borderColor: "#4a9960",
    boxShadow: "0 0 0 3px rgba(74, 153, 96, 0.1)",
  },

  "&::placeholder": {
    color: "#9ca3af",
  },

  "&:disabled": {
    backgroundColor: "#f9fafb",
    color: "#6b7280",
    cursor: "not-allowed",
  },

  "@media (max-width: 48rem)": {
    padding: "1rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    minHeight: "4.5rem",
    maxHeight: "4.5rem",
    height: "4.5rem",
    resize: "none",
  },
});

export const ErrorMessage = styled("span", {
  fontSize: "0.875rem",
  color: "#dc2626",
});

export const ButtonGroup = styled("div", {
  display: "flex",
  gap: "1rem",
  justifyContent: "flex-end",

  "@media (max-width: 48rem)": {
    flexDirection: "row",
    gap: "0.75rem",
    justifyContent: "space-between",
  },
});

export const CancelButton = styled("button", {
  padding: "0.875rem 2rem",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  backgroundColor: "white",
  color: "#374151",
  fontSize: "0.875rem",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s",
  minWidth: "120px",

  "&:hover:not(:disabled)": {
    backgroundColor: "#f9fafb",
    borderColor: "#9ca3af",
  },

  "&:disabled": {
    backgroundColor: "#f9fafb",
    color: "#9ca3af",
    cursor: "not-allowed",
  },

  "@media (max-width: 48rem)": {
    flex: 1,
    justifyContent: "center",
    padding: "0.875rem 1.5rem",
    fontSize: "1rem",
    fontWeight: 500,
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    color: "#374151",
  },
});

export const SubmitButton = styled("button", {
  padding: "0.875rem 2rem",
  border: "1px solid #00875F",
  borderRadius: "8px",
  backgroundColor: "#00875F",
  color: "white",
  fontSize: "0.875rem",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s",
  minWidth: "140px",

  "&:hover:not(:disabled)": {
    backgroundColor: "#065f46",
    borderColor: "#065f46",
  },

  "&:disabled": {
    backgroundColor: "#d1d5db",
    color: "#9ca3af",
    borderColor: "#d1d5db",
    cursor: "not-allowed",
  },

  "@media (max-width: 48rem)": {
    flex: 1,
    justifyContent: "center",
    padding: "0.875rem 1.5rem",
    fontSize: "1rem",
    fontWeight: 500,
    borderRadius: "0.5rem",
    backgroundColor: "#00875F",
    border: "1px solid #00875F",
  },
});
