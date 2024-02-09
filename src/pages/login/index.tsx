import { Button, Heading, LinkButton, Text, TextInput } from "@campusativo-ui/react";
import PasswordIcon from "./components/PasswordIcon";
import { Container, Form, FormError, IllustrationContainer } from "./styles";
import { useState } from "react";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { LoginFormData } from "@/@types/form.d";
import { loginFormSchema } from "@/validators/login-form";
import Image from "next/image";

import illustrationLogin from '../../assets/illustration-login.png'
import ifalLogo from '../../assets/ifal-logo.png'

export default function Login() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema)
    })

    async function handleLogin(data: LoginFormData) {
        console.log(data)
    }

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

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
            <Form onSubmit={handleSubmit(handleLogin)}>
                <Image
                    src={ifalLogo}
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
                    <TextInput type="email" {...register('email')} />
                    {
                        errors.email && (
                            <FormError size="sm">
                                {errors.email.message}
                            </FormError>
                        )
                    }
                </label>
                <label>
                    <Text size="md">Senha</Text>
                    <TextInput
                        {...register('password')}
                        type={isPasswordVisible ? "text" : "password"}
                        suffix={(
                            <PasswordIcon
                                isVisible={isPasswordVisible}
                                onTap={togglePasswordVisibility}
                            />
                        )}
                    />
                    {
                        errors.password && (
                            <FormError size="sm">
                                {errors.password.message}
                            </FormError>
                        )
                    }
                </label>
                <LinkButton variant="green">Esqueci a senha</LinkButton>
                <Button type="submit" disabled={isSubmitting}>
                    Entrar
                </Button>
            </Form >
        </Container >
    )
}
