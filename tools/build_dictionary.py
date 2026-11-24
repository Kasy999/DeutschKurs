#!/usr/bin/env python3
"""
Baut die Wörterbücher der DeutschKurs-Webapp (dict/ru.txt, dict/uk.txt, dict/hy.txt, dict/ka.txt, dict/hu.txt
und dict/index.json) aus den freien Wiktionary-Daten von kaikki.org (Wiktextract).

Quellen (alle CC BY-SA, Wiktionary-Autoren):
  1. Deutsches Wiktionary  – deutsche Wörter mit Übersetzungen + Wörter der Zielsprachen mit deutscher Bedeutung
  2. Russisches Wiktionary – russische Wörter mit deutschen Übersetzungen + deutsche Wörter mit russischer Bedeutung
  3. Englisches Wiktionary – Übersetzungstabellen: Deutsch und Zielsprache für dieselbe englische Bedeutung,
     außerdem Wörter der Zielsprachen mit englischer Bedeutung, die über Englisch → Deutsch übertragen werden
     (nur als Ergänzung, wenn es keine direkte Übersetzung gibt; in der App mit * markiert)

Normalerweise läuft das Skript als GitHub-Action (.github/workflows/build-dictionary.yml).
Lokal:  python tools/build_dictionary.py            (lädt alles herunter, ca. 3,5 GB, dauert lange)
        python tools/build_dictionary.py --no-en    (ohne englisches Wiktionary, viel schneller)
        python tools/build_dictionary.py --de DATEI --ru DATEI --en DATEI   (lokale .jsonl/.jsonl.gz-Dateien)

Dateiformat (UTF-8, eine Zeile pro Eintrag, Felder mit TAB getrennt):
  D  deutsch  artikel  plural  wortart  übersetzungen  quelle      (Deutsch → Sprache; quelle w = direkt, e = über Englisch)
  X  wort     wortart  bedeutungen  quelle                         (Sprache → Deutsch; quelle w = direkt, e = über Englisch)
  Mehrere Bedeutungen sind mit " ; " getrennt, Wörter einer Bedeutung mit ", ".
"""
import argparse, datetime, gzip, io, json, os, re, sys, time, urllib.request

try:
    import orjson
    loads = orjson.loads
except ImportError:  # langsamer, funktioniert aber
    loads = json.loads

LANGS = ['ru', 'uk', 'hy', 'ka', 'hu']
URLS = {
    'de': ['https://kaikki.org/dictionary/downloads/de/de-extract.jsonl.gz', 'https://kaikki.org/dictionary/downloads/de/de-extract.json.gz'],
    'ru': ['https://kaikki.org/dictionary/downloads/ru/ru-extract.jsonl.gz', 'https://kaikki.org/dictionary/downloads/ru/ru-extract.json.gz'],
    'en': ['https://kaikki.org/dictionary/raw-wiktextract-data.jsonl.gz', 'https://kaikki.org/dictionary/raw-wiktextract-data.json.gz'],
}
MAX_WORDS_PER_SENSE = 6
MAX_SENSES = 8
MAX_GLOSS = 90

POS = {  # Wiktextract-Wortarten → kurze deutsche Kürzel für die App
    'noun': 'n', 'name': 'name', 'verb': 'v', 'adj': 'adj', 'adv': 'adv', 'prep': 'präp', 'pron': 'pron', 'conj': 'konj',
    'num': 'num', 'intj': 'interj', 'phrase': 'wend', 'proverb': 'wend', 'abbrev': 'abk', 'article': 'art', 'particle': 'part',
    'det': 'art', 'postp': 'präp', 'contraction': 'abk', 'prep_phrase': 'wend', 'adj_noun': 'adj',
}
ART = {'masculine': 'der', 'feminine': 'die', 'neuter': 'das'}
BAD = re.compile(r'[\[\]{}<>|=\t\n]')
STRESS = '́̀'


def log(*a):
    print(time.strftime('%H:%M:%S'), *a, flush=True)


