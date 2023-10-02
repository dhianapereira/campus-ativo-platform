# Padrão de Mensagens
O padrão para títulos de _pull request_ e mensagens de _commit_ é o seguinte:

```
tipo: mensagem
```

---

O `tipo` pode ser um desses:

- `feat`: desenvolvimento de uma nova funcionalidade (ex.: criação de um novo componente);

- `fix`: correção de problemas, bugs e erros de código (ex.: tratar uma função que está retornando erro);

- `refactor`: refatoração de código que não impacta na lógica/regra de negócio (ex.: mudanças de código após revisão de um _pull request_);

- `style`: mudanças de formatação e estilo do código (ex.: mudanças no guia de estilos, correções de indentação, remoção de espaços em brancos, remoção de comentários);

- `chore`: mudanças de desenvolvimento (ex.: mudanças no ESLint, atualizações do _.gitignore_);

- `docs`: mudanças na documentação do projeto (ex.: mudanças no _README_);

- `build`: mudanças que afetam o processo de construção e entrega (_build_) do projeto ou dependências externas (ex.: adição de dependências do _NPM_);

- `perf`: melhorias de performance (ex.: diminuir o tempo de carregamento de uma imagem, reduzir _scripts_);

- `revert`: reversão de um _commit_ anterior;

---

A `mensagem` é um pequeno texto que descreve a alteração que você realizou. Ela deve estar escrita em **inglês**.