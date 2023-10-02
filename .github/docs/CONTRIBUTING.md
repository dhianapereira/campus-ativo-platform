# Como contribuir
> Siga os passos abaixo para contribuir com código ou sugestões de melhorias/correções no NOME_DO_PROJETO
## Conteúdo:
- [Pré-Requisitos](#1-pré-requisitos)
- [Instalação](#2-siga-os-passos-do-guia-de-instalação)
- [Sincronização](#3-antes-de-tudo-sincronize-com-o-repositório-remoto)
- [Criar uma _branch_](#4-inicie-a-branch-de-funcionalidade)
- [Realizar as alterações](#5-realize-as-alterações-necessárias)
- [Registrar as alterações](#6-registre-as-alterações-realizadas)
- [Submeter contribuição](#7-enviar-as-modificações-para-análise)
- [Solicitar avaliação](#8-abra-um-pull-request-pr-para-os-mais-íntimos)
- [O PR foi aprovado?](#9-o-pr-foi-aprovado)
- [Sugerir melhorias ou correções](#sugerir-melhorias-ou-correções)

---

## 1. Pré-Requisitos
- [Git](https://git-scm.com/downloads) - versionamento de código;  
- [NodeJS](https://nodejs.org/en/) - desenvolvimento do site;
- Editor de código (ex.: [Visual Studio Code](https://code.visualstudio.com/Download)).

## 2. Siga os passos do [Guia de Instalação](../../README.md#guia-de-instalação)
Com isso, você terá tudo o que é necessário para executar a aplicação.

Após seguir todos os passos do guia, execute as seguintes instruções:
## 3. Antes de tudo, sincronize com o repositório remoto
Para evitar conflitos com o código principal que está no repositório remoto do GitHub, **SEMPRE** execute o comando abaixo antes de realizar qualquer modificação:

Se você estiver na branch principal (`main`), rode o comando:
```bash
git checkout develop
```
Após entrar na branch de desenvolvimento (`develop`), execute:
```bash
git pull origin develop
```

Assim, você evitará muitos problemas e todo mundo fica feliz ;)

## 4. Inicie a _branch_ de funcionalidade
> Não sabe o que é uma _branch_? Não tem problema, [clique aqui](https://git-scm.com/book/pt-br/v2/Branches-no-Git-Branches-em-poucas-palavras) para entender.
```bash
git checkout -b feature/<nome-da-branch>

# feature é apenas um prefixo que adotamos para as nossas branches. 
# Esse prefixo não é padrão do git.
# Troque <nome-da-branch> pelo nome da funcionalidade que você implementará (ex.: header-component)
```

## 5. Realize as alterações necessárias
Agora você pode modificar os arquivos existentes no projeto ou até criar novos arquivos e pastas, caso seja necessário.

## 6. Registre as alterações realizadas
Após alterar o código, adicione as alterações ao Git com os seguintes comandos:

```bash
git add .

# "." vai adicionar todos os arquivos de uma vez
# Caso queira adicionar um arquivo específico, 
# troque "." pelo endereço do arquivo (ex.: "git add src/components/Header/index.jsx")
```

```bash
git commit -m "tipo: mensagem"
```

Verifique no arquivo [`conventions.md`](./conventions.md) o padrão de mensagens de _commit_ que você deve seguir.

### Atenção!
Não dê pequenos commits para uma mesma atividade dividindo ela em pequenos passos, em vez disso reúna tudo em um único commit. Se você não se sentir seguro(a) e/ou prefere fazer pequenos commits, então use o `amend`:

Após ter dado o commit com uma parte da sua feature:

```bash
git add .
git commit -m "tipo: mensagem"
```

No segundo commit para adicionar mais atualizações, no lugar de dar mais um commit, utilize:

```bash
git add .
git commit --amend --no-edit
```
Sucesso! Agora tudo que tu modificou foi adicionado ao seu commit (um único commit).
Caso você tenha errado a mensagem do commit, ou queira alterá-la, basta **remover** o `--no-edit`, assim o comando será:

```bash
git commit --amend
```

Uma mensagem irá aparecer no seu terminal possibilitando a edição da mensagem de commit. Basta editar, salvar a alteração e fechar a aba aberta. 

### Fiz algo de errado... E agora?
Se você chegou em algum ponto que não sabe o que fazer, dá uma olhada nesse artigo: https://ohshitgit.com/ 

## 7. Enviar as modificações para análise
Após fazer e registrar as alterações, é necessário enviá-las para o repositório remoto. Assim, todos poderão ver a sua contribuição.

Para enviar suas modificações, execute o seguinte comando:

```bash
git push origin feature/<nome-da-branch>

# Troque <nome-da-branch> pelo nome da branch que você criou no passo 4 deste guia
```

## 8. Abra um _Pull Request_ (PR para os mais íntimos)
> Não sabe o que é um _Pull Request_? [Clique aqui](https://docs.github.com/pt/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) para entender.
Você pode seguir [este guia](https://docs.github.com/pt/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) para criar um _pull request_.

Na criação do PR, siga o padrão abaixo na definição do título:

```
tipo: mensagem
```

Verifique no arquivo [`conventions.md`](./conventions.md) o tipo que você deve adicionar.

Após a criação do PR, espere alguém analisar o seu código e indicar o que deve ser feito.

Caso seja exigida alguma alteração, você pode realizar as correções seguindo do [passo 5](#5-realize-as-alterações-necessárias) deste guia em diante.

## 9. O PR foi aprovado?
> Só siga esse passo se tiver certeza de que o PR foi aprovado. Caso tenha dúvida, pergunte ;)
Se o PR foi aprovado, você pode enviar as alterações realizadas para a _branch_ de desenvolvimento (develop) através do botão de `merge` do seu PR. Após o merge, você pode excluir a _branch_ que criou no [passo 4](#4-inicie-a-branch-de-funcionalidade).

## Sugerir melhorias ou correções
Caso você ainda não sinta segurança em contribuir com código ou encontrou um problema/situação de melhoria e quer reportar, crie uma [_issue_]().

Utilize [este guia](https://docs.github.com/pt/issues/tracking-your-work-with-issues/creating-an-issue) para reportar um problema ou indicar uma melhoria através de _issues_.

---

Surgiu alguma dúvida? Entre em contato com um dos membros do repositório ;)