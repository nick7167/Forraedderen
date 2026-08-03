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
  soundOn: "Slå lyd til",
  soundOff: "Slå lyd fra",
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
  shareInvite: "Del",
  shareTitle: "Kom og spil Kamæleon",
  shareText: "Jeg har startet et spil Kamæleon. Kode: {code}",
  joiningRoom: "Du er på vej ind i spillet…",
  joinPrompt: "Vælg dit navn, så er du med",
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
  needMorePlayers: "Mindst 3 spillere",
  waitingForPlayers: "Venter på spillere…",
  waitingNextRound: "Du er med fra næste runde",

  // Settings
  imposters: "Kamæleoner",
  cluePasses: "Spor-runder",
  roundCount: "Antal runder",
  roundCountSub: "Pr. kamp",
  impostersSub: "Antal per runde",
  cluePassesSub: "Spor-runder pr. runde",
  changePack: "Skift →",
  imposterSeesCategory: "Kamæleon ser kategorien",
  imposterSeesCategorySub: "Giver kamæleonen et fingerpeg",
  impostersKnowEachOther: "Kamæleoner kender hinanden",
  impostersKnowEachOtherSub: "Kun ved flere kamæleoner",
  timers: "Tidsbegrænsning",
  pack: "Kategori",
  choosePack: "Vælg kategori",
  on: "Til",
  off: "Fra",

  // Game mode
  mode: "Spiltype",
  modeSpy: "Klassisk",
  modeSpyTag: "Kamæleonen ved intet",
  modeUndercoverTag: "Lignende ord til spionen",
  modeQuestionsTag: "Ét ords svar på spørgsmål",
  modeScaleTag: "Tal fra 1 til 5",
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
  tapToHide: "Tryk for at skjule igen",
  youAreImposter: "Du er KAMÆLEONEN",
  youAreCrew: "Du er i besætningen",
  theWord: "Ordet",
  theWordIs: "Ordet er",
  roleCrew: "Besætningsmedlem",
  roleImposter: "Kamæleonen",
  imposterNoWord: "Du kender ikke ordet",
  keepItSecret: "Behold det hemmeligt!",
  blendIn: "Smelt ind — vind!  🎭",
  accused: "Anklaget",
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
  cluePhaseTitle: "Giv et spor 💬",
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
  voteSelf: "Dig selv",
  voteSuspect: "Mistænkt?",
  voteHasVoted: "Har stemt ✓",
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
  theImposterWas: "Kamæleonen",
  theImpostersWere: "Kamæleonerne",
  imposterWordWas: "Kamæleonens ord",
  votes: "stemmer",
  nextRound: "Næste runde",
  scoreboard: "Stilling",
  finalResults: "Slutresultat",
  winner: "Vinder",
  playAgain: "Spil igen",
  backToLobby: "Til lobby",
  points: "point",
  pointsShort: "pt",
  scoreUpdate: "Pointopdatering",

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
  historyTitle: "Tidligere runder",
  howToTitle: "Sådan spilles",
  // The home-screen explainer. Enough to understand a round without opening anything —
  // the exhaustive rules (ties, scoring) still live in `howTo` below and open in a drawer.
  homeHowLabel: "Sådan spilles",
  homeSteps: {
    word: {
      title: "Alle får et ord",
      body: "Hele bordet får det samme hemmelige ord. Alle undtagen én — kamæleonen.",
    },
    clue: {
      title: "Giv et spor",
      body: "På skift siger I ét ord om det hemmelige ord. Tydeligt nok til de andre, men ikke så tydeligt at kamæleonen kan gætte det.",
    },
    vote: {
      title: "Find kamæleonen",
      body: "Diskutér, og stem så på den, I mistænker. Rammer I rigtigt, vinder holdet. Ellers slipper kamæleonen væk med sejren.",
    },
  },
  homeModesLabel: "Fire spiltyper",
  homeModesNote: "Værten vælger spiltype i lobbyen.",
  homeRulesCta: "Se alle reglerne",
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
      body: "Bagefter stemmer alle i hemmelighed på, hvem de tror er kamæleonen. Flest stemmer ryger ud. Du kan skifte stemme, indtil alle har stemt.",
    },
    tie: {
      title: "Uafgjort",
      body: "Står stemmerne lige — eller stemmer ingen — sker der ingen udstemning, og kamæleonen slipper fri og vinder runden. Det kan altså betale sig at blive enige.",
    },
    points: {
      title: "Point",
      body: "Du får 1 point, hver runde du stemmer på en kamæleon — også selvom kamæleonen alligevel slipper væk. En kamæleon, der overlever runden, får 2 point. Efter hver runde kan du se din pointændring på resultatskærmen.",
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

  // Screen-reader announcements (live region)
  a11yYourTurn: "Det er din tur til at give et spor.",
  a11yWaitingTurn: "{name} giver et spor.",
  a11yClueCount: "{done} af {total} spor givet.",
  a11yVotePhase: "Afstemning i gang. {done} af {total} har stemt.",
  a11yYouVoted: "Din stemme er afgivet.",
  a11yRevealPhase: "Se din rolle. {ready} af {total} er klar.",
  a11yDiscussPhase: "Diskussion. Alle spor er givet.",
  a11yResultCrew: "Kamæleonen blev fanget.",
  a11yResultImposters: "Kamæleonen slap væk.",

  // Crash / error boundary
  crashTitle: "Noget gik galt",
  crashBody: "Appen løb ind i en fejl. Prøv at genindlæse — dit spil kører videre.",
  crashReload: "Genindlæs",

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
