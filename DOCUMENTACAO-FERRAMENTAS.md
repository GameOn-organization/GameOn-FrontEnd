# Documentação de Ferramentas e Dependências - GameOn FrontEnd

Esta documentação descreve todas as ferramentas, bibliotecas e dependências utilizadas no projeto GameOn FrontEnd.

---

## 📋 Índice

1. [Framework e Core](#framework-e-core)
2. [Firebase](#firebase)
3. [Navegação](#navegação)
4. [UI/UX e Componentes](#uiux-e-componentes)
5. [Utilitários e Helpers](#utilitários-e-helpers)
6. [Ferramentas de Desenvolvimento](#ferramentas-de-desenvolvimento)

---

## 🚀 Framework e Core

### Expo (~53.0.22)
**Descrição:** Framework completo para desenvolvimento de aplicações React Native multiplataforma.

**Uso no projeto:**
- Gerenciamento de rotas com `expo-router`
- Build e deploy para iOS, Android e Web
- Acesso a APIs nativas através de módulos Expo

**Documentação:** https://docs.expo.dev/

---

### React (19.0.0)
**Descrição:** Biblioteca JavaScript para construção de interfaces de usuário.

**Uso no projeto:**
- Base do framework de desenvolvimento
- Componentes funcionais e hooks
- Gerenciamento de estado

**Documentação:** https://react.dev/

---

### React Native (0.79.5)
**Descrição:** Framework para desenvolvimento de aplicações móveis nativas usando React.

**Uso no projeto:**
- Componentes nativos (View, Text, ScrollView, etc.)
- Estilização com StyleSheet
- Integração com APIs nativas

**Documentação:** https://reactnative.dev/

---

### React DOM (19.0.0)
**Descrição:** Renderizador React para web.

**Uso no projeto:**
- Suporte para plataforma web através do Expo
- Renderização de componentes React no navegador

**Documentação:** https://react.dev/

---

## 🔥 Firebase

### Firebase (^12.5.0)
**Descrição:** Plataforma completa de desenvolvimento de aplicativos backend da Google.

**Módulos utilizados no projeto:**

#### Firebase Authentication (`firebase/auth`)
**Descrição:** Serviço de autenticação de usuários.

**Funcionalidades:**
- Autenticação por email/senha
- Autenticação social (Google, Facebook, etc.)
- Gerenciamento de sessões
- Recuperação de senha

**Uso no projeto:**
- Arquivo: `config/firebase.ts`
- Exporta instância `auth` para uso em toda a aplicação
- Integrado com `services/authService.ts`

**Documentação:** https://firebase.google.com/docs/auth

---

#### Cloud Firestore (`firebase/firestore`)
**Descrição:** Banco de dados NoSQL em tempo real.

**Funcionalidades:**
- Armazenamento de dados em documentos e coleções
- Sincronização em tempo real
- Consultas complexas
- Offline-first

**Uso no projeto:**
- Arquivo: `config/firebase.ts`
- Exporta instância `db` para operações de banco de dados
- Armazenamento de dados de usuários, eventos, mensagens, etc.

**Documentação:** https://firebase.google.com/docs/firestore

---

#### Firebase Storage (`firebase/storage`)
**Descrição:** Armazenamento de arquivos na nuvem.

**Funcionalidades:**
- Upload e download de arquivos
- Gerenciamento de imagens e mídia
- URLs públicas e privadas
- Regras de segurança

**Uso no projeto:**
- Configurado no `firebaseConfig` (storageBucket: "tcc-gameon.firebasestorage.app")
- Disponível através do SDK do Firebase
- Para usar, importe: `import { getStorage } from 'firebase/storage'`
- Usado para upload de imagens de perfil, eventos, wallpapers, etc.
- Integrado com `expo-image-picker` para seleção de imagens

**Exemplo de uso:**
```typescript
import { getStorage } from 'firebase/storage';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storage = getStorage(app);
// Upload de arquivo
const storageRef = ref(storage, 'images/profile.jpg');
await uploadBytes(storageRef, file);
const url = await getDownloadURL(storageRef);
```

**Documentação:** https://firebase.google.com/docs/storage

---

**Configuração Firebase:**
```typescript
// config/firebase.ts
- apiKey: Chave de API do Firebase
- authDomain: Domínio de autenticação
- projectId: ID do projeto (tcc-gameon)
- storageBucket: Bucket de armazenamento
- messagingSenderId: ID do remetente de mensagens
- appId: ID da aplicação
```

---

## 🧭 Navegação

### Expo Router (~5.1.5)
**Descrição:** Sistema de roteamento baseado em arquivos para Expo.

**Funcionalidades:**
- Roteamento baseado em estrutura de arquivos
- Navegação entre telas
- Deep linking
- Navegação aninhada

**Uso no projeto:**
- Estrutura de rotas em `app/`
- Rotas principais: `(tabs)/`, `auth/`
- Layouts aninhados com `_layout.tsx`

**Documentação:** https://docs.expo.dev/router/introduction/

---

### React Navigation

#### @react-navigation/native (^7.1.6)
**Descrição:** Biblioteca de navegação para React Native.

**Uso no projeto:**
- Base para sistemas de navegação
- Integração com Expo Router

**Documentação:** https://reactnavigation.org/

---

#### @react-navigation/bottom-tabs (^7.3.10)
**Descrição:** Navegador de abas na parte inferior da tela.

**Uso no projeto:**
- Navegação principal entre telas principais
- Implementado em `app/(tabs)/_layout.tsx`

**Documentação:** https://reactnavigation.org/docs/bottom-tab-navigator

---

#### @react-navigation/drawer (^7.5.8)
**Descrição:** Navegador de gaveta lateral (drawer).

**Uso no projeto:**
- Menu lateral para navegação
- Acesso a configurações e perfil

**Documentação:** https://reactnavigation.org/docs/drawer-navigator

---

#### @react-navigation/elements (^2.3.8)
**Descrição:** Componentes e elementos reutilizáveis para React Navigation.

**Uso no projeto:**
- Componentes auxiliares de navegação
- Headers e elementos de UI

**Documentação:** https://reactnavigation.org/docs/elements

---

### React Native Gesture Handler (~2.24.0)
**Descrição:** Sistema de gestos nativos para React Native.

**Uso no projeto:**
- Suporte a gestos (swipe, pan, etc.)
- Necessário para React Navigation
- Usado em componentes de swipe (SwipeCard, SwipeDeck)

**Documentação:** https://docs.swmansion.com/react-native-gesture-handler/

---

### React Native Reanimated (~3.17.4)
**Descrição:** Biblioteca de animações de alto desempenho para React Native.

**Uso no projeto:**
- Animações suaves e performáticas
- Animações de transição entre telas
- Animações em componentes interativos

**Documentação:** https://docs.swmansion.com/react-native-reanimated/

---

### React Native Safe Area Context (^5.4.0)
**Descrição:** Gerenciamento de áreas seguras (notch, status bar, etc.).

**Uso no projeto:**
- Adaptação de layout para diferentes dispositivos
- Evita sobreposição de conteúdo com elementos do sistema

**Documentação:** https://github.com/th3rdwave/react-native-safe-area-context

---

### React Native Screens (~4.11.1)
**Descrição:** Implementação nativa de telas para React Navigation.

**Uso no projeto:**
- Melhora de performance na navegação
- Transições nativas entre telas

**Documentação:** https://github.com/software-mansion/react-native-screens

---

## 🎨 UI/UX e Componentes

### React Native Paper (^5.14.5)
**Descrição:** Biblioteca de componentes Material Design para React Native.

**Funcionalidades:**
- Componentes Material Design
- Temas customizáveis
- Componentes: Button, Card, TextInput, etc.

**Uso no projeto:**
- Componentes de UI consistentes
- Design system Material Design

**Documentação:** https://callstack.github.io/react-native-paper/

---

### Expo Image (~2.4.0)
**Descrição:** Componente de imagem otimizado para Expo.

**Funcionalidades:**
- Carregamento otimizado de imagens
- Cache automático
- Suporte a múltiplos formatos
- Placeholder e transições

**Uso no projeto:**
- Exibição de imagens de perfil
- Imagens de eventos
- Otimização de performance

**Documentação:** https://docs.expo.dev/versions/latest/sdk/image/

---

### Expo Image Picker (~16.1.4)
**Descrição:** Seletor de imagens da galeria ou câmera.

**Funcionalidades:**
- Acesso à galeria de fotos
- Captura de fotos pela câmera
- Edição e compressão de imagens

**Uso no projeto:**
- Upload de foto de perfil
- Adicionar imagens a eventos
- Seleção de mídia

**Documentação:** https://docs.expo.dev/versions/latest/sdk/image-picker/

---

### Expo Blur (~14.1.5)
**Descrição:** Efeito de desfoque (blur) para componentes.

**Uso no projeto:**
- Efeitos visuais de desfoque
- Overlays e modais com blur

**Documentação:** https://docs.expo.dev/versions/latest/sdk/blur/

---

### Expo Linear Gradient (^14.1.5)
**Descrição:** Componente de gradiente linear.

**Uso no projeto:**
- Backgrounds com gradiente
- Efeitos visuais modernos

**Documentação:** https://docs.expo.dev/versions/latest/sdk/linear-gradient/

---

### React Native Maps (1.20.1)
**Descrição:** Componentes de mapas para React Native.

**Funcionalidades:**
- Exibição de mapas
- Marcadores e anotações
- Geolocalização

**Uso no projeto:**
- Visualização de localização de eventos
- Mapas interativos

**Documentação:** https://github.com/react-native-maps/react-native-maps

---

### React Native Dropdown Picker (^5.4.6)
**Descrição:** Componente de dropdown/seletor.

**Uso no projeto:**
- Seleção de opções em formulários
- Filtros e seletores

**Documentação:** https://github.com/hossein-zare/react-native-dropdown-picker

---

### React Native Element Dropdown (^2.12.4)
**Descrição:** Componente de dropdown alternativo.

**Uso no projeto:**
- Seletores customizados
- Dropdowns com design específico

**Documentação:** https://github.com/hoaphantn7604/react-native-element-dropdown

---

### React Native Mask Input (^1.2.3)
**Descrição:** Input com máscara para formatação.

**Uso no projeto:**
- Formatação de telefone, CPF, CEP, etc.
- Validação visual de entrada

**Documentação:** https://github.com/CaioQuirinoMedeiros/react-native-mask-input

---

### React Native Pager View (6.7.1)
**Descrição:** Componente de paginação horizontal (swipe entre páginas).

**Uso no projeto:**
- Carrosséis de imagens
- Navegação por swipe horizontal

**Documentação:** https://github.com/callstack/react-native-pager-view

---

### @react-native-picker/picker (^2.11.1)
**Descrição:** Componente de seleção nativo.

**Uso no projeto:**
- Seletores nativos de plataforma
- Date pickers e seletores de opções

**Documentação:** https://github.com/react-native-picker/picker

---

### @react-native-community/datetimepicker (^8.4.4)
**Descrição:** Seletor de data e hora nativo.

**Uso no projeto:**
- Seleção de datas em eventos
- Seleção de horários

**Documentação:** https://github.com/react-native-community/datetimepicker

---

### @expo/vector-icons (^14.1.0)
**Descrição:** Biblioteca de ícones para Expo.

**Funcionalidades:**
- Múltiplas famílias de ícones (MaterialIcons, FontAwesome, etc.)
- Ícones vetoriais escaláveis

**Uso no projeto:**
- Ícones em toda a aplicação
- Navegação e ações

**Documentação:** https://docs.expo.dev/guides/icons/

---

### Expo Symbols (~0.4.5)
**Descrição:** Símbolos SF Symbols (iOS) e Material Symbols.

**Uso no projeto:**
- Ícones nativos modernos
- Símbolos do sistema

**Documentação:** https://docs.expo.dev/versions/latest/sdk/symbols/

---

## 🛠️ Utilitários e Helpers

### Axios (^1.12.2)
**Descrição:** Cliente HTTP baseado em Promises.

**Uso no projeto:**
- Requisições HTTP para APIs externas
- Configuração em `config/axiosConnection.ts`
- Comunicação com backend

**Documentação:** https://axios-http.com/

---

### @react-native-async-storage/async-storage (^1.24.0)
**Descrição:** Armazenamento local assíncrono e persistente.

**Funcionalidades:**
- Armazenamento de dados localmente
- Persistência entre sessões
- Chave-valor assíncrono

**Uso no projeto:**
- Cache de dados
- Preferências do usuário
- Tokens e sessões

**Documentação:** https://react-native-async-storage.github.io/async-storage/

---

### Expo Location (^18.1.6)
**Descrição:** Acesso à localização do dispositivo.

**Funcionalidades:**
- Geolocalização
- Coordenadas GPS
- Permissões de localização

**Uso no projeto:**
- Localização de eventos
- Busca por proximidade
- Mapas e navegação

**Documentação:** https://docs.expo.dev/versions/latest/sdk/location/

---

### Expo Linking (~7.1.7)
**Descrição:** Criação e manipulação de links profundos (deep links).

**Uso no projeto:**
- Links para compartilhamento
- Deep linking na aplicação
- Integração com outros apps

**Documentação:** https://docs.expo.dev/versions/latest/sdk/linking/

---

### Expo Web Browser (~14.2.0)
**Descrição:** Abertura de URLs no navegador do sistema.

**Uso no projeto:**
- Links externos
- Autenticação OAuth
- Visualização de conteúdo web

**Documentação:** https://docs.expo.dev/versions/latest/sdk/webbrowser/

---

### Expo Haptics (~14.1.4)
**Descrição:** Feedback háptico (vibração) do dispositivo.

**Uso no projeto:**
- Feedback tátil em interações
- Confirmação de ações
- Melhora de UX

**Documentação:** https://docs.expo.dev/versions/latest/sdk/haptics/

---

### Expo Font (~13.3.2)
**Descrição:** Carregamento de fontes customizadas.

**Uso no projeto:**
- Fontes personalizadas
- Tipografia customizada
- Fontes em `assets/fonts/`

**Documentação:** https://docs.expo.dev/versions/latest/sdk/font/

---

### Expo Constants (~17.1.7)
**Descrição:** Constantes do sistema e da aplicação.

**Uso no projeto:**
- Informações do dispositivo
- Versão da aplicação
- Configurações do ambiente

**Documentação:** https://docs.expo.dev/versions/latest/sdk/constants/

---

### Expo Splash Screen (~0.30.10)
**Descrição:** Tela de splash (inicialização).

**Uso no projeto:**
- Tela de carregamento inicial
- Branding da aplicação

**Documentação:** https://docs.expo.dev/versions/latest/sdk/splash-screen/

---

### Expo Status Bar (~2.2.3)
**Descrição:** Controle da barra de status do sistema.

**Uso no projeto:**
- Customização da barra de status
- Cores e estilo

**Documentação:** https://docs.expo.dev/versions/latest/sdk/status-bar/

---

### Expo Navigation Bar (~4.2.8)
**Descrição:** Controle da barra de navegação (Android).

**Uso no projeto:**
- Customização da barra de navegação
- Cores e comportamento

**Documentação:** https://docs.expo.dev/versions/latest/sdk/navigation-bar/

---

### Expo System UI (~5.0.11)
**Descrição:** Controle da UI do sistema.

**Uso no projeto:**
- Gerenciamento de elementos do sistema
- Status bar e navigation bar

**Documentação:** https://docs.expo.dev/versions/latest/sdk/system-ui/

---

### React Native WebView (13.13.5)
**Descrição:** Componente de visualização web embutido.

**Uso no projeto:**
- Exibição de conteúdo web dentro do app
- Termos de uso, políticas
- Integração com páginas web

**Documentação:** https://github.com/react-native-webview/react-native-webview

---

### React Native Web (~0.20.0)
**Descrição:** Compatibilidade web para componentes React Native.

**Uso no projeto:**
- Suporte para plataforma web
- Componentes React Native no navegador

**Documentação:** https://necolas.github.io/react-native-web/

---

### @expo/ngrok (^4.1.3)
**Descrição:** Integração com ngrok para túneis de desenvolvimento.

**Uso no projeto:**
- Túneis para desenvolvimento
- Testes com dispositivos remotos

**Documentação:** https://docs.expo.dev/guides/using-ngrok/

---

## 🔧 Ferramentas de Desenvolvimento

### TypeScript (~5.8.3)
**Descrição:** Superset tipado do JavaScript.

**Uso no projeto:**
- Tipagem estática
- Melhor autocomplete e detecção de erros
- Arquivos `.ts` e `.tsx`

**Documentação:** https://www.typescriptlang.org/

---

### ESLint (^9.25.0)
**Descrição:** Linter para JavaScript e TypeScript.

**Uso no projeto:**
- Análise estática de código
- Padrões de código
- Detecção de erros e problemas

**Configuração:** `eslint.config.js`

**Documentação:** https://eslint.org/

---

### ESLint Config Expo (~9.2.0)
**Descrição:** Configuração do ESLint para projetos Expo.

**Uso no projeto:**
- Regras específicas para Expo
- Padrões recomendados

**Documentação:** https://github.com/expo/expo/tree/main/packages/eslint-config-expo

---

### @babel/core (^7.25.2)
**Descrição:** Compilador JavaScript (transpilador).

**Uso no projeto:**
- Compilação de código TypeScript/JSX
- Transformações de código
- Necessário para Expo e React Native

**Documentação:** https://babeljs.io/

---

### @types/react (~19.0.10)
**Descrição:** Definições de tipos TypeScript para React.

**Uso no projeto:**
- Tipagem para React
- Autocomplete e IntelliSense

**Documentação:** https://www.npmjs.com/package/@types/react

---

## 📝 Notas Adicionais

### Zod
**Status:** Não encontrado como dependência direta no `package.json`.

**Descrição:** Biblioteca de validação de esquemas TypeScript-first.

**Recomendação:** Se você está usando Zod no projeto, adicione ao `package.json`:
```json
"zod": "^3.23.8"
```

**Uso típico:**
- Validação de formulários
- Validação de dados de API
- Schemas de validação type-safe

**Documentação:** https://zod.dev/

---

## 📦 Scripts Disponíveis

```json
{
  "start": "expo start",                    // Inicia o servidor de desenvolvimento
  "android": "expo start --android",        // Inicia no Android
  "ios": "expo start --ios",                // Inicia no iOS
  "web": "expo start --web",                // Inicia no navegador
  "lint": "expo lint",                      // Executa o linter
  "reset-project": "node ./scripts/reset-project.js"  // Reseta o projeto
}
```

---

## 🔗 Links Úteis

- **Documentação Expo:** https://docs.expo.dev/
- **Documentação React Native:** https://reactnative.dev/
- **Documentação Firebase:** https://firebase.google.com/docs
- **React Navigation:** https://reactnavigation.org/
- **TypeScript:** https://www.typescriptlang.org/

---

## 📄 Versões

Esta documentação foi criada com base no `package.json` do projeto. Para verificar versões atualizadas, consulte o arquivo `package.json` ou execute:

```bash
npm list --depth=0
```

---

**Última atualização:** Baseado no `package.json` do projeto GameOn FrontEnd

