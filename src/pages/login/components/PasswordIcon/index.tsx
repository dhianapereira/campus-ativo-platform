import { Eye, EyeSlash } from "phosphor-react";
import { IProps } from "./index.d"

export default function PasswordIcon({ isVisible, onTap }: IProps) {
    const IconComponent = isVisible ? EyeSlash : Eye;

    return (
        <IconComponent
            style={{ cursor: 'pointer' }}
            onClick={onTap}
        />
    );
}
