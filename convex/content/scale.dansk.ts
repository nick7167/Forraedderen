import type { ScalePair } from "./types";

// "Dansk kultur" — Måleren prompts rooted in Danish traditions, places and
// everyday habits. On by default; a host can switch the tier off for a table
// where not everyone grew up here.
//
// Deliberately NO brand names, company names or TV-programme titles: those are
// trademarks, they date badly, and half of them are regional anyway. Traditions,
// dishes, institutions and shared habits carry the Danishness on their own.
//
// Same hard rules as the family pool: 70-character cap, both prompts on the
// identical 1–5 scale, imposter prompt adjacent rather than opposite.

export const SCALE_DANSK: ScalePair[] = [
  // ——— Hygge ———
  { crew: "Hvor vigtigt er levende lys for din hygge?", imposter: "Hvor tit tænder du stearinlys om vinteren?" },
  { crew: "Hvor godt kan du lide et tæppe i sofaen?", imposter: "Hvor tit ligger du under et plaid en søndag?" },
  { crew: "Hvor meget betyder ordet hygge for dig?", imposter: "Hvor tit bruger du ordet hygge på en uge?" },
  { crew: "Hvor hyggeligt er et regnvejrsvindue?", imposter: "Hvor godt kan du lide at være inde, når det blæser?" },
  { crew: "Hvor ofte inviterer du til kaffe og kage?", imposter: "Hvor tit bager du selv til gæster?" },
  { crew: "Hvor vigtigt er en god stol for din hygge?", imposter: "Hvor meget går du op i dansk design?" },
  { crew: "Hvor tit sidder du i sofaen hele aftenen?", imposter: "Hvor svært er det at komme ud ad døren om vinteren?" },

  // ——— Mad og drikke ———
  { crew: "Hvor tit spiser du rugbrød?", imposter: "Hvor godt kan du lide leverpostej?" },
  { crew: "Hvor meget elsker du frikadeller?", imposter: "Hvor vigtig er brun sovs for dig?" },
  { crew: "Hvor godt kan du lide smørrebrød?", imposter: "Hvor pænt anretter du din mad?" },
  { crew: "Hvor ofte spiser du fiskefilet med remoulade?", imposter: "Hvor gerne spiser du fisk generelt?" },
  { crew: "Hvor godt kan du lide sildemad?", imposter: "Hvor gerne spiser du noget syltet?" },
  { crew: "Hvor meget elsker du kartofler?", imposter: "Hvor tit får du kartofler til aftensmad?" },
  { crew: "Hvor tit laver du en madpakke?", imposter: "Hvor kedelig er din typiske madpakke?" },
  { crew: "Hvor godt kan du lide saltlakrids?", imposter: "Hvor stærk lakrids kan du klare?" },
  { crew: "Hvor tit spiser du fredagsslik?", imposter: "Hvor fast er din fredagstradition?" },
  { crew: "Hvor gerne drikker du snaps til frokost?", imposter: "Hvor tit synger du en snapsevise?" },
  { crew: "Hvor godt kan du lide koldskål?", imposter: "Hvor meget glæder du dig til sommermaden?" },
  { crew: "Hvor gerne spiser du risalamande til jul?", imposter: "Hvor meget vil du vinde mandelgaven?" },
  { crew: "Hvor godt kan du lide æbleskiver?", imposter: "Hvor tit får du gløgg i december?" },
  { crew: "Hvor ofte bager du boller i weekenden?", imposter: "Hvor gerne står du tidligt op for morgenbrød?" },
  { crew: "Hvor vigtig er en wienerbrød til kaffen?", imposter: "Hvor tit køber du kage til kontoret?" },
  { crew: "Hvor tit spiser du pølser fra en vogn?", imposter: "Hvor gerne spiser du stående på gaden?" },
  { crew: "Hvor meget går du op i en god ost?", imposter: "Hvor stærk ost kan du klare?" },
  { crew: "Hvor tit drikker du kaffe på en dag?", imposter: "Hvor stærk skal din kaffe være?" },

  // ——— Højtider og traditioner ———
  { crew: "Hvor meget glæder du dig til julefrokosten?", imposter: "Hvor sent går du hjem fra en julefrokost?" },
  { crew: "Hvor ofte går du til julefrokost på arbejdet?", imposter: "Hvor akavet er en julefrokost med kollegerne?" },
  { crew: "Hvor vigtigt er det at danse om juletræet?", imposter: "Hvor gerne synger du med på julesange?" },
  { crew: "Hvor tidligt begynder du at pynte op til jul?", imposter: "Hvor længe står pynten fremme bagefter?" },
  { crew: "Hvor tit laver du julegaver selv?", imposter: "Hvor sent køber du dine julegaver?" },
  { crew: "Hvor meget betyder en pakkekalender for dig?", imposter: "Hvor tit tæller du dagene til jul?" },
  { crew: "Hvor gerne slår du katten af tønden?", imposter: "Hvor gerne klæder du dig ud til fastelavn?" },
  { crew: "Hvor tit går du til sankthansbål?", imposter: "Hvor gerne synger du midsommervisen?" },
  { crew: "Hvor meget fylder påskefrokost hos dig?", imposter: "Hvor tit holder du en lang frokost med familien?" },
  { crew: "Hvor gerne fejrer du nytår med fyrværkeri?", imposter: "Hvor tæt på fyrværkeri tør du stå?" },
  { crew: "Hvor vigtigt er kransekage til nytår?", imposter: "Hvor tit springer du op fra stolen ved midnat?" },
  { crew: "Hvor meget betyder nytårstalen for din aften?", imposter: "Hvor tit ser du hele nytårstalen igennem?" },
  { crew: "Hvor gerne fejrer du grundlovsdag?", imposter: "Hvor meget går du op i danske mærkedage?" },
  { crew: "Hvor stort holdes fødselsdage i din familie?", imposter: "Hvor vigtigt er flag på bordet?" },
  { crew: "Hvor ofte hejser du Dannebrog?", imposter: "Hvor meget betyder flaget for dig?" },
  { crew: "Hvor vigtig var din konfirmation?", imposter: "Hvor meget husker du af din konfirmationsdag?" },
  { crew: "Hvor vild var din studentertid?", imposter: "Hvor godt husker du studenterkørslen?" },
  { crew: "Hvor gerne går du med studenterhue en hel uge?", imposter: "Hvor stolt var du på din studenterdag?" },

  // ——— Steder og ferie i Danmark ———
  { crew: "Hvor gerne holder du ferie i et sommerhus?", imposter: "Hvor tit tager du på weekendtur i Danmark?" },
  { crew: "Hvor meget elsker du Vesterhavet?", imposter: "Hvor gerne går du en tur i klitterne?" },
  { crew: "Hvor gerne tager du til Bornholm?", imposter: "Hvor gerne sejler du med en færge?" },
  { crew: "Hvor godt kan du lide København?", imposter: "Hvor tit tager du til hovedstaden?" },
  { crew: "Hvor gerne bor du på landet?", imposter: "Hvor hurtigt keder du dig uden for byen?" },
  { crew: "Hvor meget savner du din barndomsby?", imposter: "Hvor tit tager du tilbage?" },
  { crew: "Hvor gerne har du en kolonihave?", imposter: "Hvor meget nyder du havearbejde?" },
  { crew: "Hvor tit går du en tur i en dansk skov?", imposter: "Hvor godt kender du dine lokale stier?" },
  { crew: "Hvor gerne tager du på campingferie?", imposter: "Hvor godt sover du i en campingvogn?" },
  { crew: "Hvor tit besøger du et slot eller en herregård?", imposter: "Hvor meget interesserer historie dig?" },
  { crew: "Hvor gerne tager du på en musikfestival?", imposter: "Hvor mange dage kan du holde til i telt?" },
  { crew: "Hvor tidligt på året tør du bade i havet?", imposter: "Hvor gerne vinterbader du?" },
  { crew: "Hvor ofte tager du til stranden om sommeren?", imposter: "Hvor længe bliver du liggende i solen?" },

  // ——— Transport og vejr ———
  { crew: "Hvor tit cykler du på arbejde?", imposter: "Hvor gerne cykler du året rundt?" },
  { crew: "Hvor tit bruger du cykelhjelm?", imposter: "Hvor sikkerhedsbevidst er du i trafikken?" },
  { crew: "Hvor irriteret bliver du af en togforsinkelse?", imposter: "Hvor tit kommer du for sent på grund af toget?" },
  { crew: "Hvor ofte brokker du dig over vejret?", imposter: "Hvor meget fylder vejret i din small talk?" },
  { crew: "Hvor godt kan du lide dansk sommer?", imposter: "Hvor tit skuffer den danske sommer dig?" },
  { crew: "Hvor meget påvirker den mørke vinter dig?", imposter: "Hvor tit tager du D-vitamin?" },
  { crew: "Hvor tit tjekker du vejrudsigten?", imposter: "Hvor meget stoler du på vejrudsigten?" },
  { crew: "Hvor gerne går du ud i blæsevejr?", imposter: "Hvor let giver du op og bliver hjemme?" },
  { crew: "Hvor tit glemmer du din paraply?", imposter: "Hvor tit bliver du gennemblødt på vej hjem?" },
  { crew: "Hvor ofte tager du færgen frem for broen?", imposter: "Hvor gerne kører du en lang tur i bil?" },

  // ——— Samfund og hverdag ———
  { crew: "Hvor meget genkender du dig selv i janteloven?", imposter: "Hvor svært er det for dig at prale?" },
  { crew: "Hvor tit sorterer du affald korrekt?", imposter: "Hvor tit kører du på genbrugspladsen?" },
  { crew: "Hvor tit samler du pantflasker sammen?", imposter: "Hvor længe står pantflaskerne og venter?" },
  { crew: "Hvor aktiv er du i en forening?", imposter: "Hvor tit melder du dig frivilligt til noget?" },
  { crew: "Hvor ofte går du til et beboermøde?", imposter: "Hvor meget blander du dig i naboskabet?" },
  { crew: "Hvor godt kender du dine naboer ved navn?", imposter: "Hvor tit låner du noget af en nabo?" },
  { crew: "Hvor tit stemmer du til et valg?", imposter: "Hvor meget følger du med i politik?" },
  { crew: "Hvor meget går du op i din skattebillet?", imposter: "Hvor godt styr har du på din økonomi?" },
  { crew: "Hvor tit går du til lægen?", imposter: "Hvor længe venter du med at søge hjælp?" },
  { crew: "Hvor vigtigt er flextid for dig?", imposter: "Hvor tit går du tidligt hjem om fredagen?" },
  { crew: "Hvor ofte holder du fri mellem jul og nytår?", imposter: "Hvor tit tjekker du mail i juleferien?" },
  { crew: "Hvor meget betyder en fredagsbar for dig?", imposter: "Hvor tit bliver du hængende bagefter?" },
  { crew: "Hvor tit siger du du til en fremmed?", imposter: "Hvor formel er du over for autoriteter?" },
  { crew: "Hvor tit taler du med fremmede i toget?", imposter: "Hvor akavet synes du, det er?" },
  { crew: "Hvor ofte står du i kø uden at brokke dig?", imposter: "Hvor tålmodig er du i supermarkedet?" },

  // ——— Sport og fritid ———
  { crew: "Hvor meget følger du med i landsholdet?", imposter: "Hvor højt råber du foran en landskamp?" },
  { crew: "Hvor gerne spiller du håndbold?", imposter: "Hvor meget ser du håndbold i fjernsynet?" },
  { crew: "Hvor tit går du til fodbold på stadion?", imposter: "Hvor meget betyder dit lokale hold?" },
  { crew: "Hvor gerne går du til gymnastik eller svømning?", imposter: "Hvor tit brugte du den lokale hal som barn?" },
  { crew: "Hvor tit tager du en gåtur efter aftensmaden?", imposter: "Hvor langt går du på en aftentur?" },
  { crew: "Hvor gerne løber du et motionsløb?", imposter: "Hvor konkurrencepræget bliver du?" },
  { crew: "Hvor ofte spiller du et brætspil med familien?", imposter: "Hvor højt går snakken ved bordet?" },
  { crew: "Hvor gerne synger du i en fællessang?", imposter: "Hvor godt kender du højskolesangbogen?" },

  // ——— Skole, uddannelse og opvækst ———
  { crew: "Hvor meget betød folkeskolen for dig?", imposter: "Hvor tit tænker du på dine klassekammerater?" },
  { crew: "Hvor gerne ville du på efterskole?", imposter: "Hvor godt kunne du bo væk hjemmefra som ung?" },
  { crew: "Hvor gerne ville du på højskole?", imposter: "Hvor meget tiltaler fællesskab dig?" },
  { crew: "Hvor tit læste du lektier til tiden?", imposter: "Hvor meget udsatte du opgaver i skolen?" },
  { crew: "Hvor aktiv var du i skolens fester?", imposter: "Hvor gerne stod du på en scene?" },
  { crew: "Hvor tit cyklede du i skole?", imposter: "Hvor langt havde du til skole?" },
  { crew: "Hvor meget fyldte fritidsjobbet i din ungdom?", imposter: "Hvor tidligt begyndte du at tjene egne penge?" },

  // ——— Bolig og hjem ———
  { crew: "Hvor gerne bor du i lejlighed frem for hus?", imposter: "Hvor vigtigt er en altan eller have for dig?" },
  { crew: "Hvor meget går du op i at have det pænt udenfor?", imposter: "Hvor tit luger du i bedet?" },
  { crew: "Hvor ofte griller du om sommeren?", imposter: "Hvor gerne står du selv ved grillen?" },
  { crew: "Hvor vigtigt er en god seng for dig?", imposter: "Hvor meget brugte du på dit soveværelse?" },
  { crew: "Hvor tit lufter du ud om vinteren?", imposter: "Hvor koldt må der være indenfor?" },
  { crew: "Hvor meget sparer du på varmen?", imposter: "Hvor tit går du med sokker indendørs?" },
  { crew: "Hvor tit tager du skoene af hos andre?", imposter: "Hvor meget forventer du, at gæster tager skoene af?" },
  { crew: "Hvor gerne bor du tæt på familien?", imposter: "Hvor tit besøger du dine forældre?" },
  { crew: "Hvor ofte rydder du op på loftet eller i kælderen?", imposter: "Hvor meget gemmer du af gamle ting?" },
];
