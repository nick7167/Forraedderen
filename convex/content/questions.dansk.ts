import type { QuestionPair } from "./types";

// "Dansk kultur" — Spørgsmål rooted in Danish traditions, places and everyday
// habits. On by default; a host can switch the tier off for a table where not
// everyone grew up here.
//
// No brand names, company names or TV-programme titles — they are trademarks,
// they date fast, and many are regional. Traditions, dishes, institutions and
// shared habits carry the Danishness on their own.
//
// Same authoring rules as the family pool: ONE-WORD answer, crew and imposter
// demand the same TYPE of answer, and every question stands alone.

export const QUESTIONS_DANSK: QuestionPair[] = [
  // ——— Mad og drikke ———
  { crew: "Hvad har du oftest på dit rugbrød?", imposter: "Hvad har du oftest på din morgenmad?" },
  { crew: "Hvilket stykke smørrebrød vælger du først?", imposter: "Hvilket stykke smørrebrød lader du altid ligge?" },
  { crew: "Hvad er det bedste tilbehør til frikadeller?", imposter: "Hvad er det bedste tilbehør til flæskesteg?" },
  { crew: "Hvilken slags lakrids kan du bedst lide?", imposter: "Hvilken slags vingummi vælger du?" },
  { crew: "Hvad køber du altid i bageren?", imposter: "Hvad køber du altid i slagteren?" },
  { crew: "Hvad drikker du til en julefrokost?", imposter: "Hvad drikker du til en sommergrill?" },
  { crew: "Hvilken dansk ret ville du servere for en udlænding?", imposter: "Hvilken dansk ret ville du advare dem imod?" },
  { crew: "Hvad skal der på en hotdog?", imposter: "Hvad skal der på en burger?" },
  { crew: "Hvilken kage hører til en fødselsdag?", imposter: "Hvilken kage hører til en søndag?" },
  { crew: "Hvad spiser du juleaften?", imposter: "Hvad spiser du nytårsaften?" },
  { crew: "Hvilken slags sild kan du lide?", imposter: "Hvilken slags ost tager du til frokost?" },
  { crew: "Hvad er den bedste danske sommermad?", imposter: "Hvad er den bedste danske vintermad?" },
  { crew: "Hvor mange kopper kaffe drikker du på et arbejde?", imposter: "Hvor mange gange holder du kagepause om ugen?" },
  { crew: "Hvad tager du med til en fælles frokost?", imposter: "Hvad tager du med til et sommerhus?" },
  { crew: "Hvilken slags øl vælger du?", imposter: "Hvilken slags snaps kan du holde ud?" },
  { crew: "Hvad er det bedste ved en pølsevogn?", imposter: "Hvad er det bedste ved en isbod?" },

  // ——— Højtider og traditioner ———
  { crew: "Hvad er din bedste juletradition?", imposter: "Hvad er din bedste nytårstradition?" },
  { crew: "Hvilken julesang synger du helst?", imposter: "Hvilken julesang gider du ikke mere?" },
  { crew: "Hvad ønsker du dig altid til jul?", imposter: "Hvad giver du oftest i julegave?" },
  { crew: "Hvornår sætter du juletræet op?", imposter: "Hvornår tager du det ned igen?" },
  { crew: "Hvad klædte du dig ud som til fastelavn?", imposter: "Hvad klædte du dig ud som til halloween?" },
  { crew: "Hvad laver du sankthansaften?", imposter: "Hvad laver du grundlovsdag?" },
  { crew: "Hvad fik du i konfirmationsgave?", imposter: "Hvad fik du i studentergave?" },
  { crew: "Hvilken højtid glæder du dig mest til?", imposter: "Hvilken højtid kunne du godt springe over?" },
  { crew: "Hvad synger I til fødselsdage i din familie?", imposter: "Hvad serverer I altid til fødselsdage?" },
  { crew: "Hvor mange julefrokoster er du til om året?", imposter: "Hvor mange fødselsdage skal du huske?" },
  { crew: "Hvad er det bedste ved påsken?", imposter: "Hvad er det bedste ved pinsen?" },
  { crew: "Hvem i gruppen er mest julemenneske?", imposter: "Hvem i gruppen holder mest af sommeren?" },

  // ——— Steder og geografi ———
  { crew: "Hvilken dansk by ville du flytte til?", imposter: "Hvilken dansk by har du besøgt flest gange?" },
  { crew: "Hvilken landsdel føler du dig mest hjemme i?", imposter: "Hvilken landsdel kender du dårligst?" },
  { crew: "Hvad er det bedste sted i Danmark om sommeren?", imposter: "Hvad er det bedste sted i Danmark om vinteren?" },
  { crew: "Hvilken dansk ø ville du gerne besøge?", imposter: "Hvilken dansk strand er den bedste?" },
  { crew: "Hvad hedder den by, du er vokset op i?", imposter: "Hvad hedder den by, du bor i nu?" },
  { crew: "Hvilken dansk seværdighed har du aldrig set?", imposter: "Hvilken dansk seværdighed er overvurderet?" },
  { crew: "Hvor tager din familie hen i sommerferien?", imposter: "Hvor tager I hen, når I skal på weekendtur?" },
  { crew: "Hvilken bro eller færge bruger du oftest?", imposter: "Hvilken motorvej kører du mest på?" },
  { crew: "Hvor mange år har du boet længst ét sted?", imposter: "Hvor mange steder har du boet i alt?" },
  { crew: "Hvilken dansk skov eller strand går du tur i?", imposter: "Hvilken park bruger du mest?" },

  // ——— Vejr og årstider ———
  { crew: "Hvad gør du, når det regner en hel weekend?", imposter: "Hvad gør du på årets første solskinsdag?" },
  { crew: "Hvilken måned er den mest deprimerende i Danmark?", imposter: "Hvilken måned er den mest hyggelige?" },
  { crew: "Hvad tager du på, når det blæser?", imposter: "Hvad tager du på, når det bare småregner?" },
  { crew: "Hvornår tænder du lys for første gang om efteråret?", imposter: "Hvornår sætter du havemøblerne ud om foråret?" },
  { crew: "Hvad er den bedste ting ved dansk vinter?", imposter: "Hvad er den værste ting ved dansk sommer?" },
  { crew: "Hvor mange dage med sne får vi i år?", imposter: "Hvor mange gode sommerdage får vi i år?" },

  // ——— Hverdag, samfund og vaner ———
  { crew: "Hvad er den mest danske ting, du gør hver dag?", imposter: "Hvad er den mest danske ting, du ejer?" },
  { crew: "Hvad brokker du dig oftest over?", imposter: "Hvad roser du oftest?" },
  { crew: "Hvad køber du altid, når du er i supermarkedet?", imposter: "Hvad glemmer du altid at købe?" },
  { crew: "Hvad gør du, når naboen larmer?", imposter: "Hvad gør du, når naboen beder om en tjeneste?" },
  { crew: "Hvad tager du med til et fællesarrangement?", imposter: "Hvad melder du dig frivilligt til?" },
  { crew: "Hvilket transportmiddel tager du på arbejde?", imposter: "Hvilket transportmiddel tager du i weekenden?" },
  { crew: "Hvad gør du, mens du venter på toget?", imposter: "Hvad gør du, mens du sidder i bilkø?" },
  { crew: "Hvor mange gange om ugen cykler du?", imposter: "Hvor mange gange om ugen går du en tur?" },
  { crew: "Hvad har du i din kolonihave eller på din altan?", imposter: "Hvad ville du plante, hvis du havde en have?" },
  { crew: "Hvad afleverer du oftest på genbrugspladsen?", imposter: "Hvad gemmer du, selvom du burde smide det ud?" },
  { crew: "Hvilken forening eller klub har du været med i?", imposter: "Hvilken sport gik du til som barn?" },
  { crew: "Hvad siger du, når du møder en nabo i opgangen?", imposter: "Hvad siger du, når du forlader en butik?" },
  { crew: "Hvor mange gange har du flyttet inden for Danmark?", imposter: "Hvor mange adresser har du haft?" },
  { crew: "Hvad er det mest typiske danske småsnak-emne?", imposter: "Hvad taler du om, når du ikke ved hvad du skal sige?" },

  // ——— Skole, ungdom og opvækst ———
  { crew: "Hvad var dit yndlingsfag i folkeskolen?", imposter: "Hvad var det fag, du sprang over flest gange?" },
  { crew: "Hvad lavede du i frikvarteret?", imposter: "Hvad havde du med i madpakken?" },
  { crew: "Hvad tog du på efterskole eller gymnasiet?", imposter: "Hvad var din første uddannelse efter skolen?" },
  { crew: "Hvad var dit første fritidsjob?", imposter: "Hvad var din første rigtige løn brugt på?" },
  { crew: "Hvem var din bedste lærer?", imposter: "Hvem var din bedste ven i skolen?" },
  { crew: "Hvad lavede du til din sidste skoledag?", imposter: "Hvad lavede du på din studenterkørsel?" },
  { crew: "Hvor mange år gik du på samme skole?", imposter: "Hvor mange klassekammerater har du stadig kontakt til?" },

  // ——— Hjem og hygge ———
  { crew: "Hvad er det hyggeligste rum i dit hjem?", imposter: "Hvad er det mest praktiske rum i dit hjem?" },
  { crew: "Hvad tænder du, når det skal være hyggeligt?", imposter: "Hvad sætter du på, når du vil slappe af?" },
  { crew: "Hvilket dansk møbel ville du gerne eje?", imposter: "Hvilken lampe har du derhjemme?" },
  { crew: "Hvad står der altid på dit sofabord?", imposter: "Hvad står der altid i din vindueskarm?" },
  { crew: "Hvad gør din bolig til dit hjem?", imposter: "Hvad savner du ved dit barndomshjem?" },
  { crew: "Hvor mange stearinlys brænder du på en vinteruge?", imposter: "Hvor mange tæpper har du liggende i stuen?" },
  { crew: "Hvad laver du, når gæsterne er gået?", imposter: "Hvad laver du, lige inden gæsterne kommer?" },

  // ——— Gruppen, dansk stil ———
  { crew: "Hvem i gruppen ville trives bedst i et sommerhus en uge?", imposter: "Hvem i gruppen ville kede sig først på landet?" },
  { crew: "Hvem i gruppen er bedst til at holde en tale?", imposter: "Hvem i gruppen ville skrive en festsang?" },
  { crew: "Hvem i gruppen ville cykle i regnvejr uden at klage?", imposter: "Hvem i gruppen tager altid en taxa?" },
  { crew: "Hvem i gruppen laver den bedste brune sovs?", imposter: "Hvem i gruppen bager bedst?" },
  { crew: "Hvem i gruppen ville hoppe i havet i januar?", imposter: "Hvem i gruppen fryser altid?" },
  { crew: "Hvem i gruppen er mest hyggelig at drikke kaffe med?", imposter: "Hvem i gruppen taler mest til en middag?" },
  { crew: "Hvem i gruppen ville melde sig til en arbejdsdag?", imposter: "Hvem i gruppen ville finde en undskyldning?" },
  { crew: "Hvem i gruppen kender flest danske sange udenad?", imposter: "Hvem i gruppen synger højest til en fest?" },

  // ——— Blandet dansk ———
  { crew: "Hvad er den mest danske undskyldning for at aflyse?", imposter: "Hvad er den mest danske grund til at komme for sent?" },
  { crew: "Hvilken dansk vane ville du savne i udlandet?", imposter: "Hvilken dansk ret ville du savne mest?" },
  { crew: "Hvad tager du med, når du skal til fest i et forsamlingshus?", imposter: "Hvad tager du med til en fælles grillaften?" },
  { crew: "Hvilket dansk ord er sværest at forklare?", imposter: "Hvilket dansk ord bruger du oftest?" },
  { crew: "Hvad er det bedste ved en dansk sommeraften?", imposter: "Hvad er det bedste ved en dansk vinteraften?" },
  { crew: "Hvad drikker du til en fodboldkamp?", imposter: "Hvad spiser du foran en håndboldkamp?" },
  { crew: "Hvilken dansk tradition ville du eksportere?", imposter: "Hvilken udenlandsk tradition ville du hente hjem?" },
  { crew: "Hvad gør du på en fridag i november?", imposter: "Hvad gør du på en fridag i juni?" },
  { crew: "Hvor mange gange om året spiser du flæskesteg?", imposter: "Hvor mange gange om året spiser du sild?" },
  { crew: "Hvem i gruppen er mest typisk dansk?", imposter: "Hvem i gruppen ville trives bedst i udlandet?" },
  { crew: "Hvad er det bedste danske slik?", imposter: "Hvad er den bedste danske kage?" },
  { crew: "Hvad pakker du altid til et sommerhus?", imposter: "Hvad er det sidste, du gør inden I kører hjem?" },
  { crew: "Hvilket dansk landskab holder du mest af?", imposter: "Hvilken dansk kyst er den flotteste?" },
  { crew: "Hvad er den mest overvurderede danske ret?", imposter: "Hvad er den mest undervurderede danske ret?" },
  { crew: "Hvad gør du, hvis der er udsalg i byen?", imposter: "Hvad gør du, hvis der er loppemarked i weekenden?" },
  { crew: "Hvilken dansk højtid har den bedste mad?", imposter: "Hvilken dansk højtid har den bedste stemning?" },
  { crew: "Hvad hedder din yndlingssøndagstur?", imposter: "Hvad hedder det sted, du helst går hen om sommeren?" },
  { crew: "Hvem i gruppen ville arrangere en fælles middag?", imposter: "Hvem i gruppen ville komme med kagen?" },

  // ——— Endnu mere dansk ———
  { crew: "Hvad er den mest danske form for hygge?", imposter: "Hvad er den mest danske form for pligt?" },
  { crew: "Hvad ville du vise en gæst fra udlandet først?", imposter: "Hvad ville du advare dem om?" },
  { crew: "Hvad er det bedste ved et dansk sommerhus?", imposter: "Hvad er det værste ved et dansk sommerhus?" },
  { crew: "Hvad tager du med til en skovtur?", imposter: "Hvad tager du med til stranden?" },
  { crew: "Hvad er det mest danske svar på hvordan går det?", imposter: "Hvad er det mest ærlige svar, du kunne give?" },
  { crew: "Hvilken dansk drik hører til en fest?", imposter: "Hvilken dansk drik hører til en hverdag?" },
  { crew: "Hvad gør du, når der er fælles arbejdsdag i foreningen?", imposter: "Hvad gør du, når der er beboermøde?" },
  { crew: "Hvad er det bedste ved den danske vinterferie?", imposter: "Hvad er det bedste ved efterårsferien?" },
  { crew: "Hvilken dansk by har den bedste stemning?", imposter: "Hvilken dansk by er mest undervurderet?" },
  { crew: "Hvor mange gange om året er du i sommerhus?", imposter: "Hvor mange gange om året er du på campingtur?" },
  { crew: "Hvad laver du juledag?", imposter: "Hvad laver du nytårsdag?" },
  { crew: "Hvem i gruppen ville lave den bedste julefrokost?", imposter: "Hvem i gruppen ville rydde op bagefter?" },

  { crew: "Hvad er den mest danske ting at brokke sig over?", imposter: "Hvad er den mest danske ting at være stolt af?" },
  { crew: "Hvilken dansk måned har det bedste vejr?", imposter: "Hvilken dansk måned har den bedste stemning?" },
  { crew: "Hvad drikker du, når du fryser?", imposter: "Hvad spiser du, når det er koldt udenfor?" },
  { crew: "Hvad er det mest hyggelige danske sted?", imposter: "Hvad er det mest smukke danske sted?" },
  { crew: "Hvilket dansk måltid ville du lave til en fest?", imposter: "Hvilket dansk måltid laver du til hverdag?" },
  { crew: "Hvad tager du med, når du besøger familien?", imposter: "Hvad tager du med, når du besøger en ven?" },
  { crew: "Hvor mange gange om året går du til en fest med sang?", imposter: "Hvor mange gange om året holder du tale?" },
  { crew: "Hvem i gruppen kender flest steder i Danmark?", imposter: "Hvem i gruppen har rejst længst væk?" },
];
