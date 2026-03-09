import { ComponentProps } from "react";
import { styled } from "@/styles/stitches";

const TextAreaStyled = styled("textarea", {
  backgroundColor: "$white",
  padding: "$3 $4",
  borderRadius: "$sm",
  boxSizing: "border-box",
  border: "1px solid $lightGray",
  fontFamily: "$default",
  fontSize: "$sm",
  color: "$gray",
  fontWeight: "$regular",
  resize: "vertical",
  minHeight: 80,

  "&:focus": {
    outline: 0,
    border: "2px solid $green",
  },

  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  "&::placeholder": {
    color: "$lightGray",
  },

  variants: {
    hasError: {
      true: {
        border: "2px solid $red",
        "&:focus": {
          border: "2px solid $red",
        },
      },
    },
    isAutocomplete: {
      true: {
        backgroundColor: "transparent",
      },
    },
  },
});

export interface TextAreaProps extends ComponentProps<typeof TextAreaStyled> {
  hasError?: boolean;
  isAutocomplete?: boolean;
  maxLength?: number;
  showCounter?: boolean;
}

export const TextArea = ({
  hasError,
  isAutocomplete,
  maxLength,
  showCounter,
  ...props
}: TextAreaProps) => {
  const isControlled = "value" in props;
  const displayValue = isControlled ? (props.value as string) ?? "" : undefined;
  const currentLength = (displayValue ?? "").toString().length;

  return (
    <div>
      <TextAreaStyled
        hasError={hasError}
        isAutocomplete={isAutocomplete}
        maxLength={maxLength}
        {...props}
        {...(isControlled
          ? {
              value: displayValue,
              onChange: props.onChange,
            }
          : {})}
      />
      {showCounter && maxLength && (
        <TextAreaCounter>
          {currentLength}/{maxLength}
        </TextAreaCounter>
      )}
    </div>
  );
};

const TextAreaCounter = styled("div", {
  fontSize: "$xs",
  color: "$lightGray",
  textAlign: "right",
  marginTop: "$1",
});

TextArea.displayName = "TextArea";
