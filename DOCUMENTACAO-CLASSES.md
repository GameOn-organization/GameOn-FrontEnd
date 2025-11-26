# Documentação de Classes e Componentes - GameOn Frontend

Este documento contém uma lista completa de todas as classes, componentes, interfaces e tipos do frontend do GameOn.

---

## 📁 Estrutura do Projeto

```
GameOn-FrontEnd/
├── app/                    # Rotas e telas principais
├── components/            # Componentes reutilizáveis
├── config/                # Configurações
├── constants/             # Constantes
├── hooks/                 # Custom hooks
└── services/              # Serviços e APIs
```

---

## 🧩 Componentes Principais

### 1. Formulario
**Arquivo:** `components/Formulario.tsx`

Componente de formulário para criação/edição de perfil de usuário.

**Interfaces:**

```typescript
interface DataItem {
  label: string,
  value: string,
  icon: string,
}

interface FormularioProps {
  styleProp?: object,
  colorProp?: object,
  onSubmit?: (data: {
    nome: string,
    descricao: string,
    idade: number,
    sexo: string,
    localizacao: string,
    selected1: string[],
    selected2: string[],
    images: (string | null)[],
    wallpaper: string | null,
  }) => void | Promise<void>,
  initialData?: {
    nome?: string,
    descricao?: string,
    idade?: number,
    sexo?: string,
    localizacao?: string,
    selected1?: string[],
    selected2?: string[],
    images?: (string | null)[],
    wallpaper?: string | null,
  },
}
```

**Funcionalidades:**
- Campos: nome, descrição, idade, sexo, localização
- Seleção múltipla de jogos e esportes
- Upload de imagens (até 9 fotos)
- Upload de wallpaper
- Integração com geolocalização

---

### 2. SwipeCard
**Arquivo:** `components/SwipeCard.tsx`

Componente de card para sistema de swipe (Tinder-like).

**Interfaces:**

```typescript
interface Tag {
  label: string,
  color: string,
}

interface Profile {
  id: string,
  name: string,
  age: number,
  image: any,
  tags: Tag[],
}

interface SwipeCardRef {
  swipeLeft: () => void,
  swipeRight: () => void,
}

interface SwipeCardProps {
  profile: Profile,
  onSwipeRight: (profile: Profile) => void,
  onSwipeLeft: (profile: Profile) => void,
  disabled?: boolean,
}
```

**Funcionalidades:**
- Animação de swipe com PanResponder
- Suporte a gestos de arrastar
- Botões de ação (like/dislike)
- Exibição de tags e informações do perfil

---

### 3. SwipeDeck
**Arquivo:** `components/SwipeDeck.tsx`

Container que gerencia múltiplos SwipeCards.

**Interfaces:**

```typescript
interface Tag {
  label: string,
  color: string,
}

interface Profile {
  id: string,
  name: string,
  age: number,
  image: any,
  tags: Tag[],
}

interface SwipeDeckProps {
  data: Profile[],
  onSwipeRight?: (profile: Profile) => void,
  onSwipeLeft?: (profile: Profile) => void,
}
```

**Funcionalidades:**
- Gerenciamento de pilha de cards
- Controle de índice atual
- Callbacks para ações de swipe

---

### 4. Post
**Arquivo:** `components/Post.tsx`

Componente para criação e exibição de posts.

**Interfaces:**

```typescript
interface User {
  id: number,
  name: string,
  image: any,
}

interface PostProps {
  id: string,
  user: User,
  images?: any[],
  likes: number,
  comments?: PostProps[],
}
```

**Funcionalidades:**
- Campo de texto para postagem
- Botões de ação (curtir, comentar, anexar)
- Modal para comentários
- Sistema de likes

---

### 5. Notification
**Arquivo:** `components/Notification.tsx`

Componente de notificação individual.

**Interfaces:**

```typescript
interface NotificationProps {
  avatar: any,
  username: string,
  time: string,
  action: string,
  thumbnail?: any,
  highlight?: boolean,
  category?: string,
}
```

**Funcionalidades:**
- Exibição de avatar e informações
- Badge para matches
- Botão de ação para matches
- Thumbnail opcional

---

### 6. MenuProfile
**Arquivo:** `components/MenuProfile.tsx`

Menu lateral do perfil com opções de navegação.

**Props:**

```typescript
interface MenuProfileProps {
  closeDrawer: () => void,
}
```

**Funcionalidades:**
- Lista de itens de menu
- Badge de notificações
- Switch de tema claro/escuro
- Navegação para diferentes telas

---

### 7. ChatButton
**Arquivo:** `components/ChatButton.tsx`

Botão de item de conversa na lista de mensagens.

**Props:**

```typescript
interface ChatButtonProps {
  onPress: () => void,
}
```

