// Danish UI strings. Centralised so additional locales can be added later
// without touching components.

export const t = {
  appName: "Kamæleon",
  // Home tagline and room-code label are the concept's verbatim (screens 1–2).
  tagline: "Find kamæleonen iblandt jer",

  // Home / join
  yourName: "Dit navn",
  namePlaceholder: "Skriv et navn",
  chooseAvatar: "Vælg avatar",
  createGame: "Opret spil",
  joinGame: "Deltag i spil",
  roomCode: "Rum-kode",
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
  leaveConfirmTitle: "Forlad spillet?",
  leaveConfirmBody: "Du forlader spillet og går tilbage til forsiden.",
  cancel: "Annullér",
  kick: "Smid ud",
  settings: "Indstillinger",
  host: "Vært",
  you: "dig",
  bot: "BOT",
  addBot: "Tilføj bot",
  waitingNextRound: "Du er med fra næste runde",

  // Settings
  imposters: "Kamæleoner",
  cluePasses: "Spor-runder",
  roundCount: "Antal runder",
  imposterSeesCategory: "Kamæleon ser kategorien",
  impostersKnowEachOther: "Kamæleoner kender hinanden",
  timers: "Tidsbegrænsning",
  pack: "Kategori",
  choosePack: "Vælg kategori",
  on: "Til",
  off: "Fra",

  // Game mode
  mode: "Spiltype",
  modeSpy: "Klassisk",
  modeUndercover: "Undercover",
  modeQuestions: "Spørgsmål",
  modeScale: "Måleren",
  modeSpyDesc: "Kamæleonen kender ikke ordet.",
  modeUndercoverDesc: "Kamæleonen får et lignende ord — uden at vide det.",
  modeQuestionsDesc: "Alle svarer på et spørgsmål. Kamæleonen får et lidt andet spørgsmål — uden at vide det.",
  modeScaleDesc: "Alle svarer fra 1–5. Kamæleonen får et lidt andet spørgsmål — uden at vide det.",
  randomCategory: "Tilfældig",
  randomCategoryOption: "Tilfældig kategori",
  randomCategoryNote: "Skifter hver runde",

  // Reveal
  yourRole: "Din rolle",
  tapToReveal: "Tryk for at se din rolle",
  youAreImposter: "Du er KAMÆLEONEN",
  youAreCrew: "Du er i besætningen",
  theWord: "Ordet",
  category: "Kategori",
  imposterHint: "Bluf dig igennem — du kender ikke ordet!",
  yourTeammates: "Dine medkamæleoner",
  ready: "Klar",
  readyWaiting: "Venter på de andre…",
  readyCount: "klar",
  startNow: "Start nu",
  startClues: "Start spor-fasen",

  // Clues
  cluePhase: "Spor",
  yourTurn: "Det er din tur",
  waitingFor: "Venter på",
  yourClue: "Dit spor",
  prepareTurn: "Det er {name}s tur — forbered dit svar",
  cluePlaceholder: "Skriv ét ord eller kort spor",
  submitClue: "Send spor",
  pass: "Runde",
  clueGiven: "Spor givet",
  thinking: "tænker…",

  // Questions mode
  yourQuestion: "Dit spørgsmål",
  questionAnswerHint: "Svar ærligt med ÉT ord.",
  scaleAnswerHint: "Svar ærligt på skalaen fra 1 til 5.",
  chooseScale: "Vælg et tal fra 1 til 5",
  answerPhase: "Svar",
  answerPlaceholder: "Skriv dit svar (ét ord)",
  submitAnswer: "Send svar",
  answeredCount: "har svaret",
  youAnswered: "Du har svaret",
  waitingForAnswers: "Venter på de andres svar…",
  answerWaitOthers: "Afventer at alle svarer…",
  bannerAnswer: "Svar",
  voteInstructionQuestions: "Hvem fik et andet spørgsmål?",
  theCrewQuestion: "Spørgsmålet",
  theImposterQuestion: "Kamæleonens spørgsmål",
  theRealQuestion: "Det rigtige spørgsmål",
  discussPromptQuestions: "Hvem svarede på et andet spørgsmål?",

  // Discussion
  discussTitle: "Diskutér",
  discussPrompt: "Hvem virker falsk?",
  discussHint: "Snak om, hvem der virker mistænkelig.",
  nextClue: "Næste spor",
  goToVoting: "Gå til afstemning",

  // Settings coach (first-time host nudge)
  coachSettings: "Tilpas spillet",
  coachSettingsSub: "Skift spiltype, kategori og mere",

  // Phase-transition banners
  bannerClues: "Spor",
  bannerDiscuss: "Diskutér",
  bannerVote: "Afstemning",

  // Vote
  votePhase: "Stem",
  voteInstruction: "Hvem er kamæleonen?",
  voteFor: "Stem på",
  youVoted: "Du har stemt",
  changeVote: "Skift stemme",
  voteChangeHint: "Tryk for at stemme — du kan skifte når som helst",
  eliminatedHint: "Du er ude og kan ikke stemme i denne runde",
  waitingForVotes: "Venter på alle stemmer…",
  eliminated: "Ude",
  ballotNumber: "Afstemning",

  // Reveal / resolve
  crewWon: "Besætningen vandt!",
  impostersWon: "Kamæleonerne vandt!",
  // Short result headlines — the concept's `.result-headline` copy (screen 7).
  // The long forms above overflow the 28px headline at 375px wide.
  caught: "Fanget!",
  escaped: "Slap væk!",
  vote: "stemme",
  theImposterWas: "Kamæleonen var",
  theImpostersWere: "Kamæleonerne var",
  imposterWordWas: "Kamæleonens ord",
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
  skipTurn: "Spring {name} over",
  endVote: "Afslut afstemning",
  skipPlayer: "Spring stallende spiller over",
  hostGone: "Værten er væk",
  claimHost: "Overtag som vært",

  // Spectator / removed / rejoin
  waitingTitle: "Du er med fra næste runde",
  waitingBody: "Spillet er i gang. Du deltager, så snart næste runde starter.",
  removedTitle: "Du er ikke længere i spillet",
  removedBody: "Du er blevet fjernet fra rummet.",
  goHome: "Til forsiden",
  continueGame: "Fortsæt spil",

  // Clue hint (broad-clue guidance)
  clueHintCrew: "Giv et bredt spor — tydeligt nok for andre med ordet, men ikke så tydeligt at kamæleonen kan gætte det.",
  clueHintSpyImposter: "Du kender ikke ordet. Lyt til de andre og bluf et spor.",
  clueHintUndercover: "Giv et bredt spor til dit ord.",

  // How to play
  howToTitle: "Sådan spilles",
  howTo: {
    goal: {
      title: "Målet",
      body: "Alle får det samme hemmelige ord — undtagen kamæleonen. Find kamæleonen ved at lytte til hinandens spor. Kamæleonen vil overleve uden at blive afsløret.",
    },
    clues: {
      title: "Spor",
      body: "På skift giver alle ét bredt spor til ordet. Et godt spor er tydeligt nok for dem, der kender ordet, men ikke så afslørende, at kamæleonen kan gætte det.",
    },
    vote: {
      title: "Afstemning",
      body: "Bagefter stemmer alle i hemmelighed på, hvem de tror er kamæleonen. Flest stemmer ryger ud. Står det lige, slipper kamæleonen fri.",
    },
    klassisk: {
      title: "Klassisk",
      body: "Kamæleonen ved, at de er kamæleon, men kender ikke ordet og må bluffe sig igennem.",
    },
    undercover: {
      title: "Undercover",
      body: "Kamæleonen ved IKKE, at de er kamæleon — de får bare et lignende ord. Deres spor kommer til at passe lidt skævt.",
    },
    questions: {
      title: "Spørgsmål",
      body: "Alle får et spørgsmål og svarer med ét ord på samme tid. Kamæleonen får et lidt andet spørgsmål — uden at vide det. Find ud af, hvem der svarede på et andet spørgsmål.",
    },
    scale: {
      title: "Måleren",
      body: "Alle svarer privat fra 1 til 5 på det samme spørgsmål. Kamæleonen får et lignende, men anderledes spørgsmål. Sammenlign tallene og find den, der svarer skævt.",
    },
  },

  // Match highlights
  matchHighlights: "Højdepunkter",
  bestDetective: "Bedste detektiv",
  bestBluff: "Bedste bluff",
  mostSuspected: "Mest mistænkt",
  mostCorrectVotes: "Flest rigtige stemmer",
  accuracy: "træfsikker",
  correctVotes: "rigtige stemmer",
  receivedVotes: "modtagne stemmer",
  imposterWins: "sejre som Kamæleon",

  // Errors / misc
  loading: "Indlæser…",
  roomNotFound: "Rummet findes ikke.",
  connecting: "Forbinder…",
  offline: "Du er offline — genopretter…",

  // Add to home screen
  a2hsTitle: "Få den fulde oplevelse",
  a2hsBody: "Føj Kamæleon til din hjemmeskærm for fuld skærm og hurtig adgang.",
  a2hsInstall: "Føj til hjemmeskærm",
  a2hsContinue: "Fortsæt i browser",
  a2hsIosIntro: "Sådan gør du i Safari:",
  a2hsIosStep1: "Tryk på Del-knappen nederst",
  a2hsIosStep2: 'Vælg "Føj til hjemmeskærm"',
} as const;
