import { Button, Heading, LinkButton, Text, TextInput } from "@campusativo-ui/react";
import { Container, Form, IllustrationContainer } from "./styles";
import Image from "next/image";


import illustrationLogin from '../../assets/illustration-login.png'
import ifalLogo from '../../assets/ifal-logo.png'

export default function Login() {
    return (
        <Container>
            <IllustrationContainer>
                <Image
                    src={illustrationLogin}
                    height={391}
                    width={665}
                    quality={100}
                    priority
                    alt="Uma ilustração de um homem abrindo uma porta."
                />
            </IllustrationContainer>
            <Form>
                <Image src={ifalLogo}
                    height={104}
                    width={291}
                    quality={100}
                    alt="Logo do Instituto Federal de Alagoas."
                />
                <Heading size="3xl">Campus Ativo</Heading>
                <Text size="md">
                    Uma ferramenta para o auxílio na identificação e execução
                    de ações de manutenção em Instituições de Ensino.
                </Text>
                <label>
                    <Text size="md">E-mail</Text>
                    <TextInput />
                </label>
                <label>
                    <Text size="md">Senha</Text>
                    <TextInput />
                </label>
                <LinkButton variant="green">Esqueci a senha</LinkButton>
                <Button type="submit">
                    Entrar
                </Button>
            </Form>
        </Container>
    )
}