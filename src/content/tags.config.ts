// Configuração centralizada para todas as tags do site
export const tagConfig = {
  // Tags de tecnologia
  'javascript': { color: '#f7df1e', bgColor: 'rgba(247, 223, 30, 0.1)', textColor: '#f7df1e' },
  'typescript': { color: '#3178c6', bgColor: 'rgba(49, 120, 198, 0.1)', textColor: '#3178c6' },
  'react': { color: '#61dafb', bgColor: 'rgba(97, 218, 251, 0.1)', textColor: '#61dafb' },
  'astro': { color: '#ff5d01', bgColor: 'rgba(255, 93, 1, 0.1)', textColor: '#ff5d01' },
  'nextjs': { color: '#000000', bgColor: 'rgba(0, 0, 0, 0.1)', textColor: '#000000' },
  'nodejs': { color: '#339933', bgColor: 'rgba(51, 153, 51, 0.1)', textColor: '#339933' },
  'python': { color: '#3776ab', bgColor: 'rgba(55, 118, 171, 0.1)', textColor: '#3776ab' },
  'css': { color: '#1572b6', bgColor: 'rgba(21, 114, 182, 0.1)', textColor: '#1572b6' },
  'tailwind': { color: '#06b6d4', bgColor: 'rgba(6, 182, 212, 0.1)', textColor: '#06b6d4' },
  'sass': { color: '#cc6699', bgColor: 'rgba(204, 102, 153, 0.1)', textColor: '#cc6699' },
  
  // Tags de categorias
  'webdev': { color: '#8a63d2', bgColor: 'rgba(138, 99, 210, 0.1)', textColor: '#8a63d2' },
  'frontend': { color: '#6e3ebb', bgColor: 'rgba(110, 62, 187, 0.1)', textColor: '#6e3ebb' },
  'backend': { color: '#4a2a8c', bgColor: 'rgba(74, 42, 140, 0.1)', textColor: '#4a2a8c' },
  'fullstack': { color: '#9f8be0', bgColor: 'rgba(159, 139, 224, 0.1)', textColor: '#9f8be0' },
  'mobile': { color: '#ff6b6b', bgColor: 'rgba(255, 107, 107, 0.1)', textColor: '#ff6b6b' },
  'desktop': { color: '#4ecdc4', bgColor: 'rgba(78, 205, 196, 0.1)', textColor: '#4ecdc4' },
  
  // Tags de estado/projeto
  'completed': { color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)', textColor: '#22c55e' },
  'in-progress': { color: '#eab308', bgColor: 'rgba(234, 179, 8, 0.1)', textColor: '#eab308' },
  'planning': { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', textColor: '#f59e0b' },
  'on-hold': { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', textColor: '#ef4444' },
  'experimental': { color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)', textColor: '#8b5cf6' },
  
  // Tags de conteúdo
  'tutorial': { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', textColor: '#3b82f6' },
  'guide': { color: '#0ea5e9', bgColor: 'rgba(14, 165, 233, 0.1)', textColor: '#0ea5e9' },
  'tips': { color: '#06b6d4', bgColor: 'rgba(6, 182, 212, 0.1)', textColor: '#06b6d4' },
  'blog': { color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.1)', textColor: '#ec4899' },
  'personal': { color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.1)', textColor: '#f97316' },
  'learning': { color: '#84cc16', bgColor: 'rgba(132, 204, 22, 0.1)', textColor: '#84cc16' },
  
  // Tags de áreas de interesse
  'ui-ux': { color: '#f43f5e', bgColor: 'rgba(244, 63, 94, 0.1)', textColor: '#f43f5e' },
  'design': { color: '#d946ef', bgColor: 'rgba(217, 70, 239, 0.1)', textColor: '#d946ef' },
  'music': { color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.1)', textColor: '#a855f7' },
  'production': { color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.1)', textColor: '#ec4899' },
  'gaming': { color: '#14b8a6', bgColor: 'rgba(20, 184, 166, 0.1)', textColor: '#14b8a6' },
  'creative': { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', textColor: '#f59e0b' },
  
  // Tags gerais
  'misc': { color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)', textColor: '#6b7280' },
  'introduction': { color: '#9ca3af', bgColor: 'rgba(156, 163, 175, 0.1)', textColor: '#9ca3af' },
  'update': { color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)', textColor: '#6b7280' },
  
  // Fallback para tags não definidas
  'default': { color: '#8a63d2', bgColor: 'rgba(138, 99, 210, 0.1)', textColor: '#8a63d2' }
} as const;// Tipo para as configurações de tag
export type TagConfig = typeof tagConfig;
export type TagName = keyof TagConfig;

// Função helper para obter configuração de uma tag
export function getTagConfig(tagName: string) {
  const normalizedTag = tagName.toLowerCase() as TagName;
  return tagConfig[normalizedTag] || tagConfig.default;
}

// Função para obter todas as tags definidas
export function getAllDefinedTags(): TagName[] {
  return Object.keys(tagConfig).filter(tag => tag !== 'default') as TagName[];
}