**Funcionalidades:**
- Exibição de avatar, nome e última mensagem
- Indicador de status de leitura
- Timestamp da mensagem

---

### 8. FaqButton
**Arquivo:** `components/FaqButton.tsx`

Botão de item de FAQ na lista.

**Props:**

```typescript
interface FaqButtonProps {
  onPress: () => void,
}
```

**Funcionalidades:**
- Exibição de nome da FAQ
- Botões de ação (editar/excluir) para admins
- Navegação para detalhes

---

### 9. Switch
**Arquivo:** `components/Switch.tsx`

Componente de switch animado para alternar entre tabs.

**Interfaces:**

```typescript
interface SwitchProps {
  activeTab: "posts" | "info",
  onChangeTab: (tab: "posts" | "info") => void,
}
```

**Funcionalidades:**
- Animação suave entre tabs
- Gradiente de fundo
- Indicador visual da tab ativa

---

### 10. SwitchIcon
**Arquivo:** `components/SwitchIcon.tsx`

Versão do Switch com suporte a múltiplas tabs e ícones.

**Interfaces:**

```typescript
interface Tab {
  key: string,
  title: string,
  icon?: string,
}

interface SwitchIconProps {
  tabs: Tab[],
  activeTab: string,
  onChangeTab: (key: string) => void,
}
```

**Funcionalidades:**
- Suporte a múltiplas tabs
- Ícones opcionais
- Animação dinâmica baseada no número de tabs

---

### 11. AddEventModal
**Arquivo:** `components/addEventModal.tsx`

Modal para adicionar novos eventos.

**Props:**

```typescript
interface AddEventModalProps {
  isVisible: boolean,
  onClose: () => void,
  onAddEvent: (event: {
    title: string,
    price: string,
    description: string,
    imagePlaceholderText: string,
    imagePlaceholderSubtext: string,
  }) => void,
}
```

**Funcionalidades:**
- Formulário de criação de evento
- Campos: título, preço, descrição, textos de imagem
- Validação de campos obrigatórios

---

### 12. EventDetailModal
**Arquivo:** `components/eventDetailModal.tsx`

Modal para exibir detalhes de um evento.

**Props:**

```typescript
interface EventDetailModalProps {
  isVisible: boolean,
  onClose: () => void,
  event: Event,
}
```

**Funcionalidades:**
- Exibição completa de informações do evento
- Botão de inscrição
- Scroll para conteúdo longo

---

## 📱 Telas (Screens)

### 1. Home
**Arquivo:** `app/(tabs)/home.tsx`

Tela principal com sistema de swipe de perfis.

**Interfaces:**

```typescript
interface Tag {
  label: string,
  color: string,
}

interface Profile {
  id: string,
  name: string,
  age: number,
  image: any,
  tags: Tag[],
}
```

**Funcionalidades:**
- Renderização do SwipeDeck
- Callbacks para ações de swipe
- Dados mockados de perfis

---

### 2. Community
**Arquivo:** `app/(tabs)/community.tsx`

Tela de comunidade com mapa e locais.

**Funcionalidades:**
- Integração com MapView (react-native-maps)
- Busca de localizações via Google Geocoding API
- Filtros de eventos (Físicos/Digitais)
- Modal com detalhes de locais
- Marcadores customizados no mapa

---

### 3. Events
**Arquivo:** `app/(tabs)/events.tsx`

Tela de listagem e gerenciamento de eventos.

**Interfaces:**

```typescript
interface Event {
  id: string,
  title: string,
  rating: string,
  distance: string,
  price: string,
  description: string,
  imagePlaceholderText: string,
  imagePlaceholderSubtext: string,
  category: "Eventos Inscritos" | "Eventos Abertos",
}

type FilterCategory = "Todos" | "Eventos Inscritos" | "Eventos Abertos",
```

**Funcionalidades:**
- Lista de eventos com filtros
- Modal de detalhes
- Modal de criação
- Botão flutuante para adicionar eventos

---

### 4. Profile
**Arquivo:** `app/(tabs)/profile.tsx`

Tela de perfil do usuário.

**Funcionalidades:**
- Seção superior com imagem e informações
- Switch entre Posts e Informações
- Drawer lateral com menu
- Modal de edição de perfil
- Modal de criação de post
- Scroll dinâmico com mudança de StatusBar

---

### 5. Notification
**Arquivo:** `app/(tabs)/notification.tsx`

Tela de notificações.

**Funcionalidades:**
- Lista de notificações
- Filtros por categoria (Todos, MATCH!, Equipes, Eventos, Comunidade)
- Componente Notification para cada item

---

### 6. Chat
**Arquivo:** `app/(tabs)/messages/chat.tsx`

Tela de chat individual.

