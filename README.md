# 💳 Financia App

<div align="center">

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)

</div>

---

## 📋 Sobre o Projeto

O Financia App é um aplicativo mobile desenvolvido como projeto de extensão acadêmica para a disciplina de **Programação para Dispositivos Móveis em Android**. O aplicativo tem como objetivo facilitar a organização e o controle das finanças pessoais, permitindo acompanhar receitas, despesas e metas financeiras de maneira simples e prática.

### 👨‍🏫 Equipe e Orientação

- **Professor:** Rodrigo Fontes
- **Desenvolvedores:** Marcos Paulo, Alef Santos e Ronald Alves.

---

## ✨ Funcionalidades

- Cadastro, edição e exclusão de receitas e despesas.
- Visualização do saldo e acompanhamento das movimentações financeiras.
- Histórico de transações com filtros por tipo.
- Gerenciamento de categorias, incluindo criação, edição e exclusão.
- Criação, edição, exclusão e acompanhamento de metas financeiras.
- Relatórios financeiros mensais e anuais.
- Exportação de movimentações em arquivos CSV e PDF.
- Perfil com possibilidade de personalizar o nome do usuário.
- Proteção de acesso por PIN e autenticação biométrica, quando disponível.
- Telas de ajuda e informações sobre o aplicativo.
- Armazenamento local dos dados no dispositivo.

---

## Tecnologias Utilizadas

- **React Native** - Desenvolvimento da interface mobile para Android e iOS.
- **Expo** - Ambiente e ferramentas para desenvolvimento e execução do aplicativo.
- **JavaScript** - Implementação da lógica e das funcionalidades.
- **TypeScript** - Configuração e implementação das rotas do aplicativo.
- **Expo Router** - Navegação entre as telas baseada em arquivos.
- **AsyncStorage** - Armazenamento local das informações do aplicativo.
- **Expo SecureStore** - Armazenamento seguro de informações relacionadas à autenticação.
- **Expo Local Authentication** - Suporte à autenticação biométrica.
- **Expo Print e Expo Sharing** - Geração e compartilhamento de arquivos.
- **@expo/vector-icons** - Biblioteca de ícones utilizada na interface.

---

## 📱 Estrutura do Projeto
```
Financia-app/
├── app/
│   └── Rotas e layout do Expo Router
├── src/
│   ├── components/
│   │   └── Componentes reutilizáveis
│   ├── screens/
│   │   └── Telas principais do aplicativo
│   ├── storage/
│   │   └── Persistência local dos dados
│   ├── theme/
│   │   └── Cores e configurações visuais
│   └── utils/
│       └── Funções utilitárias
├── assets/
│   └── Imagens e ícones
├── app.json
└── package.json
```

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos

- Node.js compatível com a versão do Expo utilizada pelo projeto.
- npm ou yarn.
- Expo Go compatível com **Expo SDK 57** em um dispositivo Android ou Android Studio configurado com um emulador.
- Navegador atualizado para executar a versão Web.

### 📥 Download do Expo Go

Para executar o Financia App em um dispositivo Android, utilize a versão do Expo Go compatível com o SDK 57.

[**Baixar Expo Go — SDK 57 para Android**](https://expo.dev/go?sdkVersion=57&platform=android&device=true)

### ⚙️ Instalação do Expo Go no Android

Caso o Android bloqueie a instalação do aplicativo baixado, pode ser necessário permitir temporariamente a instalação de aplicativos de fontes desconhecidas.

1. Abra as **Configurações** do Android.
2. Acesse **Aplicativos** e procure a opção **Acesso especial a apps**.
3. Entre em **Instalar apps desconhecidos**.
4. Selecione o navegador ou gerenciador de arquivos utilizado para baixar e abrir o instalador.
5. Ative a opção **Permitir desta fonte**.
6. Abra o arquivo baixado do Expo Go e confirme a instalação.

**Observação:** os nomes e caminhos dessas opções podem variar de acordo com a versão do Android e o fabricante do dispositivo. Após a instalação, recomenda-se desativar novamente a permissão para a fonte utilizada.

### 🖥️ Configuração do Android Studio

Para executar o aplicativo em um emulador no computador, é necessário configurar o Android Studio.

1. Baixe e instale o [Android Studio](https://developer.android.com/studio).
2. Durante a configuração, certifique-se de instalar o Android SDK e as ferramentas necessárias.
3. Abra o Android Studio e acesse o **Device Manager**.
4. Clique em **Create Virtual Device** para criar um dispositivo virtual.
5. Escolha um modelo de celular e selecione uma versão do Android disponível.
6. Finalize a configuração e inicie o emulador criado.

### 🌐 Executar no navegador do computador

Também é possível abrir o Financia App diretamente no navegador, sem utilizar um celular ou emulador.

1. Inicie o projeto com o comando `npx expo start`.
2. Aguarde o Expo iniciar e disponibilizar os endereços de acesso.
3. Pressione a tecla **w** no terminal para abrir a versão Web ou copie o endereço Web disponibilizado pelo Expo.
4. Caso prefira, cole o endereço no navegador do computador.

**Observação:** alguns recursos que dependem de funcionalidades nativas do dispositivo, como armazenamento seguro e autenticação biométrica, podem apresentar limitações ou não funcionar na versão Web.

### Passos para Instalação

1. **Clone o repositório**
   ```
   git clone https://github.com/marcosbr29/Financia-app.git
   ```
2. **Entre na pasta do projeto**
   ```
   cd Financia-app
   ```
3. **Instale as dependências**
   ```
   npm install
   ```
4. **Inicie o projeto com Expo**
   ```
   npx expo start
   ```
5. **Execute no dispositivo ou emulador**

   Escaneie o QR Code com o aplicativo Expo Go ou utilize um emulador configurado para executar o projeto. Para abrir no navegador do computador, pressione **w** no terminal.

---

## 📦 Principais Dependências

- **React Native:** framework utilizado para desenvolver a interface do aplicativo.
- **Expo:** conjunto de ferramentas que facilita o desenvolvimento e a execução de aplicações React Native.
- **Expo Router:** biblioteca responsável pela navegação entre as telas.
- **AsyncStorage:** armazenamento local de receitas, despesas, categorias e metas.
- **Expo SecureStore:** armazenamento seguro de informações de autenticação.
- **Expo Local Authentication:** integração com os recursos de autenticação biométrica do dispositivo.
- **Expo Print e Expo Sharing:** recursos utilizados para gerar e compartilhar relatórios em PDF.
- **@expo/vector-icons:** biblioteca utilizada para os ícones da interface.

---

## 🔒 Armazenamento e Privacidade

Os dados do aplicativo são armazenados localmente no dispositivo. Esta versão não possui integração com banco de dados remoto nem sincronização entre dispositivos.

A autenticação biométrica depende da compatibilidade e da configuração do dispositivo utilizado.