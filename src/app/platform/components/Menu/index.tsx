import React from 'react';
import { MenuContainer, MenuOptions } from './styles';
import Image from 'next/image';

import whiteIfalLogo from '@/assets/white-ifal-logo.png';
import { LinkButton } from '@campusativo-ui/react';
import { Warning, SignOut } from 'phosphor-react';

export default function Menu() {
    return (
        <MenuContainer>
            <Image
                src={whiteIfalLogo}
                height={68}
                width={193}
                quality={100}
                alt="Logo do Instituto Federal de Alagoas."
            />
            <MenuOptions>
                <LinkButton variant="white">
                    <>
                        <Warning weight="bold" />
                        Problemas
                    </>
                </LinkButton>
                <LinkButton variant="white">
                    <>
                        <SignOut weight="bold" />
                        Sair da plataforma
                    </>
                </LinkButton>
            </MenuOptions>
        </MenuContainer>
    );
}