**Funcionalidades:**
- Lista de mensagens
- Input de mensagem
- Scroll automático para última mensagem
- Suporte a teclado (KeyboardAvoidingView)
- Estilos diferenciados para usuário/bot

---

### 7. Message
**Arquivo:** `app/(tabs)/messages/message.tsx`

Tela de lista de conversas.

**Funcionalidades:**
- Lista de ChatButtons
- Navegação para chat individual

---

### 8. Manage (Admin)
**Arquivo:** `app/(tabs)/admin/manage.tsx`

Tela de gerenciamento de usuários (admin).

**Interfaces:**

```typescript
interface User {
  id: string,
  name: string,
  type: string,
}
```

**Funcionalidades:**
- Lista de usuários com checkboxes
- Busca de usuários
- Filtros e organização
- Chips de tipo de usuário (Player, Partner, Admin, Support)

---

### 9. FAQs Screen
**Arquivo:** `app/(tabs)/faqs/faqsScreen.tsx`

Tela de lista de FAQs.

**Funcionalidades:**
- Lista de FaqButtons
- Navegação para detalhes

---

### 10. FAQ About
**Arquivo:** `app/(tabs)/faqs/faqAbout.tsx`

Tela de detalhes de uma FAQ.

**Funcionalidades:**
- Exibição de nome, descrição e soluções

---

### 11. Settings - Config
**Arquivo:** `app/(tabs)/settings/config.tsx`

Tela de configurações gerais.

**Funcionalidades:**
- Alteração de e-mail
- Alteração de telefone (com máscara)
- Alteração de senha
- Validação de campos

---

### 12. Settings - Premium
**Arquivo:** `app/(tabs)/settings/premium.tsx`

Tela de assinatura premium.

**Funcionalidades:**
- Lista de benefícios
- Botão de assinatura

---

### 13. Settings - Privacy
**Arquivo:** `app/(tabs)/settings/privacy.tsx`

Tela de configurações de privacidade.

**Funcionalidades:**
- Switches para notificações e localização
- Opções de privacidade
- Opções de segurança

---

### 14. Index (Login)
**Arquivo:** `app/index.tsx`

Tela de login inicial.

**Funcionalidades:**
- Formulário de login
- Validação de campos
- Integração com authService
- Links para recuperação de senha e cadastro
- Login social (Google, Apple)

---

### 15. Create Account
**Arquivo:** `app/auth/create-account.tsx`

Tela de criação de conta.

**Funcionalidades:**
- Formulário de cadastro básico
- Validação de senhas
- Modal de formulário completo de perfil
- Integração com authService

---

### 16. Forgot Password
**Arquivo:** `app/auth/forgot-password.tsx`

Tela de recuperação de senha.

**Funcionalidades:**
- Campo de e-mail
- Envio de e-mail de recuperação

---

## 🔧 Componentes de UI Auxiliares

### 1. ThemedText
**Arquivo:** `components/examples/ThemedText.tsx`

Componente de texto com suporte a temas.

**Interfaces:**

```typescript
interface ThemedTextProps {
  lightColor?: string,
  darkColor?: string,
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link',
}
```

---

### 2. ThemedView
**Arquivo:** `components/examples/ThemedView.tsx`

Componente de View com suporte a temas.

**Interfaces:**

```typescript
interface ThemedViewProps {
  lightColor?: string,
  darkColor?: string,
}
```

---

### 3. HapticTab
**Arquivo:** `components/examples/HapticTab.tsx`

Componente de tab com feedback háptico.

**Funcionalidades:**
- Feedback háptico no iOS
- Wrapper para PlatformPressable

---

## 🔌 Serviços

### 1. authService
**Arquivo:** `services/authService.ts`

Serviço de autenticação.

**Interfaces:**

```typescript
interface SignupData {
  email: string,
  password: string,
  name: string,
  age?: number,
  phone?: string,
}

interface LoginData {
  email: string,
  password: string,
}

interface ProfileData {
  name: string,
  age?: number,
  email: string,
  phone?: string,
  descricao?: string,
  sexo?: 'm' | 'f' | 'nb',
  localizacao?: string,
  images?: (string | null)[],
  wallpaper?: string | null,
  tags?: string[],
}
```

**Funções:**
- `signup(signupData: SignupData)`: Cria conta e autentica
- `login(loginData: LoginData)`: Faz login
- `createProfile(profileData: ProfileData)`: Cria/atualiza perfil
- `logout()`: Faz logout
- `isAuthenticated()`: Verifica se está autenticado
- `getCurrentUser()`: Obtém usuário atual

---

## ⚙️ Configurações

### 1. axiosConnection
**Arquivo:** `config/axiosConnection.ts`

Configuração do cliente Axios.

