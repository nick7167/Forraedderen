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
  pack: "Kategori",
  choosePack: "Vælg kategori",
  on: "Til",
  off: "Fra",

  // Game mode
  mode: "Spiltype",
  modeSpy: "Klassisk",
  modeUndercover: "Undercover",
  modeSpyDesc: "Forræderen kender ikke ordet.",
  modeUndercoverDesc: "Forræderen får et lignende ord — uden at vide det.",
  randomCategory: "Tilfældig",
  randomCategoryOption: "Tilfældig kategori",

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
  imposterWordWas: "Forræderens ord",
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

  // Clue hint (broad-clue guidance)
  clueHintCrew: "Giv et bredt spor — tydeligt nok for andre med ordet, men ikke så tydeligt at forræderen kan gætte det.",
  clueHintSpyImposter: "Du kender ikke ordet. Lyt til de andre og bluf et spor.",
  clueHintUndercover: "Giv et bredt spor til dit ord.",

  // How to play
  howToTitle: "Sådan spilles",
  howTo: {
    goal: {
      title: "Målet",
      body: "Alle får det samme hemmelige ord — undtagen forræderen. Find forræderen ved at lytte til hinandens spor. Forræderen vil overleve uden at blive afsløret.",
    },
    clues: {
      title: "Spor",
      body: "På skift giver alle ét bredt spor til ordet. Et godt spor er tydeligt nok for dem, der kender ordet, men ikke så afslørende, at forræderen kan gætte det.",
    },
    vote: {
      title: "Afstemning",
      body: "Bagefter stemmer alle i hemmelighed på, hvem de tror er forræderen. Flest stemmer ryger ud. Står det lige, slipper forræderen fri.",
    },
    klassisk: {
      title: "Klassisk",
      body: "Forræderen ved, at de er forræder, men kender ikke ordet og må bluffe sig igennem.",
    },
    undercover: {
      title: "Undercover",
      body: "Forræderen ved IKKE, at de er forræder — de får bare et lignende ord. Deres spor kommer til at passe lidt skævt.",
    },
  },

  // Errors / misc
  loading: "Indlæser…",
  roomNotFound: "Rummet findes ikke.",
  connecting: "Forbinder…",
  offline: "Du er offline — genopretter…",
} as const;