def open_source(name, path):
    """Datei oder URL als Zeilenstrom (bytes) öffnen; .gz wird entpackt."""
    if path:
        raw = open(path, 'rb')
        src = path
    else:
        last = None
        for url in URLS[name]:
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'DeutschKurs-Dictionary-Builder/1.0'})
                raw = urllib.request.urlopen(req, timeout=120)
                src = url
                break
            except Exception as e:  # nächsten Dateinamen probieren
                last = e
        else:
            raise SystemExit(f'Download fehlgeschlagen ({name}): {last}')
    log('Lese', src)
    stream = gzip.GzipFile(fileobj=raw) if src.endswith('.gz') else raw
    return io.BufferedReader(stream, buffer_size=1 << 20)


def clean(w):
    if not isinstance(w, str):
        return ''
    w = w.strip().strip(',;').strip()
    if not w or len(w) > 60 or BAD.search(w):
        return ''
    return w


def short(g):
    g = re.sub(r'\s+', ' ', g or '').strip()
    if BAD.search(g):
        g = BAD.sub('', g)
    return g if len(g) <= MAX_GLOSS else g[:MAX_GLOSS - 1].rstrip() + '…'


class Store:
    def __init__(self):
        # deutsches Wort → {'art': set, 'pl': str, 'pos': set, 'tr': {lang: {sense: [wörter]}}, 'pv': {lang: [wörter]}}
        self.de = {}
        # (sprache, wort) → {'pos': set, 'gl': [bedeutungen]}
        self.x = {lang: {} for lang in LANGS}
        # Sprache → Deutsch über englische Bedeutung (nur genutzt, wenn es keinen direkten Eintrag gibt)
        self.xe = {lang: {} for lang in LANGS}

    def de_entry(self, word):
        e = self.de.get(word)
        if e is None:
            e = self.de[word] = {'art': set(), 'pl': '', 'pos': set(), 'tr': {}, 'pv': {}}
        return e

    def add_tr(self, word, lang, sense, tw):
        tw = clean(tw)
        if not tw:
            return
        senses = self.de_entry(word)['tr'].setdefault(lang, {})
        if any(tw in ws for ws in senses.values()):  # schon bei einer anderen Bedeutung vorhanden
            return
        lst = senses.setdefault(sense or '', [])
        if len(lst) < MAX_WORDS_PER_SENSE:
            lst.append(tw)

    def add_x(self, lang, word, pos, gloss):
        word, gloss = clean(word), short(gloss)
        if not word or not gloss:
            return
        e = self.x[lang].setdefault(word, {'pos': set(), 'gl': []})
        if pos:
            e['pos'].add(pos)
        if gloss not in e['gl'] and len(e['gl']) < MAX_SENSES:
            e['gl'].append(gloss)


def german_info(st, obj):
    """Artikel, Plural und Wortart eines deutschen Eintrags übernehmen."""
    word = clean(obj.get('word'))
    if not word:
        return None
    e = st.de_entry(word)
    pos = POS.get(obj.get('pos'), '')
    if pos:
        e['pos'].add(pos)
    if obj.get('pos') == 'noun':
        for t in obj.get('tags') or []:
            if t in ART:
                e['art'].add(ART[t])
        if not e['pl']:
            for f in obj.get('forms') or []:
                tags = f.get('tags') or []
                if 'plural' in tags and 'nominative' in tags and clean(f.get('form')):
                    e['pl'] = clean(f.get('form'))
                    break
    return word


def read_de(st, fh):
    n = 0
    for line in fh:
        if b'"lang_code"' not in line:
            continue
        try:
            obj = loads(line)
        except Exception:
            continue
        lc = obj.get('lang_code')
        if lc == 'de':
            word = german_info(st, obj)
            if not word:
                continue
            for t in obj.get('translations') or []:
                lang = t.get('lang_code')
                if lang in LANGS:
                    st.add_tr(word, lang, t.get('sense_index') or t.get('sense') or '', t.get('word'))
            n += 1
        elif lc in LANGS:
            pos = POS.get(obj.get('pos'), '')
            for s in obj.get('senses') or []:
                for g in s.get('glosses') or []:
                    st.add_x(lc, obj.get('word'), pos, g)
        if n and n % 200000 == 0:
            log('  de:', n, 'deutsche Einträge')
    log('de fertig:', n, 'deutsche Einträge')


