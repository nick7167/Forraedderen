// Built-in Danish question pairs for the "questions" game mode.
//
// Each pair is a CREW question + a related-but-different IMPOSTER question.
// There are no categories — pairs are drawn from one flat pool. There are no
// predefined answers either: players write their own one-word answer.
//
// Authoring rules (so the imposter blends by format and is only caught by the
// *content* of their answer):
//   1. Every question must have a ONE-WORD / single-value answer.
//   2. The crew and imposter questions must demand the SAME answer TYPE
//      (number↔number, name↔name, color↔color, …) — but never the same question.
//   3. Keep every `crew` question unique.
//   4. ALL questions must be subjective, personal, or behavior-based (NO trivia).
//
// Stored on a round as: secretWord = crew question, decoyWord = imposter
// question (category is left empty for this mode).

export type QuestionPair = {
  crew: string;
  imposter: string;
};

export const QUESTION_PAIRS: QuestionPair[] = [
  // Originale par
  {
    crew: "Hvor mange timer sov du i nat?",
    imposter: "Hvor mange kopper kaffe drikker du om dagen?",
  },
  {
    crew: "Hvor mange par sko ejer du?",
    imposter: "Hvor mange puder har du i din seng?",
  },
  {
    crew: "Hvor gammel var du, da du fik din første mobil?",
    imposter: "Hvor mange lande har du besøgt?",
  },
  {
    crew: "Hvad er din yndlingsårstid?",
    imposter: "I hvilken årstid har du fødselsdag?",
  },
  {
    crew: "Hvilken årstid fryser du mest om?",
    imposter: "Hvilken årstid rejser du helst i?",
  },
  {
    crew: "Hvad er din yndlingsfarve?",
    imposter: "Hvilken farve er din yndlingstrøje?",
  },
  {
    crew: "Hvilken farve er din hoveddør?",
    imposter: "Hvilken farve er dit værelse?",
  },
  {
    crew: "Hvad spiste du til morgenmad?",
    imposter: "Hvad ville du ønske, du fik til morgenmad?",
  },
  {
    crew: "Hvad er din yndlingsret?",
    imposter: "Hvilken ret kan du slet ikke lide?",
  },
  {
    crew: "Hvad er din yndlingsfrugt?",
    imposter: "Hvilken frugt kan du ikke lide?",
  },
  {
    crew: "Hvilket land vil du helst rejse til?",
    imposter: "Hvilket land har du senest besøgt?",
  },
  {
    crew: "Hvilken by vil du helst bo i?",
    imposter: "Hvilken by er du født i?",
  },
  {
    crew: "Hvilken ugedag kan du bedst lide?",
    imposter: "Hvilken ugedag glæder du dig mindst til?",
  },
  {
    crew: "Hvad drikker du om morgenen?",
    imposter: "Hvad drikker du, når du skal slappe af?",
  },
  {
    crew: "Hvilket kæledyr vil du helst have?",
    imposter: "Hvilket dyr er du mest bange for?",
  },
  {
    crew: "Hvilket vildt dyr synes du er flottest?",
    imposter: "Hvilket dyr ville du helst være?",
  },
  {
    crew: "Hvilken sport ser du helst?",
    imposter: "Hvilken sport dyrker du selv?",
  },
  {
    crew: "Hvad laver du helst i weekenden?",
    imposter: "Hvad laver du, når du keder dig?",
  },

  // Vaner, tal og mængder
  {
    crew: "Hvor mange gange trykker du typisk snooze om morgenen?",
    imposter: "Hvor mange kopper kaffe drikker du før frokost?",
  },
  {
    crew: "Hvor mange gange om måneden spiser du fastfood?",
    imposter: "Hvor mange gange om ugen træner du reelt?",
  },
  {
    crew: "Hvor mange par sko bruger du til hverdag?",
    imposter: "Hvor mange jakker hænger der i din entré?",
  },
  {
    crew: "Hvor mange ubesvarede beskeder har du cirka på din telefon lige nu?",
    imposter: "Hvor mange apps bruger du faktisk dagligt?",
  },
  {
    crew: "Hvor mange kærester har du haft i dit liv?",
    imposter: "Hvor mange lande har du boet eller arbejdet i?",
  },
  {
    crew: "Hvor mange dage om ugen føler du dig helt udhvilet?",
    imposter: "Hvor mange dage om ugen spiser du slik eller kage?",
  },
  {
    crew: "Hvor mange tatoveringer overvejer du at få (eller har du allerede)?",
    imposter: "Hvor mange knogler har du brækket gennem tiden?",
  },
  {
    crew: "Hvor mange streamingtjenester betaler du for lige nu?",
    imposter: "Hvor mange abonnementer har du glemt at afmelde?",
  },
  {
    crew: "Hvor mange timer kan du maksimalt holde ud at være til en vild fest?",
    imposter: "Hvor mange timer drømmer du om at sove på en søndag?",
  },
  {
    crew: "Hvor mange gange om ugen kigger du dig grundigt i spejlet?",
    imposter: "Hvor mange gange om ugen stikker du en hvid løgn?",
  },
  {
    crew: "Hvor mange stueplanter har du dræbt det seneste år?",
    imposter: "Hvor mange bøger har du læst færdig i år?",
  },
  {
    crew: "Hvor mange børn drømmer du om at få (eller har du)?",
    imposter: "Hvor mange kæledyr ville du ønske, du havde plads til?",
  },
  {
    crew: "Hvor mange kilometer kan du løbe lige nu uden pause?",
    imposter: "Hvor mange kilometer har du cirka til dit arbejde eller studie?",
  },
  {
    crew: "Hvor mange gange i dit liv har du været rigtigt forelsket?",
    imposter: "Hvor mange gange har du skiftet frisure drastisk?",
  },
  {
    crew: "Hvor mange gange om måneden spiser du på restaurant?",
    imposter: "Hvor mange gange om måneden bager du noget fra bunden?",
  },
  {
    crew: "Hvor mange timer bruger du dagligt på sociale medier?",
    imposter: "Hvor mange timer ser du tv på en gennemsnitlig hverdagsaften?",
  },
  {
    crew: "Hvor mange gange om året er du typisk syg?",
    imposter: "Hvor mange gange om året holder du ferie i udlandet?",
  },
  {
    crew: "Hvor mange gange har du mistet din telefon?",
    imposter: "Hvor mange gange har du spærret dit dankort?",
  },
  {
    crew: "Hvor mange ex-kærester har du stadig kontakt med?",
    imposter: "Hvor mange af dine kollegaer ses du med privat?",
  },
  {
    crew: "Hvor mange timer bruger du typisk på at gøre rent om ugen?",
    imposter: "Hvor mange timer om ugen overvejer du at få en rengøringshjælp?",
  },

  // Farver i hverdagen
  {
    crew: "Hvilken farve har den tandbørste, du bruger lige nu?",
    imposter: "Hvilken farve er der mest af i din garderobe?",
  },
  {
    crew: "Hvilken farve har din absolutte yndlingstrøje?",
    imposter: "Hvilken farve har det sengetøj, du oftest sover i?",
  },
  {
    crew: "Hvilken farve er din yndlingskop derhjemme?",
    imposter: "Hvilken farve har din foretrukne vinterjakke?",
  },
  {
    crew: "Hvilken farve har sofaen hjemme i din stue?",
    imposter: "Hvilken farve drømmer du om at male dit soveværelse?",
  },
  {
    crew: "Hvilken farve ville du aldrig nogensinde tage på til en fest?",
    imposter: "Hvilken farve forbinder du allermest med stress?",
  },
  {
    crew: "Hvilken farve har de sko, du går mest i for tiden?",
    imposter: "Hvilken farve har din hverdagstaske eller rygsæk?",
  },
  {
    crew: "Hvilken farve beskriver bedst din personlighed?",
    imposter: "Hvilken farve forbinder du med ro og afslapning?",
  },
  {
    crew: "Hvilken farve har den bil, du oftest befinder dig i?",
    imposter: "Hvilken farve ville du vælge, hvis du skulle købe en sportsvogn?",
  },
  {
    crew: "Hvilken farve synes du, klæder dig allerbedst?",
    imposter: "Hvilken farve er det meste af dit undertøj?",
  },
  {
    crew: "Hvilken farve har stellet på din cykel?",
    imposter: "Hvilken farve har din hoveddør udenpå?",
  },

  // "Hvem i rummet..." (relationer og vurderinger)
  {
    crew: "Hvem i rummet er mest stædig under en diskussion?",
    imposter: "Hvem i rummet kommer oftest for sent til en aftale?",
  },
  {
    crew: "Hvem i rummet er den største flirt i byen?",
    imposter: "Hvem i rummet er mest tilbøjelig til at snuble over sine egne ben?",
  },
  {
    crew: "Hvem i rummet er absolut bedst til at holde en hemmelighed?",
    imposter: "Hvem i rummet vil du betegne som den mest loyale ven?",
  },
  {
    crew: "Hvem i rummet bruger flest penge på mærkevaretøj?",
    imposter: "Hvem i rummet har den dyreste smag, når det gælder mad?",
  },
  {
    crew: "Hvem i rummet ville overleve længst alene i ødemarken?",
    imposter: "Hvem i rummet er det største konkurrencemenneske i brætspil?",
  },
  {
    crew: "Hvem i rummet tager flest selfies på en bytur?",
    imposter: "Hvem i rummet er mest aktiv og synlig på Instagram?",
  },
  {
    crew: "Hvem i rummet er den mest kræsne, når I spiser ude?",
    imposter: "Hvem i rummet fryser altid og klager over kulden?",
  },
  {
    crew: "Hvem i rummet har generelt den dårligste musiksmag?",
    imposter: "Hvem i rummet tror du, synger højest (og falskest) i badet?",
  },
  {
    crew: "Hvem i rummet griner oftest på upassende tidspunkter?",
    imposter: "Hvem i rummet har den mest larmende og smitsomme latter?",
  },
  {
    crew: "Hvem i rummet starter oftest en joke, der falder til jorden?",
    imposter: "Hvem i rummet elsker sladder og drama allermest?",
  },
  {
    crew: "Hvem i rummet sover tungest og er umulig at vække?",
    imposter: "Hvem i rummet brokker sig mest over at være træt?",
  },
  {
    crew: "Hvem i rummet kunne realistisk set finde på at blive veganer i morgen?",
    imposter: "Hvem i rummet går mest op i at spise sundt?",
  },
  {
    crew: "Hvem i rummet bander allermest i hverdagen?",
    imposter: "Hvem i rummet har den korteste lunte i trafikken?",
  },
  {
    crew: "Hvem i rummet er den største romantiker?",
    imposter: "Hvem i rummet græder lettest under en sørgelig film?",
  },
  {
    crew: "Hvem i rummet giver generelt de bedste og mest modne råd?",
    imposter: "Hvem i rummet virker ældst af sind?",
  },
  {
    crew: "Hvem i rummet er den dårligste taber?",
    imposter: "Hvem i rummet kunne bedst finde på at snyde lidt i et spil?",
  },
  {
    crew: "Hvem i rummet bruger morgenen længst tid foran spejlet?",
    imposter: "Hvem i rummet går mest op i sin hudplejerutine?",
  },
  {
    crew: "Hvem i rummet ville du ringe til for at få hjælp til at samle et IKEA-skab?",
    imposter: "Hvem i rummet er mest praktisk anlagt med en skruemaskine?",
  },
  {
    crew: "Hvem i rummet kigger oftest på sin mobil, når I er samlet?",
    imposter: "Hvem i rummet er dårligst til at svare på beskeder?",
  },
  {
    crew: "Hvem i rummet drikker hurtigst sin øl eller drink?",
    imposter: "Hvem i rummet er mest tilbøjelig til at falde i søvn til festen?",
  },

  // Mad og drikke (subjektive præferencer)
  {
    crew: "Hvad er din absolutte livret, når du virkelig skal forkæles?",
    imposter: "Hvad bestiller du altid, når du har alvorlige tømmermænd?",
  },
  {
    crew: "Hvad er dit foretrukne pålæg på en flad rugbrødsmad?",
    imposter: "Hvad lugter allerværst i et køleskab?",
  },
  {
    crew: "Hvilken sodavand bestiller du oftest, hvis du er tørstig?",
    imposter: "Hvilken drik giver dig flest mavekneb?",
  },
  {
    crew: "Hvilken type ost kan du allerbedst lide?",
    imposter: "Hvad spiser du principielt aldrig, fordi konsistensen er klam?",
  },
  {
    crew: "Hvad er din faste go-to snack fredag aften?",
    imposter: "Hvad er den mest irriterende og larmende snack at sidde ved siden af i biografen?",
  },
  {
    crew: "Hvilken grøntsag fylder mest i dit køkken?",
    imposter: "Hvilken grøntsag piller du konsekvent ud af en ret?",
  },
  {
    crew: "Hvilken type is vælger du altid i vaffelbageriet?",
    imposter: "Hvad er den mest skuffende smag at finde i en æske chokolade?",
  },
  {
    crew: "Hvad drikker du allerhelst for at skyde en god fest i gang?",
    imposter: "Hvad drak du, da du kastede op efter en fest for første gang?",
  },
  {
    crew: "Hvilken type kage har du sværest ved at sige nej til?",
    imposter: "Hvad er den mest tørre og skuffende dessert, der findes?",
  },
  {
    crew: "Hvilken frugt synes du er allermest besværlig at skrælle eller spise?",
    imposter: "Hvilken frugt napper du oftest med på farten?",
  },
  {
    crew: "Hvad smører du typisk under dit pålæg?",
    imposter: "Hvad kunne du aldrig drømme om at putte i en burger?",
  },
  {
    crew: "Hvad er det absolut bedste at dyppe sine pommes frites i?",
    imposter: "Hvad smager overraskende godt på en pizza, selvom mange hader det?",
  },
  {
    crew: "Hvad spiser du oftest, hvis du spiser sen natmad?",
    imposter: "Hvad spiser du oftest til morgenmad på en stresset mandag?",
  },
  {
    crew: "Hvilken smagsvariant er din yndlings-te?",
    imposter: "Hvad smager mest af parfume og sæbe ifølge dine smagsløg?",
  },
  {
    crew: "Hvilket bær glæder du dig mest til om sommeren?",
    imposter: "Hvad fylder ofte alt for meget i en billig smoothie?",
  },
  {
    crew: "Hvilken fastfoodkæde er din svaghed?",
    imposter: "Hvor har du fået den dårligste madoplevelse for nylig?",
  },
  {
    crew: "Hvad spiser du oftest til frokost på en arbejdsdag?",
    imposter: "Hvad tager du med i madpakken, når du absolut ingen fantasi har?",
  },
  {
    crew: "Hvilken slags kød foretrækker du på grillen?",
    imposter: "Hvilket kødstykke synes du oftest bliver tørt og kedeligt?",
  },
  {
    crew: "Hvad er det dyreste, du plejer at bestille på en menu?",
    imposter: "Hvad spiser du, når det er sidst på måneden, og kontoen er tom?",
  },
  {
    crew: "Hvilken krydderurt bruger du oftest i din madlavning?",
    imposter: "Hvad smager konsekvent af jord ifølge dig?",
  },

  // Dyr, ting og associationer
  {
    crew: "Hvilket kæledyr synes du er det mest fantastiske selskab?",
    imposter: "Hvilket dyr lugter værst at have gående i et hjem?",
  },
  {
    crew: "Hvilket dyr er du allermest bange for at støde på?",
    imposter: "Hvilket dyr synes du, klammer sig mest desperat til sin ejer?",
  },
  {
    crew: "Hvilket vildt dyr fascinerer dig mest, når du ser naturprogrammer?",
    imposter: "Hvilket dyr ville du vælge som dit personlige åndedyr?",
  },
  {
    crew: "Hvilket insekt kan give dig det værste panikanfald?",
    imposter: "Hvilket krybdyr giver dig allermest myrekryb at se på?",
  },
  {
    crew: "Hvilket dyr minder dig om en gnaven, ældre mand?",
    imposter: "Hvilket dyr ser konstant træt og ugideligt ud?",
  },
  {
    crew: "Hvilket stykke tøj tager du absolut først på om morgenen?",
    imposter: "Hvad er det første stykke tøj, du smider, når du kommer træt hjem?",
  },
  {
    crew: "Hvad er den første app, du tjekker på din telefon hver morgen?",
    imposter: "Hvilken app stjæler allermest af din fritid generelt?",
  },
  {
    crew: "Hvilket møbel i dit hjem elsker du at slænge dig i?",
    imposter: "Hvor lægger du dig oftest for at slå mave efter et stort måltid?",
  },
  {
    crew: "Hvad glemmer du oftest at få med, når du stresser ud ad døren?",
    imposter: "Hvad har du oftest mistet eller glemt i byen på en fuld aften?",
  },
  {
    crew: "Hvad pakker du altid som det allervigtigste i din kuffert?",
    imposter: "Hvad er det mest overvurderede at slæbe med på ferie?",
  },
  {
    crew: "Hvad bruger du typisk til at vaske dit ansigt med?",
    imposter: "Hvad er den blødeste tekstil, du har liggende på dit badeværelse?",
  },
  {
    crew: "Hvad er det mest uundværlige redskab i hele dit køkken?",
    imposter: "Hvad er det farligste objekt at vaske op i hånden?",
  },
  {
    crew: "Hvad er den genstand på dit skrivebord, du rører alleroftest?",
    imposter: "Hvad samler helt ekstremt meget støv hjemme hos dig?",
  },
  {
    crew: "Hvad bruger du til at lukke larm ude, når du skal koncentrere dig?",
    imposter: "Hvad er dit dyreste stykke elektronik (udover din mobil)?",
  },
  {
    crew: "Hvilket smykke eller tilbehør bærer du stort set hver dag?",
    imposter: "Hvad er den mest personlige gave, du bærer på dig lige nu?",
  },

  // Steder, følelser og beskrivende ord
  {
    crew: "Hvilket ord beskriver bedst din nuværende sindstilstand?",
    imposter: "Hvilket ord beskriver bedst vejret udenfor netop nu?",
  },
  {
    crew: "Hvor i verden har du haft din allermest fantastiske ferie?",
    imposter: "Hvor drømmer du mest om at flygte hen lige nu?",
  },
  {
    crew: "Hvilket rum i dit hus synes du er det mest hyggelige?",
    imposter: "Hvor sætter du dig oftest for at fordybe dig i en god bog eller serie?",
  },
  {
    crew: "Hvilken by i Danmark synes du er den absolut smukkeste?",
    imposter: "Hvilken by vækker de stærkeste barndomsminder hos dig?",
  },
  {
    crew: "Hvilken årstid føler du dig mest frisk og produktiv i?",
    imposter: "Hvilken årstid synes du indbyder mest til lange, rolige gåture?",
  },
  {
    crew: "Hvilken ugedag føles konsekvent som ugens absolut længste?",
    imposter: "Hvilken ugedag er du oftest mest drænet for social energi?",
  },
  {
    crew: "Hvor på din krop er du allermest kilden?",
    imposter: "Hvor på kroppen er du oftest øm efter en lang, hård dag?",
  },
  {
    crew: "Hvilket ord beskriver bedst din arbejds- eller studieindsats i dag?",
    imposter: "Hvordan vil du med ét tillægsord beskrive din seneste bytur?",
  },
  {
    crew: "Hvilken overflade eller tekstur hader du at røre ved?",
    imposter: "Hvad er det mest ru og kradsende materiale, du ejer noget af?",
  },
  {
    crew: "Hvad er det absolut blødeste, du overhovedet kan forestille dig at røre ved?",
    imposter: "Hvad ligger dit hoved oftest på, når du virkelig skal koble af?",
  },
  {
    crew: "Hvilken specifik lugt minder dig øjeblikkeligt om din skoletid?",
    imposter: "Hvad er den mest syntetiske og kvalmende duft, du kender?",
  },
  {
    crew: "Hvor ville du bo, hvis du havde uendeligt mange penge?",
    imposter: "Hvor har du haft den mest luksuriøse oplevelse i dit liv?",
  },
  {
    crew: "Hvilket rum i dit hjem har det med at rode allermest?",
    imposter: "Hvor lægger du oftest breve og regninger, du ikke orker at åbne?",
  },
  {
    crew: "Hvor tager du hen, når du har brug for at være helt alene med dine tanker?",
    imposter: "Hvor i dit lokalområde føler du dig allermest afslappet?",
  },
  {
    crew: "Hvilket tillægsord beskriver bedst stemningen mandag morgen kl. 07:00?",
    imposter: "Hvordan har du det typisk i maven fem minutter inden en tandlægetid?",
  },
];
