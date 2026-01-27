// Supported languages
export type Language = "es" | "pt" | "en";

export const LANGUAGES: Record<Language, { label: string; flag: string }> = {
  es: { label: "Español", flag: "🇪🇸" },
  pt: { label: "Português", flag: "🇧🇷" },
  en: { label: "English", flag: "🇬🇧" },
};

// Country to language mapping
export const COUNTRY_LANGUAGES: Record<string, Language> = {
  // Spanish
  argentina: "es",
  españa: "es",
  spain: "es",
  mexico: "es",
  méxico: "es",
  chile: "es",
  colombia: "es",
  peru: "es",
  perú: "es",
  uruguay: "es",
  ecuador: "es",
  bolivia: "es",
  paraguay: "es",
  venezuela: "es",
  // Portuguese
  brasil: "pt",
  brazil: "pt",
  portugal: "pt",
  // English
  "united states": "en",
  usa: "en",
  "united kingdom": "en",
  uk: "en",
  australia: "en",
  canada: "en",
  "new zealand": "en",
  ireland: "en",
};

// Detect language from city/country string
export function detectLanguageFromLocation(location: string): Language {
  const lower = location.toLowerCase();
  for (const [country, lang] of Object.entries(COUNTRY_LANGUAGES)) {
    if (lower.includes(country)) {
      return lang;
    }
  }
  return "es"; // Default to Spanish
}

