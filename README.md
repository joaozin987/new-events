# Eventus Mobile

Aplicativo mobile de eventos criado com **Expo** e **expo-router**.

## Sobre o projeto

Este sistema permite que o usuário:

- faça cadastro e login
- veja eventos publicados
- crie novos eventos com imagem, local, cidade, preço e data
- acesse seus próprios eventos em **Meus Eventos**
- edite seu perfil e faça logout

O app usa armazenamento local com **AsyncStorage** como fallback, tornando o fluxo funcional mesmo sem backend Firebase configurado.

## Principais funcionalidades

- Autenticação de usuário (login/cadastro)
- Navegação em abas com `expo-router`
- Lista de eventos e busca básica
- Criação de evento com foto e localização
- Perfil do usuário com edição de dados
- Listagem de eventos do usuário
- Exibição de detalhes do evento e QR Code

## Estrutura do projeto

- `app/` — telas e rotas do aplicativo
- `app/(tabs)/` — rotas de aba principais
- `components/` — cabeçalho, rodapé e componentes reutilizáveis
- `hooks/` — hooks customizados
- `constants/` — definições de tema e cores
- `app/services/appStorage.ts` — persistência local de usuários e eventos
- `app/firebase.ts` — inicialização opcional do Firebase

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o Expo:

```bash
npx expo start
```

3. Abra no navegador, no emulador ou com o Expo Go no celular.

> Se a porta `8081` já estiver em uso, aceite usar outra porta.

## Comandos úteis

- `npm run start` — inicia o Expo
- `npm run android` — executa no Android
- `npm run ios` — executa no iOS
- `npm run web` — executa no navegador
- `npm run lint` — verifica o código com ESLint

## Observações para o professor

O sistema demonstra:

- uso de rotas e layout global com `expo-router`
- gestão de estado de usuário e eventos
- persistência local com AsyncStorage
- formulários de cadastro e criação de evento
- uso de recursos nativos (imagem, localização, QR Code)

O app está pronto para entrega e pode ser executado localmente sem depender da configuração completa do Firebase.