def read_ru(st, fh):
    n = 0
    for line in fh:
        try:
            obj = loads(line)
        except Exception:
            continue
        lc = obj.get('lang_code')
        if lc == 'ru':
            word = clean(obj.get('word'))
            pos = POS.get(obj.get('pos'), '')
            for t in obj.get('translations') or []:
                if (t.get('lang_code') or t.get('code')) == 'de':
                    de = clean(t.get('word'))
                    if de and word:
                        st.add_x('ru', word, pos, de)            # Russisch → Deutsch
                        st.add_tr(de, 'ru', 'ru:' + (t.get('sense') or ''), word)  # umgekehrt auch Deutsch → Russisch
                        n += 1
        elif lc == 'de':
            word = german_info(st, obj)
            if not word:
                continue
            for i, s in enumerate(obj.get('senses') or []):
                for g in s.get('glosses') or []:
                    g = short(g)
                    if g and len(g) <= 40:  # nur kurze russische Bedeutungen sind Übersetzungen
                        st.add_tr(word, 'ru', 'rg%d' % i, g)
    log('ru fertig:', n, 'Übersetzungen')


def read_en(st, fh):
    n = 0
    en_de = {}      # (englisches Wort, Wortart) → [deutsche Wörter], erste Bedeutung zuerst
    pending = {lang: {} for lang in LANGS}   # Zielsprachen-Wort → [(wortart, englische Bedeutung)]
    for line in fh:
        has_tr = b'"translations"' in line
        if not has_tr and not EN_TARGET.search(line):
            continue
        try:
            obj = loads(line)
        except Exception:
            continue
        lc = obj.get('lang_code')
        if lc in LANGS:  # z. B. ungarisches Wort mit englischer Bedeutung
            word = clean(obj.get('word'))
            if not word:
                continue
            lst = pending[lc].setdefault(word, [])
            for sn in obj.get('senses') or []:
                if 'form-of' in (sn.get('tags') or []) or sn.get('form_of'):
                    continue
                for g in sn.get('glosses') or []:
                    if len(lst) < MAX_SENSES:
                        lst.append((obj.get('pos') or '', g))
            continue
        if lc != 'en' or not has_tr:
            continue
        groups = {}
        for t in obj.get('translations') or []:
            code = t.get('lang_code') or t.get('code')
            if code != 'de' and code not in LANGS:
                continue
            w = clean(t.get('word'))
            if w:
                g = groups.setdefault(t.get('sense') or '', {})
                g.setdefault(code, []).append((w, t.get('tags') or []))
        key = ((obj.get('word') or '').lower(), obj.get('pos') or '')
        for g in groups.values():
            des = g.get('de')
            if not des:
                continue
            lst = en_de.setdefault(key, [])
            for de, _ in des[:3]:
                if de not in lst and len(lst) < 6:
                    lst.append(de)
            for de, tags in des[:4]:
                e = st.de_entry(de)
                for t in tags:
                    if t in ART and de[:1].isupper():
                        e['art'].add(ART[t])
                for lang in LANGS:
                    for w, _ in g.get(lang, [])[:MAX_WORDS_PER_SENSE]:
                        lst2 = e['pv'].setdefault(lang, [])
                        if w not in lst2 and len(lst2) < MAX_WORDS_PER_SENSE * 2:
                            lst2.append(w)
                            n += 1
    log('en: ', n, 'Wortpaare über englische Übersetzungstabellen')
    # Englische Bedeutungen über en_de ins Deutsche übertragen
    by_word = {}
    for (w, pos), des in en_de.items():
        by_word.setdefault(w, des)
    m = 0
    for lang in LANGS:
        for word, glosses in pending[lang].items():
            if word in st.x[lang]:
                continue  # direkter Eintrag vorhanden
            out = []
            for pos, gloss in glosses:
                for de in en_to_de(gloss, pos, en_de, by_word):
                    if de not in out and len(out) < 8:
                        out.append(de)
            if out:
                ps = POS.get(next((p for p, _ in glosses if p), ''), '')
                st.xe[lang][word] = {'pos': {ps} if ps else set(), 'gl': [', '.join(out)]}
                m += 1
    log('en fertig:', m, 'Wörter Sprache → Deutsch über Englisch')


