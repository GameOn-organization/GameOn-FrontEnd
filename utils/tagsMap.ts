// Mapeamento de tags de jogos (deve corresponder ao Formulario.tsx)
export const gamesMap: { [key: string]: string } = {
  "1": "The Legend of Zelda",
  "2": "Super Mario",
  "3": "Minecraft",
  "4": "Fortnite",
  "5": "League of Legends",
  "6": "Counter-Strike",
  "7": "Pokémon",
  "8": "GTA V",
};

// Mapeamento de tags de esportes (deve corresponder ao Formulario.tsx)
export const sportsMap: { [key: string]: string } = {
  "1": "Futebol",
  "2": "Basquete",
  "3": "Tênis",
  "4": "Vôlei",
  "5": "Natação",
  "6": "Ciclismo",
  "7": "Corrida",
  "8": "Beisebol",
};

// Função para obter o nome da tag pelo ID
export const getTagName = (tagId: string): string => {
  return gamesMap[tagId] || sportsMap[tagId] || tagId;
};

// Função para obter múltiplos nomes de tags
export const getTagNames = (tagIds: string[]): string[] => {
  return tagIds.map(id => getTagName(id));
};

