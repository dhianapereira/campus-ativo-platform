import { z } from "zod";

export const loginFormSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "O campo e-mail é obrigatório.")
        .regex(/^[a-z0-9.]+@+ifal\.edu\.br$/i, "O e-mail deve ser do domínio ifal.edu.br"),
    password: z
        .string()
        .trim()
        .min(1, "O campo senha é obrigatório.")
        .min(6, "A senha precisa ter no mínimo 6 caracteres.")
        .regex(/^(?=.*[A-Z])(?=.*\d).{6,}$/, "A senha precisa ter letras maiúsculas e números."),
});