EN_TARGET = re.compile(rb'"lang_code": ?"(%s)"' % '|'.join(LANGS).encode())
EN_DROP = re.compile(r'\([^)]*\)|\[[^\]]*\]')
EN_ART = re.compile(r'^(to|a|an|the)\s+', re.I)


def en_to_de(gloss, pos, en_de, by_word):
    """Kurze englische Bedeutungen („dog“, „to go“, „beautiful, pretty“) in deutsche Wörter übersetzen."""
    g = EN_DROP.sub('', gloss or '')
    res = []
    for part in re.split(r'[;,]', g):
        part = EN_ART.sub('', part.strip().rstrip('.')).strip().lower()
        if not part or len(part.split()) > 3:
            continue
        des = en_de.get((part, pos)) or by_word.get(part)
        if des:
            res.extend(des[:3])
        if len(res) >= 6:
            break
    return res


def norm(s):
    s = s.lower()
    for ch in STRESS:
        s = s.replace(ch, '')
    return s.replace('ё', 'е')


def write(st, out_dir, sources):
    os.makedirs(out_dir, exist_ok=True)
    now = datetime.datetime.now(datetime.timezone.utc)
    index = {'version': now.strftime('%Y%m%d%H%M'), 'built': now.strftime('%Y-%m-%dT%H:%M:%SZ'),
             'license': 'CC BY-SA 4.0 – Wiktionary-Autoren, extrahiert mit Wiktextract (kaikki.org)', 'sources': sources, 'langs': {}}
    for lang in LANGS:
        lines = []
        nd = nx = 0
        for word in sorted(st.de, key=lambda w: (norm(w), w)):
            e = st.de[word]
            senses = e['tr'].get(lang)
            src = 'w'
            if senses:
                groups = [', '.join(ws) for ws in list(senses.values())[:MAX_SENSES] if ws]
            elif e['pv'].get(lang):
                groups = [', '.join(e['pv'][lang][:MAX_WORDS_PER_SENSE * 2])]
                src = 'e'
            else:
                continue
            art = '/'.join(a for a in ('der', 'die', 'das') if a in e['art']) if 'n' in e['pos'] or e['art'] else ''
            pos = ','.join(sorted(e['pos']))
            lines.append('\t'.join(['D', word, art, e['pl'], pos, ' ; '.join(groups), src]))
            nd += 1
        xall = {w: (e, 'w') for w, e in st.x[lang].items()}
        for w, e in st.xe[lang].items():
            xall.setdefault(w, (e, 'e'))
        for word in sorted(xall, key=lambda w: (norm(w), w)):
            e, src = xall[word]
            lines.append('\t'.join(['X', word, ','.join(sorted(e['pos'])), ' ; '.join(e['gl']), src]))
            nx += 1
        data = ('\n'.join(lines) + '\n').encode('utf-8')
        with open(os.path.join(out_dir, lang + '.txt'), 'wb') as f:
            f.write(data)
        index['langs'][lang] = {'file': lang + '.txt', 'de': nd, 'x': nx, 'bytes': len(data), 'gzip': len(gzip.compress(data, 6))}
        log(f'{lang}: {nd} deutsche Stichwörter, {nx} Stichwörter {lang}→de, {len(data) / 1e6:.1f} MB')
    with open(os.path.join(out_dir, 'index.json'), 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=1)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--de'); ap.add_argument('--ru'); ap.add_argument('--en')
    ap.add_argument('--no-en', action='store_true', help='englisches Wiktionary auslassen')
    ap.add_argument('--no-ru', action='store_true', help='russisches Wiktionary auslassen')
    ap.add_argument('--out', default=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dict'))
    a = ap.parse_args()
    st = Store()
    sources = []
    with open_source('de', a.de) as fh:
        read_de(st, fh)
    sources.append('de.wiktionary.org')
    if not a.no_ru:
        with open_source('ru', a.ru) as fh:
            read_ru(st, fh)
        sources.append('ru.wiktionary.org')
    if not a.no_en:
        with open_source('en', a.en) as fh:
            read_en(st, fh)
        sources.append('en.wiktionary.org')
    write(st, os.path.abspath(a.out), sources)
    log('Fertig.')


if __name__ == '__main__':
    main()
