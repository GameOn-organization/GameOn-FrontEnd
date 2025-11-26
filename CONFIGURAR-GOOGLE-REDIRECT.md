# Configuração Simplificada do Login com Google

## ✅ Usando apenas Firebase Auth (sem configuração manual no GCP)

Quando você usa Firebase Auth, a maioria das configurações já está feita automaticamente. Você só precisa:

1. **Obter o Client ID do Firebase Console** (já configurado)
2. **Adicionar o Redirect URI do proxy do Expo uma vez** (é estável e não muda)

## 🔍 Problema: Erro 404 ao fazer login com Google

O erro 404 acontece quando o Redirect URI usado pelo app não está configurado no Google Cloud Console. Mas com o Firebase Auth, isso é simplificado!

## ✅ Solução Passo a Passo

### 1. Obter o Client ID do Firebase (ÚNICA CONFIGURAÇÃO NECESSÁRIA)

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `tcc-gameon`
3. Vá em **Authentication** > **Sign-in method** > **Google**
4. Copie o **Web client ID** completo
5. Adicione no arquivo `.env` na raiz do projeto `GameOn-FrontEnd`:

```env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=seu-client-id-completo.apps.googleusercontent.com
```

### 2. Verificar o Redirect URI Gerado

Quando você executar o app e tentar fazer login com Google, verifique os logs no console. Você verá algo como:

```
🔵 [AUTH SERVICE] Redirect URI: https://auth.expo.io/@seu-usuario/gameon
```

**Este URI é estável e não muda!** Você só precisa adicioná-lo uma vez no Google Cloud Console.

### 3. Adicionar Redirect URI no Google Cloud Console (UMA VEZ)

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione o projeto `tcc-gameon`
3. Vá em **APIs & Services** > **Credentials**
4. Clique no **OAuth 2.0 Client ID** do tipo **Web application**
5. Em **Authorized redirect URIs**, clique em **+ ADD URI**
6. Cole o Redirect URI que você copiou dos logs
7. Clique em **SAVE**

## 📝 Nota Importante

**Você só precisa fazer isso UMA VEZ!** O redirect URI do proxy do Expo é estável e não muda entre execuções do app. Após adicionar uma vez, não precisa mais configurar manualmente.

### 4. Redirect URIs Comuns

Dependendo de como você está executando o app, o Redirect URI pode ser:

#### Para Expo Go (Desenvolvimento):

```
https://auth.expo.io/@seu-usuario/gameon
```

#### Para Build de Desenvolvimento:

```
gameon://auth
```

#### Para Web:

```
http://localhost:8081
```



```
https://seu-dominio.com
```

## ✅ Resumo: Configuração Simplificada

Com Firebase Auth, você só precisa:

1. ✅ Obter o Client ID do Firebase Console (já está configurado)
2. ✅ Adicionar no `.env` como `EXPO_PUBLIC_GOOGLE_CLIENT_ID`
3. ✅ Adicionar o redirect URI do proxy do Expo no GCP (uma vez, é estável)

**Não precisa configurar múltiplos redirect URIs ou fazer configurações complexas!**

### 5. Verificar o Client ID

Certifique-se de que o Client ID está configurado corretamente:

1. No Firebase Console, vá em **Authentication** > **Sign-in method** > **Google**
2. Copie o **Web client ID** completo
3. Adicione no arquivo `.env` na raiz do projeto `GameOn-FrontEnd`:

```env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=seu-client-id-completo.apps.googleusercontent.com
```

4. Reinicie o servidor do Expo após adicionar a variável de ambiente

### 6. Testar Novamente

1. Reinicie o app
2. Tente fazer login com Google novamente
3. Verifique os logs para confirmar que o Redirect URI está correto

## ❌ Erros Comuns

### Erro: "redirect_uri_mismatch"

- **Causa**: O Redirect URI não está configurado no Google Cloud Console
- **Solução**: Adicione o URI exato que aparece nos logs

### Erro: "invalid_client"

- **Causa**: Client ID incorreto ou não configurado
- **Solução**: Verifique se o `EXPO_PUBLIC_GOOGLE_CLIENT_ID` está correto no `.env`

### Erro: 404

- **Causa**: Redirect URI não encontrado no Google Cloud Console
- **Solução**: Adicione o Redirect URI que aparece nos logs do console

## 📝 Notas Importantes

- O Redirect URI deve corresponder **exatamente** ao configurado no Google Cloud Console
- Para desenvolvimento com Expo Go, sempre use o proxy do Expo (`useProxy: true`)
- Após adicionar um novo Redirect URI, pode levar alguns minutos para ficar ativo
- Certifique-se de usar o **Web Client ID** do Firebase, não o Client ID específico de iOS/Android

## 🔗 Links Úteis

- [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
- [Firebase Console - Authentication](https://console.firebase.google.com/project/tcc-gameon/authentication/providers)
- [Expo AuthSession Documentation](https://docs.expo.dev/guides/authentication/#google)