**Funcionalidades:**
- Configuração de baseURL dinâmica
- Interceptor para adicionar token de autenticação
- Tratamento de erros
- Suporte a diferentes ambientes (web/dispositivo)

---

### 2. firebase
**Arquivo:** `config/firebase.ts`

Configuração do Firebase.

**Exportações:**
- `auth`: Instância de autenticação
- `db`: Instância do Firestore
- `app`: App do Firebase

---

## 🎣 Hooks Customizados

### 1. useThemeColor
**Arquivo:** `hooks/useThemeColor.ts`

Hook para obter cores do tema atual.

**Parâmetros:**
- `props: { light?: string; dark?: string }`
- `colorName: keyof typeof Colors.light & keyof typeof Colors.dark`

**Retorno:** Cor do tema atual

---

### 2. useColorScheme
**Arquivo:** `hooks/useColorScheme.ts`

Hook para obter o esquema de cores atual.

**Retorno:** `'light' | 'dark' | null`

---

## 📊 Constantes

### 1. Colors
**Arquivo:** `constants/Colors.ts`

Constantes de cores do tema.

**Estrutura:**
```typescript
Colors = {
  light: {
    text: string
    background: string
    tint: string
    icon: string
    tabIconDefault: string
    tabIconSelected: string
  },
  dark: {
    // Mesmas propriedades
  }
}
```

---

## 📝 Tipos e Interfaces Globais

### Tipos de Dados Comuns

```typescript
interface Tag {
  label: string,
  color: string,
}

interface Profile {
  id: string,
  name: string,
  age: number,
  image: any,
  tags: Tag[],
}

interface Event {
  id: string,
  title: string,
  rating: string,
  distance: string,
  price: string,
  description: string,
  imagePlaceholderText: string,
  imagePlaceholderSubtext: string,
  category: "Eventos Inscritos" | "Eventos Abertos",
}

interface User {
  id: string | number,
  name: string,
  type?: string,
  image?: any,
}
```

---

## 🔄 Layouts e Navegação

### 1. SwipeTabsLayoutWithVisualFeedback
**Arquivo:** `app/(tabs)/_layout.tsx`

Layout principal das tabs com sistema de swipe.

**Funcionalidades:**
- Navegação por gestos de swipe
- Animações entre telas
- Feedback visual
- Rotas configuráveis

---

## 📦 Dependências Principais

- **React Native**: Framework base
- **Expo**: Plataforma de desenvolvimento
- **Expo Router**: Sistema de roteamento
- **React Native Paper**: Biblioteca de componentes UI
- **React Native Maps**: Mapas
- **Axios**: Cliente HTTP
- **Firebase**: Backend e autenticação
- **React Native Reanimated**: Animações
- **React Native Gesture Handler**: Gestos

---

## 📌 Observações

1. **Tipagem**: O projeto utiliza TypeScript com interfaces bem definidas
2. **Componentes Funcionais**: Todos os componentes são funcionais (hooks)
3. **Estilização**: Uso de StyleSheet do React Native
4. **Navegação**: Expo Router para navegação baseada em arquivos
5. **Estado**: Uso de useState e useRef para gerenciamento de estado
6. **Animações**: React Native Reanimated e Animated API

---

## 🔍 Estrutura de Pastas Detalhada

```
app/
├── (tabs)/              # Rotas principais com tabs
│   ├── home.tsx
│   ├── community.tsx
│   ├── events.tsx
│   ├── notification.tsx
│   ├── profile.tsx
│   ├── admin/
│   │   └── manage.tsx
│   ├── faqs/
│   │   ├── faqsScreen.tsx
│   │   └── faqAbout.tsx
│   ├── messages/
│   │   ├── chat.tsx
│   │   └── message.tsx
│   └── settings/
│       ├── config.tsx
│       ├── premium.tsx
│       └── privacy.tsx
├── auth/                # Rotas de autenticação
│   ├── create-account.tsx
│   └── forgot-password.tsx
└── index.tsx            # Tela de login

components/
├── Formulario.tsx
├── SwipeCard.tsx
├── SwipeDeck.tsx
├── Post.tsx
├── Notification.tsx
├── MenuProfile.tsx
├── ChatButton.tsx
├── FaqButton.tsx
├── Switch.tsx
├── SwitchIcon.tsx
├── addEventModal.tsx
├── eventDetailModal.tsx
└── examples/            # Componentes de exemplo
    ├── ThemedText.tsx
    ├── ThemedView.tsx
    └── HapticTab.tsx

config/
├── axiosConnection.ts
└── firebase.ts

services/
└── authService.ts

hooks/
├── useThemeColor.ts
└── useColorScheme.ts

constants/
└── Colors.ts
```

---

**Última atualização:** Documento gerado automaticamente a partir da análise do código-fonte.

