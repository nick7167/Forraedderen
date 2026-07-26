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

const QUESTION_PAIRS_EXTRA: QuestionPair[] = [
  // Originale par
  {
    crew: "Hvor mange uåbnede faner har du åbne i din browser på mobilen?",
    imposter: "Hvor mange apps har du installeret, som du aldrig har åbnet?",
  },
  {
    crew: "Hvem i gruppen ville ende på skadestuen på den dummeste måde?",
    imposter: "Hvem i gruppen er mest tilbøjelig til at få en spontan skade under sport?",
  },
  {
    crew: "Hvor mange solbriller har du mistet eller trådt på i dit liv?",
    imposter: "Hvor mange paraplyer har du efterladt i toget eller bussen?",
  },
  {
    crew: "Hvem i gruppen ville udløse en brandalarm ved et uheld i køkkenet?",
    imposter: "Hvem i gruppen er mest tilbøjelig til at spilde rødvin på et hvidt tæppe?",
  },
  {
    crew: "Hvor mange gange om ugen spiser du mad direkte fra emballagen?",
    imposter: "Hvor mange gange om ugen genopvarmer du kaffe i mikroovnen?",
  },
  {
    crew: "Hvem i gruppen har den mest kaotiske natbords-skuffe?",
    imposter: "Hvem i gruppen har flest halvt tømte vandflasker stående på værelset?",
  },
  {
    crew: "Hvor mange ubesvarede beskeder har du i din familie-gruppechat?",
    imposter: "Hvor mange ulæste notifikationer har du på sociale medier lige nu?",
  },
  {
    crew: "Hvem i gruppen ville prøve at snakke sig ud af en fartbøde?",
    imposter: "Hvem i gruppen ville gå fuldstændig i panik hvis de fik en parkeringsbøde?",
  },
  {
    crew: "Hvor mange par uslidte strømper har du bagerst i din skuffe?",
    imposter: "Hvor mange slidte t-shirts nægter du at smide ud?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at synge operasang på toilettet?",
    imposter: "Hvem i gruppen nynner altid på den samme irriterende sang?",
  },
  {
    crew: "Hvor mange minutter kan du køre på bilens reservetank før du går i panik?",
    imposter: "Hvor mange procent strøm har din mobil før du panikker og leder efter en oplader?",
  },
  {
    crew: "Hvem i gruppen ville prøve at spise noget udløbet mad for at bevise det var ok?",
    imposter: "Hvem i gruppen smider mad ud dagen før udløbsdatoen for en sikkerheds skyld?",
  },
  {
    crew: "Hvor mange gange har du lades som om du sov i et offentligt transportmiddel?",
    imposter: "Hvor mange gange har du overhørt dit stoppested fordi du hørte musik?",
  },
  {
    crew: "Hvem i gruppen har de mest bizar-kombinerede natmads-snacks?",
    imposter: "Hvem i gruppen ville spise kold pizza til morgenmad tre dage i træk?",
  },
  {
    crew: "Hvor mange gange har du taget fejl af sukker og salt under madlavning?",
    imposter: "Hvor mange gange har du glemt en pizza i ovnen, så den blev kulsvart?",
  },
  {
    crew: "Hvem i gruppen ville overbevise et helt selskab om en opdigtet røverhistorie?",
    imposter: "Hvem i gruppen er dårligst til at holde masken, når der bliver fortalt en løgn?",
  },
  {
    crew: "Hvor mange glemte genstande har du bagerst i din fryser?",
    imposter: "Hvor mange glas syltede ting har du stående i bunden af dit køleskab?",
  },
  {
    crew: "Hvem i gruppen ville gå amok på et loppemarked og købe noget helt ubrugeligt?",
    imposter: "Hvem i gruppen er mest tilbøjelig til at prutte om prisen i en helt almindelig butik?",
  },
  {
    crew: "Hvor mange gange har du gennemsøgt hele huset efter noget du holdt i hånden?",
    imposter: "Hvor mange gange har du ledt efter din telefon mens du talte i den?",
  },
  {
    crew: "Hvem i gruppen ville bruge alle sine lommepenge på en forlystelsespark på én dag?",
    imposter: "Hvem i gruppen nægter at prøve de vilde forlystelser i Tivoli?",
  },
  {
    crew: "Hvor mange tøjklemmer eller elastikker har du liggende i din skuffe?",
    imposter: "Hvor mange genanvendelige poser har du samlet sammen under vasken?",
  },
  {
    crew: "Hvem i gruppen ville være den første til at fare vild i et stormagasin?",
    imposter: "Hvem i gruppen bruger længst tid på at læse menukortet på en restaurant?",
  },
  {
    crew: "Hvor mange gange har du tabt en shampoo-flaske ned over din tå i bruseren?",
    imposter: "Hvor mange gange har du skoldet dig på for varmt badevand?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at starte en vild dans i en stumfilm?",
    imposter: "Hvem i gruppen laver altid de mest dramatiske armbevægelser når de fortæller noget?",
  },
  {
    crew: "Hvor mange gange har du spist chips til aftensmad fordi du var for dopet til at lave mad?",
    imposter: "Hvor mange gange har du bestilt takeaway to gange på samme dag?",
  },
  {
    crew: "Hvem i gruppen ville glemme sin egen bagage på bagagebåndet i lufthavnen?",
    imposter: "Hvem i gruppen stiller op ved gate'n to timer før flyet boarder?",
  },
  {
    crew: "Hvor mange uåbnede vitaminpiller eller kosttilskud har du i skabet?",
    imposter: "Hvor mange forskellige slags te eller kaffe har du stående i dit køkken?",
  },
  {
    crew: "Hvem i gruppen har den mest højlydte og smittende grineanfald?",
    imposter: "Hvem i gruppen fniser altid på de mest upassende tidspunkter?",
  },
  {
    crew: "Hvor mange par handsker eller vanter har du mistet kun den ene af?",
    imposter: "Hvor mange paraplyer har du haft, som blæste vrangen ud i blæsevejr?",
  },
  {
    crew: "Hvem i gruppen ville prøve at tæmme et vildt dyr hvis de stødte på det?",
    imposter: "Hvem i gruppen ville hoppe op på en stol hvis de så en lille mus?",
  },
  {
    crew: "Hvor mange gange har du skrevet en lang besked og slettet den hele igen?",
    imposter: "Hvor mange gange har du fortrudt en besked i det sekund du trykkede send?",
  },
  {
    crew: "Hvem i gruppen er den største udskydelses-konge, når der skal gøres rent?",
    imposter: "Hvem i gruppen sorterer sit vasketøj efter nøjagtige farvenuancer?",
  },
  {
    crew: "Hvor mange ubesvarede mails har du på din private mailadresse?",
    imposter: "Hvor mange spam-mails sletter du om dagen uden at åbne dem?",
  },
  {
    crew: "Hvem i gruppen ville være den første til at falde over sine egne ben på flad vej?",
    imposter: "Hvem i gruppen går altid ind i dørkarme derhjemme?",
  },
  {
    crew: "Hvor mange gange har du trykket 'glemt adgangskode' i denne måned?",
    imposter: "Hvor mange forskellige koder har du prøvet før en konto blev spærret?",
  },
  {
    crew: "Hvem i gruppen tager de længste og mest luksuriøse karbade eller brusere?",
    imposter: "Hvem i gruppen bruger mest hårlak eller hårvoks før de går ud?",
  },
  {
    crew: "Hvor mange halvbrugte noter har du liggende i din note-app på mobilen?",
    imposter: "Hvor mange indkøbssedler har du lavet og derefter glemt at tage med i butikken?",
  },
  {
    crew: "Hvem i gruppen ville være den mest udholdende til en pubquiz?",
    imposter: "Hvem i gruppen gætter altid vildt forkert i et spil Trivial Pursuit?",
  },
  {
    crew: "Hvor mange gange har du prøvet at tænde fjernsynet med din mobil i stedet for fjernbetjeningen?",
    imposter: "Hvor mange gange har du ledt efter fjernbetjeningen mens den lå under dig i sofaen?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at købe matchende tøj til sit kæledyr?",
    imposter: "Hvem i gruppen taler til sine stueplanter som om de var mennesker?",
  },
  {
    crew: "Hvor mange gange har du tabt noget spiseligt på gulvet og brugt 5-sekunders-reglen?",
    imposter: "Hvor mange gange har du pustet på et stykke mad og spist det alligevel?",
  },
  {
    crew: "Hvem i gruppen ville hurtigst kunne gennemskue et magisk trick?",
    imposter: "Hvem i gruppen bliver altid fuldstændig blæst bagover af simple tryllekunstner?",
  },
  {
    crew: "Hvor mange uåbnede breve fra banken eller det offentlige har du liggende?",
    imposter: "Hvor mange kvitteringer gemmer du i din pung, som du aldrig får brug for?",
  },
  {
    crew: "Hvem i gruppen er den største snob når det kommer til kaffe eller vin?",
    imposter: "Hvem i gruppen kan absolut ikke smage forskel på en dyr og en billig vin?",
  },
  {
    crew: "Hvor mange gange har du haft en sang på hjernen i mere end tre dage i træk?",
    imposter: "Hvor mange gange har du sunget forkert på en sangtekst i flere år?",
  },
  {
    crew: "Hvem i gruppen ville være den mest tilbøjelige til at overleve en zombie-apokalypse?",
    imposter: "Hvem i gruppen ville overgive sig først til zombierne for at undgå motion?",
  },
  {
    crew: "Hvor mange tomme papkasser fra nethandel står der i dit hjem lige nu?",
    imposter: "Hvor mange ting har du bestilt på nettet og fortrudt før det overhovedet ankom?",
  },
  {
    crew: "Hvem i gruppen har den sjoveste eller mest unikke ringetone på mobilen?",
    imposter: "Hvem i gruppen har altid sin mobil på lydløs og opdager aldrig opkald?",
  },
  {
    crew: "Hvor mange gange har du sat noget i mikrobølgeovnen og glemt alt om det?",
    imposter: "Hvor mange gange har du fyldt en elkedel og glemt at tænde for den?",
  },
  {
    crew: "Hvem i gruppen ville være den mest tilbøjelige til at gå i panik over en fejl i GPS'en?",
    imposter: "Hvem i gruppen kører altid forkert fordi de tror de ved bedre end GPS'en?",
  },
  {
    crew: "Hvor mange gange har du ladet som om du ikke var hjemme, da det ringede på døren?",
    imposter: "Hvor mange gange har du kigget ud ad kighullet for at tjekke hvem der var i opgangen?",
  },
  {
    crew: "Hvem i gruppen har flest ubrugte træningsprogrammer gemt på mobilen?",
    imposter: "Hvem i gruppen har købt et fitnessabonnement uden at sætte sine ben der i et halvt år?",
  },
  {
    crew: "Hvor mange gange har du spist slik til aftensmad, da du var alene hjemme?",
    imposter: "Hvor mange gange har du spist en hel pakke kiks på ti minutter?",
  },
  {
    crew: "Hvem i gruppen ville først blive opslugt af en mærkelig konspirationsteori?",
    imposter: "Hvem i gruppen tror mest på at spøgelser og overnaturlige ting findes?",
  },
  {
    crew: "Hvor mange par slidte sneakers ejer du, som du aldrig vil smide ud?",
    imposter: "Hvor mange par fest-sko har du stående, som er for smertefulde at gå i?",
  },
  {
    crew: "Hvem i gruppen ville blive fanget i en teltlynlås under en campingtur?",
    imposter: "Hvem i gruppen nægter under alle omstændigheder at sove i et telt?",
  },
  {
    crew: "Hvor mange minutter bruger du på at finde den helt rigtige film på Netflix før du opgiver?",
    imposter: "Hvor mange trailers ser du igennem før du overhovedet vælger hvad du vil se?",
  },
  {
    crew: "Hvem i gruppen ville være den første til at bruge en hel flaske ketchup på én uge?",
    imposter: "Hvem i gruppen putter altid alt for meget chilisauce på deres mad?",
  },
  {
    crew: "Hvor mange gange har du skiftede tøj tre gange før du gik ud ad døren?",
    imposter: "Hvor mange gange har du spurgt en ven om dit outfit så dumt ud?",
  },
  {
    crew: "Hvem i gruppen har den vildeste historik med knuste mobilskærme?",
    imposter: "Hvem i gruppen bruger det mest tykke og beskyttende mobilcover?",
  },
  {
    crew: "Hvor mange gange har du prøvet at hælde mælk i kaffemaskinen ved et uheld?",
    imposter: "Hvor mange gange har du stillet mælken ind i køkkenskabet i stedet for køleskabet?",
  },
  {
    crew: "Hvem i gruppen ville være den værste til at lægge et simpelt puslespil?",
    imposter: "Hvem i gruppen bliver mest frustreret hvis en brik mangler i et spil?",
  },
  {
    crew: "Hvor mange glemte mønter har du liggende i bunden af dine jakkelommer?",
    imposter: "Hvor mange brugte lommetørklæder finder du bagerst i dine jakker?",
  },
  {
    crew: "Hvem i gruppen ville prøve at reparere sit eget bliktag uden nogen erfaring?",
    imposter: "Hvem i gruppen tilkalder en håndværker til at skifte en helt almindelig pære?",
  },
  {
    crew: "Hvor mange gange har du prøvet at åbne en dåse uden dåseåbner og mislykkedes?",
    imposter: "Hvor mange gange har du skåret dig på en dåsekant ved et uheld?",
  },
  {
    crew: "Hvem i gruppen har den mest overfyldte fryser fyldt med gamle bær og is?",
    imposter: "Hvem i gruppen gemmer altid en mikroskopisk rest af mad i en plastikbeholder?",
  },
  {
    crew: "Hvor mange gange har du sagt 'hvad?' tre gange og derefter bare nikket uden at høre efter?",
    imposter: "Hvor mange gange har du ladet som om du forstod et fremmedsprog på en ferie?",
  },
  {
    crew: "Hvem i gruppen ville starte en udklædningsfest helt uden grund?",
    imposter: "Hvem i gruppen dukker altid op i det mest afdæmpede og neutrale tøj?",
  },
  {
    crew: "Hvor mange ulæste bøger står der i din reol som pynt?",
    imposter: "Hvor mange kogebøger har du stående, som du aldrig har lavet opskrifter fra?",
  },
  {
    crew: "Hvem i gruppen ville være den mest tilbøjelige til at fare vild på en simpel gåtur i skoven?",
    imposter: "Hvem i gruppen pakker altid en kæmpe rygsæk til en helt kort tur?",
  },
  {
    crew: "Hvor mange gange har du trådt på en LEGO-klods med bare tæer?",
    imposter: "Hvor mange gange har du stødt din lilletå mod et seneben?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at holde en tale der varer tre gange for længe?",
    imposter: "Hvem i gruppen bliver mest genert når alle kigger på dem til en fest?",
  },
  {
    crew: "Hvor mange gange har du prøvet at tage et billede af månen og været skuffet over resultatet?",
    imposter: "Hvor mange solnedgangsbilleder har du liggende på din telefon?",
  },
  {
    crew: "Hvem i gruppen ville først foreslå at tage på en spontan nat-svømmetur om sommeren?",
    imposter: "Hvem i gruppen synes altid at badevandet i Danmark er alt for koldt?",
  },
  {
    crew: "Hvor mange gange har du glemt at du havde noget i ovnen indtil det lugtede brændt?",
    imposter: "Hvor mange gange har du sat en gryde over og glemt alt om den?",
  },
  {
    crew: "Hvem i gruppen har den største samling af mærkelige krydderier de aldrig bruger?",
    imposter: "Hvem i gruppen spiser den mest uoriginale og kedelige mad hver dag?",
  },
  {
    crew: "Hvor mange gange har du prøvet at tage et koldt bad fordi du glemte at tænde for det varme?",
    imposter: "Hvor mange gange har du løbet tør for varmt vand midt i et bad?",
  },
  {
    crew: "Hvem i gruppen ville ende med at købe det dyreste udstyr før de overhovedet er startet på en ny hobby?",
    imposter: "Hvem i gruppen opgiver en ny hobby efter under en uge?",
  },
  {
    crew: "Hvor mange uåbnede dåser med sodavand eller øl har du stående i dit skur?",
    imposter: "Hvor mange tomme pantflasker har du stående i en pose derhjemme lige nu?",
  },
  {
    crew: "Hvem i gruppen tager altid flest billeder af deres mad før de spiser den?",
    imposter: "Hvem i gruppen begynder at spise før alle andre overhovedet har sat sig?",
  },
  {
    crew: "Hvor mange gange har du prøvet at smide noget i skraldespanden og ramt ved siden af?",
    imposter: "Hvor mange gange har du tabt noget ned i toilettet ved et uheld?",
  },
  {
    crew: "Hvem i gruppen er den mest tilbøjelige til at bruge fem timer på at samle et simpelt bord?",
    imposter: "Hvem i gruppen nægter at læse brugsanvisningen når noget skal sættes op?",
  },
  {
    crew: "Hvor mange glemte nøglereringe eller badges har du liggende i en skuffe?",
    imposter: "Hvor mange ubrugte klistermærker har du gemt gennem tiden?",
  },
  {
    crew: "Hvem i gruppen ville være den mest tilbøjelige til at melde sig til et tåbeligt verdensrekordforsøg?",
    imposter: "Hvem i gruppen er bedst til at udføre helt unyttige og mærkelige partertricks?",
  },
  {
    crew: "Hvor mange gange har du prøvet at åbne en dør med dit rejsekort eller betalingskort?",
    imposter: "Hvor mange gange har du prøvet at 'zoome' på et fysisk papirbillede med to fingre?",
  },
  {
    crew: "Hvem i gruppen har den mest kaotiske og usorterede slikpose til fredagsslik?",
    imposter: "Hvem i gruppen spiser kun én bestemt type slik fra en bland-selv-pose?",
  },
  {
    crew: "Hvor mange gange har du købt en plante og dræbt den inden for en måned?",
    imposter: "Hvor mange plastikplanter har du i dit hjem for at undgå at dræbe dem?",
  },
  {
    crew: "Hvem i gruppen ville overtale alle andre til at tage den dyreste taxi hjem fra byen?",
    imposter: "Hvem i gruppen vil hellere gå fem kilometer om natten for at spare taxapengene?",
  },
  {
    crew: "Hvor mange ulæste beskeder har du fra folk du bevidst undgår at svare?",
    imposter: "Hvor mange gange har du brugt 'dårligt batteri' som undskyldning for ikke at svare?",
  },
  {
    crew: "Hvem i gruppen ville være den første til at falde i søvn i biografen under en actionfilm?",
    imposter: "Hvem i gruppen spiser alle sine popcorn før reklamerne i biografen er færdige?",
  },
  {
    crew: "Hvor mange gange har du haft dit tøj omvendt på uden at opdage det før middag?",
    imposter: "Hvor mange gange har du haft to forskellige strømper på på arbejde?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at synge forfærdeligt falsk men med enorm indlevelse?",
    imposter: "Hvem i gruppen tvinger altid andre til at lytte til deres yndlingsmusik i bilen?",
  },
  {
    crew: "Hvor mange gange har du prøvet at drikke af en tom kop fordi du var uopmærksom?",
    imposter: "Hvor mange gange har du spildt drikkevarer ud over dit eget tastatur?",
  },
  {
    crew: "Hvem i gruppen ville blive mest oppe at køre over et billigt kup i et supermarked?",
    imposter: "Hvem i gruppen tjekker altid tilbudsaviser igennem før de køber ind?",
  },
  {
    crew: "Hvor mange halvbrugte solcremer fra i forfjor har du liggende i skabet?",
    imposter: "Hvor mange lipbalms eller lypsyler har du mistet i løbet af vinteren?",
  },
  {
    crew: "Hvem i gruppen ville være den mest udholdende til at stå i en ti timer lang kø for billetter?",
    imposter: "Hvem i gruppen opgiver at handle hvis der er mere end tre personer i køen?",
  },
  {
    crew: "Hvor mange gange har du lades som om du kiggede intenst på din mobil for at undgå øjenkontakt?",
    imposter: "Hvor mange gange har du taget høretelefoner i uden at afspille noget for at være i fred?",
  },
  {
    crew: "Hvem i gruppen har den mest uforståelige og kaotiske tidsplan i løbet af en uge?",
    imposter: "Hvem i gruppen planlægger sine aftaler tre måneder ud i fremtiden?",
  },
  {
    crew: "Hvor mange gange har du skiftet kanal på TV'et og glemt hvad du ville se?",
    imposter: "Hvor mange gange har du haft TV'et kørende i baggrunden uden overhovedet at kigge på det?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at miste sin jakke på et diskotek eller en bar?",
    imposter: "Hvem i gruppen glemmer altid at tage sin pung med når I skal ud?",
  },
];

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
  {
    crew: "Hvor mange minutter er du om at trykke snoozeit om morgenen?",
    imposter: "Hvor mange minutter bruger du på at scrolle på mobilen før du står op?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at falde i søvn til en fest?",
    imposter: "Hvem i gruppen råber højest, når der synges karaoke?",
  },
  {
    crew: "Hvor mange uafsluttede projekter har du gang i lige nu?",
    imposter: "Hvor mange par usolgte sko har du stående bagerst i skabet?",
  },
  {
    crew: "Hvem i gruppen har den mest kaotiske kamerarulle på telefonen?",
    imposter: "Hvem i gruppen har flest uåbnede mails i sin indbakke?",
  },
  {
    crew: "Hvad er din største guilty pleasure-snack?",
    imposter: "Hvad spiser du altid, når ingen andre kigger?",
  },
  {
    crew: "Hvem i gruppen ville lade sig overtale til et faldskærmsudspring først?",
    imposter: "Hvem i gruppen ville gå i panik i et escape room?",
  },
  {
    crew: "Hvor mange dage i træk har du spist pizza eller fastfood?",
    imposter: "Hvor mange dåser energidrik drikker du på en hård uge?",
  },
  {
    crew: "Hvem i gruppen er den største dramadronning, når vedkommende er syg?",
    imposter: "Hvem i gruppen beklager sig mest over vejret?",
  },
  {
    crew: "Hvilken kendis ville du helst gå på date med?",
    imposter: "Hvilken kendis ville du mindst lide at strande i en elevator med?",
  },
  {
    crew: "Hvor mange stemmebeskeder sender du i gennemsnit om ugen?",
    imposter: "Hvor mange korte videoer sender du til venner om dagen?",
  },
  {
    crew: "Hvem i gruppen brænder oftest maden på?",
    imposter: "Hvem i gruppen smider mest mad ud?",
  },
  {
    crew: "Hvor mange abonnementer betaler du for uden at bruge dem?",
    imposter: "Hvor mange glemte ting har du liggende i bunden af din taske?",
  },
  {
    crew: "Hvem i gruppen ville flirte sig til en gratis drink i baren?",
    imposter: "Hvem i gruppen prutter mest ugenert i eget selskab?",
  },
  {
    crew: "Hvilket klichéfuldt realityshow ville du snige dig til at deltage i?",
    imposter: "Hvilket tv-program kan du absolut ikke holde ud at se i to minutter?",
  },
  {
    crew: "Hvor mange gange har du ladet som om du kender en på gaden?",
    imposter: "Hvor mange gange har du ladet som om du ikke hørte din alarm?",
  },
  {
    crew: "Hvem i gruppen har den mærkeligste vane derhjemme?",
    imposter: "Hvem i gruppen bruger længst tid på badeværelset?",
  },
  {
    crew: "Hvor mange tabte væddemål har du bag dig?",
    imposter: "Hvor mange dumme impulskøb har du foretaget i år?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at starte en modedille ved et uheld?",
    imposter: "Hvem i gruppen har den mest tvivlsomme musiksmag?",
  },
  {
    crew: "Hvor mange gange om måneden trykker du 'skip intro' på streamingtjenester?",
    imposter: "Hvor mange serieafsnit kan du kværne på én søndag?",
  },
  {
    crew: "Hvem i gruppen glemmer altid, hvor de har parkeret deres bil eller cykel?",
    imposter: "Hvem i gruppen leder altid efter sine nøgler i sidste øjeblik?",
  },
  {
    crew: "Hvor mange ubesvarede opkald har du haft på din mest travle dag?",
    imposter: "Hvor mange screenshots tager du på en uge?",
  },
  {
    crew: "Hvem i gruppen bruger de mest tåkrummende scorereplikker?",
    imposter: "Hvem i gruppen bliver hurtigst rød i hovedet?",
  },
  {
    crew: "Hvilken type fastfood ville du spise resten af livet?",
    imposter: "Hvilken tøjstil ville du nægte at bære for en million kroner?",
  },
  {
    crew: "Hvor mange gange har du sendt en besked til den forkerte person?",
    imposter: "Hvor mange gange har du set en besked uden at svare?",
  },
  {
    crew: "Hvem i gruppen ville være den første til at blive smidt ud af et casino?",
    imposter: "Hvem i gruppen ville tage styringen under et kup?",
  },
  {
    crew: "Hvor mange timers søvn kræver du for at fungere om morgenen?",
    imposter: "Hvor mange kopper kaffe skal du have for at vågne ordentligt?",
  },
  {
    crew: "Hvem i gruppen har de sjoveste ansigtsudtryk under dyb koncentration?",
    imposter: "Hvem i gruppen taler højest i telefon i offentlig transport?",
  },
  {
    crew: "Hvor mange ting har du købt i genbrugsbutikker det seneste år?",
    imposter: "Hvor mange ubrugte gadgets ligger der i din skuffe?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at blive et internet-meme?",
    imposter: "Hvem i gruppen glemmer oftest navnet på folk, de lige har mødt?",
  },
  {
    crew: "Hvor mange gange har du glemt vådt tøj i vaskemaskinen?",
    imposter: "Hvor mange gange har du spist noget over udløbsdatoen?",
  },
  {
    crew: "Hvor mange gange om ugen spiser du i sengen?",
    imposter: "Hvor mange gange om ugen taber du din telefon på gulvet?",
  },
  {
    crew: "Hvem i gruppen ville først blive anholdt for en helt latterlig banal ting?",
    imposter: "Hvem i gruppen ville glemme sit eget pas på vej til lufthavnen?",
  },
  {
    crew: "Hvor mange glemte opgaver har du udskudt til sidste øjeblik i måneden?",
    imposter: "Hvor mange gange har du lades som om du var syg for at blive hjemme?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at overfaldsspise slik i smug?",
    imposter: "Hvem i gruppen lader sit batteri nå 1% før de lader op?",
  },
  {
    crew: "Hvor mange par sokker uden makker har du liggende i skuffen?",
    imposter: "Hvor mange tomme emballager står der i dit køkken lige nu?",
  },
  {
    crew: "Hvem i gruppen ville være mest pinlig på et dansegulv klokken tre om natten?",
    imposter: "Hvem i gruppen bruger flest emojis i en helt almindelig besked?",
  },
  {
    crew: "Hvor mange gange har du gået ud af døren med tøjet vrangen ud?",
    imposter: "Hvor mange gange har du gået ind i en lygtepæl mens du kiggede på mobilen?",
  },
  {
    crew: "Hvem i gruppen kunne finde på at bruge en hel weekend uden at se andre mennesker?",
    imposter: "Hvem i gruppen arrangerer altid de vildeste ture for vennerne?",
  },
  {
    crew: "Hvor mange uåbnede breve eller e-boksbeskeder har du stående?",
    imposter: "Hvor mange alarmer skal der til for at du tvinger dig selv op?",
  },
  {
    crew: "Hvem i gruppen har den mærkeligste samling af ting derhjemme?",
    imposter: "Hvem i gruppen har den mest kaotiske skrivebordsbaggrund?",
  },
  {
    crew: "Hvor mange gange om dagen tjekker du dit eget spejlbillede?",
    imposter: "Hvor mange gange om dagen tjekker du vejrappen?",
  },
  {
    crew: "Hvem i gruppen ville først lade sig overtale til at deltage i et realityshow?",
    imposter: "Hvem i gruppen ville glemme sin egen fødselsdag hvis ingen sagde noget?",
  },
  {
    crew: "Hvor mange ubrugte gavekort har du liggende i skuffen?",
    imposter: "Hvor mange stempler har du på dit yndlings-stempelkort?",
  },
  {
    crew: "Hvem i gruppen har den sjoveste grinelyd når de virkelig griner igennem?",
    imposter: "Hvem i gruppen nyser altid på den mest voldsomme måde?",
  },
  {
    crew: "Hvor mange gange har du ved et uheld sendt et screenshot til den person du tog screenshot af?",
    imposter: "Hvor mange gange har du skrevet en besked og fortrudt før du trykkede send?",
  },
  {
    crew: "Hvem i gruppen ville klare sig dårligst uden internet i et døgn?",
    imposter: "Hvem i gruppen ville gå i panik hvis strømmen gik i en time?",
  },
  {
    crew: "Hvor mange kopper halvfuld te eller kaffe lader du stå rundt omkring?",
    imposter: "Hvor mange flasker vand har du stående på dit natbord?",
  },
  {
    crew: "Hvem i gruppen ville være den første til at bruge alle sine penge i den første uge af måneden?",
    imposter: "Hvem i gruppen prutter om prisen når de er på loppemarked?",
  },
  {
    crew: "Hvor mange gange har du lades som om du forstod en joke uden at fange den?",
    imposter: "Hvor mange gange har du grinet så meget at du mistede pusten i det forkerte øjeblik?",
  },
  {
    crew: "Hvem i gruppen lytter til den mest uventede og overraskende musik genre?",
    imposter: "Hvem i gruppen ser de mest mærkelige dokumentarprogrammer på tv?",
  },
  {
    crew: "Hvor mange gange har du prøvet at låse en dør op med den forkerte nøgle?",
    imposter: "Hvor mange gange har du gået forkert i et indkøbscenter?",
  },
  {
    crew: "Hvem i gruppen ville lade sig lokke til at spise en chili kun for opmærksomheden?",
    imposter: "Hvem i gruppen tager altid den sidste bid af maden uden at spørge?",
  },
  {
    crew: "Hvor mange gange har du spildt kaffe eller mad ud over dit rene tøj?",
    imposter: "Hvor mange gange har du trådt i en tyggegummi på gaden?",
  },
  {
    crew: "Hvem i gruppen har den sjoveste adfærd efter to øl eller et glas vin?",
    imposter: "Hvem i gruppen falder altid i søvn i sofaen før filmen er slut?",
  },
  {
    crew: "Hvor mange gange har du prøvet at skubbe til en dør hvor der stod træk?",
    imposter: "Hvor mange gange har du vinket tilbage til en person der vinkede til nogen bag dig?",
  },
  {
    crew: "Hvem i gruppen bruger de mærkeligste talemåder i dagligdagen?",
    imposter: "Hvem i gruppen retter altid på folks grammatik når de taler?",
  },
  {
    crew: "Hvor mange uåbnede emballager har du i dine badeværelsesskabe?",
    imposter: "Hvor mange halve shampoo flasker står der i din bruser?",
  },
  {
    crew: "Hvem i gruppen ville klare sig bedst som stand-up komiker?",
    imposter: "Hvem i gruppen fortæller de mest langstrakte og mærkelige historier?",
  },
  {
    crew: "Hvor mange gange har du spist aftensmad foran tv'et denne uge?",
    imposter: "Hvor mange gange har du bestilt takeaway fordi du ikke gad vaske op?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at købe en helt ubrugelig ting på nettet klokken tre om natten?",
    imposter: "Hvem i gruppen lader sig lettest overtale af en telefonsælger?",
  },
  {
    crew: "Hvor mange tabte genstande har du genfundet i bunden af dit køleskab?",
    imposter: "Hvor mange poser frysevarer har du liggende som du har glemt hvad er?",
  },
  {
    crew: "Hvem i gruppen ville hurtigst fare vild i sin egen hjemby uden GPS?",
    imposter: "Hvem i gruppen kan slet ikke finde vej uden kort på mobilen?",
  },
  {
    crew: "Hvor mange gange om ugen glemmer du hvad du gik ind i et rum for?",
    imposter: "Hvor mange gange om ugen glemmer du hvad du skulle til at søge på på Google?",
  },
  {
    crew: "Hvem i gruppen ville være den mest uorganiserede rejseleder på en ferie?",
    imposter: "Hvem i gruppen pakker sin kuffert mere end en uge før afrejse?",
  },
  {
    crew: "Hvor mange gange har du ladet telefonen op i bilen fordi du glemte det derhjemme?",
    imposter: "Hvor mange gange har du lånt en oplader og aldrig afleveret den tilbage?",
  },
  {
    crew: "Hvem i gruppen ville lade sig friste af et hurtigt lån til en spontan rejse?",
    imposter: "Hvem i gruppen har den tætteste sparerutine i hele selskabet?",
  },
  {
    crew: "Hvor mange solbriller har du knækket eller mistet i dit liv?",
    imposter: "Hvor mange paraplyer har du glemt i bussen eller toget?",
  },
  {
    crew: "Hvem i gruppen ville være den mest dramatiske under et brætspil?",
    imposter: "Hvem i gruppen jubler højest når de vinder et simpelt spil?",
  },
  {
    crew: "Hvor mange gange har du prøvet at betale med det forkerte kort i butikken?",
    imposter: "Hvor mange gange har du glet din pinkode og spærret dit kort?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at blive venner med betjeningen på en restaurant?",
    imposter: "Hvem i gruppen stiller flest mærkelige spørgsmål til menukortet?",
  },
  {
    crew: "Hvor mange gange har du ladet som om du sov for at undgå at rydde op?",
    imposter: "Hvor mange gange har du lades som om du havde travlt for at undgå en aftale?",
  },
  {
    crew: "Hvem i gruppen ville først glemme navnet på hovedpersonen i en film de lige har set?",
    imposter: "Hvem i gruppen spoiler altid slutningen på en film ved et uheld?",
  },
  {
    crew: "Hvor mange uåbnede pakker med madvarer har du i skabet som er for gamle?",
    imposter: "Hvor mange krydderier har du stående som du kun har brugt én gang?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at gå i panik over en lille edderkop?",
    imposter: "Hvem i gruppen råber højest hvis der kommer en hveps forbi bordet?",
  },
  {
    crew: "Hvor mange gange har du ved et uheld ringet til nogen op fra lommen?",
    imposter: "Hvor mange gange har du sendt en mærkelig besked pga. autokorrektur?",
  },
  {
    crew: "Hvem i gruppen ville hurtigst opgive at samle et IKEA-møbel og ringe efter hjælp?",
    imposter: "Hvem i gruppen har flest ubrugte skruer tilovers efter samling af møbler?",
  },
  {
    crew: "Hvor mange gange har du prøvet at åbne en bil der ikke var din?",
    imposter: "Hvor mange gange har du sat dig ind i den forkerte bil på en parkeringsplads?",
  },
  {
    crew: "Hvem i gruppen tager altid de mest akavede poseringer på fotos?",
    imposter: "Hvem i gruppen kræver altid at billedet skal tages om fire gange?",
  },
  {
    crew: "Hvor mange gange om måneden glemmer du at tage din genanvendelige indkøbspose med?",
    imposter: "Hvor mange plastikposer har du stoppet ind i en anden plastikpose derhjemme?",
  },
  {
    crew: "Hvem i gruppen ville være den første til at bruge alle sine mobildata før måneden er omme?",
    imposter: "Hvem i gruppen spørger altid efter wi-fi-koden det øjeblik de træder ind i et rum?",
  },
  {
    crew: "Hvor mange ubesvarede beskeder har du liggende fra din mor eller far?",
    imposter: "Hvor mange gruppechats har du sat på 'lydløs' i din besked-app?",
  },
  {
    crew: "Hvem i gruppen ville være den værste til at holde en tale til et bryllup?",
    imposter: "Hvem i gruppen begynder altid at græde først til følelsesladede film?",
  },
  {
    crew: "Hvor mange gange har du købt noget tøj fordi det var på tilbud og aldrig brugt det?",
    imposter: "Hvor mange tøjstykker ligger i dit skab med prismærket på endnu?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at tabe mad på gulvet og spise det alligevel?",
    imposter: "Hvem i gruppen er mest bange for bakterier i offentlige rum?",
  },
  {
    crew: "Hvor mange gange har du glemt at slukke lyset da du gik fra din bolig?",
    imposter: "Hvor mange gange har du tjekket om komfuret var slukket mere end tre gange?",
  },
  {
    crew: "Hvem i gruppen har den mest uforståelige håndskrift i hele selskabet?",
    imposter: "Hvem i gruppen tegner de mærkeligste kruseduller under et telefonmøde?",
  },
  {
    crew: "Hvor mange gange har du tabt noget ned bag sofaen og ladet det ligge?",
    imposter: "Hvor mange glemte mønter har du fundet i bunden af vaskemaskinen?",
  },
  {
    crew: "Hvem i gruppen ville først melde sig til en vild overlevelsesudfordring i tv?",
    imposter: "Hvem i gruppen klager mest over komforten når I er på tur?",
  },
  {
    crew: "Hvor mange gange har du oprettet en ny konto fordi du glemte din adgangskode?",
    imposter: "Hvor mange gange har du brugt '1234' eller din fødselsdag som kode?",
  },
  {
    crew: "Hvem i gruppen ville lade sig overtale til at tage en spontan tatovering i en kaffepause?",
    imposter: "Hvem i gruppen har den skøreste historie bag et af sine ar?",
  },
  {
    crew: "Hvor mange gange har du skruet helt op for musikken i bilen og sunget med af fulde hals?",
    imposter: "Hvor mange gange har du danset foran spejlet derhjemme når ingen kiggede?",
  },
  {
    crew: "Hvem i gruppen ville være den første til at bruge alle sine penge på gourmetmad?",
    imposter: "Hvem i gruppen spiser altid den samme ret hver eneste gang I er ude?",
  },
  {
    crew: "Hvor mange uåbnede læsestof eller magasiner har du liggende på bordet?",
    imposter: "Hvor mange bøger har du startet på uden nogensinde at læse dem færdig?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at komme med en helt vanvittig bortforklaring?",
    imposter: "Hvem i gruppen afslører altid sig selv ved at begynde at fnise når de lyver?",
  },
  {
    crew: "Hvor mange gange har du tabt dine høretelefoner ned på gulvet i løbet af en uge?",
    imposter: "Hvor mange gange har du ledt efter dine briller eller solbriller mens de sad på hovedet?",
  },
  {
    crew: "Hvem i gruppen ville klare sig dårligst i et stumt skuespil uden ord?",
    imposter: "Hvem i gruppen bruger flest fagter med hænderne når de forklarer noget?",
  },
  {
    crew: "Hvor mange gange har du prøvet at tage et pænt billede af din mad til sociale medier?",
    imposter: "Hvor mange gange har du rettet på lyset i et rum for at lave det perfekte foto?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at tabe sit nøglebundt ned i et kloakgitter?",
    imposter: "Hvem i gruppen har flest nøgleringe siddende på sit nøglebundt?",
  },
  {
    crew: "Hvor mange gange har du drukket mælk direkte fra kartonen derhjemme?",
    imposter: "Hvor mange gange har du spist is direkte fra bøtten med en spiseske?",
  },
  {
    crew: "Hvem i gruppen ville være den hurtigste til at kede sig på en strandferie?",
    imposter: "Hvem i gruppen kan ligge i en liggestol en hel uge uden at lave noget som helst?",
  },
];