// Translations
export const translations: Record<Language, Record<string, string>> = {
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.profile": "Mi perfil",

    // Tabs
    "tabs.now": "Ahora",
    "tabs.today": "Hoy",
    "tabs.tomorrow": "Mañana",

    // Cards
    "card.people": "personas",
    "card.person": "persona",
    "card.join": "Sumarme",
    "card.joined": "Anotado",
    "card.featured": "Destacado",

    // Categories
    "category.beach": "Playa",
    "category.dinner": "Cena",
    "category.bar": "Bar",
    "category.surf": "Surf",
    "category.hike": "Caminata",
    "category.party": "Fiesta",
    "category.tour": "Tour",
    "category.other": "Otro",

    // New plan
    "newPlan.title": "Nuevo plan",
    "newPlan.type": "Tipo de plan",
    "newPlan.planTitle": "Título del plan",
    "newPlan.planTitlePlaceholder": "Ej: Pizza en la terraza",
    "newPlan.when": "¿Cuándo?",
    "newPlan.pickDate": "Elegir fecha",
    "newPlan.date": "Fecha",
    "newPlan.time": "Hora",
    "newPlan.location": "Lugar (opcional)",
    "newPlan.locationPlaceholder": "Ej: Terraza del hostel, Playa Norte...",
    "newPlan.preview": "Preview",
    "newPlan.create": "Crear plan",
    "newPlan.creating": "Creando...",
    "newPlan.errorTitle": "Ingresá un título",
    "newPlan.errorTime": "Elegí una hora",

    // Quick times
    "time.now": "Ahora",
    "time.30min": "En 30 min",
    "time.1hour": "En 1 hora",
    "time.2hours": "En 2 horas",
    "time.tonight": "Esta noche",
    "time.tomorrow": "Mañana",

    // Bottom section
    "bottom.joinOrCreate": "Sumate a un plan o proponé el tuyo",
    "bottom.newPlan": "Nuevo plan",
    "bottom.scanQR": "Escaneá el QR para compartir",

    // Join page
    "join.title": "Entrá al tablero",
    "join.subtitle": "Sumate a planes en segundos.",
    "join.nickname": "Apodo",
    "join.nicknamePlaceholder": "Ej: Franco",
    "join.pickEmoji": "Elegí un emoji",
    "join.enter": "Entrar",
    "join.entering": "Entrando...",
    "join.hostelCode": "Código del hostel",
    "join.invalidCode": "Código inválido",
    "join.invalidCodeMsg": "Código inválido o hostel no encontrado.",
    "join.tryAgain": "Verificá que el código sea correcto e intentá de nuevo.",

    // Empty state
    "empty.noPlans": "No hay planes todavía",
    "empty.createFirst": "Creá el primero",

    // General
    "loading": "Cargando...",
    "error": "Error",
    "language": "Idioma",
  },

  pt: {
    // Navigation
    "nav.home": "Início",
    "nav.profile": "Meu perfil",

    // Tabs
    "tabs.now": "Agora",
    "tabs.today": "Hoje",
    "tabs.tomorrow": "Amanhã",

    // Cards
    "card.people": "pessoas",
    "card.person": "pessoa",
    "card.join": "Participar",
    "card.joined": "Inscrito",
    "card.featured": "Destaque",

    // Categories
    "category.beach": "Praia",
    "category.dinner": "Jantar",
    "category.bar": "Bar",
    "category.surf": "Surf",
    "category.hike": "Trilha",
    "category.party": "Festa",
    "category.tour": "Tour",
    "category.other": "Outro",

    // New plan
    "newPlan.title": "Novo plano",
    "newPlan.type": "Tipo de plano",
    "newPlan.planTitle": "Título do plano",
    "newPlan.planTitlePlaceholder": "Ex: Pizza no terraço",
    "newPlan.when": "Quando?",
    "newPlan.pickDate": "Escolher data",
    "newPlan.date": "Data",
    "newPlan.time": "Hora",
    "newPlan.location": "Local (opcional)",
    "newPlan.locationPlaceholder": "Ex: Terraço do hostel, Praia Norte...",
    "newPlan.preview": "Preview",
    "newPlan.create": "Criar plano",
    "newPlan.creating": "Criando...",
    "newPlan.errorTitle": "Digite um título",
    "newPlan.errorTime": "Escolha um horário",

    // Quick times
    "time.now": "Agora",
    "time.30min": "Em 30 min",
    "time.1hour": "Em 1 hora",
    "time.2hours": "Em 2 horas",
    "time.tonight": "Hoje à noite",
    "time.tomorrow": "Amanhã",

    // Bottom section
    "bottom.joinOrCreate": "Participe de um plano ou crie o seu",
    "bottom.newPlan": "Novo plano",
    "bottom.scanQR": "Escaneie o QR para compartilhar",

    // Join page
    "join.title": "Entre no quadro",
    "join.subtitle": "Participe de planos em segundos.",
    "join.nickname": "Apelido",
    "join.nicknamePlaceholder": "Ex: João",
    "join.pickEmoji": "Escolha um emoji",
    "join.enter": "Entrar",
    "join.entering": "Entrando...",
    "join.hostelCode": "Código do hostel",
    "join.invalidCode": "Código inválido",
    "join.invalidCodeMsg": "Código inválido ou hostel não encontrado.",
    "join.tryAgain": "Verifique se o código está correto e tente novamente.",

    // Empty state
    "empty.noPlans": "Ainda não há planos",
    "empty.createFirst": "Crie o primeiro",

    // General
    "loading": "Carregando...",
    "error": "Erro",
    "language": "Idioma",
  },

  en: {
    // Navigation
    "nav.home": "Home",
    "nav.profile": "My profile",

    // Tabs
    "tabs.now": "Now",
    "tabs.today": "Today",
    "tabs.tomorrow": "Tomorrow",

    // Cards
    "card.people": "people",
    "card.person": "person",
    "card.join": "Join",
    "card.joined": "Joined",
    "card.featured": "Featured",

    // Categories
    "category.beach": "Beach",
    "category.dinner": "Dinner",
    "category.bar": "Bar",
    "category.surf": "Surf",
    "category.hike": "Hike",
    "category.party": "Party",
    "category.tour": "Tour",
    "category.other": "Other",

    // New plan
    "newPlan.title": "New plan",
    "newPlan.type": "Plan type",
    "newPlan.planTitle": "Plan title",
    "newPlan.planTitlePlaceholder": "E.g.: Pizza on the terrace",
    "newPlan.when": "When?",
    "newPlan.pickDate": "Pick date",
    "newPlan.date": "Date",
    "newPlan.time": "Time",
    "newPlan.location": "Location (optional)",
    "newPlan.locationPlaceholder": "E.g.: Hostel terrace, North Beach...",
    "newPlan.preview": "Preview",
    "newPlan.create": "Create plan",
    "newPlan.creating": "Creating...",
    "newPlan.errorTitle": "Enter a title",
    "newPlan.errorTime": "Pick a time",

    // Quick times
    "time.now": "Now",
    "time.30min": "In 30 min",
    "time.1hour": "In 1 hour",
    "time.2hours": "In 2 hours",
    "time.tonight": "Tonight",
    "time.tomorrow": "Tomorrow",

    // Bottom section
    "bottom.joinOrCreate": "Join a plan or create your own",
    "bottom.newPlan": "New plan",
    "bottom.scanQR": "Scan QR to share",

    // Join page
    "join.title": "Join the board",
    "join.subtitle": "Join plans in seconds.",
    "join.nickname": "Nickname",
    "join.nicknamePlaceholder": "E.g.: John",
    "join.pickEmoji": "Pick an emoji",
    "join.enter": "Enter",
    "join.entering": "Entering...",
    "join.hostelCode": "Hostel code",
    "join.invalidCode": "Invalid code",
    "join.invalidCodeMsg": "Invalid code or hostel not found.",
    "join.tryAgain": "Check the code and try again.",

    // Empty state
    "empty.noPlans": "No plans yet",
    "empty.createFirst": "Create the first one",

    // General
    "loading": "Loading...",
    "error": "Error",
    "language": "Language",
  },
};

// Get translation
export function t(key: string, lang: Language): string {
  return translations[lang][key] || translations.es[key] || key;
}

// Category icons (universal)
export const CATEGORY_ICONS: Record<string, string> = {
  beach: "🏖️",
  dinner: "🍽️",
  bar: "🍻",
  surf: "🏄",
  hike: "🥾",
  party: "🎉",
  tour: "🚐",
  other: "✨",
};

// Get localized category
export function getCategoryLabel(category: string, lang: Language): string {
  return t(`category.${category}`, lang);
}
