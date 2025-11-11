# Configuração do IP para Desenvolvimento

## Problema

Quando você roda o app React Native/Expo em um dispositivo físico ou emulador, `localhost` não funciona porque se refere ao próprio dispositivo, não ao computador onde o backend está rodando.

## Solução

O arquivo `config/axiosConnection.ts` foi configurado para usar automaticamente:
- **Web**: `http://localhost:3000`
- **Dispositivo/Emulador**: `http://[SEU_IP]:3000`

## Como descobrir seu IP

### Linux/Mac:
```bash
hostname -I
# ou
ip addr show | grep "inet " | grep -v 127.0.0.1
```

### Windows:
```bash
ipconfig
# Procure por "IPv4 Address" na sua interface de rede ativa
```

## Como atualizar o IP no código

1. Abra o arquivo `GameOn-FrontEnd/config/axiosConnection.ts`
2. Encontre a linha:
   ```typescript
   const LOCAL_IP = '192.168.15.8' // ⚠️ ATUALIZE ESTE IP COM O IP DA SUA MÁQUINA
   ```
3. Substitua `192.168.15.8` pelo seu IP atual
4. Salve o arquivo
5. Reinicie o app Expo

## Verificação

Quando o app iniciar, você verá nos logs:
```
🔵 [AXIOS CONFIG] Base URL configurada: http://[SEU_IP]:3000
```

Se o IP estiver correto e o backend estiver rodando, as requisições devem funcionar.

## Troubleshooting

### Backend não recebe requisições

1. **Verifique se o backend está rodando:**
   ```bash
   cd GameOn-backend
   npm run start:dev
   ```
   Você deve ver: `✅ [MAIN] Servidor rodando em http://localhost:3000`

2. **Verifique se o IP está correto:**
   - O IP deve ser o da interface de rede que está conectada
   - Se estiver usando WiFi, use o IP do WiFi
   - Se estiver usando cabo, use o IP do cabo

3. **Verifique o firewall:**
   - O firewall pode estar bloqueando a porta 3000
   - No Linux: `sudo ufw allow 3000`
   - No Windows: Adicione uma exceção no Firewall do Windows

4. **Verifique se dispositivo e computador estão na mesma rede:**
   - Ambos devem estar na mesma rede WiFi ou LAN

### Usar variável de ambiente (Opcional)

Você também pode criar um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=http://192.168.15.8:3000
```

E o código usará automaticamente essa URL.

