# 💳 Financia App

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

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

```text
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
- Expo Go em um dispositivo compatível ou emulador Android/iOS configurado.

### Passos para Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/marcosbr29/Financia-app.git
   ```

2. **Entre na pasta do projeto**

   ```bash
   cd Financia-app
   ```

3. **Instale as dependências**

   ```bash
   npm install
   ```

4. **Inicie o projeto com Expo**

   ```bash
   npx expo start
   ```

5. **Execute no dispositivo ou emulador**

   Escaneie o QR Code com o aplicativo Expo Go ou utilize um emulador configurado para executar o projeto.

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