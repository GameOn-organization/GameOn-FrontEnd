# Configuração do Login com Google para Mobile

Este guia explica como configurar o login com Google no mobile (iOS/Android).

## 📋 Pré-requisitos

1. Firebase Console configurado
2. Google Cloud Console acessível
3. Expo CLI instalado

## 🔧 Passo a Passo

### 1. Obter o Client ID do Google OAuth

#### Opção A: Via Firebase Console
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto (`tcc-gameon`)
3. Vá em **Authentication** > **Sign-in method**
4. Clique em **Google**
5. Se ainda não estiver habilitado, habilite o Google Sign-In
6. Clique em **Web SDK configuration**
7. Copie o **Web client ID** completo (formato: `xxxxx-xxxxx.apps.googleusercontent.com`)

#### Opção B: Via Google Cloud Console
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione o projeto `tcc-gameon`
3. Vá em **APIs & Services** > **Credentials**
4. Encontre o OAuth 2.0 Client ID do tipo **Web application**
5. Copie o **Client ID** completo

### 2. Configurar o Client ID no Código

Edite o arquivo `services/authService.ts` e atualize a linha:

```typescript
const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'SEU_CLIENT_ID_COMPLETO_AQUI'
```

**OU** configure via variável de ambiente:

Crie um arquivo `.env` na raiz do projeto `GameOn-FrontEnd`:

```env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=seu-client-id-completo.apps.googleusercontent.com
```

### 3. Configurar Redirect URI no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Vá em **APIs & Services** > **Credentials**
3. Clique no OAuth 2.0 Client ID (Web application)
4. Em **Authorized redirect URIs**, adicione:
   - `gameon://auth` (para desenvolvimento)
   - `exp://localhost:8081/--/auth` (para Expo Go)
   - `gameon://` (fallback)

### 4. Verificar o Scheme do App

O scheme `gameon` já está configurado no `app.json`:

```json
{
  "expo": {
    "scheme": "gameon"
  }
}
```

## 🧪 Testando

1. Execute o app no mobile:
   ```bash
   npm run android
   # ou
   npm run ios
   ```

2. Clique no botão "Entrar com Google"

3. Verifique os logs no console:
   - `🔵 [AUTH SERVICE] Redirect URI: ...`
   - `🔵 [AUTH SERVICE] Client ID: ...`
   - `🔵 [AUTH SERVICE] Request criado, abrindo navegador...`

## ❌ Solução de Problemas

### Erro: "Redirect URI não configurado"
- **Solução**: Adicione o redirect URI no Google Cloud Console (passo 3)

### Erro: "Client ID inválido"
- **Solução**: Verifique se o Client ID está completo e correto (formato: `xxxxx-xxxxx.apps.googleusercontent.com`)

### O navegador não abre
- **Solução**: Verifique se o scheme `gameon` está configurado no `app.json`
- Verifique os logs do console para mais detalhes

### Erro: "Token do Google não recebido"
- **Solução**: Verifique se o redirect URI está correto e autorizado no Google Cloud Console

## 📝 Notas Importantes

- O Client ID usado deve ser o **Web Client ID** do Firebase, não o Client ID específico de iOS/Android
- O redirect URI deve corresponder exatamente ao configurado no Google Cloud Console
- Para produção, configure a variável de ambiente `EXPO_PUBLIC_GOOGLE_CLIENT_ID`
- O fluxo OAuth abre um navegador externo para autenticação e depois retorna ao app

## 🔗 Links Úteis

- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Expo AuthSession](https://docs.expo.dev/guides/authentication/#google)







