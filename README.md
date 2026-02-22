🐦 Growtwitter - Frontend

Este é o projeto frontend do Growtwitter, uma aplicação web que simula uma rede social estilo Twitter. Desenvolvido com React e Vite, ele se conecta a uma API REST externa para gerenciar usuários, tweets e interações.

✨ Funcionalidades

O projeto Growtwitter oferece as seguintes funcionalidades:

•
Autenticação de Usuário:

•
Cadastro de novos usuários (/cadastro).

•
Login de usuários existentes (/login).

•
Proteção de rotas: usuários não autenticados são redirecionados para a página de login.



•
Feed de Tweets:

•
Visualização de todos os tweets publicados.

•
Publicação de novos tweets.

•
Atualização automática do feed após a publicação de um novo tweet.

•
Funcionalidade de "Reply" (responder a tweets).

•
Likes (Simulado): Sistema de curtidas persistente localmente (via localStorage), onde o usuário pode curtir/descurtir tweets, com feedback visual e contador.



•
Página Explorar:

•
Lista de todos os usuários cadastrados na plataforma.

•
Funcionalidade de busca para encontrar usuários específicos.



•
Página de Perfil:

•
Visualização do perfil de qualquer usuário (incluindo o próprio).

•
Exibição de capa, avatar, nome de usuário, @username e data de criação da conta.

•
Listagem dos tweets publicados pelo usuário.

•
Layout responsivo e ajustado para exibir corretamente as informações do perfil.



•
Navegação:

•
Menu lateral intuitivo para acesso rápido às seções: Página Inicial, Explorar e Perfil.

•
Botão de "Sair" para deslogar o usuário.



🚀 Tecnologias Utilizadas

•
Frontend:

•
React: Biblioteca JavaScript para construção de interfaces de usuário.

•
Vite: Ferramenta de build rápida para projetos web modernos.

•
TypeScript: Superset do JavaScript que adiciona tipagem estática.

•
Material-UI (MUI): Biblioteca de componentes React para um design elegante e responsivo.

•
React Router DOM: Para gerenciamento de rotas na aplicação.

•
Axios: Cliente HTTP para fazer requisições à API.



•
API:

•
Growtwitter API (Backend): API RESTful externa fornecida pela Growdev para gerenciamento de dados.



⚙️ Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e executar o projeto em sua máquina local:

Pré-requisitos

Certifique-se de ter o Node.js (versão 18 ou superior) e o npm (gerenciador de pacotes do Node.js) instalados.

Instalação

1.
Clone o repositório para sua máquina local:

Bash


git clone https://github.com/seu-usuario/growtwitter-frontend.git
cd growtwitter-frontend



(Substitua seu-usuario pelo seu nome de usuário do GitHub e growtwitter-frontend pelo nome do seu repositório. )



2.
Instale as dependências do projeto:

Bash


npm install





Execução

1.
Inicie o servidor de desenvolvimento:

Bash


npm run dev





2.
Abra seu navegador e acesse: http://localhost:5173

✅ Como Testar a Aplicação

Para testar as funcionalidades do Growtwitter, siga os cenários abaixo:

Cenário 1: Cadastro e Login

1.
Acesse a aplicação (http://localhost:5173 ). Você será redirecionado para a página de login.

2.
Clique em "Cadastre-se" para criar uma nova conta.

3.
Preencha os dados e clique em "Cadastrar".

4.
Após o cadastro, você será redirecionado para a página de login. Faça login com as credenciais que acabou de criar.

5.
Verifique se você é redirecionado para o Feed principal (/feed).

Cenário 2: Publicar um Tweet

1.
No Feed, clique no botão "Tweetar" no menu lateral.

2.
Digite um conteúdo para o seu tweet no modal que aparecer.

3.
Clique em "Tweetar" para publicar.

4.
Verifique se o seu novo tweet aparece no topo do feed e se o feed foi atualizado automaticamente.

Cenário 3: Responder a um Tweet

1.
No Feed, localize um tweet e clique no ícone de comentário (balão de fala).

2.
Digite uma resposta no modal que aparecer.

3.
Clique em "Responder".

4.
Verifique se a sua resposta aparece abaixo do tweet original.

Cenário 4: Curtir/Descurtir um Tweet (Funcionalidade Simulado)

1.
No Feed, localize um tweet e clique no ícone de coração (♡).

2.
Verifique se o coração fica vermelho e o contador de likes aumenta.

3.
Navegue para a página "Explorar" e depois volte para o "Feed". Verifique se o like que você deu ainda está lá (persistência via localStorage).

4.
Clique novamente no coração para descurtir. Verifique se ele volta ao normal e o contador diminui.

Cenário 5: Navegação e Páginas de Perfil/Explorar

1.
Clique em "Explorar" no menu lateral. Verifique se a página de usuários é carregada.

2.
Use a barra de busca na página "Explorar" para encontrar um usuário.

3.
Clique em um usuário na lista para visitar seu perfil.

4.
Na página de perfil, verifique se as informações do usuário (nome, @username, data de membro) e seus tweets são exibidos corretamente.

5.
Clique em "Perfil" no menu lateral para ver o seu próprio perfil.

6.
Clique em "Página Inicial" para retornar ao feed.

Cenário 6: Proteção de Rotas

1.
Faça logout da aplicação (clique em "Sair" no menu lateral).

2.
Tente acessar diretamente a URL /feed no navegador (http://localhost:5173/feed ).

3.
Verifique se você é redirecionado automaticamente para a página de login.

☁️ Deploy

Este projeto pode ser facilmente deployado em plataformas como a Vercel. Para instruções detalhadas sobre como fazer o deploy, consulte a documentação específica da plataforma e as instruções fornecidas anteriormente.

🧑‍💻 Autor

Desenvolvido por Giovanna Figueiroa.


