// Danish UI strings. Centralised so additional locales can be added later
// without touching components.

export const t = {
  appName: "Forræderen",
  tagline: "Find forræderen — eller overlev som den.",

  // Home / join
  yourName: "Dit navn",
  namePlaceholder: "Skriv et navn",
  chooseAvatar: "Vælg avatar",
  createGame: "Opret spil",
  joinGame: "Deltag i spil",
  roomCode: "Rumkode",
  codePlaceholder: "ABCD",
  join: "Deltag",
  create: "Opret",
  back: "Tilbage",

  // Lobby
  lobby: "Lobby",
  players: "Spillere",
  waitingForHost: "Venter på at værten starter spillet…",
  startGame: "Start spil",
  shareCode: "Del koden med dine venner",
  copyCode: "Kopiér kode",
  copied: "Kopieret!",
  leave: "Forlad",
  kick: "Smid ud",
  settings: "Indstillinger",
  host: "Vært",
  you: "dig",
  bot: "BOT",
  addBot: "Tilføj bot",
  waitingNextRound: "Du er med fra næste runde",

  // Settings
  imposters: "Forrædere",
  cluePasses: "Spor-runder",
  roundCount: "Antal runder",
  imposterSeesCategory: "Forræder ser kategorien",
  impostersKnowEachOther: "Forrædere kender hinanden",
  timers: "Tidsbegrænsning",
  pack: "Ordpakke",
  choosePack: "Vælg pakke",
  on: "Til",
  off: "Fra",

  // Reveal
  yourRole: "Din rolle",
  tapToReveal: "Tryk for at se din rolle",
  youAreImposter: "Du er FORRÆDEREN",
  youAreCrew: "Du er i besætningen",
  theWord: "Ordet",
  category: "Kategori",
  imposterHint: "Bluf dig igennem — du kender ikke ordet!",
  yourTeammates: "Dine medforrædere",
  ready: "Klar",
  startClues: "Start spor-fasen",

  // Clues
  cluePhase: "Spor",
  yourTurn: "Det er din tur",
  waitingFor: "Venter på",
  yourClue: "Dit spor",
  cluePlaceholder: "Skriv ét ord eller kort spor",
  submitClue: "Send spor",
  pass: "Runde",
  clueGiven: "Spor givet",
  thinking: "tænker…",

  // Vote
  votePhase: "Stem",
  voteInstruction: "Hvem er forræderen?",
  voteFor: "Stem på",
  youVoted: "Du har stemt",
  changeVote: "Skift stemme",
  waitingForVotes: "Venter på alle stemmer…",
  eliminated: "Ude",
  ballotNumber: "Afstemning",

  // Reveal / resolve
  crewWon: "Besætningen vandt!",
  impostersWon: "Forræderne vandt!",
  theImposterWas: "Forræderen var",
  theImpostersWere: "Forræderne var",
  votes: "stemmer",
  nextRound: "Næste runde",
  scoreboard: "Stilling",
  finalResults: "Slutresultat",
  winner: "Vinder",
  playAgain: "Spil igen",
  backToLobby: "Til lobby",
  points: "point",

  // Host controls
  skip: "Spring over",
  skipPlayer: "Spring stallende spiller over",

  // Errors / misc
  loading: "Indlæser…",
  roomNotFound: "Rummet findes ikke.",
  connecting: "Forbinder…",
  offline: "Du er offline — genopretter…",
} as const;
