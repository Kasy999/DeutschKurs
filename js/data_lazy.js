'use strict';
// Zusammengesetzte Datenbestände (in Kotlin „by lazy“) und Funktionen aus den Datendateien.

/* Word.kt / VocabA1.kt */
const extraVocab = [...vocabA1, ...vocabA2, ...vocabB1a, ...vocabB1b];
const vocabulary = [...baseVocabulary, ...extraVocab.map((x) => x.word)];

function articleHint(word) {
  const lower = word.de.toLowerCase();
  for (const [endings, article, hint] of articleHints) {
    if (article !== word.article) continue;
    const isGe = endings.length === 1 && endings[0] === 'ge';
    const match = isGe ? lower.startsWith('ge') && lower.length >= 6 : endings.some((x) => lower.endsWith(x));
    if (match) return hint;
  }
  return null;
}

/* Verb.kt */
const verbs = [...baseVerbs, ...extraVerbs];

/* CasesTenses.kt */
const praeteritum = new Map([...basePraeteritum, ...extraPraeteritum]);
const caseWords = vocabulary.filter((x) => !nDeklination.has(x.de) && x.de !== 'Herz' && !(x.article === 'der' && x.de.endsWith('e')));

/* Konjunktiv2.kt */
const konjActivities = verbs.filter((x) => konjActivityInfs.includes(x.inf));
const konjPastVerbs = verbs.filter((x) => konjPastInfs.includes(x.inf) && x.aux != null);

/* Exercises.kt, Sentences.kt, Spelling.kt */
const choiceItems = [...baseChoiceItems, ...[...extraChoice, ...extraChoiceCasesTenses, ...extraChoiceModalPast, ...extraChoiceKonj, ...moreChoice].map((x) => x.item)];
const orderItems = [...baseOrderItems, ...extraOrder.map((x) => x.item), ...moreOrder.map((x) => x.item)];
const spellItems = [...baseSpellItems, ...extraSpell.map((x) => x.item)];
const partsItems = moreParts.map((x) => x.item);

/* Lang.kt */
translations = new Map([
  // Zusätzliche Sätze zuerst, damit bei gleichem russischen Text die bestehende Übersetzung gilt.
  ...[...moreChoice, ...moreOrder, ...moreParts].map((x) => [x.item.ru, x.tr]),
  ...trWords, ...trLife, ...extraVocab.map((x) => [x.word.ru, x.tr]), ...trVerbs, ...trVerbsExtra, ...trReflexive, ...trKonj, ...trMisc,
  ...trChoice1, ...trChoice2, ...trOrder, ...trSpell,
  ...[...extraChoice, ...extraChoiceCasesTenses, ...extraChoiceModalPast, ...extraChoiceKonj].map((x) => [x.item.ru, x.tr]),
  ...extraOrder.map((x) => [x.item.ru, x.tr]),
  ...extraSpell.map((x) => [x.item.ru, x.tr]),
]);
ruleTranslations = new Map([...trRules, ...trRulesExtra, ...trSpellRules]);

/* Satzglieder (Rules.kt / TrRules.kt / TrWords.kt) */
translations.set('Члены предложения', Tr('Члени речення', 'Նախադասության անդամներ', 'წინადადების წევრები'));
rules.set('satzglieder', Bi(
  'Satzglieder: Das Subjekt (Wer oder was?) steht im Nominativ und bestimmt die Verbform. Das Prädikat ist das Verb – auch mehrteilig: hat … gekauft, ruft … an, muss … gehen. Das Akkusativobjekt antwortet auf „Wen oder was?“, das Dativobjekt auf „Wem?“. Das Subjekt steht nicht immer vorne – der Kasus entscheidet.',
  'Члены предложения: подлежащее (Subjekt) отвечает на вопрос «кто? что?», стоит в именительном падеже и определяет форму глагола. Сказуемое (Prädikat) — это глагол, часто из нескольких частей: hat … gekauft, ruft … an, muss … gehen. Прямое дополнение в винительном падеже (Akkusativobjekt) отвечает на вопрос «кого? что?», дополнение в дательном падеже (Dativobjekt) — на вопрос «кому?». Подлежащее не всегда стоит первым — решает падеж.',
));
ruleTranslations.set('satzglieder', Tr(
  'Члени речення: підмет (Subjekt) відповідає на питання «хто? що?», стоїть у називному відмінку й визначає форму дієслова. Присудок (Prädikat) — це дієслово, часто з кількох частин: hat … gekauft, ruft … an, muss … gehen. Прямий додаток у знахідному відмінку (Akkusativobjekt) відповідає на питання «кого? що?», додаток у давальному відмінку (Dativobjekt) — на питання «кому?». Підмет не завжди стоїть першим — вирішує відмінок.',
  'Նախադասության անդամներ. ենթական (Subjekt) պատասխանում է «ո՞վ, ի՞նչ» հարցին, դրվում է ուղղական հոլովով և որոշում է բայի ձևը։ Ստորոգյալը (Prädikat) բայն է, հաճախ մի քանի մասից՝ hat … gekauft, ruft … an, muss … gehen։ Հայցական հոլովով ուղիղ խնդիրը (Akkusativobjekt) պատասխանում է «ո՞ւմ, ի՞նչ» հարցին, տրական հոլովով խնդիրը (Dativobjekt)՝ «ո՞ւմ» հարցին։ Ենթական միշտ չէ, որ առաջինն է՝ որոշում է հոլովը։',
  'წინადადების წევრები: ქვემდებარე (Subjekt) პასუხობს კითხვას „ვინ? რა?“, დგას სახელობით ბრუნვაში და განსაზღვრავს ზმნის ფორმას. შემასმენელი (Prädikat) ზმნაა, ხშირად რამდენიმე ნაწილისგან: hat … gekauft, ruft … an, muss … gehen. ბრალდებით ბრუნვაში მდგარი პირდაპირი დამატება (Akkusativobjekt) პასუხობს კითხვას „ვის? რას?“, მიცემით ბრუნვაში მდგარი დამატება (Dativobjekt) — კითხვას „ვის?“. ქვემდებარე ყოველთვის პირველ ადგილზე არ დგას — ბრუნვა წყვეტს.',
));

/* Rules.kt */
function rule(id) {
  const base = rules.get(id) || spellRules.get(id);
  if (!base) return Bi('', '');
  return Bi(() => base.de, () => {
    if (AppLang.current === Lang.HU) return huRules.get(id) || base.loc;
    const x = ruleTranslations.get(id); return (x && x.get(AppLang.current)) || base.loc;
  });
}

/* Rewards.kt */
const levelFor = (points) => { let idx = -1; levelThresholds.forEach((th, i) => { if (points >= th) idx = i; }); return idx + 1; };

/* Strings.kt */
function strings(lang) { return lang === Lang.RU ? STR_RU : lang === Lang.UK ? STR_UK : lang === Lang.HY ? STR_HY : lang === Lang.HU ? STR_HU : STR_KA; }
Object.defineProperty(globalThis, 'S', { get() { return strings(AppLang.current); } });
