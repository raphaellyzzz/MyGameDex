# MyGameDex
O MyGameDex é um catálogo de jogos interativo, construído em Vue.js. A plataforma permite que os usuários não apenas explorem títulos e vejam detalhes como gênero e ano de lançamento, mas também gerenciem sua própria jornada de jogo de forma pessoal.

Ele oferece ferramentas exclusivas como o Diário de Jogatina para registrar experiências e conquistas, o Comparador de Títulos que auxilia na decisão de compra e o Mapa de Gêneros para visualizar os hábitos de consumo de jogos do usuário. Para tornar a descoberta de jogos mais dinâmica, o MyGameDex inclui um sistema de recomendações por humor, um sorteador de jogos para descobertas aleatórias e um feed de notícias, dividido entre geral e personalizado, que mantém o jogador sempre atualizado.

## Estrutura do projeto
```
mygamedex/
├── src/                     
│   ├── api/                  # api local para simulações
│   ├── assets/               # estáticos
│   ├── components/           
│   │   ├── capsule/          # lógica para a "Cápsula do Tempo"
│   │   ├── comparator/       # lógica do "Comparador de Títulos"
│   │   ├── diary/            # lógica para o "Diário de Jogatina"
│   │   ├── layout/           # componentes de layout (Navbar, Footer, etc.)
│   │   ├── map_genres/       # lógica do "Mapa de Gêneros"
│   │   ├── random/           # lógica do "Jogo Aleatório"
│   │   └── recommendations/  # lógica para as "Recomendações por Mood"
│   ├── router/               # definições de rotas de navegação
│   ├── services/             # lógica de negócio e dados do usuário (LocalStorage)
│   └── views/                # páginas principais do aplicativo
```
