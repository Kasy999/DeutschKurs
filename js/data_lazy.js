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
const choiceItems = [...baseChoiceItems, ...[...extraChoice, ...extraChoiceCasesTenses, ...extraChoiceModalPast, ...extraChoiceKonj].map((x) => x.item)];
const orderItems = [...baseOrderItems, ...extraOrder.map((x) => x.item)];
const spellItems = [...baseSpellItems, ...extraSpell.map((x) => x.item)];

/* Lang.kt */
translations = new Map([
  ...trWords, ...trLife, ...extraVocab.map((x) => [x.word.ru, x.tr]), ...trVerbs, ...trVerbsExtra, ...trReflexive, ...trKonj, ...trMisc,
  ...trChoice1, ...trChoice2, ...trOrder, ...trSpell,
  ...[...extraChoice, ...extraChoiceCasesTenses, ...extraChoiceModalPast, ...extraChoiceKonj].map((x) => [x.item.ru, x.tr]),
  ...extraOrder.map((x) => [x.item.ru, x.tr]),
  ...extraSpell.map((x) => [x.item.ru, x.tr]),
]);
ruleTranslations = new Map([...trRules, ...trRulesExtra, ...trSpellRules]);

/* Rules.kt */
function rule(id) {
  const base = rules.get(id) || spellRules.get(id);
  if (!base) return Bi('', '');
  return Bi(() => base.de, () => { const x = ruleTranslations.get(id); return (x && x.get(AppLang.current)) || base.loc; });
}

/* Rewards.kt */
const levelFor = (points) => { let idx = -1; levelThresholds.forEach((th, i) => { if (points >= th) idx = i; }); return idx + 1; };

/* Strings.kt */
function strings(lang) { return lang === Lang.RU ? STR_RU : lang === Lang.UK ? STR_UK : lang === Lang.HY ? STR_HY : STR_KA; }
Object.defineProperty(globalThis, 'S', { get() { return strings(AppLang.current); } });
