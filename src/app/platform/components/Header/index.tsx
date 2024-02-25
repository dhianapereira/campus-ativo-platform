import React from 'react';
import { HeaderContainer, Info, UserInfoContainer } from './styles';
import { Avatar, Heading, Text } from '@campusativo-ui/react';
import { IProps } from '@/app/platform/components/Header/index.d';

export default function Header({ src, alt, name, position }: IProps) {
    return (
        <HeaderContainer>
            <Heading>Campus Ativo</Heading>
            <UserInfoContainer>
                <Avatar src={src} alt={alt} />
                <Info>
                    <Text className="name" size="md">{name}</Text>
                    <Text className="position" size="sm">{position}</Text>
                </Info>
            </UserInfoContainer>
        </HeaderContainer>
    );
}
