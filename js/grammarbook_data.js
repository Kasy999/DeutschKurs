'use strict';
// Regelbuch (Grammatik A1–B2): 12 Kapitel in Deutsch, Russisch, Ukrainisch, Armenisch, Georgisch und Ungarisch.
// Aufbau eines Kapitels:
//   id, icon, levels, rules (IDs der Kurzregeln aus data.js – verbindet Übungen mit dem Kapitel)
//   tables:   [{ head: [...], rows: [[...]] }]           (Tabelleninhalt Deutsch)
//   examples: [{ de: 'Text mit [Hervorhebung]', ru, uk, hy, ka, hu }]
//   mistakes: [{ w: 'falsch', r: 'richtig' }]
//   text: { de|ru|uk|hy|ka|hu: { title, sum, pts: [...], tip, why: [... je Fehler] } }
// Neue Sprache: in jedem Kapitel einen weiteren Schlüssel in text/examples ergänzen und in GB_UI (grammarbook.js) Oberflächentexte anlegen.

const GB_CHAPTERS = [];

/* =====================================================================
   1 · Satzbau
   ===================================================================== */
GB_CHAPTERS.push({
  id: 'satzbau', icon: '🧱', levels: ['A1'],
  rules: ['v2', 'vfrage', 'wfrage', 'satzklammer', 'satzglieder'],
  tables: [{
    head: ['Platz 1', 'Platz 2 = Verb', 'Mitte', 'Ende'],
    rows: [
      ['Ich', 'lerne', 'heute Deutsch.', ''],
      ['Heute', 'lerne', 'ich Deutsch.', ''],
      ['Morgen', 'rufe', 'ich dich', 'an.'],
      ['Ich', 'habe', 'gestern Pizza', 'gegessen.'],
      ['Wann', 'kommst', 'du?', ''],
      ['(Ja/Nein-Frage)', 'Kommst', 'du heute?', ''],
    ],
  }],
  examples: [
    { de: 'Ich [lerne] heute Deutsch.', ru: 'Я сегодня учу немецкий.', uk: 'Я сьогодні вчу німецьку.', hy: 'Ես այսօր գերմաներեն եմ սովորում։', ka: 'მე დღეს გერმანულს ვსწავლობ.', hu: 'Én ma németet tanulok.' },
    { de: 'Heute [lerne] ich Deutsch.', ru: 'Сегодня я учу немецкий.', uk: 'Сьогодні я вчу німецьку.', hy: 'Այսօր ես գերմաներեն եմ սովորում։', ka: 'დღეს მე გერმანულს ვსწავლობ.', hu: 'Ma németet tanulok.' },
    { de: 'Am Abend [kochen] wir zusammen.', ru: 'Вечером мы готовим вместе.', uk: 'Увечері ми готуємо разом.', hy: 'Երեկոյան մենք միասին ճաշ ենք պատրաստում։', ka: 'საღამოს ჩვენ ერთად ვამზადებთ საჭმელს.', hu: 'Este együtt főzünk.' },
    { de: '[Kommst] du morgen?', ru: 'Ты придёшь завтра?', uk: 'Ти прийдеш завтра?', hy: 'Վաղը կգա՞ս։', ka: 'ხვალ მოხვალ?', hu: 'Holnap jössz?' },
    { de: 'Wir [müssen] heute lange [arbeiten].', ru: 'Сегодня нам нужно долго работать.', uk: 'Сьогодні нам треба довго працювати.', hy: 'Այսօր մենք պետք է երկար աշխատենք։', ka: 'დღეს დიდხანს უნდა ვიმუშაოთ.', hu: 'Ma sokáig kell dolgoznunk.' },
  ],
  mistakes: [
    { w: 'Heute ich lerne Deutsch.', r: 'Heute lerne ich Deutsch.' },
    { w: 'Ich habe gegessen Pizza.', r: 'Ich habe Pizza gegessen.' },
  ],
  text: {
    de: {
      title: 'Satzbau: Das Verb steht auf Platz 2',
      sum: 'Im deutschen Aussagesatz ist Platz 2 immer für das konjugierte Verb reserviert – egal, was am Anfang steht.',
      pts: [
        'Platz 1 ist EIN Satzteil, auch wenn er aus mehreren Wörtern besteht: „Am Abend“, „Mein kleiner Bruder“.',
        'Steht nicht das Subjekt auf Platz 1 (sondern Zeit, Ort oder ein Objekt), kommt das Subjekt direkt nach dem Verb: Heute lerne ich.',
        'Satzklammer: Hat das Verb zwei Teile (Modalverb + Infinitiv, haben + Partizip, trennbares Präfix), steht Teil 1 auf Platz 2 und Teil 2 ganz am Ende.',
        'Ja/Nein-Fragen beginnen mit dem Verb: Kommst du? W-Fragen: Fragewort auf Platz 1, Verb auf Platz 2: Wann kommst du?',
        'In der Satzmitte gilt oft: Zeit – Grund – Art – Ort (TeKaMoLo): Ich fahre morgen wegen der Arbeit mit dem Zug nach Berlin.',
      ],
      tip: 'Formel: [Platz 1] + [VERB] + [Rest] + [zweiter Verbteil].',
      why: ['„Heute“ besetzt schon Platz 1. Darum muss das Verb „lerne“ auf Platz 2 stehen, das Subjekt „ich“ kommt danach.', 'Das Partizip „gegessen“ ist der zweite Verbteil und gehört ans Satzende.'],
    },
    ru: {
      title: 'Порядок слов: глагол на 2-м месте',
      sum: 'В немецком повествовательном предложении 2-е место всегда занимает изменяемый глагол — что бы ни стояло в начале.',
      pts: [
        'В русском порядок слов свободный: «Сегодня я учу» = «Я сегодня учу». В немецком изменяемый глагол «приклеен» ко 2-му месту.',
        '1-е место — это один член предложения, даже если в нём несколько слов: «Am Abend», «Mein kleiner Bruder».',
        'Если на 1-м месте не подлежащее (а время, место или дополнение), подлежащее встаёт сразу после глагола: Heute lerne ich.',
        'Рамка (Satzklammer): если у глагола две части (модальный глагол + инфинитив, haben + причастие, отделяемая приставка), первая часть стоит на 2-м месте, вторая — в самом конце.',
        'Вопрос «да/нет» начинается с глагола: Kommst du? Вопрос с вопросительным словом: слово на 1-м месте, глагол на 2-м: Wann kommst du?',
        'В середине предложения обычно порядок «когда – почему – как – где» (TeKaMoLo): Ich fahre morgen wegen der Arbeit mit dem Zug nach Berlin.',
      ],
      tip: 'Формула: [1-е место] + [ГЛАГОЛ] + [всё остальное] + [вторая часть глагола].',
      why: ['«Heute» (сегодня) уже занимает 1-е место, поэтому глагол «lerne» встаёт на 2-е, а «ich» — после него.', 'По-русски «я съел пиццу» — глагол стоит рядом. В немецком причастие «gegessen» уходит в конец предложения.'],
    },
    uk: {
      title: 'Порядок слів: дієслово на 2-му місці',
      sum: 'У німецькому розповідному реченні 2-ге місце завжди займає змінюване дієслово — хоч би що стояло на початку.',
      pts: [
        'В українській порядок слів вільний: «Сьогодні я вчу» = «Я сьогодні вчу». У німецькій змінюване дієслово «прив’язане» до 2-го місця.',
        '1-ше місце — це один член речення, навіть якщо в ньому кілька слів: «Am Abend», «Mein kleiner Bruder».',
        'Якщо на 1-му місці не підмет (а час, місце чи додаток), підмет стає одразу після дієслова: Heute lerne ich.',
        'Рамка (Satzklammer): якщо дієслово має дві частини (модальне дієслово + інфінітив, haben + дієприкметник, відокремлюваний префікс), перша частина стоїть на 2-му місці, друга — у самому кінці.',
        'Питання «так/ні» починається з дієслова: Kommst du? Питання з питальним словом: слово на 1-му місці, дієслово на 2-му: Wann kommst du?',
        'У середині речення зазвичай порядок «коли – чому – як – де» (TeKaMoLo): Ich fahre morgen wegen der Arbeit mit dem Zug nach Berlin.',
      ],
      tip: 'Формула: [1-ше місце] + [ДІЄСЛОВО] + [усе інше] + [друга частина дієслова].',
      why: ['«Heute» (сьогодні) вже займає 1-ше місце, тому дієслово «lerne» стає на 2-ге, а «ich» — після нього.', 'Українською «я з’їв піцу» — дієслово стоїть поруч. У німецькій дієприкметник «gegessen» іде в кінець речення.'],
    },
    hy: {
      title: 'Բառերի դասավորություն. բայը 2-րդ տեղում է',
      sum: 'Գերմաներեն պատմողական նախադասության մեջ 2-րդ տեղը միշտ խոնարհված բայինն է, ինչով էլ սկսվի նախադասությունը։',
      pts: [
        'Հայերենում բառերի կարգն ազատ է, և բայը հաճախ վերջում է («Ես այսօր գերմաներեն եմ սովորում»)։ Գերմաներենում խոնարհված բայը միշտ 2-րդ տեղում է։',
        '1-ին տեղը նախադասության մեկ անդամ է, նույնիսկ եթե այն մի քանի բառից է՝ «Am Abend», «Mein kleiner Bruder»։',
        'Եթե 1-ին տեղում ենթական չէ (այլ ժամանակ, տեղ կամ խնդիր), ենթական դրվում է անմիջապես բայից հետո՝ Heute lerne ich։',
        'Բայական շրջանակ (Satzklammer). եթե բայը երկու մասից է (եղանակավորող բայ + անորոշ դերբայ, haben + դերբայ, անջատվող նախածանց), առաջին մասը 2-րդ տեղում է, երկրորդը՝ նախադասության վերջում։',
        '«Այո/ոչ» հարցը սկսվում է բայով՝ Kommst du? Հարցական բառով հարցում բառը 1-ին տեղում է, բայը՝ 2-րդ՝ Wann kommst du?',
        'Նախադասության մեջտեղում սովորաբար այսպես է՝ «երբ – ինչու – ինչպես – որտեղ» (TeKaMoLo)՝ Ich fahre morgen wegen der Arbeit mit dem Zug nach Berlin։',
      ],
      tip: 'Բանաձև՝ [1-ին տեղ] + [ԲԱՅ] + [մնացածը] + [բայի երկրորդ մասը]։',
      why: ['«Heute»-ն (այսօր) արդեն զբաղեցնում է 1-ին տեղը, ուստի «lerne» բայը պետք է լինի 2-րդ տեղում, իսկ «ich»-ը՝ դրանից հետո։', '«gegessen» դերբայը բայի երկրորդ մասն է և գնում է նախադասության վերջ։'],
    },
    ka: {
      title: 'სიტყვათა წყობა: ზმნა მე-2 ადგილზეა',
      sum: 'გერმანულ თხრობით წინადადებაში მე-2 ადგილი ყოველთვის უღლებად ზმნას ეკუთვნის — რითაც არ უნდა იწყებოდეს წინადადება.',
      pts: [
        'ქართულში სიტყვათა წყობა თავისუფალია და ზმნა ხშირად ბოლოშია („მე დღეს გერმანულს ვსწავლობ“). გერმანულში უღლებადი ზმნა მყარად დგას მე-2 ადგილზე.',
        'პირველი ადგილი წინადადების ერთი წევრია, თუნდაც რამდენიმე სიტყვისგან შედგებოდეს: „Am Abend“, „Mein kleiner Bruder“.',
        'თუ პირველ ადგილზე ქვემდებარე არ არის (არამედ დრო, ადგილი ან დამატება), ქვემდებარე ზმნის შემდეგ დგება: Heute lerne ich.',
        'ზმნური ჩარჩო (Satzklammer): თუ ზმნა ორი ნაწილისგან შედგება (მოდალური ზმნა + ინფინიტივი, haben + მიმღეობა, მოცილებადი ზმნისწინი), პირველი ნაწილი მე-2 ადგილზეა, მეორე — წინადადების ბოლოს.',
        '„კი/არა“ კითხვა ზმნით იწყება: Kommst du? კითხვითი სიტყვის შემთხვევაში სიტყვა პირველ ადგილზეა, ზმნა — მეორეზე: Wann kommst du?',
        'წინადადების შუაში ჩვეულებრივ ასეთი რიგია: „როდის – რატომ – როგორ – სად“ (TeKaMoLo): Ich fahre morgen wegen der Arbeit mit dem Zug nach Berlin.',
      ],
      tip: 'ფორმულა: [1-ლი ადგილი] + [ზმნა] + [დანარჩენი] + [ზმნის მეორე ნაწილი].',
      why: ['„Heute“ (დღეს) უკვე იკავებს პირველ ადგილს, ამიტომ ზმნა „lerne“ მე-2 ადგილზე უნდა იდგეს, „ich“ კი — მის შემდეგ.', 'მიმღეობა „gegessen“ ზმნის მეორე ნაწილია და წინადადების ბოლოში მიდის.'],
    },
    hu: {
      title: 'Szórend: az ige a 2. helyen áll',
      sum: 'A német kijelentő mondatban a 2. hely mindig a ragozott igéé – bármivel kezdődik is a mondat.',
      pts: [
        'A magyar szórend a hangsúlytól függ, az ige sok helyen állhat. A németben a ragozott ige a kijelentő mondatban mindig a 2. helyen van.',
        'Az 1. hely egyetlen mondatrész, akkor is, ha több szóból áll: „Am Abend“, „Mein kleiner Bruder“.',
        'Ha az 1. helyen nem az alany áll (hanem idő, hely vagy tárgy), az alany közvetlenül az ige után jön: Heute lerne ich.',
        'Mondatkeret (Satzklammer): ha az ige két részből áll (módbeli segédige + főnévi igenév, haben + melléknévi igenév, elváló igekötő), az első rész a 2. helyen, a második a mondat végén áll.',
        'Az eldöntendő kérdés igével kezdődik: Kommst du? Kérdőszós kérdésben a kérdőszó az 1., az ige a 2. helyen áll: Wann kommst du?',
        'A mondat közepén általában ez a sorrend: „mikor – miért – hogyan – hol“ (TeKaMoLo): Ich fahre morgen wegen der Arbeit mit dem Zug nach Berlin.',
      ],
      tip: 'Képlet: [1. hely] + [IGE] + [minden más] + [az ige második része].',
      why: ['A „Heute“ (ma) már elfoglalja az 1. helyet, ezért a „lerne“ igének a 2. helyen kell állnia, az „ich“ pedig utána jön.', 'A „gegessen“ az ige második része, ezért a mondat végére kerül.'],
    },
  },
});

/* =====================================================================
   2 · Präsens, trennbare Verben, Imperativ
   ===================================================================== */
GB_CHAPTERS.push({
  id: 'praesens', icon: '⚡', levels: ['A1'],
  rules: ['sein', 'haben', 'trennbar', 'imperativ'],
  tables: [{
    head: ['Person', 'Endung', 'machen', 'arbeiten', 'fahren', 'sein', 'haben'],
    rows: [
      ['ich', '-e', 'mache', 'arbeite', 'fahre', 'bin', 'habe'],
      ['du', '-st', 'machst', 'arbeitest', 'fährst', 'bist', 'hast'],
      ['er/sie/es', '-t', 'macht', 'arbeitet', 'fährt', 'ist', 'hat'],
      ['wir', '-en', 'machen', 'arbeiten', 'fahren', 'sind', 'haben'],
      ['ihr', '-t', 'macht', 'arbeitet', 'fahrt', 'seid', 'habt'],
      ['sie/Sie', '-en', 'machen', 'arbeiten', 'fahren', 'sind', 'haben'],
    ],
  }, {
    head: ['Imperativ', 'kommen', 'nehmen', 'anrufen', 'sein'],
    rows: [
      ['du', 'Komm!', 'Nimm!', 'Ruf an!', 'Sei ruhig!'],
      ['ihr', 'Kommt!', 'Nehmt!', 'Ruft an!', 'Seid ruhig!'],
      ['Sie', 'Kommen Sie!', 'Nehmen Sie!', 'Rufen Sie an!', 'Seien Sie ruhig!'],
    ],
  }],
  examples: [
    { de: 'Ich [wohne] in Berlin.', ru: 'Я живу в Берлине.', uk: 'Я живу в Берліні.', hy: 'Ես ապրում եմ Բեռլինում։', ka: 'ბერლინში ვცხოვრობ.', hu: 'Berlinben lakom.' },
    { de: '[Fährst] du heute nach Hause?', ru: 'Ты сегодня едешь домой?', uk: 'Ти сьогодні їдеш додому?', hy: 'Այսօր տո՞ւն ես գնում։', ka: 'დღეს სახლში მიდიხარ?', hu: 'Ma hazamész?' },
    { de: 'Ich [stehe] um 7 Uhr [auf].', ru: 'Я встаю в 7 часов.', uk: 'Я встаю о 7-й годині.', hy: 'Ես վեր եմ կենում ժամը 7-ին։', ka: '7 საათზე ვდგები.', hu: '7 órakor kelek fel.' },
    { de: 'Er [ist] müde.', ru: 'Он устал.', uk: 'Він утомився.', hy: 'Նա հոգնած է։', ka: 'ის დაღლილია.', hu: 'Ő fáradt.' },
    { de: '[Ruf] mich bitte [an]!', ru: 'Позвони мне, пожалуйста!', uk: 'Подзвони мені, будь ласка!', hy: 'Խնդրում եմ, զանգիր ինձ։', ka: 'დამირეკე, თუ შეიძლება!', hu: 'Kérlek, hívj fel!' },
  ],
  mistakes: [
    { w: 'Er müde.', r: 'Er ist müde.' },
    { w: 'Ich anrufe dich morgen.', r: 'Ich rufe dich morgen an.' },
  ],
  text: {
    de: {
      title: 'Verben im Präsens, trennbare Verben und Imperativ',
      sum: 'Die Endung des Verbs zeigt, wer etwas tut – und manche Verben teilen sich im Satz in zwei Teile.',
      pts: [
        'Endungen: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en.',
        'Stamm auf -t oder -d (arbeiten, finden): vor -st und -t kommt ein -e-: du arbeitest, er findet.',
        'Viele starke Verben ändern bei du und er/sie/es den Vokal: fahren → du fährst, sehen → du siehst, nehmen → du nimmst, lesen → du liest.',
        'sein und haben sind unregelmäßig und kommen ständig vor – zuerst auswendig lernen. „sein“ darf im Satz nie fehlen: Er ist müde.',
        'Trennbare Verben (aufstehen, einkaufen, anrufen, fernsehen): Im Hauptsatz steht das Präfix am Satzende: Ich stehe um 7 Uhr auf. Die Betonung liegt auf dem Präfix: AUFstehen.',
        'Imperativ: du-Form = Stamm ohne -st und ohne „du“ (Komm! Nimm! Lies!), ihr-Form = Präsens ohne „ihr“ (Kommt!), Sie-Form: Kommen Sie! Mit „bitte“ klingt es höflich.',
        'Das Präsens benutzt man auch für die Zukunft: Morgen fahre ich nach Hamburg.',
      ],
      tip: 'Nie trennbar sind be-, ge-, er-, ver-, zer-, ent-, emp-, miss- (bekommen, verstehen). Die meisten anderen (an-, auf-, aus-, ein-, mit-, zu- …) trennen sich.',
      why: ['„sein“ muss immer da sein. Ohne Verb ist der deutsche Satz unvollständig.', '„anrufen“ ist trennbar: „rufe“ steht auf Platz 2, „an“ ganz am Ende.'],
    },
    ru: {
      title: 'Глаголы в настоящем времени, отделяемые приставки и повелительное наклонение',
      sum: 'Окончание глагола показывает, кто действует, а некоторые глаголы в предложении распадаются на две части.',
      pts: [
        'Окончания: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en. Как в русском (я делаю, ты делаешь), только окончаний меньше.',
        'Основа на -t или -d (arbeiten, finden): перед -st и -t вставляется -e-: du arbeitest, er findet.',
        'Многие сильные глаголы меняют гласную у du и er/sie/es: fahren → du fährst, sehen → du siehst, nehmen → du nimmst.',
        'В русском «быть» в настоящем времени пропускают («Он устал»). В немецком так нельзя: Er ist müde. Формы sein и haben выучите в первую очередь.',
        'Отделяемые приставки похожи на русские (вставать = auf + stehen), но в главном предложении они «отрываются» и уходят в конец: Ich stehe um 7 Uhr auf. Ударение — на приставке: AUFstehen.',
        'Повелительное наклонение: для du — основа без -st и без «du» (Komm! Nimm! Lies!), для ihr — как в настоящем времени без «ihr» (Kommt!), вежливо: Kommen Sie! Слово «bitte» делает просьбу вежливой.',
        'Настоящее время используют и для будущего — как в русском «Завтра я еду в Гамбург»: Morgen fahre ich nach Hamburg.',
      ],
      tip: 'Никогда не отделяются be-, ge-, er-, ver-, zer-, ent-, emp-, miss- (bekommen, verstehen). Почти все остальные (an-, auf-, aus-, ein-, mit-, zu- …) отделяются.',
      why: ['В немецком глагол «sein» нужен всегда — без глагола предложение неполное.', '«anrufen» — глагол с отделяемой приставкой: «rufe» на 2-м месте, «an» — в самом конце.'],
    },
    uk: {
      title: 'Дієслова в теперішньому часі, відокремлювані префікси та наказовий спосіб',
      sum: 'Закінчення дієслова показує, хто діє, а деякі дієслова в реченні розпадаються на дві частини.',
      pts: [
        'Закінчення: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en. Як в українській (я роблю, ти робиш), лише закінчень менше.',
        'Основа на -t або -d (arbeiten, finden): перед -st і -t вставляється -e-: du arbeitest, er findet.',
        'Багато сильних дієслів змінюють голосну в du та er/sie/es: fahren → du fährst, sehen → du siehst, nehmen → du nimmst.',
        'В українській «бути» в теперішньому часі зазвичай пропускають («Він утомився»). У німецькій так не можна: Er ist müde. Форми sein і haben вивчіть насамперед.',
        'Відокремлювані префікси схожі на українські префікси (вставати = auf + stehen), але в головному реченні вони «відриваються» і йдуть у кінець: Ich stehe um 7 Uhr auf. Наголос — на префіксі: AUFstehen.',
        'Наказовий спосіб: для du — основа без -st і без «du» (Komm! Nimm! Lies!), для ihr — як у теперішньому часі без «ihr» (Kommt!), ввічливо: Kommen Sie! Слово «bitte» робить прохання ввічливим.',
        'Теперішній час уживають і для майбутнього — як в українському «Завтра я їду до Гамбурга»: Morgen fahre ich nach Hamburg.',
      ],
      tip: 'Ніколи не відокремлюються be-, ge-, er-, ver-, zer-, ent-, emp-, miss- (bekommen, verstehen). Майже всі інші (an-, auf-, aus-, ein-, mit-, zu- …) відокремлюються.',
      why: ['У німецькій дієслово «sein» потрібне завжди — без дієслова речення неповне.', '«anrufen» — дієслово з відокремлюваним префіксом: «rufe» на 2-му місці, «an» — у самому кінці.'],
    },
    hy: {
      title: 'Բայերը ներկա ժամանակում, անջատվող նախածանցներ և հրամայական',
      sum: 'Բայի վերջավորությունը ցույց է տալիս, թե ով է գործողություն կատարում, իսկ որոշ բայեր նախադասության մեջ բաժանվում են երկու մասի։',
      pts: [
        'Հայերենում ներկան կազմվում է երկու բառով (սովորում եմ), գերմաներենում՝ մեկ բառով, որի վերջավորությունը ցույց է տալիս դեմքը՝ ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en։',
        'Եթե արմատը վերջանում է -t կամ -d-ով (arbeiten, finden), -st-ից և -t-ից առաջ ավելանում է -e-՝ du arbeitest, er findet։',
        'Շատ ուժեղ բայեր du-ի և er/sie/es-ի հետ փոխում են ձայնավորը՝ fahren → du fährst, sehen → du siehst, nehmen → du nimmst։',
        'sein (լինել) և haben (ունենալ) բայերն անկանոն են և շատ հաճախ են օգտագործվում․ նախ դրանք անգիր արեք։ Ինչպես հայերենում «է»-ն, գերմաներենում էլ «sein»-ը չի կարելի բաց թողնել՝ Er ist müde։',
        'Անջատվող նախածանցներով բայեր (aufstehen, einkaufen, anrufen)․ գլխավոր նախադասության մեջ նախածանցը գնում է վերջ՝ Ich stehe um 7 Uhr auf։ Շեշտը նախածանցի վրա է՝ AUFstehen։ Սա նման է հայերենի «վեր կենալ» կապակցությանը, որտեղ «եմ»-ը մտնում է մեջտեղ՝ վեր եմ կենում։',
        'Հրամայական՝ du-ի համար արմատն առանց -st-ի և առանց «du»-ի (Komm! Nimm! Lies!), ihr-ի համար՝ ներկայի ձևն առանց «ihr»-ի (Kommt!), քաղաքավարի՝ Kommen Sie! «bitte» բառը խնդրանքը դարձնում է քաղաքավարի։',
        'Ներկան օգտագործվում է նաև ապառնիի համար՝ Morgen fahre ich nach Hamburg (Վաղը գնում եմ Համբուրգ)։',
      ],
      tip: 'Երբեք չեն անջատվում be-, ge-, er-, ver-, zer-, ent-, emp-, miss- նախածանցները (bekommen, verstehen)։ Գրեթե մնացած բոլորը (an-, auf-, aus-, ein-, mit-, zu- …) անջատվում են։',
      why: ['«sein» բայը միշտ պետք է լինի․ առանց բայի գերմաներեն նախադասությունը թերի է։', '«anrufen»-ն անջատվող նախածանցով բայ է՝ «rufe»-ն 2-րդ տեղում է, «an»-ը՝ ամենավերջում։'],
    },
    ka: {
      title: 'ზმნები აწმყოში, მოცილებადი ზმნისწინები და ბრძანებითი კილო',
      sum: 'ზმნის დაბოლოება აჩვენებს, ვინ მოქმედებს, ზოგი ზმნა კი წინადადებაში ორ ნაწილად იყოფა.',
      pts: [
        'ქართულ ზმნაში პირს პრეფიქსიც აჩვენებს (ვ-სწავლობ), გერმანულში — მხოლოდ დაბოლოება: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en.',
        'თუ ფუძე -t-ზე ან -d-ზე მთავრდება (arbeiten, finden), -st-ისა და -t-ის წინ ემატება -e-: du arbeitest, er findet.',
        'ბევრი ძლიერი ზმნა du-სა და er/sie/es-თან ხმოვანს იცვლის: fahren → du fährst, sehen → du siehst, nehmen → du nimmst.',
        'sein (ყოფნა) და haben (ქონა) არაწესიერი ზმნებია და ძალიან ხშირად გვხვდება — ჯერ ისინი დაიზეპირეთ. „sein“ წინადადებიდან არასოდეს ამოვარდება: Er ist müde.',
        'მოცილებადი ზმნისწინები ქართული ზმნისწინების მსგავსია (ა-დგომა, გა-მოსვლა), მაგრამ მთავარ წინადადებაში ისინი ზმნას შორდებიან და ბოლოში მიდიან: Ich stehe um 7 Uhr auf. მახვილი ზმნისწინზე მოდის: AUFstehen.',
        'ბრძანებითი: du-სთვის — ფუძე -st-ისა და „du“-ს გარეშე (Komm! Nimm! Lies!), ihr-სთვის — აწმყოს ფორმა „ihr“-ის გარეშე (Kommt!), თავაზიანად: Kommen Sie! სიტყვა „bitte“ თხოვნას თავაზიანს ხდის.',
        'აწმყოს მომავლისთვისაც იყენებენ: Morgen fahre ich nach Hamburg (ხვალ ჰამბურგში მივდივარ).',
      ],
      tip: 'არასოდეს შორდება be-, ge-, er-, ver-, zer-, ent-, emp-, miss- (bekommen, verstehen). თითქმის ყველა დანარჩენი (an-, auf-, aus-, ein-, mit-, zu- …) შორდება.',
      why: ['„sein“ ყოველთვის საჭიროა — ზმნის გარეშე გერმანული წინადადება არასრულია.', '„anrufen“ მოცილებადზმნისწინიანი ზმნაა: „rufe“ მე-2 ადგილზეა, „an“ — ბოლოში.'],
    },
    hu: {
      title: 'Igék jelen időben, elváló igekötők és felszólító mód',
      sum: 'Az ige végződése mutatja, ki cselekszik – egyes igék pedig a mondatban két részre válnak.',
      pts: [
        'Végződések: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en. Mint a magyarban (csinálok, csinálsz), csak kevesebb alak van.',
        'Ha a tő -t-re vagy -d-re végződik (arbeiten, finden), a -st és a -t elé -e- kerül: du arbeitest, er findet.',
        'Sok erős ige a du és az er/sie/es alakban magánhangzót vált: fahren → du fährst, sehen → du siehst, nehmen → du nimmst.',
        'A magyarban 3. személyben elmarad a „van“ (Ő fáradt). A németben a „sein“ mindig kell: Er ist müde. A sein és a haben alakjait tanulja meg elsőként.',
        'Az elváló igekötők nagyon hasonlítanak a magyar igekötőkre (felkel, bevásárol, felhív). A magyarban főleg tagadásnál válnak el (Nem kelek fel), a németben minden kijelentő főmondatban, és a mondat végére kerülnek: Ich stehe um 7 Uhr auf. A hangsúly az igekötőn van: AUFstehen.',
        'Felszólítás: du alak = tő -st és „du“ nélkül (Komm! Nimm! Lies!), ihr alak = jelen idő „ihr“ nélkül (Kommt!), magázva: Kommen Sie! A „bitte“ udvariassá teszi.',
        'A jelen időt a jövőre is használják, mint a magyarban: Morgen fahre ich nach Hamburg (Holnap Hamburgba utazom).',
      ],
      tip: 'Soha nem válnak el: be-, ge-, er-, ver-, zer-, ent-, emp-, miss- (bekommen, verstehen). Szinte az összes többi (an-, auf-, aus-, ein-, mit-, zu- …) elválik.',
      why: ['A németben a „sein“ igének mindig ott kell lennie – ige nélkül a mondat hiányos.', 'Az „anrufen“ elváló igekötős ige: a „rufe“ a 2. helyen, az „an“ a mondat végén áll.'],
    },
  },
});

/* =====================================================================
   3 · Artikel und Plural
   ===================================================================== */
GB_CHAPTERS.push({
  id: 'artikel', icon: '🏷️', levels: ['A1'],
  rules: ['viel'],
  tables: [{
    head: ['Endung / Gruppe', 'Genus', 'Beispiele'],
    rows: [
      ['-ung, -heit, -keit, -schaft, -ion, -tät', 'die', 'die Wohnung, die Freiheit, die Universität'],
      ['-e (meistens)', 'die', 'die Lampe, die Tasche, die Straße'],
      ['-chen, -lein', 'das', 'das Mädchen, das Brötchen'],
      ['-ment, -um, -nis (meistens)', 'das', 'das Dokument, das Museum, das Ergebnis'],
      ['-er (Person, Gerät), -ling, -ismus', 'der', 'der Lehrer, der Computer, der Frühling'],
      ['Tage, Monate, Jahreszeiten', 'der', 'der Montag, der Mai, der Winter'],
      ['Zusammengesetzte Wörter', 'wie das letzte Wort', 'das Haus + die Tür → die Haustür'],
    ],
  }, {
    head: ['Plural-Muster', 'Singular', 'Plural'],
    rows: [
      ['-e', 'der Tag', 'die Tage'],
      ['¨-e', 'der Stuhl', 'die Stühle'],
      ['-er / ¨-er', 'das Kind / das Buch', 'die Kinder / die Bücher'],
      ['-(e)n', 'die Frau / die Lampe', 'die Frauen / die Lampen'],
      ['-s', 'das Auto', 'die Autos'],
      ['– / ¨', 'der Lehrer / der Vater', 'die Lehrer / die Väter'],
    ],
  }],
  examples: [
    { de: '[Das] Mädchen liest [ein] Buch.', ru: 'Девочка читает книгу.', uk: 'Дівчинка читає книжку.', hy: 'Աղջիկը գիրք է կարդում։', ka: 'გოგონა წიგნს კითხულობს.', hu: 'A lány egy könyvet olvas.' },
    { de: 'Da ist [ein] Tisch. [Der] Tisch ist neu.', ru: 'Там стол. Стол новый.', uk: 'Там стіл. Стіл новий.', hy: 'Այնտեղ սեղան կա։ Սեղանը նոր է։', ka: 'იქ მაგიდაა. მაგიდა ახალია.', hu: 'Ott van egy asztal. Az asztal új.' },
    { de: '[Die] Kinder spielen im Garten.', ru: 'Дети играют в саду.', uk: 'Діти граються в саду.', hy: 'Երեխաները խաղում են այգում։', ka: 'ბავშვები ბაღში თამაშობენ.', hu: 'A gyerekek a kertben játszanak.' },
    { de: 'Ich bin Lehrerin.', ru: 'Я учительница.', uk: 'Я вчителька.', hy: 'Ես ուսուցչուհի եմ։', ka: 'მე მასწავლებელი ვარ.', hu: 'Tanárnő vagyok.' },
    { de: '[Die] Haustür ist offen.', ru: 'Входная дверь открыта.', uk: 'Вхідні двері відчинені.', hy: 'Մուտքի դուռը բաց է։', ka: 'სახლის კარი ღიაა.', hu: 'A bejárati ajtó nyitva van.' },
  ],
  mistakes: [
    { w: 'Das ist Auto.', r: 'Das ist ein Auto.' },
    { w: 'Der Mädchen ist nett.', r: 'Das Mädchen ist nett.' },
  ],
  text: {
    de: {
      title: 'Artikel (der, die, das) und Plural',
      sum: 'Jedes Nomen hat ein Genus – darum lernt man jedes Wort zusammen mit Artikel und Plural.',
      pts: [
        'Bestimmter Artikel: der (maskulin), die (feminin), das (neutrum); im Plural immer die.',
        'Unbestimmter Artikel: ein (der/das), eine (die); im Plural kein Artikel: Ich kaufe Äpfel.',
        'ein = etwas Neues, Unbekanntes. der/die/das = etwas Bekanntes oder Einmaliges: Da ist ein Tisch. Der Tisch ist neu.',
        'Ohne Artikel: Berufe und Nationalitäten (Ich bin Lehrerin), Unzählbares (Ich trinke Wasser), Namen und die meisten Länder (Deutschland).',
        'Das Genus ist grammatisch, nicht natürlich: das Mädchen, das Kind. Endungen helfen oft (siehe Tabelle).',
        'Bei zusammengesetzten Wörtern entscheidet das letzte Wort: das Haus + die Tür = die Haustür.',
        'Der Plural hat fünf Muster und muss mitgelernt werden. Im Wörterbuch steht z. B.: der Stuhl, -¨e → die Stühle.',
      ],
      tip: 'Lerne nie „Tisch“, sondern immer „der Tisch, die Tische“. Farbtrick: blau = der, rot = die, grün = das – schreib deine Vokabeln in diesen Farben.',
      why: ['Ein zählbares Nomen im Singular braucht einen Artikel: ein Auto oder das Auto.', '-chen-Wörter sind immer neutrum, auch wenn sie eine Frau oder ein Mädchen bezeichnen.'],
    },
    ru: {
      title: 'Артикли (der, die, das) и множественное число',
      sum: 'У каждого существительного есть род — поэтому каждое слово учат вместе с артиклем и формой множественного числа.',
      pts: [
        'В русском артиклей нет, а в немецком они почти всегда стоят перед существительным. Определённый артикль: der (м. р.), die (ж. р.), das (ср. р.); во множественном числе всегда die.',
        'Неопределённый артикль: ein (der/das), eine (die) — примерно «какой-то, один». Во множественном числе его нет: Ich kaufe Äpfel.',
        'ein — что-то новое, ещё не упомянутое. der/die/das — уже известное или единственное: Da ist ein Tisch. Der Tisch ist neu.',
        'Без артикля: профессии и национальности (Ich bin Lehrerin), неисчисляемое (Ich trinke Wasser), имена и большинство стран (Deutschland).',
        'Род в немецком часто не совпадает с русским: die Sonne (солнце — ср. р.), der Löffel (ложка — ж. р.), das Mädchen (девочка). Не переносите русский род на немецкие слова!',
        'В сложных словах род определяет последнее слово: das Haus + die Tür = die Haustür.',
        'Множественное число образуется пятью способами — его надо учить вместе со словом. В словаре: der Stuhl, -¨e → die Stühle.',
      ],
      tip: 'Учите не «Tisch», а «der Tisch, die Tische». Цветовой приём: синий = der, красный = die, зелёный = das.',
      why: ['Исчисляемому существительному в единственном числе нужен артикль: ein Auto или das Auto.', 'Слова на -chen всегда среднего рода, даже если обозначают девочку или женщину.'],
    },
    uk: {
      title: 'Артиклі (der, die, das) і множина',
      sum: 'Кожен іменник має рід — тому кожне слово вчать разом з артиклем і формою множини.',
      pts: [
        'В українській артиклів немає, а в німецькій вони майже завжди стоять перед іменником. Означений артикль: der (ч. р.), die (ж. р.), das (с. р.); у множині завжди die.',
        'Неозначений артикль: ein (der/das), eine (die) — приблизно «якийсь, один». У множині його немає: Ich kaufe Äpfel.',
        'ein — щось нове, ще не згадане. der/die/das — уже відоме або єдине: Da ist ein Tisch. Der Tisch ist neu.',
        'Без артикля: професії та національності (Ich bin Lehrerin), незлічуване (Ich trinke Wasser), імена й більшість країн (Deutschland).',
        'Рід у німецькій часто не збігається з українським: die Sonne (сонце — с. р.), der Löffel (ложка — ж. р.), das Mädchen (дівчинка). Не переносьте український рід на німецькі слова!',
        'У складних словах рід визначає останнє слово: das Haus + die Tür = die Haustür.',
        'Множина утворюється п’ятьма способами — її треба вчити разом зі словом. У словнику: der Stuhl, -¨e → die Stühle.',
      ],
      tip: 'Вчіть не «Tisch», а «der Tisch, die Tische». Кольоровий прийом: синій = der, червоний = die, зелений = das.',
      why: ['Злічуваному іменнику в однині потрібен артикль: ein Auto або das Auto.', 'Слова на -chen завжди середнього роду, навіть якщо означають дівчинку чи жінку.'],
    },
    hy: {
      title: 'Հոդեր (der, die, das) և հոգնակի թիվ',
      sum: 'Յուրաքանչյուր գոյական ունի քերականական սեռ, ուստի ամեն բառ սովորում են հոդի և հոգնակի ձևի հետ միասին։',
      pts: [
        'Հայերենում քերականական սեռ չկա, իսկ գերմաներենում երեքն են՝ der (արական), die (իգական), das (չեզոք)։ Հոգնակիում միշտ die։',
        'Հայերենի որոշիչ հոդը (-ը/-ն) բառի վերջում է՝ սեղանը։ Գերմաներենում հոդը բառից առաջ է և ունի երեք ձև՝ der Tisch։',
        'Անորոշ հոդ՝ ein (der/das), eine (die)՝ հայերենի «մի»-ի պես։ Հոգնակիում անորոշ հոդ չկա՝ Ich kaufe Äpfel։',
        'ein = նոր, դեռ չհիշատակված բան, der/die/das = արդեն հայտնի բան՝ Da ist ein Tisch. Der Tisch ist neu։',
        'Առանց հոդի՝ մասնագիտություններ և ազգություններ (Ich bin Lehrerin), անհաշվելի բաներ (Ich trinke Wasser), անուններ և երկրների մեծ մասը (Deutschland)։',
        'Սեռը քերականական է, ոչ բնական՝ das Mädchen (աղջիկ), das Kind (երեխա)։ Բառի վերջավորությունը հաճախ օգնում է (տես աղյուսակը)։ Բարդ բառերում որոշում է վերջին բառը՝ das Haus + die Tür = die Haustür։',
        'Հայերենում հոգնակին պարզ է (-եր/-ներ), գերմաներենում կա հինգ ձև, որոնք պետք է սովորել բառի հետ՝ der Stuhl, -¨e → die Stühle։',
      ],
      tip: 'Մի սովորեք «Tisch», այլ միշտ «der Tisch, die Tische»։ Գույների հնարք՝ կապույտ = der, կարմիր = die, կանաչ = das։',
      why: ['Եզակի թվով հաշվելի գոյականին հոդ է պետք՝ ein Auto կամ das Auto։', '-chen-ով վերջացող բառերը միշտ չեզոք սեռի են, նույնիսկ եթե աղջկա կամ կնոջ մասին է։'],
    },
    ka: {
      title: 'არტიკლები (der, die, das) და მრავლობითი რიცხვი',
      sum: 'ყველა არსებით სახელს აქვს გრამატიკული სქესი — ამიტომ ყველა სიტყვას არტიკლთან და მრავლობითის ფორმასთან ერთად სწავლობენ.',
      pts: [
        'ქართულში არც გრამატიკული სქესია და არც არტიკლი. გერმანულში სამი სქესია: der (მამრობითი), die (მდედრობითი), das (საშუალო). მრავლობითში ყოველთვის die.',
        'განუსაზღვრელი არტიკლი: ein (der/das), eine (die) — დაახლოებით „ერთი, რაღაც“. მრავლობითში ის არ გამოიყენება: Ich kaufe Äpfel.',
        'ein = ახალი, ჯერ არნახსენები რამ. der/die/das = უკვე ცნობილი ან ერთადერთი: Da ist ein Tisch. Der Tisch ist neu.',
        'არტიკლის გარეშე: პროფესიები და ეროვნებები (Ich bin Lehrerin), არათვლადი რამ (Ich trinke Wasser), სახელები და ქვეყნების უმეტესობა (Deutschland).',
        'სქესი გრამატიკულია და არა ბუნებრივი: das Mädchen (გოგონა), das Kind (ბავშვი). სიტყვის დაბოლოება ხშირად გვეხმარება (იხ. ცხრილი).',
        'რთულ სიტყვებში სქესს ბოლო სიტყვა განსაზღვრავს: das Haus + die Tür = die Haustür.',
        'ქართულში მრავლობითი მარტივია (-ებ-), გერმანულში ხუთი ხერხია და სიტყვასთან ერთად უნდა ისწავლოთ: der Stuhl, -¨e → die Stühle.',
      ],
      tip: 'ნუ ისწავლით „Tisch“-ს — ყოველთვის „der Tisch, die Tische“. ფერების ხრიკი: ლურჯი = der, წითელი = die, მწვანე = das.',
      why: ['მხოლობით რიცხვში თვლად არსებით სახელს არტიკლი სჭირდება: ein Auto ან das Auto.', '-chen-ზე დამთავრებული სიტყვები ყოველთვის საშუალო სქესისაა, თუნდაც გოგონას ან ქალს აღნიშნავდეს.'],
    },
    hu: {
      title: 'Névelők (der, die, das) és többes szám',
      sum: 'Minden főnévnek nyelvtani neme van – ezért minden szót a névelőjével és a többes számával együtt tanulunk.',
      pts: [
        'A magyarban nincs nyelvtani nem, a németben három van: der (hímnem), die (nőnem), das (semlegesnem). Többes számban mindig die.',
        'Jó hír: határozott névelő a magyarban is van. A németben az „a/az“-nak három alakja van: der Tisch = az asztal.',
        'Határozatlan névelő: ein (der/das), eine (die) – mint az „egy“. Többes számban nincs: Ich kaufe Äpfel.',
        'ein = új, még nem említett dolog, der/die/das = már ismert dolog: Da ist ein Tisch. Der Tisch ist neu.',
        'Névelő nélkül: foglalkozás és nemzetiség (Ich bin Lehrerin), megszámlálhatatlan dolog (Ich trinke Wasser), nevek és a legtöbb ország (Deutschland).',
        'A nem nyelvtani, nem természetes: das Mädchen (lány), das Kind (gyerek). A végződés gyakran segít (lásd a táblázatot). Összetett szónál az utolsó tag dönt: das Haus + die Tür = die Haustür.',
        'A magyar többes szám szabályos (-k), a németben öt minta van, amelyet a szóval együtt kell megtanulni: der Stuhl, -¨e → die Stühle.',
      ],
      tip: 'Ne „Tisch“-t tanuljon, hanem mindig „der Tisch, die Tische“-t. Színes trükk: kék = der, piros = die, zöld = das.',
      why: ['Egyes számú, megszámlálható főnévnek névelő kell: ein Auto vagy das Auto.', 'A -chen végű szavak mindig semlegesneműek, akkor is, ha lányt vagy nőt jelölnek.'],
    },
  },
});

/* =====================================================================
   4 · Verneinung
   ===================================================================== */
GB_CHAPTERS.push({
  id: 'verneinung', icon: '🚫', levels: ['A1'],
  rules: ['kein_nicht', 'nicht_pos', 'doch'],
  tables: [{
    head: ['kein-', 'maskulin', 'feminin', 'neutrum', 'Plural'],
    rows: [
      ['Nominativ', 'kein', 'keine', 'kein', 'keine'],
      ['Akkusativ', 'keinen', 'keine', 'kein', 'keine'],
      ['Dativ', 'keinem', 'keiner', 'keinem', 'keinen'],
    ],
  }, {
    head: ['Wohin kommt „nicht“?', 'Beispiel'],
    rows: [
      ['ganzer Satz: möglichst weit hinten', 'Ich verstehe dich nicht.'],
      ['vor den zweiten Verbteil', 'Ich habe den Film nicht gesehen.'],
      ['vor Adjektiv / Adverb', 'Das Essen ist nicht teuer.'],
      ['vor Ortsangabe mit Präposition', 'Ich wohne nicht in Berlin.'],
      ['vor ein einzelnes Wort (Kontrast)', 'Nicht ich, sondern mein Bruder.'],
    ],
  }],
  examples: [
    { de: 'Ich habe [keine] Zeit.', ru: 'У меня нет времени.', uk: 'У мене немає часу.', hy: 'Ես ժամանակ չունեմ։', ka: 'დრო არ მაქვს.', hu: 'Nincs időm.' },
    { de: 'Das ist [kein] Problem.', ru: 'Это не проблема.', uk: 'Це не проблема.', hy: 'Դա խնդիր չէ։', ka: 'ეს პრობლემა არ არის.', hu: 'Ez nem probléma.' },
    { de: 'Ich verstehe dich [nicht].', ru: 'Я тебя не понимаю.', uk: 'Я тебе не розумію.', hy: 'Ես քեզ չեմ հասկանում։', ka: 'შენი არ მესმის.', hu: 'Nem értelek.' },
    { de: 'Ich habe den Film [nicht] gesehen.', ru: 'Я не смотрел этот фильм.', uk: 'Я не дивився цей фільм.', hy: 'Ես այդ ֆիլմը չեմ դիտել։', ka: 'ეს ფილმი არ მინახავს.', hu: 'Nem láttam a filmet.' },
    { de: 'Kommst du nicht? – [Doch], ich komme!', ru: 'Ты не придёшь? — Нет, приду!', uk: 'Ти не прийдеш? — Та прийду!', hy: 'Չե՞ս գալու։ — Իհարկե գալու եմ։', ka: 'არ მოხვალ? — როგორ არა, მოვალ!', hu: 'Nem jössz? – De, jövök!' },
  ],
  mistakes: [
    { w: 'Ich habe nicht Zeit.', r: 'Ich habe keine Zeit.' },
    { w: 'Er sagt nicht nichts.', r: 'Er sagt nichts.' },
  ],
  text: {
    de: {
      title: 'Verneinung: nicht oder kein?',
      sum: '„kein“ verneint Nomen ohne Artikel oder mit „ein“, „nicht“ verneint alles andere.',
      pts: [
        'kein = nicht + ein: Ich habe ein Auto → Ich habe kein Auto. Auch bei Nomen ohne Artikel: Ich habe Zeit → Ich habe keine Zeit.',
        '„kein“ bekommt dieselben Endungen wie „ein“ (Tabelle); im Plural: keine.',
        '„nicht“ verneint Verben, Adjektive, Adverbien und Nomen mit der/die/das oder mein/dein: Das ist nicht mein Handy.',
        'Verneint „nicht“ den ganzen Satz, steht es möglichst weit hinten – aber vor dem zweiten Verbteil: Ich habe den Film nicht gesehen.',
        'Gegensatz: nicht … sondern / kein … sondern: Das ist kein Tee, sondern Kaffee.',
        'Auf eine verneinte Frage antwortet man mit „doch“, wenn die Antwort positiv ist: Kommst du nicht? – Doch!',
        'Im Deutschen gibt es keine doppelte Verneinung: nichts, niemand, nie, nirgends stehen allein.',
      ],
      tip: 'Frage dich: Könnte im positiven Satz „ein“ stehen oder gar kein Artikel? → kein. Sonst → nicht.',
      why: ['„Zeit“ steht ohne Artikel, darum verneint man mit „keine“ (die Zeit → keine).', '„nichts“ verneint schon allein. Ein zweites „nicht“ würde den Satz wieder positiv machen.'],
    },
    ru: {
      title: 'Отрицание: nicht или kein?',
      sum: '«kein» отрицает существительное без артикля или с «ein», «nicht» — всё остальное.',
      pts: [
        'В русском почти везде «не» или «нет». В немецком: kein = nicht + ein. Ich habe ein Auto → Ich habe kein Auto. Также без артикля: Ich habe Zeit → Ich habe keine Zeit.',
        '«kein» получает те же окончания, что и «ein» (см. таблицу); во множественном числе — keine.',
        '«nicht» отрицает глаголы, прилагательные, наречия и существительные с der/die/das или mein/dein: Das ist nicht mein Handy.',
        'В русском «не» стоит перед глаголом («не понимаю»). В немецком «nicht» стоит как можно дальше в конце — но перед второй частью глагола: Ich verstehe dich nicht. Ich habe den Film nicht gesehen.',
        'Противопоставление: nicht … sondern / kein … sondern = не …, а …: Das ist kein Tee, sondern Kaffee.',
        'На вопрос с отрицанием («Ты не придёшь?») положительный ответ — «Doch!» (нет, приду!). «Ja» здесь звучит неясно.',
        'Двойного отрицания нет! По-русски «я ничего не вижу», а по-немецки только одно отрицание: Ich sehe nichts.',
      ],
      tip: 'Проверка: можно ли в утвердительном предложении поставить «ein» или вообще без артикля? → kein. Иначе → nicht.',
      why: ['«Zeit» стоит без артикля, поэтому отрицание — «keine» (die Zeit → keine).', '«nichts» уже содержит отрицание. В отличие от русского («ничего не говорит») второе «nicht» не нужно.'],
    },
    uk: {
      title: 'Заперечення: nicht чи kein?',
      sum: '«kein» заперечує іменник без артикля або з «ein», «nicht» — усе інше.',
      pts: [
        'В українській майже скрізь «не» або «немає». У німецькій: kein = nicht + ein. Ich habe ein Auto → Ich habe kein Auto. Так само без артикля: Ich habe Zeit → Ich habe keine Zeit.',
        '«kein» отримує ті самі закінчення, що й «ein» (див. таблицю); у множині — keine.',
        '«nicht» заперечує дієслова, прикметники, прислівники та іменники з der/die/das або mein/dein: Das ist nicht mein Handy.',
        'В українській «не» стоїть перед дієсловом («не розумію»). У німецькій «nicht» стоїть якомога ближче до кінця — але перед другою частиною дієслова: Ich verstehe dich nicht. Ich habe den Film nicht gesehen.',
        'Протиставлення: nicht … sondern / kein … sondern = не …, а …: Das ist kein Tee, sondern Kaffee.',
        'На питання із запереченням («Ти не прийдеш?») ствердна відповідь — «Doch!» (та прийду!). «Ja» тут звучить незрозуміло.',
        'Подвійного заперечення немає! Українською «я нічого не бачу», а німецькою лише одне заперечення: Ich sehe nichts.',
      ],
      tip: 'Перевірка: чи можна в ствердному реченні поставити «ein» або взагалі без артикля? → kein. Інакше → nicht.',
      why: ['«Zeit» стоїть без артикля, тому заперечення — «keine» (die Zeit → keine).', '«nichts» уже містить заперечення. На відміну від української («нічого не каже») друге «nicht» не потрібне.'],
    },
    hy: {
      title: 'Ժխտում. nicht, թե՞ kein',
      sum: '«kein»-ը ժխտում է առանց հոդի կամ «ein»-ով գոյականը, «nicht»-ը՝ մնացած ամեն ինչ։',
      pts: [
        'Հայերենում ժխտումը սովորաբար բային կցված «չ»-ն է (չունեմ, չեմ հասկանում)։ Գերմաներենում՝ kein = nicht + ein. Ich habe ein Auto → Ich habe kein Auto։ Նաև առանց հոդի՝ Ich habe Zeit → Ich habe keine Zeit։',
        '«kein»-ն ստանում է նույն վերջավորությունները, ինչ «ein»-ը (տես աղյուսակը), հոգնակիում՝ keine։',
        '«nicht»-ը ժխտում է բայեր, ածականներ, մակբայներ և der/die/das կամ mein/dein ունեցող գոյականներ՝ Das ist nicht mein Handy։',
        'Ամբողջ նախադասությունը ժխտելիս «nicht»-ը դրվում է հնարավորինս վերջում, բայց բայի երկրորդ մասից առաջ՝ Ich verstehe dich nicht. Ich habe den Film nicht gesehen։',
        'Հակադրություն՝ nicht … sondern / kein … sondern = ոչ թե …, այլ …՝ Das ist kein Tee, sondern Kaffee։',
        'Ժխտական հարցին («Չե՞ս գալու») դրական պատասխանը «Doch!» է (իհարկե գալու եմ)։ «Ja»-ն այստեղ անհասկանալի է հնչում։',
        'Կրկնակի ժխտում չկա։ Հայերենում «ոչինչ չեմ տեսնում», իսկ գերմաներենում միայն մեկ ժխտում՝ Ich sehe nichts։',
      ],
      tip: 'Ստուգեք. արդյոք դրական նախադասության մեջ կարող է լինել «ein» կամ ընդհանրապես հոդ չլինել → kein։ Հակառակ դեպքում → nicht։',
      why: ['«Zeit»-ը առանց հոդի է, ուստի ժխտում ենք «keine»-ով (die Zeit → keine)։', '«nichts»-ն ինքնին ժխտում է։ Ի տարբերություն հայերենի («ոչինչ չի ասում»), երկրորդ «nicht» պետք չէ։'],
    },
    ka: {
      title: 'უარყოფა: nicht თუ kein?',
      sum: '„kein“ უარყოფს არტიკლის გარეშე ან „ein“-ით მდგარ არსებით სახელს, „nicht“ — ყველაფერს დანარჩენს.',
      pts: [
        'ქართულში უარყოფა თითქმის ყოველთვის ზმნის წინ მდგარი „არ“-ია. გერმანულში: kein = nicht + ein. Ich habe ein Auto → Ich habe kein Auto. ასევე არტიკლის გარეშე: Ich habe Zeit → Ich habe keine Zeit.',
        '„kein“ იმავე დაბოლოებებს იღებს, რასაც „ein“ (იხ. ცხრილი); მრავლობითში — keine.',
        '„nicht“ უარყოფს ზმნებს, ზედსართავებს, ზმნიზედებს და der/die/das-ით ან mein/dein-ით მდგარ არსებით სახელებს: Das ist nicht mein Handy.',
        'ქართულში „არ“ ზმნის წინ დგას („არ მესმის“). გერმანულში მთელი წინადადების უარყოფისას „nicht“ რაც შეიძლება ბოლოში დგას, მაგრამ ზმნის მეორე ნაწილის წინ: Ich verstehe dich nicht. Ich habe den Film nicht gesehen.',
        'დაპირისპირება: nicht … sondern / kein … sondern = … კი არა, …: Das ist kein Tee, sondern Kaffee.',
        'უარყოფით კითხვაზე („არ მოხვალ?“) დადებითი პასუხია „Doch!“ (როგორ არა, მოვალ!). „Ja“ აქ გაუგებრად ჟღერს.',
        'ორმაგი უარყოფა არ არსებობს: nichts, niemand, nie მარტო დგას — ისევე როგორც ქართულში „არაფერს ვხედავ“: Ich sehe nichts.',
      ],
      tip: 'შეამოწმეთ: დადებით წინადადებაში შეიძლება იდგეს „ein“ ან საერთოდ არ იყოს არტიკლი? → kein. სხვა შემთხვევაში → nicht.',
      why: ['„Zeit“ არტიკლის გარეშე დგას, ამიტომ ვუარყოფთ „keine“-ით (die Zeit → keine).', '„nichts“ თავისთავად უარყოფაა. მეორე „nicht“ წინადადებას ისევ დადებითს გახდიდა.'],
    },
    hu: {
      title: 'Tagadás: nicht vagy kein?',
      sum: 'A „kein“ a névelő nélküli vagy „ein“ névelős főnevet tagadja, a „nicht“ minden mást.',
      pts: [
        'A magyarban „nem“ vagy „nincs“. A németben: kein = nicht + ein. Ich habe ein Auto → Ich habe kein Auto. Névelő nélkül is: Ich habe Zeit → Ich habe keine Zeit (Nincs időm).',
        'A „kein“ ugyanazokat a végződéseket kapja, mint az „ein“ (lásd a táblázatot); többes számban: keine.',
        'A „nicht“ igét, melléknevet, határozószót, valamint der/die/das vagy mein/dein előtti főnevet tagad: Das ist nicht mein Handy.',
        'A magyarban a „nem“ az ige előtt áll („nem értem“). A németben az egész mondatot tagadó „nicht“ minél hátrébb kerül, de az ige második része elé: Ich verstehe dich nicht. Ich habe den Film nicht gesehen.',
        'Ellentét: nicht … sondern / kein … sondern = nem …, hanem …: Das ist kein Tee, sondern Kaffee.',
        'Tagadó kérdésre („Nem jössz?“) az igenlő válasz „Doch!“ – pontosan mint a magyar „De!“.',
        'Kettős tagadás nincs! Magyarul „semmit sem látok“, németül csak egy tagadószó áll: Ich sehe nichts.',
      ],
      tip: 'Ellenőrzés: állhatna az állító mondatban „ein“, vagy egyáltalán nincs névelő? → kein. Egyébként → nicht.',
      why: ['A „Zeit“ névelő nélkül áll, ezért „keine“-vel tagadjuk (die Zeit → keine).', 'A „nichts“ már önmagában tagad. A magyartól eltérően („semmit sem mond“) nem kell második tagadás.'],
    },
  },
});

/* =====================================================================
   5 · Die vier Fälle
   ===================================================================== */
GB_CHAPTERS.push({
  id: 'faelle', icon: '🎯', levels: ['A1', 'A2', 'B1'],
  rules: ['nom', 'akk', 'dat', 'genitiv', 'wer_wen_wem', 'dat_verb', 'n_dekl', 'plural_dat', 'es_gibt', 'welch'],
  tables: [{
    head: ['Fall · Frage', 'maskulin', 'feminin', 'neutrum', 'Plural'],
    rows: [
      ['Nominativ · Wer? Was?', 'der / ein', 'die / eine', 'das / ein', 'die / –'],
      ['Akkusativ · Wen? Was?', 'den / einen', 'die / eine', 'das / ein', 'die / –'],
      ['Dativ · Wem?', 'dem / einem', 'der / einer', 'dem / einem', 'den …-n / –'],
      ['Genitiv · Wessen?', 'des …-(e)s / eines', 'der / einer', 'des …-(e)s / eines', 'der / –'],
    ],
  }, {
    head: ['Verb verlangt …', 'Beispiele'],
    rows: [
      ['Akkusativ', 'haben, sehen, kaufen, brauchen, fragen, anrufen, besuchen, es gibt'],
      ['Dativ', 'helfen, danken, gefallen, gehören, antworten, gratulieren, schmecken, passen, folgen'],
      ['Dativ (Person) + Akkusativ (Sache)', 'geben, schenken, zeigen, erklären, bringen, schicken'],
    ],
  }],
  examples: [
    { de: '[Der Hund] schläft.', ru: 'Собака спит. (кто? — Nominativ)', uk: 'Собака спить. (хто? — Nominativ)', hy: 'Շունը քնած է։ (ո՞վ — Nominativ)', ka: 'ძაღლს სძინავს. (ვინ? — Nominativ)', hu: 'A kutya alszik. (Ki? Mi? – Nominativ)' },
    { de: 'Ich füttere [den Hund].', ru: 'Я кормлю собаку. (кого? — Akkusativ)', uk: 'Я годую собаку. (кого? — Akkusativ)', hy: 'Ես կերակրում եմ շանը։ (ո՞ւմ — Akkusativ)', ka: 'ძაღლს ვაჭმევ. (ვის? — Akkusativ)', hu: 'Megetetem a kutyát. (Kit? Mit? – Akkusativ)' },
    { de: 'Ich gebe [dem Hund] Wasser.', ru: 'Я даю собаке воду. (кому? — Dativ)', uk: 'Я даю собаці воду. (кому? — Dativ)', hy: 'Ես շանը ջուր եմ տալիս։ (ո՞ւմ — Dativ)', ka: 'ძაღლს წყალს ვაძლევ. (ვის? — Dativ)', hu: 'Vizet adok a kutyának. (Kinek? – Dativ)' },
    { de: 'Das ist das Auto [des Lehrers].', ru: 'Это машина учителя. (чья? — Genitiv)', uk: 'Це машина вчителя. (чия? — Genitiv)', hy: 'Սա ուսուցչի մեքենան է։ (ո՞ւմ — Genitiv)', ka: 'ეს მასწავლებლის მანქანაა. (ვისი? — Genitiv)', hu: 'Ez a tanár autója. (Kié? – Genitiv)' },
    { de: 'Ich helfe [meiner Mutter].', ru: 'Я помогаю маме.', uk: 'Я допомагаю мамі.', hy: 'Ես օգնում եմ մայրիկիս։', ka: 'დედაჩემს ვეხმარები.', hu: 'Segítek az anyámnak.' },
    { de: 'Hier gibt es [einen] Park.', ru: 'Здесь есть парк.', uk: 'Тут є парк.', hy: 'Այստեղ այգի կա։', ka: 'აქ პარკია.', hu: 'Itt van egy park.' },
  ],
  mistakes: [
    { w: 'Ich sehe der Mann.', r: 'Ich sehe den Mann.' },
    { w: 'Ich gratuliere dich zum Geburtstag.', r: 'Ich gratuliere dir zum Geburtstag.' },
  ],
  text: {
    de: {
      title: 'Die 4 Fälle: Nominativ, Akkusativ, Dativ, Genitiv',
      sum: 'Der Fall zeigt, welche Rolle ein Wort im Satz hat – man erkennt ihn vor allem am Artikel.',
      pts: [
        'Nominativ (Wer? Was?): das Subjekt – wer etwas tut. Auch nach sein und werden: Das ist der Lehrer.',
        'Akkusativ (Wen? Was?): das direkte Objekt. Nur maskulin ändert sich: der → den, ein → einen. Nach „es gibt“ steht immer Akkusativ.',
        'Dativ (Wem?): meist die Person, die etwas bekommt: Ich gebe dem Kind einen Ball. Manche Verben brauchen immer Dativ: helfen, danken, gefallen, gehören.',
        'Genitiv (Wessen?): Besitz – das Auto des Lehrers, die Tasche der Frau. Im Alltag sagt man oft „von + Dativ“: das Auto von meinem Vater.',
        'Das Nomen selbst ändert sich nur selten: Genitiv maskulin/neutrum -(e)s (des Mannes), Dativ Plural -n (mit den Kindern), n-Deklination (den Studenten, dem Kollegen).',
        'Zwei Objekte: Dativ vor Akkusativ (Ich gebe dem Kind den Ball). Ist der Akkusativ ein Pronomen, steht er zuerst (Ich gebe ihn dem Kind).',
        'Präpositionen bestimmen oft den Fall selbst – siehe Kapitel „Präpositionen“.',
      ],
      tip: 'Im Akkusativ ändert sich NUR das Maskulinum (der → den). Feminin, Neutrum und Plural sehen aus wie im Nominativ.',
      why: ['Wen sehe ich? Den Mann – Akkusativ, maskulin: der → den.', '„gratulieren“ verlangt den Dativ: Wem gratuliere ich? – dir.'],
    },
    ru: {
      title: 'Четыре падежа: Nominativ, Akkusativ, Dativ, Genitiv',
      sum: 'Падеж показывает роль слова в предложении. В немецком его видно прежде всего по артиклю.',
      pts: [
        'В русском 6 падежей, и меняются окончания слов. В немецком падежей 4, и меняется в основном артикль: der Mann → den Mann → dem Mann.',
        'Nominativ = именительный (кто? что?): подлежащее. Также после sein: Das ist der Lehrer.',
        'Akkusativ ≈ винительный (кого? что?): прямое дополнение. Меняется только мужской род: der → den, ein → einen. После «es gibt» (есть, имеется) — всегда Akkusativ.',
        'Dativ ≈ дательный (кому? чему?): обычно тот, кто что-то получает: Ich gebe dem Kind einen Ball. Некоторые глаголы всегда требуют Dativ: helfen, danken, gefallen, gehören.',
        'Genitiv похож на родительный, но отвечает на вопрос «чей?» (Wessen?): das Auto des Lehrers. В разговоре чаще говорят «von + Dativ»: das Auto von meinem Vater.',
        'Сами существительные меняются редко: Genitiv м. и ср. р. -(e)s (des Mannes), Dativ мн. ч. -n (mit den Kindern), n-склонение (den Studenten, dem Kollegen).',
        'Осторожно: управление глаголов не всегда совпадает с русским! Поздравлять (кого?) → gratulieren (wem? — Dativ). Звонить (кому?) → anrufen (wen? — Akkusativ). Спрашивать (кого?) → fragen (wen? — Akkusativ) — здесь совпадает.',
      ],
      tip: 'Лайфхак: в Akkusativ меняется ТОЛЬКО мужской род (der → den). Женский, средний род и множественное число — как в Nominativ.',
      why: ['Вижу (кого?) мужчину — это Akkusativ. Мужской артикль der → den.', 'По-русски «поздравляю тебя» (кого?), но немецкий глагол gratulieren требует Dativ: dir.'],
    },
    uk: {
      title: 'Чотири відмінки: Nominativ, Akkusativ, Dativ, Genitiv',
      sum: 'Відмінок показує роль слова в реченні. У німецькій його видно насамперед за артиклем.',
      pts: [
        'В українській 7 відмінків, і змінюються закінчення слів. У німецькій відмінків 4, і змінюється здебільшого артикль: der Mann → den Mann → dem Mann.',
        'Nominativ = називний (хто? що?): підмет. Також після sein: Das ist der Lehrer.',
        'Akkusativ ≈ знахідний (кого? що?): прямий додаток. Змінюється лише чоловічий рід: der → den, ein → einen. Після «es gibt» (є, існує) — завжди Akkusativ.',
        'Dativ ≈ давальний (кому? чому?): зазвичай той, хто щось отримує: Ich gebe dem Kind einen Ball. Деякі дієслова завжди вимагають Dativ: helfen, danken, gefallen, gehören.',
        'Genitiv схожий на родовий, але відповідає на питання «чий?» (Wessen?): das Auto des Lehrers. У розмові частіше кажуть «von + Dativ»: das Auto von meinem Vater.',
        'Самі іменники змінюються рідко: Genitiv ч. і с. р. -(e)s (des Mannes), Dativ множини -n (mit den Kindern), n-відміна (den Studenten, dem Kollegen).',
        'Обережно: керування дієслів не завжди збігається з українським! Вітати (кого?) → gratulieren (wem? — Dativ). Дзвонити (кому?) → anrufen (wen? — Akkusativ). Дякувати (кому?) → danken (wem? — Dativ) — тут збігається.',
      ],
      tip: 'Лайфхак: в Akkusativ змінюється ЛИШЕ чоловічий рід (der → den). Жіночий, середній рід і множина — як у Nominativ.',
      why: ['Бачу (кого?) чоловіка — це Akkusativ. Чоловічий артикль der → den.', 'Українською «вітаю тебе» (кого?), але німецьке дієслово gratulieren вимагає Dativ: dir.'],
    },
    hy: {
      title: 'Չորս հոլովները՝ Nominativ, Akkusativ, Dativ, Genitiv',
      sum: 'Հոլովը ցույց է տալիս բառի դերը նախադասության մեջ։ Գերմաներենում այն երևում է հիմնականում հոդից։',
      pts: [
        'Հայերենում 7 հոլով կա, և փոխվում է բառի վերջավորությունը։ Գերմաներենում 4 հոլով կա, և փոխվում է հիմնականում հոդը՝ der Mann → den Mann → dem Mann։',
        'Nominativ ≈ ուղղական (ո՞վ, ի՞նչ)՝ ենթական։ Նաև sein-ից հետո՝ Das ist der Lehrer։',
        'Akkusativ ≈ հայցական (ո՞ւմ, ի՞նչ)՝ ուղիղ խնդիր։ Փոխվում է միայն արական սեռը՝ der → den, ein → einen։ «es gibt»-ից (կա) հետո միշտ Akkusativ է։',
        'Dativ ≈ տրական (ո՞ւմ)՝ սովորաբար նա, ով ինչ-որ բան է ստանում՝ Ich gebe dem Kind einen Ball։ Որոշ բայեր միշտ Dativ են պահանջում՝ helfen, danken, gefallen, gehören։',
        'Ուշադրություն. հայերենում «ո՞ւմ» հարցը և՛ հայցական է, և՛ տրական, իսկ «ինձ, քեզ, նրան» ձևերը նույնն են երկուսի համար։ Գերմաներենում դրանք տարբեր են՝ Wen? → den/mich, Wem? → dem/mir։',
        'Genitiv ≈ սեռական (ո՞ւմ, ինչի՞ — ում է պատկանում)՝ das Auto des Lehrers (ուսուցչի մեքենան)։ Խոսակցականում հաճախ ասում են «von + Dativ»՝ das Auto von meinem Vater։',
        'Գոյականն ինքը քիչ է փոխվում՝ Genitiv արական/չեզոք -(e)s (des Mannes), Dativ հոգնակի -n (mit den Kindern), n-հոլովում (den Studenten)։',
      ],
      tip: 'Akkusativ-ում փոխվում է ՄԻԱՅՆ արական սեռը (der → den)։ Իգականը, չեզոքը և հոգնակին նույնն են, ինչ Nominativ-ում։',
      why: ['Ո՞ւմ եմ տեսնում — տղամարդուն. սա Akkusativ է, արական սեռ՝ der → den։', 'Հայերենում «քեզ»-ը և՛ տրական է, և՛ հայցական, իսկ գերմաներենում՝ dich (Akkusativ) և dir (Dativ)։ gratulieren-ը պահանջում է Dativ՝ dir։'],
    },
    ka: {
      title: 'ოთხი ბრუნვა: Nominativ, Akkusativ, Dativ, Genitiv',
      sum: 'ბრუნვა აჩვენებს სიტყვის როლს წინადადებაში. გერმანულში ის, უპირველეს ყოვლისა, არტიკლით ჩანს.',
      pts: [
        'ქართულში ბრუნვას სიტყვის დაბოლოება აჩვენებს, გერმანულში — ძირითადად არტიკლი: der Mann → den Mann → dem Mann.',
        'Nominativ (Wer? Was? — ვინ? რა?): ქვემდებარე. ქართულში ქვემდებარე შეიძლება მოთხრობითში (კაცმა) ან მიცემითში (კაცს უყვარს) იდგეს, გერმანულში ის ყოველთვის Nominativ-შია.',
        'Akkusativ (Wen? Was? — ვის? რას?): პირდაპირი დამატება. იცვლება მხოლოდ მამრობითი: der → den, ein → einen. „es gibt“-ის (არის, არსებობს) შემდეგ ყოველთვის Akkusativ-ია.',
        'Dativ (Wem? — ვის?): ჩვეულებრივ ის, ვინც რაღაცას იღებს: Ich gebe dem Kind einen Ball. ზოგი ზმნა ყოველთვის Dativ-ს მოითხოვს: helfen, danken, gefallen, gehören.',
        'ყურადღება: ქართულში ორივე დამატება მიცემითშია და კითხვაც ერთია — „ვის?“ (ძაღლს ვხედავ, ძაღლს ვაძლევ). გერმანულში ისინი განსხვავდება: Wen? → den Hund, Wem? → dem Hund.',
        'Genitiv ≈ ნათესაობითი (Wessen? — ვისი?): das Auto des Lehrers (მასწავლებლის მანქანა). სასაუბროში ხშირად „von + Dativ“-ს ამბობენ: das Auto von meinem Vater.',
        'თვითონ არსებითი სახელი იშვიათად იცვლება: Genitiv მამრ./საშ. -(e)s (des Mannes), Dativ მრავლობითი -n (mit den Kindern), n-ბრუნება (den Studenten).',
      ],
      tip: 'Akkusativ-ში იცვლება მხოლოდ მამრობითი სქესი (der → den). მდედრობითი, საშუალო და მრავლობითი ისეთივეა, როგორც Nominativ-ში.',
      why: ['ვის ვხედავ? კაცს — ეს Akkusativ-ია, მამრობითი: der → den.', 'gratulieren ყოველთვის Dativ-ს მოითხოვს: Wem? — dir (და არა dich).'],
    },
    hu: {
      title: 'A 4 eset: Nominativ, Akkusativ, Dativ, Genitiv',
      sum: 'Az eset megmutatja, milyen szerepe van a szónak a mondatban – a németben elsősorban a névelőn látszik.',
      pts: [
        'A magyarban sok eset van, és a ragok a szó végére kerülnek. A németben 4 eset van, és főleg a névelő változik: der Mann → den Mann → dem Mann.',
        'Nominativ ≈ alanyeset (Ki? Mi?): az alany. A sein után is: Das ist der Lehrer.',
        'Akkusativ ≈ tárgyeset (Kit? Mit?): a tárgy. A magyar -t minden szón látszik, a németben viszont csak a hímnem változik: der → den, ein → einen. Az „es gibt“ (van, létezik) után mindig Akkusativ áll.',
        'Dativ ≈ részeshatározó (Kinek? Minek?): általában az, aki valamit kap: Ich gebe dem Kind einen Ball. Egyes igék mindig Dativot kérnek: helfen (segít valakinek), danken, gefallen (tetszik valakinek), gehören.',
        'Genitiv ≈ birtokos (Kié? Wessen?): das Auto des Lehrers (a tanár autója). A beszélt nyelvben gyakran „von + Dativ“: das Auto von meinem Vater.',
        'Maga a főnév ritkán változik: Genitiv hím- és semlegesnem -(e)s (des Mannes), Dativ többes szám -n (mit den Kindern), n-deklináció (den Studenten).',
        'Vigyázat, az igék vonzata nem mindig egyezik a magyarral: találkozik valakivel → treffen + Akkusativ (Ich treffe dich), követ valakit → folgen + Dativ (Ich folge dir).',
      ],
      tip: 'Akkusativban CSAK a hímnem változik (der → den). A nőnem, a semlegesnem és a többes szám ugyanaz, mint Nominativban.',
      why: ['Kit látok? A férfit – ez Akkusativ, hímnem: der → den.', 'Mint a magyarban („gratulálok neked“): a gratulieren Dativot kér – dir.'],
    },
  },
});

/* =====================================================================
   6 · Pronomen
   ===================================================================== */
GB_CHAPTERS.push({
  id: 'pronomen', icon: '👥', levels: ['A1', 'A2'],
  rules: ['pron_akk', 'pron_dat', 'poss', 'reflexiv', 'indef'],
  tables: [{
    head: ['Nominativ', 'Akkusativ', 'Dativ', 'Possessiv', 'Reflexiv'],
    rows: [
      ['ich', 'mich', 'mir', 'mein', 'mich / mir'],
      ['du', 'dich', 'dir', 'dein', 'dich / dir'],
      ['er', 'ihn', 'ihm', 'sein', 'sich'],
      ['sie', 'sie', 'ihr', 'ihr', 'sich'],
      ['es', 'es', 'ihm', 'sein', 'sich'],
      ['wir', 'uns', 'uns', 'unser', 'uns'],
      ['ihr', 'euch', 'euch', 'euer', 'euch'],
      ['sie', 'sie', 'ihnen', 'ihr', 'sich'],
      ['Sie', 'Sie', 'Ihnen', 'Ihr', 'sich'],
    ],
  }, {
    head: ['mein-', 'maskulin', 'feminin', 'neutrum', 'Plural'],
    rows: [
      ['Nominativ', 'mein', 'meine', 'mein', 'meine'],
      ['Akkusativ', 'meinen', 'meine', 'mein', 'meine'],
      ['Dativ', 'meinem', 'meiner', 'meinem', 'meinen'],
    ],
  }],
  examples: [
    { de: 'Kannst du [mir] helfen?', ru: 'Можешь мне помочь?', uk: 'Можеш мені допомогти?', hy: 'Կարո՞ղ ես ինձ օգնել։', ka: 'შეგიძლია დამეხმარო?', hu: 'Tudsz nekem segíteni?' },
    { de: 'Ich rufe [dich] morgen an.', ru: 'Я позвоню тебе завтра.', uk: 'Я подзвоню тобі завтра.', hy: 'Վաղը քեզ կզանգեմ։', ka: 'ხვალ დაგირეკავ.', hu: 'Holnap felhívlak.' },
    { de: 'Wo ist die Lampe? – [Sie] ist im Keller.', ru: 'Где лампа? — Она в подвале.', uk: 'Де лампа? — Вона в підвалі.', hy: 'Որտե՞ղ է լամպը։ — Նկուղում է։', ka: 'სად არის ლამპა? — სარდაფშია.', hu: 'Hol van a lámpa? – A pincében van.' },
    { de: 'Peter besucht [seine] Mutter, Anna besucht [ihre] Oma.', ru: 'Петер навещает свою маму, Анна — свою бабушку.', uk: 'Петер відвідує свою маму, Анна — свою бабусю.', hy: 'Պետերն այցելում է իր մորը, Աննան՝ իր տատիկին։', ka: 'პეტერი დედამისთან მიდის, ანა კი — ბებიამისთან.', hu: 'Peter meglátogatja az anyját, Anna a nagymamáját.' },
    { de: 'Ich wasche [mir] die Hände.', ru: 'Я мою руки.', uk: 'Я мию руки.', hy: 'Ձեռքերս լվանում եմ։', ka: 'ხელებს ვიბან.', hu: 'Kezet mosok.' },
  ],
  mistakes: [
    { w: 'Ich rufe dir morgen an.', r: 'Ich rufe dich morgen an.' },
    { w: 'Anna kommt mit sein Mann.', r: 'Anna kommt mit ihrem Mann.' },
  ],
  text: {
    de: {
      title: 'Personal-, Possessiv- und Reflexivpronomen',
      sum: 'Pronomen ersetzen Nomen – und haben wie Artikel für jeden Fall eine eigene Form.',
      pts: [
        'Personalpronomen haben Formen für Nominativ, Akkusativ und Dativ (Tabelle): ich – mich – mir.',
        'er/sie/es richtet sich nach dem Genus des Wortes, nicht nach der Natur: der Tisch → er, die Lampe → sie, das Mädchen → es.',
        'Höflich: Sie (immer groß), auch für eine einzige Person: Können Sie mir helfen?',
        'Possessivartikel: mein, dein, sein (er/es), ihr (sie), unser, euer, ihr (sie Pl.), Ihr (Sie). Endungen wie bei ein/kein.',
        'sein oder ihr? Das hängt vom Besitzer ab: Peter → seine Mutter, Anna → ihre Mutter. Die Endung hängt vom Besitz ab: seine Mutter, sein Kind, seinen Sohn.',
        'Reflexivpronomen zeigen auf das Subjekt zurück: Ich wasche mich. Gibt es noch ein Akkusativobjekt, steht das Reflexivpronomen im Dativ: Ich wasche mir die Hände.',
        'man = Menschen allgemein, Verb in der er-Form: Hier darf man nicht rauchen.',
      ],
      tip: 'mir und dir = Dativ (Wem?), mich und dich = Akkusativ (Wen?).',
      why: ['„anrufen“ verlangt Akkusativ: Wen rufe ich an? – dich.', 'Besitzerin ist Anna (sie) → ihr. „mit“ verlangt Dativ, „Mann“ ist maskulin → mit ihrem Mann.'],
    },
    ru: {
      title: 'Личные, притяжательные и возвратные местоимения',
      sum: 'Местоимения заменяют существительные и, как артикли, имеют свою форму для каждого падежа.',
      pts: [
        'Личные местоимения имеют формы Nominativ, Akkusativ и Dativ (см. таблицу): ich – mich (меня) – mir (мне).',
        'er/sie/es выбирают по роду немецкого слова: der Tisch → er, die Lampe → sie, das Mädchen → es. Род может не совпадать с русским: die Sonne → sie (а по-русски «оно»).',
        'Вежливое «Вы»: Sie (всегда с большой буквы), в том числе для одного человека: Können Sie mir helfen?',
        'В русском есть универсальное «свой». В немецком его нет — притяжательное слово зависит от владельца: mein, dein, sein (er/es), ihr (sie), unser, euer, ihr (они), Ihr (Вы).',
        'sein или ihr? Владелец мужчина → sein: Peter besucht seine Mutter. Владелица женщина → ihr: Anna besucht ihre Mutter. Окончание же зависит от того, чем владеют: seine Mutter, sein Kind, seinen Sohn.',
        'Возвратное местоимение (как «-ся/себя»): Ich wasche mich (я моюсь). Если есть ещё дополнение, оно стоит в Dativ: Ich wasche mir die Hände. По-русски «я мою руки» — без местоимения, в немецком «mir» обязательно.',
        'man = «люди вообще», глагол в форме er: Hier darf man nicht rauchen (здесь нельзя курить).',
      ],
      tip: 'mir и dir = Dativ (кому?), mich и dich = Akkusativ (кого?).',
      why: ['По-русски «звоню тебе» (кому?), но anrufen требует Akkusativ: dich.', 'Владелица — Анна (sie), поэтому ihr. «mit» требует Dativ, «Mann» мужского рода → mit ihrem Mann.'],
    },
    uk: {
      title: 'Особові, присвійні та зворотні займенники',
      sum: 'Займенники замінюють іменники і, як артиклі, мають окрему форму для кожного відмінка.',
      pts: [
        'Особові займенники мають форми Nominativ, Akkusativ і Dativ (див. таблицю): ich – mich (мене) – mir (мені).',
        'er/sie/es добирають за родом німецького слова: der Tisch → er, die Lampe → sie, das Mädchen → es. Рід може не збігатися з українським: die Sonne → sie (а українською «воно»).',
        'Ввічливе «Ви»: Sie (завжди з великої літери), зокрема для однієї людини: Können Sie mir helfen?',
        'В українській є універсальне «свій». У німецькій його немає — присвійне слово залежить від власника: mein, dein, sein (er/es), ihr (sie), unser, euer, ihr (вони), Ihr (Ви).',
        'sein чи ihr? Власник чоловік → sein: Peter besucht seine Mutter. Власниця жінка → ihr: Anna besucht ihre Mutter. Закінчення ж залежить від того, чим володіють: seine Mutter, sein Kind, seinen Sohn.',
        'Зворотний займенник (як «-ся/себе»): Ich wasche mich (я миюся). Якщо є ще додаток, займенник стоїть у Dativ: Ich wasche mir die Hände. Українською «я мию руки» — без займенника, у німецькій «mir» обов’язкове.',
        'man = «люди взагалі», дієслово у формі er: Hier darf man nicht rauchen (тут не можна курити).',
      ],
      tip: 'mir і dir = Dativ (кому?), mich і dich = Akkusativ (кого?).',
      why: ['Українською «дзвоню тобі» (кому?), але anrufen вимагає Akkusativ: dich.', 'Власниця — Анна (sie), тому ihr. «mit» вимагає Dativ, «Mann» чоловічого роду → mit ihrem Mann.'],
    },
    hy: {
      title: 'Անձնական, ստացական և անդրադարձ դերանուններ',
      sum: 'Դերանունները փոխարինում են գոյականներին և, հոդերի պես, յուրաքանչյուր հոլովի համար ունեն իրենց ձևը։',
      pts: [
        'Անձնական դերանուններն ունեն Nominativ, Akkusativ և Dativ ձևեր (տես աղյուսակը)՝ ich – mich – mir։ Հայերենում «ինձ»-ը մեկ ձև է, իսկ գերմաներենում երկուսն են՝ mich (Wen?) և mir (Wem?)։',
        'Հայերենում «նա»-ն և՛ տղամարդու, և՛ կնոջ, և՛ առարկայի համար է։ Գերմաներենում ընտրում են բառի սեռով՝ der Tisch → er, die Lampe → sie, das Mädchen → es։',
        'Քաղաքավարի «Դուք»՝ Sie (միշտ մեծատառով), նաև մեկ մարդու համար՝ Können Sie mir helfen?',
        'Հայերենի «իր»-ը բոլորի համար է։ Գերմաներենում ստացականը կախված է տիրոջից՝ mein, dein, sein (er/es), ihr (sie), unser, euer, ihr (նրանք), Ihr (Դուք)։',
        'sein, թե՞ ihr. տերը տղամարդ է → sein՝ Peter besucht seine Mutter։ Տերը կին է → ihr՝ Anna besucht ihre Mutter։ Վերջավորությունը կախված է նրանից, ինչ պատկանում է՝ seine Mutter, sein Kind, seinen Sohn։',
        'Անդրադարձ դերանուն՝ Ich wasche mich (լվացվում եմ)։ Եթե կա ևս մեկ խնդիր, դերանունը Dativ-ում է՝ Ich wasche mir die Hände (ձեռքերս լվանում եմ)։',
        'man = «մարդիկ ընդհանրապես», բայը er-ի ձևով՝ Hier darf man nicht rauchen (այստեղ չի կարելի ծխել)։',
      ],
      tip: 'mir և dir = Dativ (Wem?), mich և dich = Akkusativ (Wen?)։',
      why: ['anrufen-ը պահանջում է Akkusativ՝ Wen rufe ich an? — dich։', 'Տերը Աննան է (sie), ուստի ihr։ «mit»-ը պահանջում է Dativ, «Mann»-ը արական է → mit ihrem Mann։'],
    },
    ka: {
      title: 'პირის, კუთვნილებითი და უკუქცევითი ნაცვალსახელები',
      sum: 'ნაცვალსახელები არსებით სახელებს ცვლის და, არტიკლების მსგავსად, თითოეული ბრუნვისთვის საკუთარი ფორმა აქვს.',
      pts: [
        'პირის ნაცვალსახელებს აქვს Nominativ, Akkusativ და Dativ ფორმები (იხ. ცხრილი): ich – mich – mir.',
        'ქართულ ზმნაში ობიექტიც ჩანს (დაგირეკავ = შენ დაგირეკავ). გერმანულში ნაცვალსახელი ყოველთვის ცალკე სიტყვაა: Ich rufe dich an.',
        'ქართული „ის“ ყველასთვისაა. გერმანულში არჩევენ სიტყვის სქესით: der Tisch → er, die Lampe → sie, das Mädchen → es.',
        'თავაზიანი „თქვენ“: Sie (ყოველთვის დიდი ასოთი), ერთი ადამიანისთვისაც: Können Sie mir helfen?',
        'ქართული „მისი“ ორივე სქესისთვისაა, გერმანულში — მფლობელის მიხედვით: Peter → seine Mutter, Anna → ihre Mutter. დაბოლოება კი იმაზეა დამოკიდებული, რას ფლობენ: seine Mutter, sein Kind, seinen Sohn.',
        'უკუქცევითი ნაცვალსახელი: Ich wasche mich (ვიბანები). თუ კიდევ არის დამატება, ის Dativ-შია: Ich wasche mir die Hände (ხელებს ვიბან).',
        'man = „ადამიანები ზოგადად“, ზმნა er-ის ფორმით: Hier darf man nicht rauchen (აქ მოწევა არ შეიძლება).',
      ],
      tip: 'mir და dir = Dativ (Wem?), mich და dich = Akkusativ (Wen?).',
      why: ['anrufen Akkusativ-ს მოითხოვს: Wen rufe ich an? — dich.', 'მფლობელი ანაა (sie), ამიტომ ihr. „mit“ Dativ-ს მოითხოვს, „Mann“ მამრობითია → mit ihrem Mann.'],
    },
    hu: {
      title: 'Személyes, birtokos és visszaható névmások',
      sum: 'A névmások főneveket helyettesítenek, és a névelőkhöz hasonlóan minden esetben más alakjuk van.',
      pts: [
        'A személyes névmásnak Nominativ, Akkusativ és Dativ alakja van (lásd a táblázatot): ich – mich (engem) – mir (nekem).',
        'A magyar igében a tárgy is benne lehet (felhívlak = téged hívlak fel). A németben a névmás mindig külön szó: Ich rufe dich an.',
        'A magyar „ő“ férfira és nőre is vonatkozik. A németben a szó neme dönt: der Tisch → er, die Lampe → sie, das Mädchen → es.',
        'Magázás: Sie (mindig nagybetűvel), egy személynek is: Können Sie mir helfen?',
        'A magyar birtokos rag (-ja/-je) mindkét nemre jó. A németben a birtokostól függ: Peter → seine Mutter, Anna → ihre Mutter. A végződés pedig a birtoktól: seine Mutter, sein Kind, seinen Sohn.',
        'Visszaható névmás: Ich wasche mich (mosakszom). Ha van még tárgy, a névmás Dativban áll: Ich wasche mir die Hände (kezet mosok).',
        'man = „általában az emberek“, az ige er alakban: Hier darf man nicht rauchen (itt nem szabad dohányozni).',
      ],
      tip: 'mir és dir = Dativ (Kinek?), mich és dich = Akkusativ (Kit?).',
      why: ['Mint a magyarban (felhív valakit): az anrufen Akkusativot kér – dich.', 'A birtokos Anna (sie), ezért ihr. A „mit“ Dativot kér, a „Mann“ hímnemű → mit ihrem Mann.'],
    },
  },
});

/* =====================================================================
   7 · Präpositionen
   ===================================================================== */
GB_CHAPTERS.push({
  id: 'praepositionen', icon: '📍', levels: ['A1', 'A2', 'B1'],
  rules: ['dat_prep', 'akk_prep', 'wechsel_wo', 'wechsel_wohin', 'stellen_stehen', 'zeit_prep', 'ort_prep', 'seit', 'uhrzeit', 'praep_verb', 'da_wo'],
  tables: [{
    head: ['Präpositionen', 'Fall', 'Beispiel'],
    rows: [
      ['aus, bei, mit, nach, seit, von, zu', 'immer Dativ', 'mit dem Bus, zum Arzt, seit einem Jahr'],
      ['durch, für, gegen, ohne, um', 'immer Akkusativ', 'für dich, ohne den Mantel, um 8 Uhr'],
      ['in, an, auf, über, unter, vor, hinter, neben, zwischen', 'Wo? → Dativ · Wohin? → Akkusativ', 'im Büro sein · ins Büro gehen'],
      ['wegen, während, trotz, statt', 'Genitiv (gesprochen oft Dativ)', 'wegen des Wetters'],
    ],
  }, {
    head: ['Ziel', 'Wo?', 'Wohin?', 'Woher?'],
    rows: [
      ['Stadt / Land ohne Artikel', 'in Berlin', 'nach Berlin', 'aus Berlin'],
      ['Land mit Artikel', 'in der Schweiz', 'in die Schweiz', 'aus der Schweiz'],
      ['Gebäude / Raum', 'im Kino', 'ins Kino', 'aus dem Kino'],
      ['Person', 'beim Arzt', 'zum Arzt', 'vom Arzt'],
      ['Zuhause', 'zu Hause', 'nach Hause', 'von zu Hause'],
    ],
  }, {
    head: ['Kurzform', '= ', 'Kurzform', '= '],
    rows: [
      ['im', 'in dem', 'ins', 'in das'],
      ['am', 'an dem', 'ans', 'an das'],
      ['zum', 'zu dem', 'zur', 'zu der'],
      ['beim', 'bei dem', 'vom', 'von dem'],
    ],
  }],
  examples: [
    { de: 'Ich fahre [mit dem] Bus [zur] Arbeit.', ru: 'Я еду на работу на автобусе.', uk: 'Я їду на роботу автобусом.', hy: 'Ավտոբուսով եմ գնում աշխատանքի։', ka: 'სამსახურში ავტობუსით მივდივარ.', hu: 'Busszal megyek dolgozni.' },
    { de: 'Das Buch liegt [auf dem] Tisch.', ru: 'Книга лежит на столе. (где?)', uk: 'Книжка лежить на столі. (де?)', hy: 'Գիրքը դրված է սեղանին։ (որտե՞ղ)', ka: 'წიგნი მაგიდაზე დევს. (სად?)', hu: 'A könyv az asztalon van. (Hol?)' },
    { de: 'Ich lege das Buch [auf den] Tisch.', ru: 'Я кладу книгу на стол. (куда?)', uk: 'Я кладу книжку на стіл. (куди?)', hy: 'Գիրքը դնում եմ սեղանին։ (ու՞ր)', ka: 'წიგნს მაგიდაზე ვდებ. (სად? საით?)', hu: 'A könyvet az asztalra teszem. (Hová?)' },
    { de: 'Ich wohne [seit] zwei Jahren in Köln.', ru: 'Я живу в Кёльне уже два года.', uk: 'Я живу в Кельні вже два роки.', hy: 'Երկու տարի է, ինչ ապրում եմ Քյոլնում։', ka: 'ორი წელია, კიოლნში ვცხოვრობ.', hu: 'Két éve lakom Kölnben.' },
    { de: 'Wir treffen uns [am] Montag [um] 8 Uhr.', ru: 'Мы встречаемся в понедельник в 8 часов.', uk: 'Ми зустрічаємося в понеділок о 8-й.', hy: 'Հանդիպում ենք երկուշաբթի ժամը 8-ին։', ka: 'ორშაბათს 8 საათზე ვხვდებით.', hu: 'Hétfőn 8 órakor találkozunk.' },
    { de: 'Ich warte [auf] dich.', ru: 'Я жду тебя.', uk: 'Я чекаю на тебе.', hy: 'Քեզ եմ սպասում։', ka: 'შენ გელოდები.', hu: 'Várok rád.' },
  ],
  mistakes: [
    { w: 'Ich warte dich.', r: 'Ich warte auf dich.' },
    { w: 'Ich gehe jetzt zu Hause.', r: 'Ich gehe jetzt nach Hause.' },
  ],
  text: {
    de: {
      title: 'Präpositionen mit Dativ, Akkusativ und Wechselpräpositionen',
      sum: 'Viele Präpositionen bestimmen den Fall – lerne sie in Gruppen.',
      pts: [
        'Immer Dativ: aus, bei, mit, nach, seit, von, zu. Immer Akkusativ: durch, für, gegen, ohne, um.',
        'Wechselpräpositionen (in, an, auf, über, unter, vor, hinter, neben, zwischen): Wo? (Ort, keine Bewegung) → Dativ. Wohin? (Richtung, Ziel) → Akkusativ.',
        'Passende Verben: stehen, liegen, sitzen, hängen (Wo? + Dativ) – stellen, legen, setzen, hängen (Wohin? + Akkusativ).',
        'Zeit: um + Uhrzeit (um 8 Uhr), am + Tag/Tageszeit (am Montag, am Abend, aber: in der Nacht), im + Monat/Jahreszeit (im Mai, im Winter).',
        '„seit“ + Dativ für etwas, das noch andauert – dann steht das Verb im Präsens: Ich wohne seit zwei Jahren hier.',
        'Richtung: nach + Stadt/Land ohne Artikel und nach Hause; zu + Person/Ort (zum Arzt); in + Land mit Artikel (in die Türkei).',
        'Viele Verben haben eine feste Präposition, die man mitlernt: warten auf + Akk, denken an + Akk, sich freuen auf/über + Akk, Angst haben vor + Dat. Bei Sachen fragt man mit wo(r)- und antwortet mit da(r)-: Worauf wartest du? – Darauf.',
      ],
      tip: 'Merksatz für Dativ: „aus, bei, mit, nach, seit, von, zu – mit dem Dativ bleibst du!“ Für Akkusativ: „DOGFU“ = durch, ohne, gegen, für, um.',
      why: ['„warten“ braucht immer die Präposition „auf“ + Akkusativ.', 'Wohin? → nach Hause. Wo? → zu Hause.'],
    },
    ru: {
      title: 'Предлоги с Dativ, Akkusativ и «двойные» предлоги',
      sum: 'Многие предлоги сами определяют падеж — учите их группами.',
      pts: [
        'Всегда Dativ: aus, bei, mit, nach, seit, von, zu. Всегда Akkusativ: durch, für, gegen, ohne, um.',
        'Двойные предлоги (in, an, auf, über, unter, vor, hinter, neben, zwischen) работают как русские «в/на»: «в комнате» (где?) — «в комнату» (куда?). Где? → Dativ (im Zimmer), куда? → Akkusativ (ins Zimmer).',
        'Глаголы-пары: stehen, liegen, sitzen, hängen (где? + Dativ) — stellen, legen, setzen, hängen (куда? + Akkusativ). Как «лежать — класть», «стоять — ставить».',
        'Время: um + час (um 8 Uhr), am + день/часть суток (am Montag, am Abend, но: in der Nacht), im + месяц/время года (im Mai, im Winter).',
        '«seit» + Dativ — для того, что длится до сих пор, и глагол стоит в настоящем времени — как в русском «живу здесь два года»: Ich wohne seit zwei Jahren hier.',
        'Направление: nach + город/страна без артикля и nach Hause; zu + человек/учреждение (zum Arzt); in + страна с артиклем (in die Türkei). Транспорт: mit dem Bus (не «auf»!).',
        'У многих глаголов свой предлог, его учат вместе с глаголом: warten auf + Akk (ждать кого-то), denken an + Akk (думать о), sich freuen auf/über + Akk, Angst haben vor + Dat (бояться). Про вещи спрашивают wo(r)- и отвечают da(r)-: Worauf wartest du? – Darauf.',
      ],
      tip: 'Запоминалка для Dativ: «aus, bei, mit, nach, seit, von, zu». Для Akkusativ: «DOGFU» = durch, ohne, gegen, für, um.',
      why: ['По-русски «ждать (кого?) тебя» — без предлога, а в немецком warten всегда с «auf» + Akkusativ.', 'Куда? → nach Hause (домой). Где? → zu Hause (дома).'],
    },
    uk: {
      title: 'Прийменники з Dativ, Akkusativ і «подвійні» прийменники',
      sum: 'Багато прийменників самі визначають відмінок — вчіть їх групами.',
      pts: [
        'Завжди Dativ: aus, bei, mit, nach, seit, von, zu. Завжди Akkusativ: durch, für, gegen, ohne, um.',
        'Подвійні прийменники (in, an, auf, über, unter, vor, hinter, neben, zwischen) працюють як українські «в/на»: «у кімнаті» (де?) — «у кімнату» (куди?). Де? → Dativ (im Zimmer), куди? → Akkusativ (ins Zimmer).',
        'Дієслова-пари: stehen, liegen, sitzen, hängen (де? + Dativ) — stellen, legen, setzen, hängen (куди? + Akkusativ). Як «лежати — класти», «стояти — ставити».',
        'Час: um + година (um 8 Uhr), am + день/частина доби (am Montag, am Abend, але: in der Nacht), im + місяць/пора року (im Mai, im Winter).',
        '«seit» + Dativ — для того, що триває досі, і дієслово стоїть у теперішньому часі — як в українському «живу тут уже два роки»: Ich wohne seit zwei Jahren hier.',
        'Напрямок: nach + місто/країна без артикля і nach Hause; zu + людина/установа (zum Arzt); in + країна з артиклем (in die Türkei). Транспорт: mit dem Bus (автобусом).',
        'Багато дієслів мають свій прийменник, його вчать разом із дієсловом: warten auf + Akk (чекати на — як в українській!), denken an + Akk, sich freuen auf/über + Akk, Angst haben vor + Dat. Про речі питають wo(r)- і відповідають da(r)-: Worauf wartest du? – Darauf.',
      ],
      tip: 'Запам’ятовувалка для Dativ: «aus, bei, mit, nach, seit, von, zu». Для Akkusativ: «DOGFU» = durch, ohne, gegen, für, um.',
      why: ['Як в українському «чекати на тебе»: warten завжди з «auf» + Akkusativ.', 'Куди? → nach Hause (додому). Де? → zu Hause (вдома).'],
    },
    hy: {
      title: 'Նախդիրներ Dativ-ով, Akkusativ-ով և «փոփոխական» նախդիրներ',
      sum: 'Շատ նախդիրներ իրենք են որոշում հոլովը. սովորեք դրանք խմբերով։',
      pts: [
        'Հայերենում տեղը հաճախ ցույց են տալիս վերջավորությամբ կամ կապով (Բեռլինում, սեղանի վրա)։ Գերմաներենում նախդիրը բառից առաջ է և որոշում է հոլովը։',
        'Միշտ Dativ՝ aus, bei, mit, nach, seit, von, zu։ Միշտ Akkusativ՝ durch, für, gegen, ohne, um։',
        'Փոփոխական նախդիրներ (in, an, auf, über, unter, vor, hinter, neben, zwischen)․ Wo? (որտե՞ղ, առանց շարժման) → Dativ։ Wohin? (ու՞ր, ուղղություն) → Akkusativ։ Հայերենում «սեղանին»-ը երկու դեպքում էլ նույնն է (դրված է սեղանին / դնում եմ սեղանին), իսկ գերմաներենում՝ auf dem Tisch / auf den Tisch։',
        'Զույգ բայեր՝ stehen, liegen, sitzen, hängen (Wo? + Dativ) — stellen, legen, setzen, hängen (Wohin? + Akkusativ)։',
        'Ժամանակ՝ um + ժամ (um 8 Uhr), am + օր/օրվա մաս (am Montag, am Abend, բայց՝ in der Nacht), im + ամիս/եղանակ (im Mai, im Winter)։',
        '«seit» + Dativ՝ այն բանի համար, որ դեռ շարունակվում է, և բայը ներկա ժամանակով է՝ Ich wohne seit zwei Jahren hier (երկու տարի է՝ այստեղ եմ ապրում)։',
        'Ուղղություն՝ nach + քաղաք/երկիր առանց հոդի և nach Hause, zu + մարդ/հաստատություն (zum Arzt)։ Շատ բայեր ունեն հաստատուն նախդիր՝ warten auf + Akk (սպասել), denken an + Akk (մտածել), Angst haben vor + Dat (վախենալ)։',
      ],
      tip: 'Dativ-ի համար հիշեք՝ «aus, bei, mit, nach, seit, von, zu»։ Akkusativ-ի համար՝ «DOGFU» = durch, ohne, gegen, für, um։',
      why: ['Հայերենում «քեզ եմ սպասում»՝ առանց նախդրի, իսկ գերմաներենում warten-ը միշտ «auf» + Akkusativ է պահանջում։', 'Ու՞ր → nach Hause (տուն)։ Որտե՞ղ → zu Hause (տանը)։'],
    },
    ka: {
      title: 'წინდებულები Dativ-ით, Akkusativ-ით და „ცვალებადი“ წინდებულები',
      sum: 'ბევრი წინდებული თავად განსაზღვრავს ბრუნვას — ისწავლეთ ისინი ჯგუფებად.',
      pts: [
        'ქართულში თანდებული სიტყვის ბოლოს ერთვის (სახლ-ში, მაგიდა-ზე). გერმანულში წინდებული სიტყვის წინ დგას და ბრუნვას განსაზღვრავს.',
        'ყოველთვის Dativ: aus, bei, mit, nach, seit, von, zu. ყოველთვის Akkusativ: durch, für, gegen, ohne, um.',
        'ცვალებადი წინდებულები (in, an, auf, über, unter, vor, hinter, neben, zwischen): Wo? (სად? — მოძრაობის გარეშე) → Dativ. Wohin? (საით? — მიმართულება) → Akkusativ. ქართულში „მაგიდაზე“ ორივე შემთხვევაში ერთნაირია (დევს / ვდებ), გერმანულში კი: auf dem Tisch / auf den Tisch.',
        'წყვილი ზმნები: stehen, liegen, sitzen, hängen (Wo? + Dativ) — stellen, legen, setzen, hängen (Wohin? + Akkusativ). როგორც „დევს — დებს“, „დგას — დგამს“.',
        'დრო: um + საათი (um 8 Uhr), am + დღე/დღის მონაკვეთი (am Montag, am Abend, მაგრამ: in der Nacht), im + თვე/წელიწადის დრო (im Mai, im Winter).',
        '„seit“ + Dativ — იმისთვის, რაც ჯერაც გრძელდება, ზმნა კი აწმყოშია, როგორც ქართულში: Ich wohne seit zwei Jahren hier (ორი წელია აქ ვცხოვრობ).',
        'მიმართულება: nach + ქალაქი/ქვეყანა არტიკლის გარეშე და nach Hause; zu + ადამიანი/დაწესებულება (zum Arzt). ტრანსპორტი: mit dem Bus (ავტობუსით). ბევრ ზმნას მყარი წინდებული აქვს: warten auf + Akk (ლოდინი), denken an + Akk (ფიქრი), Angst haben vor + Dat (შიში).',
      ],
      tip: 'Dativ-ისთვის დაიმახსოვრეთ: „aus, bei, mit, nach, seit, von, zu“. Akkusativ-ისთვის: „DOGFU“ = durch, ohne, gegen, für, um.',
      why: ['ქართულად „გელოდები“ — წინდებულის გარეშე, გერმანულში warten ყოველთვის „auf“ + Akkusativ-ს მოითხოვს.', 'საით? → nach Hause (სახლში — მიმართულება). სად? → zu Hause (სახლში — ადგილი).'],
    },
    hu: {
      title: 'Elöljárószók Dativval, Akkusativval és a „váltakozó“ elöljárók',
      sum: 'Sok elöljárószó maga dönti el az esetet – csoportokban érdemes tanulni őket.',
      pts: [
        'A magyar ragokat és névutókat a szó után teszi (házban, asztal alatt). A német elöljárószó a szó előtt áll, és meghatározza az esetet.',
        'Mindig Dativ: aus, bei, mit, nach, seit, von, zu. Mindig Akkusativ: durch, für, gegen, ohne, um.',
        'Váltakozó elöljárók (in, an, auf, über, unter, vor, hinter, neben, zwischen) – pontosan, mint a magyar hol?/hová?: asztalon (Hol?) → auf dem Tisch (Dativ), asztalra (Hová?) → auf den Tisch (Akkusativ). Hasonlóan: -ban / -ba = im / ins.',
        'Igepárok: stehen, liegen, sitzen, hängen (Hol? + Dativ) – stellen, legen, setzen, hängen (Hová? + Akkusativ). Mint „fekszik – fektet“, „áll – állít“.',
        'Idő: um + óra (um 8 Uhr), am + nap/napszak (am Montag, am Abend, de: in der Nacht), im + hónap/évszak (im Mai, im Winter).',
        '„seit“ + Dativ: valami, ami még tart, és az ige jelen időben áll, mint a magyarban: Ich wohne seit zwei Jahren hier (két éve lakom itt).',
        'Irány: nach + város/ország névelő nélkül és nach Hause; zu + személy/intézmény (zum Arzt). Sok igének állandó elöljárója van: warten auf + Akk (vár valakire – a rá = auf!), denken an + Akk (gondol valamire), Angst haben vor + Dat (fél valamitől).',
      ],
      tip: 'Dativhoz: „aus, bei, mit, nach, seit, von, zu“. Akkusativhoz: „DOGFU“ = durch, ohne, gegen, für, um.',
      why: ['Mint a magyar „vár rád“: a warten mindig „auf“ + Akkusativval áll.', 'Hová? → nach Hause (haza). Hol? → zu Hause (otthon).'],
    },
  },
});

/* =====================================================================
   8 · Modalverben
   ===================================================================== */
GB_CHAPTERS.push({
  id: 'modalverben', icon: '🔑', levels: ['A1', 'A2', 'B1'],
  rules: ['modal', 'modal_bed', 'gern', 'lassen', 'brauchen_zu', 'modal_vergangenheit'],
  tables: [{
    head: ['', 'können', 'müssen', 'dürfen', 'sollen', 'wollen', 'möchten'],
    rows: [
      ['ich', 'kann', 'muss', 'darf', 'soll', 'will', 'möchte'],
      ['du', 'kannst', 'musst', 'darfst', 'sollst', 'willst', 'möchtest'],
      ['er/sie/es', 'kann', 'muss', 'darf', 'soll', 'will', 'möchte'],
      ['wir', 'können', 'müssen', 'dürfen', 'sollen', 'wollen', 'möchten'],
      ['ihr', 'könnt', 'müsst', 'dürft', 'sollt', 'wollt', 'möchtet'],
      ['sie/Sie', 'können', 'müssen', 'dürfen', 'sollen', 'wollen', 'möchten'],
      ['Präteritum', 'konnte', 'musste', 'durfte', 'sollte', 'wollte', '(wollte)'],
    ],
  }, {
    head: ['Modalverb', 'Bedeutung', 'Beispiel'],
    rows: [
      ['können', 'Fähigkeit, Möglichkeit', 'Ich kann schwimmen.'],
      ['müssen', 'Notwendigkeit', 'Ich muss arbeiten.'],
      ['nicht müssen', 'nicht nötig', 'Du musst nicht kommen.'],
      ['dürfen / nicht dürfen', 'Erlaubnis / Verbot', 'Hier darf man nicht rauchen.'],
      ['sollen', 'Auftrag oder Rat von anderen', 'Der Arzt sagt, ich soll mehr schlafen.'],
      ['wollen', 'eigener Wille, Plan', 'Ich will Ärztin werden.'],
      ['möchten', 'höflicher Wunsch', 'Ich möchte einen Kaffee.'],
      ['mögen', 'gern haben (meist + Nomen)', 'Ich mag Schokolade.'],
    ],
  }],
  examples: [
    { de: 'Ich [kann] gut [schwimmen].', ru: 'Я хорошо умею плавать.', uk: 'Я добре вмію плавати.', hy: 'Ես լավ լողալ գիտեմ։', ka: 'კარგად ცურვა ვიცი.', hu: 'Jól tudok úszni.' },
    { de: 'Hier [darf] man nicht [parken].', ru: 'Здесь нельзя парковаться.', uk: 'Тут не можна паркуватися.', hy: 'Այստեղ չի կարելի մեքենա կայանել։', ka: 'აქ მანქანის გაჩერება არ შეიძლება.', hu: 'Itt nem szabad parkolni.' },
    { de: 'Du [musst] heute nicht [kommen].', ru: 'Тебе не нужно сегодня приходить.', uk: 'Тобі не треба сьогодні приходити.', hy: 'Այսօր պարտադիր չէ, որ գաս։', ka: 'დღეს მოსვლა არ გჭირდება.', hu: 'Ma nem kell jönnöd.' },
    { de: '[Möchten] Sie einen Kaffee?', ru: 'Хотите кофе?', uk: 'Бажаєте кави?', hy: 'Սուրճ կցանկանա՞ք։', ka: 'ყავას ხომ არ ინებებთ?', hu: 'Kér egy kávét?' },
    { de: 'Gestern [musste] ich lange [arbeiten].', ru: 'Вчера мне пришлось долго работать.', uk: 'Учора мені довелося довго працювати.', hy: 'Երեկ ստիպված էի երկար աշխատել։', ka: 'გუშინ დიდხანს მომიწია მუშაობა.', hu: 'Tegnap sokáig kellett dolgoznom.' },
    { de: 'Ich [lasse] mein Auto [reparieren].', ru: 'Я отдаю машину в ремонт.', uk: 'Я віддаю машину в ремонт.', hy: 'Մեքենաս տալիս եմ վերանորոգման։', ka: 'მანქანას ვარემონტებინებ.', hu: 'Megjavíttatom az autómat.' },
  ],
  mistakes: [
    { w: 'Ich kann gut zu schwimmen.', r: 'Ich kann gut schwimmen.' },
    { w: 'Du darfst nicht kommen. (gemeint: Es ist nicht nötig.)', r: 'Du musst nicht kommen.' },
  ],
  text: {
    de: {
      title: 'Modalverben: können, müssen, dürfen, sollen, wollen, möchten',
      sum: 'Modalverben zeigen, ob man etwas kann, muss, darf oder will – das zweite Verb steht als Infinitiv am Ende.',
      pts: [
        'Satzklammer: Modalverb auf Platz 2, Infinitiv ohne „zu“ am Satzende: Ich kann heute nicht kommen.',
        'ich und er/sie/es haben keine Endung und sind gleich: ich kann, er kann. Im Singular fällt der Umlaut weg (können → ich kann).',
        'Wichtig: „nicht müssen“ = es ist nicht nötig. „nicht dürfen“ = es ist verboten. Statt „nicht müssen“ sagt man auch „nicht brauchen zu“: Du brauchst nicht zu kommen.',
        'sollen = jemand anderes will es (Auftrag, Rat). wollen = ich selbst will es.',
        'möchten = höflicher Wunsch, besser als „ich will“ im Geschäft oder Restaurant. mögen + Nomen = gern haben; gern + Verb = etwas gern tun (Ich koche gern).',
        'Vergangenheit: meist Präteritum ohne Umlaut: konnte, musste, durfte, wollte, sollte.',
        'lassen + Infinitiv: etwas nicht selbst tun, sondern machen lassen: Ich lasse mein Auto reparieren.',
      ],
      tip: 'Das Modalverb arbeitet wie ein Motor auf Platz 2 – das „richtige“ Verb wartet am Ende, unverändert im Infinitiv.',
      why: ['Nach Modalverben steht der Infinitiv ohne „zu“.', '„nicht dürfen“ ist ein Verbot. Wenn es nur nicht nötig ist, sagt man „nicht müssen“.'],
    },
    ru: {
      title: 'Модальные глаголы: können, müssen, dürfen, sollen, wollen, möchten',
      sum: 'Модальные глаголы показывают, можно, нужно или хочется что-то сделать, — второй глагол стоит в инфинитиве в конце.',
      pts: [
        'Рамка: модальный глагол на 2-м месте, инфинитив без «zu» — в конце: Ich kann heute nicht kommen.',
        'У ich и er/sie/es нет окончания, и формы совпадают: ich kann, er kann. В единственном числе умлаут исчезает (können → ich kann).',
        'В русском «мне надо» — безличная форма с дательным падежом. В немецком всегда лично: Ich muss (а не «Mir muss»).',
        'Очень важно: «nicht müssen» = не нужно, не обязательно. «nicht dürfen» = нельзя, запрещено. Вместо «nicht müssen» говорят и «nicht brauchen zu»: Du brauchst nicht zu kommen.',
        'können = мочь и уметь. sollen = кто-то другой хочет (поручение, совет). wollen = я сам хочу.',
        'möchten = вежливое «хотел(а) бы», лучше чем «ich will» в магазине или кафе. mögen + существительное = любить (Ich mag Kaffee); gern + глагол = любить что-то делать (Ich koche gern).',
        'Прошедшее время: обычно Präteritum без умлаута: konnte, musste, durfte, wollte, sollte. lassen + инфинитив = поручить что-то сделать другому: Ich lasse mein Auto reparieren.',
      ],
      tip: 'Модальный глагол — как мотор на 2-м месте, а «настоящий» глагол ждёт в конце в неизменной форме.',
      why: ['После модальных глаголов инфинитив стоит без «zu».', '«nicht dürfen» — это запрет («нельзя»). Если просто не нужно, говорят «nicht müssen».'],
    },
    uk: {
      title: 'Модальні дієслова: können, müssen, dürfen, sollen, wollen, möchten',
      sum: 'Модальні дієслова показують, чи можна, треба або хочеться щось зробити, — друге дієслово стоїть в інфінітиві в кінці.',
      pts: [
        'Рамка: модальне дієслово на 2-му місці, інфінітив без «zu» — у кінці: Ich kann heute nicht kommen.',
        'У ich та er/sie/es немає закінчення, і форми збігаються: ich kann, er kann. В однині умлаут зникає (können → ich kann).',
        'В українській «мені треба» — безособова форма з давальним відмінком. У німецькій завжди особова: Ich muss (а не «Mir muss»).',
        'Дуже важливо: «nicht müssen» = не треба, не обов’язково. «nicht dürfen» = не можна, заборонено. Замість «nicht müssen» кажуть і «nicht brauchen zu»: Du brauchst nicht zu kommen.',
        'können = могти й уміти. sollen = хтось інший хоче (доручення, порада). wollen = я сам хочу.',
        'möchten = ввічливе «хотів(-ла) б», краще ніж «ich will» у магазині чи кафе. mögen + іменник = любити (Ich mag Kaffee); gern + дієслово = любити щось робити (Ich koche gern).',
        'Минулий час: зазвичай Präteritum без умлауту: konnte, musste, durfte, wollte, sollte. lassen + інфінітив = доручити щось зробити іншому: Ich lasse mein Auto reparieren.',
      ],
      tip: 'Модальне дієслово — як мотор на 2-му місці, а «справжнє» дієслово чекає в кінці в незмінній формі.',
      why: ['Після модальних дієслів інфінітив стоїть без «zu».', '«nicht dürfen» — це заборона («не можна»). Якщо просто не треба, кажуть «nicht müssen».'],
    },
    hy: {
      title: 'Եղանակավորող բայեր՝ können, müssen, dürfen, sollen, wollen, möchten',
      sum: 'Եղանակավորող բայերը ցույց են տալիս՝ կարելի՞ է, պե՞տք է, թե՞ ուզում ենք ինչ-որ բան անել. երկրորդ բայը անորոշ դերբայով է և վերջում։',
      pts: [
        'Շրջանակ՝ եղանակավորող բայը 2-րդ տեղում է, անորոշ դերբայը՝ առանց «zu»-ի, վերջում՝ Ich kann heute nicht kommen։',
        'Հայերենում «պետք է» բառից հետո գալիս է ըղձական (պետք է գնամ), գերմաներենում՝ անփոփոխ անորոշ դերբայ վերջում՝ Ich muss gehen։',
        'ich-ն ու er/sie/es-ը վերջավորություն չունեն և նույնն են՝ ich kann, er kann։ Եզակիում ումլաուտը (ä, ö, ü) վերանում է (können → ich kann)։',
        'Շատ կարևոր է. «nicht müssen» = պարտադիր չէ։ «nicht dürfen» = չի կարելի, արգելված է։ «nicht müssen»-ի փոխարեն ասում են նաև «nicht brauchen zu»՝ Du brauchst nicht zu kommen։',
        'können = կարողանալ և իմանալ (անել)։ sollen = ուրիշն է ուզում (հանձնարարություն, խորհուրդ)։ wollen = ես ինքս եմ ուզում։',
        'möchten = քաղաքավարի «կցանկանայի», խանութում կամ սրճարանում ավելի լավ է, քան «ich will»-ը։ mögen + գոյական = սիրել (Ich mag Kaffee), gern + բայ = սիրել ինչ-որ բան անել (Ich koche gern)։',
        'Անցյալ՝ սովորաբար Präteritum առանց ումլաուտի՝ konnte, musste, durfte, wollte, sollte։ lassen + անորոշ դերբայ = ուրիշին տալ անելու՝ Ich lasse mein Auto reparieren։',
      ],
      tip: 'Եղանակավորող բայը շարժիչի պես է 2-րդ տեղում, իսկ «իսկական» բայը սպասում է վերջում՝ անփոփոխ ձևով։',
      why: ['Եղանակավորող բայերից հետո անորոշ դերբայը գալիս է առանց «zu»-ի։', '«nicht dürfen»-ը արգելք է («չի կարելի»)։ Եթե պարզապես պետք չէ, ասում են «nicht müssen»։'],
    },
    ka: {
      title: 'მოდალური ზმნები: können, müssen, dürfen, sollen, wollen, möchten',
      sum: 'მოდალური ზმნები აჩვენებს, შეიძლება, საჭიროა თუ გვინდა რაღაცის გაკეთება — მეორე ზმნა ინფინიტივშია და ბოლოს დგას.',
      pts: [
        'ჩარჩო: მოდალური ზმნა მე-2 ადგილზეა, ინფინიტივი „zu“-ს გარეშე — ბოლოს: Ich kann heute nicht kommen.',
        'ქართული „უნდა“ ორ რამეს ნიშნავს: „უნდა წავიდე“ = Ich muss gehen, „მინდა წავიდე“ = Ich will gehen. გერმანულში ეს ორი სხვადასხვა ზმნაა: müssen და wollen.',
        'ქართულში „უნდა“-ს შემდეგ კავშირებითი მოდის (უნდა წავიდე), გერმანულში — უცვლელი ინფინიტივი ბოლოს: Ich muss gehen.',
        'ich-სა და er/sie/es-ს დაბოლოება არ აქვს და ერთნაირია: ich kann, er kann. მხოლობითში უმლაუტი ქრება (können → ich kann).',
        'ძალიან მნიშვნელოვანია: „nicht müssen“ = საჭირო არ არის. „nicht dürfen“ = არ შეიძლება, აკრძალულია. „nicht müssen“-ის ნაცვლად ამბობენ „nicht brauchen zu“-საც: Du brauchst nicht zu kommen.',
        'sollen = სხვას სურს (დავალება, რჩევა). möchten = თავაზიანი სურვილი, მაღაზიაში ან კაფეში „ich will“-ზე უკეთესია. mögen + არსებითი = მოწონება (Ich mag Kaffee); gern + ზმნა = რაღაცის კეთება მიყვარს (Ich koche gern).',
        'წარსული: ჩვეულებრივ Präteritum უმლაუტის გარეშე: konnte, musste, durfte, wollte, sollte. lassen + ინფინიტივი = სხვას გავაკეთებინო: Ich lasse mein Auto reparieren.',
      ],
      tip: 'მოდალური ზმნა მე-2 ადგილზე ძრავასავითაა, „ნამდვილი“ ზმნა კი ბოლოში უცვლელი ფორმით ელოდება.',
      why: ['მოდალური ზმნების შემდეგ ინფინიტივი „zu“-ს გარეშე დგას.', '„nicht dürfen“ აკრძალვაა („არ შეიძლება“). თუ უბრალოდ საჭირო არ არის, ამბობენ „nicht müssen“.'],
    },
    hu: {
      title: 'Módbeli segédigék: können, müssen, dürfen, sollen, wollen, möchten',
      sum: 'A módbeli segédigék megmutatják, hogy valamit lehet, kell, szabad vagy akarunk – a második ige főnévi igenévként a mondat végén áll.',
      pts: [
        'Mondatkeret: a módbeli ige a 2. helyen, a főnévi igenév „zu“ nélkül a mondat végén: Ich kann heute nicht kommen.',
        'A magyarban a „kell“ személytelen, és a személy a főnévi igenéven jelenik meg (mennem kell). A németben az ige ragozódik, a főnévi igenév változatlan: Ich muss gehen.',
        'Az ich és az er/sie/es alak végződés nélküli és azonos: ich kann, er kann. Egyes számban eltűnik az umlaut (können → ich kann).',
        'Nagyon fontos: „nicht müssen“ = nem kell. „nicht dürfen“ = nem szabad, tilos. A „nicht müssen“ helyett mondják ezt is: „nicht brauchen zu“: Du brauchst nicht zu kommen.',
        'können = tud, képes (Jól tudok úszni). sollen = más akarja (megbízás, tanács). wollen = én magam akarom.',
        'möchten = udvarias „szeretnék“, boltban vagy étteremben jobb, mint az „ich will“. mögen + főnév = szeret (Ich mag Kaffee); gern + ige = szívesen csinál valamit (Ich koche gern).',
        'Múlt idő: általában Präteritum umlaut nélkül: konnte, musste, durfte, wollte, sollte. lassen + főnévi igenév = megcsináltat (mint a magyar -tat/-tet): Ich lasse mein Auto reparieren.',
      ],
      tip: 'A módbeli ige motorként áll a 2. helyen – az „igazi“ ige változatlanul vár a mondat végén.',
      why: ['Módbeli igék után a főnévi igenév „zu“ nélkül áll.', 'A „nicht dürfen“ tiltás („nem szabad“). Ha csak nem szükséges, „nicht müssen“.'],
    },
  },
});

/* =====================================================================
   9 · Vergangenheit: Perfekt, Präteritum, Plusquamperfekt
   ===================================================================== */
GB_CHAPTERS.push({
  id: 'vergangenheit', icon: '⏳', levels: ['A2', 'B1'],
  rules: ['perfekt_haben', 'perfekt_sein', 'partizip', 'praet', 'praet_stark', 'pqp'],
  tables: [{
    head: ['Typ', 'Infinitiv', 'Partizip II'],
    rows: [
      ['regelmäßig: ge- … -t', 'machen, kaufen, arbeiten', 'gemacht, gekauft, gearbeitet'],
      ['unregelmäßig: ge- … -en', 'sehen, schreiben, trinken', 'gesehen, geschrieben, getrunken'],
      ['trennbar: Präfix + ge-', 'aufstehen, einkaufen', 'aufgestanden, eingekauft'],
      ['ohne ge-: be-, ver-, er-, ent-, zer-, ge-', 'besuchen, verstehen, erklären', 'besucht, verstanden, erklärt'],
      ['ohne ge-: -ieren', 'studieren, telefonieren', 'studiert, telefoniert'],
    ],
  }, {
    head: ['Perfekt mit sein', 'Beispiele'],
    rows: [
      ['Bewegung von A nach B', 'gehen, fahren, kommen, fliegen, laufen → ist gegangen'],
      ['Zustandsänderung', 'aufstehen, einschlafen, aufwachen, sterben, werden → ist geworden'],
      ['außerdem', 'sein → ist gewesen, bleiben → ist geblieben, passieren → ist passiert'],
    ],
  }, {
    head: ['Präteritum', 'sein', 'haben', 'machen', 'gehen'],
    rows: [
      ['ich', 'war', 'hatte', 'machte', 'ging'],
      ['du', 'warst', 'hattest', 'machtest', 'gingst'],
      ['er/sie/es', 'war', 'hatte', 'machte', 'ging'],
      ['wir', 'waren', 'hatten', 'machten', 'gingen'],
      ['ihr', 'wart', 'hattet', 'machtet', 'gingt'],
      ['sie/Sie', 'waren', 'hatten', 'machten', 'gingen'],
    ],
  }],
  examples: [
    { de: 'Ich [habe] gestern Pizza [gegessen].', ru: 'Вчера я ел пиццу.', uk: 'Учора я їв піцу.', hy: 'Երեկ պիցցա եմ կերել։', ka: 'გუშინ პიცა ვჭამე.', hu: 'Tegnap pizzát ettem.' },
    { de: 'Wir [sind] nach Berlin [gefahren].', ru: 'Мы съездили в Берлин.', uk: 'Ми їздили до Берліна.', hy: 'Մենք գնացինք Բեռլին։', ka: 'ბერლინში წავედით.', hu: 'Berlinbe utaztunk.' },
    { de: 'Er [ist] um 7 Uhr [aufgestanden].', ru: 'Он встал в 7 часов.', uk: 'Він устав о 7-й.', hy: 'Նա վեր կացավ ժամը 7-ին։', ka: 'ის 7 საათზე ადგა.', hu: '7 órakor kelt fel.' },
    { de: 'Als Kind [war] ich oft krank.', ru: 'В детстве я часто болел.', uk: 'У дитинстві я часто хворів.', hy: 'Մանուկ ժամանակ հաճախ էի հիվանդանում։', ka: 'ბავშვობაში ხშირად ვავადობდი.', hu: 'Gyerekként gyakran beteg voltam.' },
    { de: 'Nachdem wir gegessen [hatten], [gingen] wir spazieren.', ru: 'После того как мы поели, мы пошли гулять.', uk: 'Після того як ми поїли, ми пішли гуляти.', hy: 'Ուտելուց հետո գնացինք զբոսնելու։', ka: 'ჭამის შემდეგ სასეირნოდ წავედით.', hu: 'Miután ettünk, elmentünk sétálni.' },
  ],
  mistakes: [
    { w: 'Ich habe nach Berlin gefahren.', r: 'Ich bin nach Berlin gefahren.' },
    { w: 'Ich habe das Buch gelest.', r: 'Ich habe das Buch gelesen.' },
  ],
  text: {
    de: {
      title: 'Vergangenheit: Perfekt, Präteritum, Plusquamperfekt',
      sum: 'Beim Sprechen benutzt man meist das Perfekt, beim Schreiben das Präteritum – die Bedeutung ist gleich.',
      pts: [
        'Gesprochen: Perfekt (Ich habe gegessen). Geschrieben (Bücher, Berichte, Nachrichten): Präteritum (Er aß). sein, haben und Modalverben benutzt man auch im Gespräch im Präteritum: Ich war, ich hatte, ich musste.',
        'Perfekt = haben oder sein auf Platz 2 + Partizip II am Ende: Ich habe gestern Pizza gegessen.',
        'Die meisten Verben bilden das Perfekt mit haben. Mit sein: Bewegung von A nach B, Zustandsänderung, außerdem sein, bleiben, passieren.',
        'Partizip II: regelmäßig ge-…-t, unregelmäßig ge-…-en (oft mit anderem Vokal: trinken → getrunken). Ohne ge-: Verben mit be-, ver-, er- … und auf -ieren.',
        'Präteritum: ich und er/sie/es haben keine Endung (ich war, er ging). Unregelmäßige Formen lernt man mit dem Partizip: gehen – ging – gegangen.',
        'Plusquamperfekt = hatte/war + Partizip II: etwas geschah VOR einer anderen Handlung in der Vergangenheit, oft mit „nachdem“.',
      ],
      tip: 'Bewegst du dich von A nach B oder ändert sich dein Zustand? → sein. Sonst → haben.',
      why: ['„fahren“ ist eine Bewegung von A nach B → Perfekt mit sein.', '„lesen“ ist unregelmäßig: lesen – las – gelesen.'],
    },
    ru: {
      title: 'Прошедшее время: Perfekt, Präteritum, Plusquamperfekt',
      sum: 'В разговоре обычно используют Perfekt, в письменной речи — Präteritum; по смыслу они одинаковы.',
      pts: [
        'В русском одно прошедшее время, но есть вид (читал/прочитал). В немецком вида нет: «Ich habe gelesen» может значить и «читал», и «прочитал». Выбор формы зависит от стиля, а не от смысла.',
        'Устно: Perfekt (Ich habe gegessen). Письменно (книги, отчёты, новости): Präteritum (Er aß). sein, haben и модальные глаголы и в разговоре чаще в Präteritum: Ich war, ich hatte, ich musste.',
        'Perfekt = haben или sein на 2-м месте + причастие II (Partizip II) в конце: Ich habe gestern Pizza gegessen.',
        'Большинство глаголов образуют Perfekt с haben. С sein: движение из точки А в точку Б, изменение состояния, а также sein, bleiben, passieren.',
        'Partizip II: правильные ge-…-t, неправильные ge-…-en (часто с другой гласной: trinken → getrunken). Без ge-: глаголы на be-, ver-, er- … и на -ieren.',
        'Präteritum: у ich и er/sie/es нет окончания (ich war, er ging). Неправильные формы учат тройкой: gehen – ging – gegangen.',
        'Plusquamperfekt = hatte/war + Partizip II: действие произошло ДО другого действия в прошлом, часто с «nachdem» (после того как).',
      ],
      tip: 'Вы перемещаетесь из А в Б или меняется ваше состояние? → sein. Иначе → haben.',
      why: ['«fahren» — движение из А в Б → Perfekt с sein.', '«lesen» — неправильный глагол: lesen – las – gelesen.'],
    },
    uk: {
      title: 'Минулий час: Perfekt, Präteritum, Plusquamperfekt',
      sum: 'У розмові зазвичай уживають Perfekt, на письмі — Präteritum; за змістом вони однакові.',
      pts: [
        'В українській один минулий час, але є вид (читав/прочитав). У німецькій виду немає: «Ich habe gelesen» може означати і «читав», і «прочитав». Вибір форми залежить від стилю, а не від змісту.',
        'Усно: Perfekt (Ich habe gegessen). Письмово (книжки, звіти, новини): Präteritum (Er aß). sein, haben і модальні дієслова й у розмові частіше в Präteritum: Ich war, ich hatte, ich musste.',
        'Perfekt = haben або sein на 2-му місці + дієприкметник II (Partizip II) у кінці: Ich habe gestern Pizza gegessen.',
        'Більшість дієслів утворюють Perfekt із haben. Із sein: рух із точки А в точку Б, зміна стану, а також sein, bleiben, passieren.',
        'Partizip II: правильні ge-…-t, неправильні ge-…-en (часто з іншою голосною: trinken → getrunken). Без ge-: дієслова на be-, ver-, er- … і на -ieren.',
        'Präteritum: у ich та er/sie/es немає закінчення (ich war, er ging). Неправильні форми вчать трійкою: gehen – ging – gegangen.',
        'Plusquamperfekt = hatte/war + Partizip II: дія відбулася ДО іншої дії в минулому, часто з «nachdem» (після того як).',
      ],
      tip: 'Ви переміщуєтеся з А в Б або змінюється ваш стан? → sein. Інакше → haben.',
      why: ['«fahren» — рух з А в Б → Perfekt із sein.', '«lesen» — неправильне дієслово: lesen – las – gelesen.'],
    },
    hy: {
      title: 'Անցյալ ժամանակ՝ Perfekt, Präteritum, Plusquamperfekt',
      sum: 'Խոսքում սովորաբար օգտագործում են Perfekt, գրավոր խոսքում՝ Präteritum. իմաստով դրանք նույնն են։',
      pts: [
        'Perfekt-ը կառուցվածքով նման է հայերենի «կերել եմ»-ին՝ դերբայ + օժանդակ բայ, միայն թե գերմաներենում օժանդակը 2-րդ տեղում է, իսկ դերբայը՝ վերջում՝ Ich habe Pizza gegessen։',
        'Բանավոր՝ Perfekt (Ich habe gegessen)։ Գրավոր (գրքեր, հաշվետվություններ, լուրեր)՝ Präteritum (Er aß)։ sein, haben և եղանակավորող բայերը նաև խոսքում հաճախ Präteritum են՝ Ich war, ich hatte, ich musste։',
        'Օժանդակ բայը երկուսն է՝ haben կամ sein։ Բայերի մեծ մասը haben-ով է։ sein-ով են՝ Ա կետից Բ կետ շարժում, վիճակի փոփոխություն, ինչպես նաև sein, bleiben, passieren։',
        'Partizip II՝ կանոնավոր ge-…-t, անկանոն ge-…-en (հաճախ այլ ձայնավորով՝ trinken → getrunken)։ Առանց ge-՝ be-, ver-, er- … նախածանցով և -ieren-ով բայերը։',
        'Präteritum՝ ich-ն ու er/sie/es-ը վերջավորություն չունեն (ich war, er ging)։ Անկանոն ձևերը սովորում են եռյակով՝ gehen – ging – gegangen։',
        'Plusquamperfekt = hatte/war + Partizip II՝ գործողություն, որ եղել է անցյալի մեկ այլ գործողությունից ԱՌԱՋ, հաճախ «nachdem»-ով (այն բանից հետո, երբ)։',
      ],
      tip: 'Ա-ից Բ եք շարժվում, կամ փոխվում է ձեր վիճակը → sein։ Հակառակ դեպքում → haben։',
      why: ['«fahren»-ը շարժում է Ա-ից Բ → Perfekt sein-ով։', '«lesen»-ը անկանոն է՝ lesen – las – gelesen։'],
    },
    ka: {
      title: 'წარსული დრო: Perfekt, Präteritum, Plusquamperfekt',
      sum: 'საუბარში ჩვეულებრივ Perfekt-ს იყენებენ, წერისას — Präteritum-ს; მნიშვნელობით ისინი ერთნაირია.',
      pts: [
        'ყურადღება: ქართული თურმეობითი (მიჭამია) ხშირად „თურმე“-ს მნიშვნელობას შეიცავს. გერმანული Perfekt უბრალოდ სასაუბრო წარსულია, ქართული ნამყო ძირითადის (ვჭამე) მსგავსად: Ich habe gegessen = ვჭამე.',
        'სასაუბროში: Perfekt (Ich habe gegessen). წერილობით (წიგნები, ანგარიშები, ახალი ამბები): Präteritum (Er aß). sein, haben და მოდალური ზმნები საუბარშიც ხშირად Präteritum-შია: Ich war, ich hatte, ich musste.',
        'Perfekt = haben ან sein მე-2 ადგილზე + Partizip II ბოლოს: Ich habe gestern Pizza gegessen.',
        'ზმნების უმეტესობა Perfekt-ს haben-ით აწარმოებს. sein-ით: მოძრაობა A-დან B-მდე, მდგომარეობის ცვლილება, ასევე sein, bleiben, passieren.',
        'Partizip II: წესიერი ge-…-t, არაწესიერი ge-…-en (ხშირად სხვა ხმოვნით: trinken → getrunken). ge--ს გარეშე: be-, ver-, er- … თავსართიანი და -ieren-ზე დამთავრებული ზმნები.',
        'Präteritum: ich-სა და er/sie/es-ს დაბოლოება არ აქვს (ich war, er ging). არაწესიერ ფორმებს სამეულად სწავლობენ: gehen – ging – gegangen.',
        'Plusquamperfekt = hatte/war + Partizip II: ქმედება, რომელიც წარსულში სხვა ქმედებაზე ადრე მოხდა, ხშირად „nachdem“-ით (მას შემდეგ, რაც).',
      ],
      tip: 'A-დან B-მდე მოძრაობთ ან თქვენი მდგომარეობა იცვლება? → sein. სხვა შემთხვევაში → haben.',
      why: ['„fahren“ მოძრაობაა A-დან B-მდე → Perfekt sein-ით.', '„lesen“ არაწესიერია: lesen – las – gelesen.'],
    },
    hu: {
      title: 'Múlt idő: Perfekt, Präteritum, Plusquamperfekt',
      sum: 'Beszédben általában a Perfektet, írásban a Präteritumot használják – a jelentés ugyanaz.',
      pts: [
        'A magyarban egy múlt idő van (ettem). A németben kettő, és a választás stílus kérdése: beszédben Perfekt (Ich habe gegessen), írásban – könyvben, beszámolóban, hírekben – Präteritum (Er aß).',
        'A sein, a haben és a módbeli igék beszédben is többnyire Präteritumban állnak: Ich war, ich hatte, ich musste.',
        'Perfekt = haben vagy sein a 2. helyen + Partizip II a mondat végén: Ich habe gestern Pizza gegessen.',
        'A legtöbb ige haben-nel képzi a Perfektet. sein-nel: helyváltoztatás A-ból B-be, állapotváltozás, továbbá sein, bleiben, passieren.',
        'Partizip II: szabályos ge-…-t, rendhagyó ge-…-en (gyakran más magánhangzóval: trinken → getrunken). ge- nélkül: be-, ver-, er- … előtagú és -ieren végű igék.',
        'Präteritum: az ich és az er/sie/es alaknak nincs végződése (ich war, er ging). A rendhagyó alakokat hármasával tanuljuk: gehen – ging – gegangen.',
        'Plusquamperfekt = hatte/war + Partizip II: valami egy másik múltbeli esemény ELŐTT történt, gyakran „nachdem“-mel (miután).',
      ],
      tip: 'A-ból B-be mozog, vagy megváltozik az állapota? → sein. Egyébként → haben.',
      why: ['A „fahren“ helyváltoztatás A-ból B-be → Perfekt sein-nel.', 'A „lesen“ rendhagyó: lesen – las – gelesen.'],
    },
  },
});

/* =====================================================================
   10 · werden: Futur, Passiv, Konjunktiv II
   ===================================================================== */
GB_CHAPTERS.push({
  id: 'werden', icon: '🔮', levels: ['A2', 'B1', 'B2'],
  rules: ['werden', 'futur', 'passiv', 'konj2', 'konj1'],
  tables: [{
    head: ['', 'Präsens', 'Präteritum', 'Konjunktiv II'],
    rows: [
      ['ich', 'werde', 'wurde', 'würde'],
      ['du', 'wirst', 'wurdest', 'würdest'],
      ['er/sie/es', 'wird', 'wurde', 'würde'],
      ['wir', 'werden', 'wurden', 'würden'],
      ['ihr', 'werdet', 'wurdet', 'würdet'],
      ['sie/Sie', 'werden', 'wurden', 'würden'],
    ],
  }, {
    head: ['werden + …', 'Bedeutung', 'Beispiel'],
    rows: [
      ['Nomen / Adjektiv', 'Veränderung', 'Ich werde Ärztin. Es wird kalt.'],
      ['Infinitiv', 'Futur I (Zukunft, Vermutung)', 'Ich werde morgen arbeiten.'],
      ['Partizip II', 'Passiv', 'Das Haus wird gebaut.'],
      ['würde + Infinitiv', 'Konjunktiv II', 'Ich würde gern reisen.'],
    ],
  }, {
    head: ['Konjunktiv II', 'Gegenwart', 'Vergangenheit'],
    rows: [
      ['sein', 'ich wäre', 'ich wäre gewesen'],
      ['haben', 'ich hätte', 'ich hätte gehabt'],
      ['können / müssen / dürfen', 'ich könnte / müsste / dürfte', 'ich hätte … können'],
      ['andere Verben', 'ich würde kommen', 'ich wäre gekommen / hätte gemacht'],
    ],
  }, {
    head: ['Passiv', 'Form', 'Beispiel'],
    rows: [
      ['Präsens', 'wird + Partizip II', 'Das Auto wird repariert.'],
      ['Präteritum', 'wurde + Partizip II', 'Das Auto wurde repariert.'],
      ['Perfekt', 'ist + Partizip II + worden', 'Das Auto ist repariert worden.'],
      ['mit Modalverb', 'muss + Partizip II + werden', 'Das Auto muss repariert werden.'],
    ],
  }],
  examples: [
    { de: 'Es [wird] langsam dunkel.', ru: 'Постепенно темнеет.', uk: 'Поступово темніє.', hy: 'Կամաց-կամաց մթնում է։', ka: 'ნელ-ნელა ბნელდება.', hu: 'Lassan sötétedik.' },
    { de: 'Ich [werde] dich morgen [anrufen].', ru: 'Я позвоню тебе завтра.', uk: 'Я подзвоню тобі завтра.', hy: 'Վաղը քեզ կզանգեմ։', ka: 'ხვალ დაგირეკავ.', hu: 'Holnap felhívlak.' },
    { de: 'Das Haus [wird] gerade [renoviert].', ru: 'Дом сейчас ремонтируют.', uk: 'Будинок зараз ремонтують.', hy: 'Տունը հիմա վերանորոգվում է։', ka: 'სახლი ახლა რემონტდება.', hu: 'A házat éppen felújítják.' },
    { de: 'Wenn ich Zeit [hätte], [würde] ich mitkommen.', ru: 'Если бы у меня было время, я бы пошёл с вами.', uk: 'Якби я мав час, я б пішов з вами.', hy: 'Եթե ժամանակ ունենայի, ձեզ հետ կգայի։', ka: 'დრო რომ მქონდეს, თქვენთან ერთად წამოვიდოდი.', hu: 'Ha lenne időm, veletek mennék.' },
    { de: '[Könnten] Sie mir bitte helfen?', ru: 'Не могли бы вы мне помочь?', uk: 'Чи не могли б ви мені допомогти?', hy: 'Չէի՞ք օգնի ինձ, խնդրում եմ։', ka: 'ხომ ვერ დამეხმარებით?', hu: 'Segítene nekem, kérem?' },
  ],
  mistakes: [
    { w: 'Wenn ich reich wäre, ich würde ein Haus kaufen.', r: 'Wenn ich reich wäre, würde ich ein Haus kaufen.' },
    { w: 'Wenn ich Zeit würde haben, komme ich.', r: 'Wenn ich Zeit hätte, würde ich kommen.' },
  ],
  text: {
    de: {
      title: 'werden: Futur, Passiv und Konjunktiv II',
      sum: 'Ein Verb, viele Aufgaben: „werden“ bildet Zukunft, Passiv und – als „würde“ – den Konjunktiv II.',
      pts: [
        'werden allein = Veränderung: Ich werde Lehrer. Es wird dunkel.',
        'Futur I = werden + Infinitiv am Ende. Für die Zukunft reicht oft das Präsens mit Zeitangabe (Morgen arbeite ich). Das Futur betont Pläne, Versprechen oder Vermutungen: Er wird wohl krank sein.',
        'Passiv = werden + Partizip II: Wichtig ist die Handlung, nicht wer sie macht: Hier wird ein Haus gebaut. Wer es macht, steht mit „von“ + Dativ: Das Bild wurde von Picasso gemalt.',
        'Konjunktiv II = Wünsche, irreale Bedingungen, höfliche Bitten. Die meisten Verben: würde + Infinitiv. sein, haben und Modalverben haben eigene Formen: wäre, hätte, könnte, müsste.',
        'Irreale Bedingung: Wenn ich Zeit hätte, würde ich kommen. Vergangenheit: Wenn ich Zeit gehabt hätte, wäre ich gekommen.',
        'Höflich: Könnten Sie mir helfen? Ich hätte gern ein Brot. Würden Sie das Fenster öffnen?',
        'Konjunktiv I (B2) benutzt man in Nachrichten für die indirekte Rede: Der Minister sagt, er sei krank.',
      ],
      tip: 'Schau bei „werden“ ans Satzende: nichts/Nomen/Adjektiv → Veränderung, Infinitiv → Zukunft, Partizip II → Passiv.',
      why: ['Der Wenn-Satz steht auf Platz 1 – danach folgt sofort das Verb: würde ich …', 'Bei „haben“ nimmt man die eigene Form „hätte“, nicht „würde haben“. Im Hauptsatz steht dann auch Konjunktiv II.'],
    },
    ru: {
      title: 'werden: будущее время, пассив и Konjunktiv II',
      sum: 'Один глагол — много задач: «werden» образует будущее время, пассив, а в форме «würde» — сослагательное наклонение.',
      pts: [
        'werden само по себе = «становиться»: Ich werde Lehrer (стану учителем). Es wird dunkel (темнеет).',
        'Futur I = werden + инфинитив в конце — как русское «буду + инфинитив». Но для будущего часто хватает настоящего времени: Morgen arbeite ich. Futur подчёркивает план, обещание или предположение: Er wird wohl krank sein (он, наверное, болен).',
        'Пассив = werden + Partizip II. По-русски часто говорят «дом строят» или «строится». В немецком: Hier wird ein Haus gebaut. Кто делает — «von» + Dativ: Das Bild wurde von Picasso gemalt.',
        'Konjunktiv II = русское «бы»: желания, нереальные условия, вежливые просьбы. Большинство глаголов: würde + инфинитив. sein, haben и модальные глаголы имеют свои формы: wäre, hätte, könnte, müsste.',
        'Как и в русском, «бы» стоит в обеих частях: Wenn ich Zeit hätte, würde ich kommen (если бы у меня было время, я бы пришёл). Прошлое: Wenn ich Zeit gehabt hätte, wäre ich gekommen.',
        'Вежливо: Könnten Sie mir helfen? (не могли бы вы…) Ich hätte gern ein Brot (мне, пожалуйста, хлеб).',
        'Konjunktiv I (B2) встречается в новостях — в косвенной речи: Der Minister sagt, er sei krank.',
      ],
      tip: 'Смотрите на конец предложения с «werden»: ничего/существительное/прилагательное → «становиться», инфинитив → будущее, Partizip II → пассив.',
      why: ['Придаточное с wenn стоит на 1-м месте — сразу за ним идёт глагол: würde ich …', 'Для «haben» есть своя форма «hätte», а не «würde haben». В главном предложении тоже нужен Konjunktiv II.'],
    },
    uk: {
      title: 'werden: майбутній час, пасив і Konjunktiv II',
      sum: 'Одне дієслово — багато завдань: «werden» утворює майбутній час, пасив, а у формі «würde» — умовний спосіб.',
      pts: [
        'werden саме по собі = «ставати»: Ich werde Lehrer (стану вчителем). Es wird dunkel (темніє).',
        'Futur I = werden + інфінітив у кінці — як українське «буду + інфінітив». Але для майбутнього часто вистачає теперішнього часу: Morgen arbeite ich. Futur підкреслює план, обіцянку чи припущення: Er wird wohl krank sein (він, мабуть, хворий).',
        'Пасив = werden + Partizip II. Українською часто кажуть «будинок будують». У німецькій: Hier wird ein Haus gebaut. Хто робить — «von» + Dativ: Das Bild wurde von Picasso gemalt.',
        'Konjunktiv II = українське «б/би»: бажання, нереальні умови, ввічливі прохання. Більшість дієслів: würde + інфінітив. sein, haben і модальні дієслова мають свої форми: wäre, hätte, könnte, müsste.',
        'Як і в українській, «б» стоїть в обох частинах: Wenn ich Zeit hätte, würde ich kommen (якби я мав час, я б прийшов). Минуле: Wenn ich Zeit gehabt hätte, wäre ich gekommen.',
        'Ввічливо: Könnten Sie mir helfen? (чи не могли б ви…) Ich hätte gern ein Brot (мені, будь ласка, хліб).',
        'Konjunktiv I (B2) трапляється в новинах — у непрямій мові: Der Minister sagt, er sei krank.',
      ],
      tip: 'Дивіться на кінець речення з «werden»: нічого/іменник/прикметник → «ставати», інфінітив → майбутнє, Partizip II → пасив.',
      why: ['Підрядне з wenn стоїть на 1-му місці — одразу за ним іде дієслово: würde ich …', 'Для «haben» є своя форма «hätte», а не «würde haben». У головному реченні теж потрібен Konjunktiv II.'],
    },
    hy: {
      title: 'werden՝ ապառնի, կրավորական սեռ և Konjunktiv II',
      sum: 'Մեկ բայ՝ շատ դերեր. «werden»-ը կազմում է ապառնին, կրավորականը, իսկ «würde» ձևով՝ ըղձական/պայմանական եղանակը։',
      pts: [
        'werden-ը մենակ = «դառնալ»՝ Ich werde Lehrer (ուսուցիչ կդառնամ)։ Es wird dunkel (մթնում է)։',
        'Futur I = werden + անորոշ դերբայ վերջում (հայերենի «զանգելու եմ»-ի պես)։ Բայց ապագայի համար հաճախ բավական է ներկան՝ Morgen arbeite ich։ Futur-ն ընդգծում է ծրագիր, խոստում կամ ենթադրություն՝ Er wird wohl krank sein (երևի հիվանդ է)։',
        'Կրավորական = werden + Partizip II։ Հայերենում կրավորականը կազմվում է -վ- ածանցով (վերանորոգվում է), գերմաներենում՝ werden բայով՝ Hier wird ein Haus gebaut։ Կատարողը՝ «von» + Dativ՝ Das Bild wurde von Picasso gemalt։',
        'Konjunktiv II = ցանկություններ, անիրական պայմաններ, քաղաքավարի խնդրանքներ (հայերենի «կգայի», «կանեի»)։ Բայերի մեծ մասը՝ würde + անորոշ դերբայ։ sein, haben և եղանակավորող բայերն ունեն իրենց ձևերը՝ wäre, hätte, könnte, müsste։',
        'Անիրական պայման՝ Wenn ich Zeit hätte, würde ich kommen (եթե ժամանակ ունենայի, կգայի)։ Անցյալ՝ Wenn ich Zeit gehabt hätte, wäre ich gekommen։',
        'Քաղաքավարի՝ Könnten Sie mir helfen? Ich hätte gern ein Brot։ Konjunktiv I-ը (B2) լուրերում է՝ անուղղակի խոսքի համար՝ Der Minister sagt, er sei krank։',
      ],
      tip: 'werden-ով նախադասության վերջին նայեք՝ ոչինչ/գոյական/ածական → «դառնալ», անորոշ դերբայ → ապառնի, Partizip II → կրավորական։',
      why: ['wenn-ով նախադասությունը 1-ին տեղում է, դրանից անմիջապես հետո գալիս է բայը՝ würde ich …', '«haben»-ն ունի իր ձևը՝ «hätte», ոչ թե «würde haben»։ Գլխավոր նախադասության մեջ նույնպես Konjunktiv II է պետք։'],
    },
    ka: {
      title: 'werden: მომავალი, ვნებითი გვარი და Konjunktiv II',
      sum: 'ერთი ზმნა — ბევრი ფუნქცია: „werden“ აწარმოებს მომავალს, ვნებითს, „würde“-ს ფორმით კი — კავშირებითს.',
      pts: [
        'werden მარტო = „გახდომა“: Ich werde Lehrer (მასწავლებელი გავხდები). Es wird dunkel (ბნელდება).',
        'Futur I = werden + ინფინიტივი ბოლოს. ქართულში მომავალს ზმნისწინი აწარმოებს (დაგირეკავ), გერმანულში — დამხმარე ზმნა. მომავლისთვის ხშირად აწმყოც საკმარისია: Morgen arbeite ich. Futur ხაზს უსვამს გეგმას, დაპირებას ან ვარაუდს: Er wird wohl krank sein (ალბათ ავადაა).',
        'ვნებითი = werden + Partizip II. ქართულში ვნებითი ზმნის ფორმაშივეა (რემონტდება), გერმანულში ცალკე ზმნით: Hier wird ein Haus gebaut. შემსრულებელი — „von“ + Dativ: Das Bild wurde von Picasso gemalt.',
        'Konjunktiv II = სურვილები, არარეალური პირობა, თავაზიანი თხოვნა (ქართული „წამოვიდოდი“, „გავაკეთებდი“). ზმნების უმეტესობა: würde + ინფინიტივი. sein-ს, haben-სა და მოდალურ ზმნებს საკუთარი ფორმები აქვს: wäre, hätte, könnte, müsste.',
        'არარეალური პირობა: Wenn ich Zeit hätte, würde ich kommen (დრო რომ მქონდეს, მოვიდოდი). წარსული: Wenn ich Zeit gehabt hätte, wäre ich gekommen.',
        'თავაზიანად: Könnten Sie mir helfen? Ich hätte gern ein Brot. Konjunktiv I (B2) ახალ ამბებში გვხვდება, ირიბ თქმაში: Der Minister sagt, er sei krank.',
      ],
      tip: 'werden-იან წინადადებაში ბოლოს შეხედეთ: არაფერი/არსებითი/ზედსართავი → „გახდომა“, ინფინიტივი → მომავალი, Partizip II → ვნებითი.',
      why: ['wenn-იანი წინადადება პირველ ადგილზეა — მის შემდეგ მაშინვე ზმნა მოდის: würde ich …', '„haben“-ს საკუთარი ფორმა აქვს — „hätte“, და არა „würde haben“. მთავარ წინადადებაშიც Konjunktiv II უნდა იყოს.'],
    },
    hu: {
      title: 'werden: jövő idő, szenvedő szerkezet és Konjunktiv II',
      sum: 'Egy ige, sok feladat: a „werden“ képzi a jövő időt, a szenvedő szerkezetet, „würde“ alakban pedig a feltételes módot.',
      pts: [
        'A werden önmagában = „válik valamivé, lesz“: Ich werde Lehrer (tanár leszek). Es wird dunkel (sötétedik).',
        'Futur I = werden + főnévi igenév a mondat végén – mint a magyar „fog + főnévi igenév“. A jövőre gyakran elég a jelen idő: Morgen arbeite ich. A Futur tervet, ígéretet vagy feltételezést hangsúlyoz: Er wird wohl krank sein (valószínűleg beteg).',
        'Szenvedő szerkezet = werden + Partizip II. A magyar inkább többes szám 3. személyt használ („felújítják a házat“), a német passzívot: Hier wird ein Haus gebaut. A cselekvő: „von“ + Dativ: Das Bild wurde von Picasso gemalt.',
        'Konjunktiv II = a magyar feltételes mód (-na/-ne): kívánság, nem valós feltétel, udvarias kérés. A legtöbb ige: würde + főnévi igenév. A sein, a haben és a módbeli igék saját alakot kapnak: wäre, hätte, könnte, müsste.',
        'Mint a magyarban, mindkét tagmondatban feltételes mód áll: Wenn ich Zeit hätte, würde ich kommen (Ha lenne időm, eljönnék). Múlt: Wenn ich Zeit gehabt hätte, wäre ich gekommen.',
        'Udvariasan: Könnten Sie mir helfen? Ich hätte gern ein Brot (Kérnék egy kenyeret). A Konjunktiv I (B2) a hírekben, függő beszédben fordul elő: Der Minister sagt, er sei krank.',
      ],
      tip: 'Nézze meg a werden-es mondat végét: semmi/főnév/melléknév → „válik“, főnévi igenév → jövő, Partizip II → szenvedő.',
      why: ['A wenn-es mellékmondat az 1. helyen áll – utána rögtön az ige jön: würde ich …', 'A „haben“-nek saját alakja van: „hätte“, nem „würde haben“. A főmondatban is Konjunktiv II kell.'],
    },
  },
});

/* =====================================================================
   11 · Nebensätze und Konnektoren
   ===================================================================== */
GB_CHAPTERS.push({
  id: 'nebensaetze', icon: '🔗', levels: ['A2', 'B1', 'B2'],
  rules: ['nebensatz', 'nebensatz_vorn', 'konnektor_adv', 'konnektor_0', 'weil_denn', 'obwohl', 'ob_dass', 'wenn_als', 'temporal', 'um_zu', 'zu_inf', 'ohne_statt', 'relativ', 'je_desto', 'zweiteilig', 'nominal'],
  tables: [{
    head: ['Typ', 'Wörter', 'Wortstellung', 'Beispiel'],
    rows: [
      ['Position 0', 'und, aber, oder, denn, sondern', 'normal (Verb auf 2)', '…, denn ich bin müde.'],
      ['Adverb auf Position 1', 'deshalb, trotzdem, dann, danach, sonst, außerdem', 'Verb sofort danach', '…, deshalb bleibe ich zu Hause.'],
      ['Nebensatz', 'weil, dass, wenn, ob, obwohl, als, damit, bevor, nachdem, während, bis, seit', 'Verb am Ende', '…, weil ich müde bin.'],
    ],
  }, {
    head: ['Bedeutung', 'Nebensatz', 'Hauptsatz / Infinitiv'],
    rows: [
      ['Grund', 'weil', 'denn'],
      ['Folge', '–', 'deshalb, darum, deswegen'],
      ['Gegensatz', 'obwohl', 'trotzdem'],
      ['Ziel', 'damit (anderes Subjekt)', 'um … zu (gleiches Subjekt)'],
      ['Bedingung / immer wenn', 'wenn', 'sonst'],
      ['einmal in der Vergangenheit', 'als', '–'],
      ['Aussage / Ja-Nein-Frage', 'dass / ob', '–'],
    ],
  }, {
    head: ['Relativpronomen', 'maskulin', 'feminin', 'neutrum', 'Plural'],
    rows: [
      ['Nominativ', 'der', 'die', 'das', 'die'],
      ['Akkusativ', 'den', 'die', 'das', 'die'],
      ['Dativ', 'dem', 'der', 'dem', 'denen'],
    ],
  }],
  examples: [
    { de: 'Ich bleibe zu Hause, weil ich krank [bin].', ru: 'Я остаюсь дома, потому что я болен.', uk: 'Я залишаюся вдома, бо я хворий.', hy: 'Տանն եմ մնում, որովհետև հիվանդ եմ։', ka: 'სახლში ვრჩები, რადგან ავად ვარ.', hu: 'Otthon maradok, mert beteg vagyok.' },
    { de: 'Ich bin krank, deshalb [bleibe] ich zu Hause.', ru: 'Я болен, поэтому остаюсь дома.', uk: 'Я хворий, тому залишаюся вдома.', hy: 'Հիվանդ եմ, դրա համար տանն եմ մնում։', ka: 'ავად ვარ, ამიტომ სახლში ვრჩები.', hu: 'Beteg vagyok, ezért otthon maradok.' },
    { de: 'Wenn es regnet, [bleiben] wir drinnen.', ru: 'Если идёт дождь, мы остаёмся в помещении.', uk: 'Якщо йде дощ, ми лишаємося всередині.', hy: 'Երբ անձրև է գալիս, ներսում ենք մնում։', ka: 'თუ წვიმს, შიგნით ვრჩებით.', hu: 'Ha esik az eső, bent maradunk.' },
    { de: 'Ich weiß nicht, [ob] er heute kommt.', ru: 'Я не знаю, придёт ли он сегодня.', uk: 'Я не знаю, чи прийде він сьогодні.', hy: 'Չգիտեմ՝ նա այսօր կգա՞, թե ոչ։', ka: 'არ ვიცი, დღეს მოვა თუ არა.', hu: 'Nem tudom, hogy ma eljön-e.' },
    { de: 'Ich lerne Deutsch, [um] in Deutschland [zu] arbeiten.', ru: 'Я учу немецкий, чтобы работать в Германии.', uk: 'Я вчу німецьку, щоб працювати в Німеччині.', hy: 'Գերմաներեն եմ սովորում, որպեսզի Գերմանիայում աշխատեմ։', ka: 'გერმანულს ვსწავლობ, რომ გერმანიაში ვიმუშაო.', hu: 'Németül tanulok, hogy Németországban dolgozhassak.' },
    { de: 'Das ist der Mann, [dem] ich geholfen habe.', ru: 'Это мужчина, которому я помог.', uk: 'Це чоловік, якому я допоміг.', hy: 'Սա այն տղամարդն է, ում ես օգնեցի։', ka: 'ეს ის კაცია, რომელსაც დავეხმარე.', hu: 'Ez az a férfi, akinek segítettem.' },
  ],
  mistakes: [
    { w: 'Ich bleibe zu Hause, weil ich bin krank.', r: 'Ich bleibe zu Hause, weil ich krank bin.' },
    { w: 'Wenn ich gestern nach Hause kam, war niemand da.', r: 'Als ich gestern nach Hause kam, war niemand da.' },
  ],
  text: {
    de: {
      title: 'Nebensätze und Konnektoren (weil, dass, wenn, obwohl …)',
      sum: 'Im Nebensatz steht das konjugierte Verb am Ende – das ist der wichtigste Unterschied zum Hauptsatz.',
      pts: [
        'Nebensatz: Konnektor am Anfang, konjugiertes Verb am Ende, Komma davor: Ich bleibe zu Hause, weil ich krank bin.',
        'Zweiteilige Verben im Nebensatz: Das konjugierte Verb steht ganz am Ende: …, weil ich arbeiten muss / weil ich gearbeitet habe. Trennbare Verben bleiben zusammen: …, weil ich früh aufstehe.',
        'Steht der Nebensatz vorn, ist er Platz 1 – danach kommt sofort das Verb: Wenn es regnet, bleiben wir drinnen. (Verb, Verb)',
        'Gleiche Bedeutung, andere Stellung: weil (Verb am Ende) – denn (Verb auf 2) – deshalb (Folge, Verb direkt danach). obwohl (Verb am Ende) – trotzdem (Verb direkt danach).',
        'wenn = Bedingung, Gegenwart/Zukunft oder „immer wenn“. als = einmaliges Ereignis in der Vergangenheit.',
        'dass = Inhalt (Ich glaube, dass …). ob = indirekte Ja/Nein-Frage (Ich weiß nicht, ob …).',
        'Ziel: um … zu + Infinitiv bei gleichem Subjekt, damit bei verschiedenen Subjekten. zu + Infinitiv auch nach versuchen, vergessen, Lust haben, Es ist wichtig …',
        'Relativsatz: Genus und Zahl vom Bezugswort, der Fall aus dem Relativsatz: der Mann, den ich kenne / dem ich helfe. Das Verb steht am Ende.',
      ],
      tip: 'weil, dass, wenn, ob, obwohl … sind wie ein Magnet: Sie ziehen das konjugierte Verb ans Satzende.',
      why: ['„weil“ leitet einen Nebensatz ein – das Verb „bin“ muss ans Ende.', 'Ein einmaliges Ereignis in der Vergangenheit („gestern“) → als.'],
    },
    ru: {
      title: 'Придаточные предложения и союзы (weil, dass, wenn, obwohl …)',
      sum: 'В придаточном предложении изменяемый глагол стоит в конце — это главное отличие от главного предложения.',
      pts: [
        'В русском после «потому что» порядок слов не меняется. В немецком придаточное: союз в начале, изменяемый глагол — в конце, перед союзом запятая: Ich bleibe zu Hause, weil ich krank bin.',
        'Глаголы из двух частей: в самом конце стоит изменяемая часть: …, weil ich arbeiten muss / weil ich gearbeitet habe. Отделяемые приставки остаются с глаголом: …, weil ich früh aufstehe.',
        'Если придаточное стоит впереди, оно занимает 1-е место — сразу за ним идёт глагол: Wenn es regnet, bleiben wir drinnen. (глагол, глагол)',
        'Смысл один — порядок разный: weil (глагол в конце) — denn (глагол на 2-м месте) — deshalb (следствие «поэтому», глагол сразу после). obwohl (хотя, глагол в конце) — trotzdem (всё равно, глагол сразу после).',
        'wenn = если, а также «когда» в настоящем/будущем и «каждый раз, когда». als = «когда» об однократном событии в прошлом.',
        'dass = что (Ich glaube, dass …). ob = ли (Ich weiß nicht, ob er kommt — не знаю, придёт ли он).',
        'Цель («чтобы»): um … zu + инфинитив, если подлежащее одно; damit — если разные. zu + инфинитив также после versuchen, vergessen, Lust haben, Es ist wichtig …',
        'Относительное придаточное работает как русское «который»: род и число — от главного слова, падеж — из придаточного: der Mann, den ich kenne (которого) / dem ich helfe (которому). Глагол в конце.',
      ],
      tip: 'weil, dass, wenn, ob, obwohl … — как магнит: они притягивают изменяемый глагол в конец предложения.',
      why: ['«weil» вводит придаточное — глагол «bin» должен стоять в конце.', 'Однократное событие в прошлом («вчера») → als.'],
    },
    uk: {
      title: 'Підрядні речення та сполучники (weil, dass, wenn, obwohl …)',
      sum: 'У підрядному реченні змінюване дієслово стоїть у кінці — це головна відмінність від головного речення.',
      pts: [
        'В українській після «бо/тому що» порядок слів не змінюється. У німецькій підрядне: сполучник на початку, змінюване дієслово — у кінці, перед сполучником кома: Ich bleibe zu Hause, weil ich krank bin.',
        'Дієслова з двох частин: у самому кінці стоїть змінювана частина: …, weil ich arbeiten muss / weil ich gearbeitet habe. Відокремлювані префікси лишаються з дієсловом: …, weil ich früh aufstehe.',
        'Якщо підрядне стоїть попереду, воно займає 1-ше місце — одразу за ним іде дієслово: Wenn es regnet, bleiben wir drinnen. (дієслово, дієслово)',
        'Зміст один — порядок різний: weil (дієслово в кінці) — denn (дієслово на 2-му місці) — deshalb (наслідок «тому», дієслово одразу після). obwohl (хоча, дієслово в кінці) — trotzdem (все одно, дієслово одразу після).',
        'wenn = якщо, а також «коли» в теперішньому/майбутньому і «щоразу, коли». als = «коли» про одноразову подію в минулому.',
        'dass = що (Ich glaube, dass …). ob = чи — точно як в українській: Ich weiß nicht, ob er kommt (не знаю, чи прийде він).',
        'Мета («щоб»): um … zu + інфінітив, якщо підмет один; damit — якщо різні. zu + інфінітив також після versuchen, vergessen, Lust haben, Es ist wichtig …',
        'Означальне підрядне працює як українське «який»: рід і число — від головного слова, відмінок — із підрядного: der Mann, den ich kenne (якого) / dem ich helfe (якому). Дієслово в кінці.',
      ],
      tip: 'weil, dass, wenn, ob, obwohl … — як магніт: вони притягують змінюване дієслово в кінець речення.',
      why: ['«weil» вводить підрядне — дієслово «bin» має стояти в кінці.', 'Одноразова подія в минулому («учора») → als.'],
    },
    hy: {
      title: 'Երկրորդական նախադասություններ և շաղկապներ (weil, dass, wenn, obwohl …)',
      sum: 'Երկրորդական նախադասության մեջ խոնարհված բայը վերջում է. սա է գլխավոր տարբերությունը գլխավոր նախադասությունից։',
      pts: [
        'Երկրորդական նախադասություն՝ շաղկապը սկզբում, խոնարհված բայը՝ վերջում, շաղկապից առաջ՝ ստորակետ՝ Ich bleibe zu Hause, weil ich krank bin։',
        'Երկու մասից բաղկացած բայեր՝ ամենավերջում խոնարհված մասն է՝ …, weil ich arbeiten muss / weil ich gearbeitet habe։ Անջատվող նախածանցը մնում է բայի հետ՝ …, weil ich früh aufstehe։',
        'Եթե երկրորդականը առջևում է, այն 1-ին տեղն է, և դրանից անմիջապես հետո գալիս է բայը՝ Wenn es regnet, bleiben wir drinnen։ (բայ, բայ)',
        'Նույն իմաստ, տարբեր կարգ՝ weil (բայը վերջում) — denn (բայը 2-րդ տեղում) — deshalb (հետևանք՝ «դրա համար», բայը անմիջապես հետո)։ obwohl (թեև, բայը վերջում) — trotzdem (միևնույն է, բայը անմիջապես հետո)։',
        'wenn = եթե, ինչպես նաև «երբ» ներկայում/ապառնիում և «ամեն անգամ, երբ»։ als = «երբ» անցյալի մեկանգամյա իրադարձության համար։',
        'dass = որ (Ich glaube, dass …)։ ob = արդյոք (Ich weiß nicht, ob er kommt — չգիտեմ՝ կգա՞, թե ոչ)։',
        'Նպատակ («որպեսզի»)՝ um … zu + անորոշ դերբայ, եթե ենթական նույնն է, damit՝ եթե տարբեր են։ zu + անորոշ դերբայ նաև versuchen, vergessen, Lust haben, Es ist wichtig … արտահայտություններից հետո։',
        'Որոշիչ երկրորդական (հայերենի «որը/ում»)՝ սեռն ու թիվը գալիս են գլխավոր բառից, հոլովը՝ երկրորդականից՝ der Mann, den ich kenne / dem ich helfe։ Բայը վերջում է։',
      ],
      tip: 'weil, dass, wenn, ob, obwohl … մագնիսի պես են՝ խոնարհված բայը քաշում են նախադասության վերջ։',
      why: ['«weil»-ը երկրորդական նախադասություն է սկսում, ուստի «bin» բայը պետք է լինի վերջում։', 'Անցյալի մեկանգամյա իրադարձություն («երեկ») → als։'],
    },
    ka: {
      title: 'დამოკიდებული წინადადებები და კავშირები (weil, dass, wenn, obwohl …)',
      sum: 'დამოკიდებულ წინადადებაში უღლებადი ზმნა ბოლოშია — ეს მთავარი განსხვავებაა მთავარი წინადადებისგან.',
      pts: [
        'დამოკიდებული წინადადება: კავშირი დასაწყისში, უღლებადი ზმნა ბოლოს, კავშირის წინ — მძიმე: Ich bleibe zu Hause, weil ich krank bin.',
        'ორნაწილიანი ზმნები: ბოლოს უღლებადი ნაწილი დგას: …, weil ich arbeiten muss / weil ich gearbeitet habe. მოცილებადი ზმნისწინი ზმნასთან რჩება: …, weil ich früh aufstehe.',
        'თუ დამოკიდებული წინადადება წინ დგას, ის პირველი ადგილია — მის შემდეგ მაშინვე ზმნა მოდის: Wenn es regnet, bleiben wir drinnen. (ზმნა, ზმნა)',
        'ერთი მნიშვნელობა — სხვადასხვა წყობა: weil (ზმნა ბოლოს) — denn (ზმნა მე-2 ადგილზე) — deshalb (შედეგი „ამიტომ“, ზმნა მაშინვე შემდეგ). obwohl (თუმცა, ზმნა ბოლოს) — trotzdem (მაინც, ზმნა მაშინვე შემდეგ).',
        'ქართული „თუ“ ორ რამეს ნიშნავს: პირობას (თუ წვიმს = wenn) და კითხვას (მოვა თუ არა = ob). გერმანულში ეს სხვადასხვა სიტყვაა. als = „როცა“ წარსულის ერთჯერად მოვლენაზე.',
        'ქართული „რომ“ ხშირად ორივეს ნიშნავს: dass (ვფიქრობ, რომ …) და მიზანს (damit / um … zu: რომ ვიმუშაო). მიზნისთვის: um … zu + ინფინიტივი, თუ ქვემდებარე ერთია; damit — თუ სხვადასხვაა.',
        'zu + ინფინიტივი ასევე versuchen, vergessen, Lust haben, Es ist wichtig … -ის შემდეგ.',
        'მსაზღვრელი დამოკიდებული წინადადება (ქართული „რომელიც“): სქესი და რიცხვი მთავარი სიტყვიდან, ბრუნვა — დამოკიდებული წინადადებიდან: der Mann, den ich kenne / dem ich helfe. ზმნა ბოლოს დგას.',
      ],
      tip: 'weil, dass, wenn, ob, obwohl … მაგნიტივითაა: უღლებად ზმნას წინადადების ბოლოში ეწევა.',
      why: ['„weil“ დამოკიდებულ წინადადებას იწყებს — ზმნა „bin“ ბოლოს უნდა იდგეს.', 'ერთჯერადი მოვლენა წარსულში („გუშინ“) → als.'],
    },
    hu: {
      title: 'Mellékmondatok és kötőszók (weil, dass, wenn, obwohl …)',
      sum: 'A mellékmondatban a ragozott ige a mondat végén áll – ez a legfontosabb különbség a főmondathoz képest.',
      pts: [
        'A magyarban a „mert“ után nem változik a szórend. A német mellékmondatban: kötőszó elöl, ragozott ige a végén, előtte vessző: Ich bleibe zu Hause, weil ich krank bin.',
        'Kétrészes igék: a legvégén a ragozott rész áll: …, weil ich arbeiten muss / weil ich gearbeitet habe. Az elváló igekötő az igével együtt marad: …, weil ich früh aufstehe.',
        'Ha a mellékmondat elöl áll, az az 1. hely – utána rögtön az ige jön: Wenn es regnet, bleiben wir drinnen. (ige, ige)',
        'Ugyanaz a jelentés, más szórend: weil (ige a végén) – denn (ige a 2. helyen) – deshalb (következmény „ezért“, ige rögtön utána). obwohl (bár, ige a végén) – trotzdem (mégis, ige rögtön utána).',
        'wenn = ha, valamint „amikor“ jelenben/jövőben és „valahányszor“. als = „amikor“ egyszeri múltbeli eseménynél.',
        'dass = hogy (Ich glaube, dass …). ob = a magyar „-e“ kérdőszócska: Ich weiß nicht, ob er kommt (Nem tudom, eljön-e).',
        'Cél: a magyar „hogy“ itt is elég, a németben kétféle: um … zu + főnévi igenév azonos alanynál, damit eltérő alanynál. zu + főnévi igenév áll a versuchen, vergessen, Lust haben, Es ist wichtig … után is.',
        'Vonatkozó mellékmondat (aki, ami, amely): a nem és a szám a jelzett szótól, az eset a mellékmondatból jön: der Mann, den ich kenne (akit) / dem ich helfe (akinek). Az ige a végén áll.',
      ],
      tip: 'A weil, dass, wenn, ob, obwohl … olyanok, mint egy mágnes: a ragozott igét a mondat végére húzzák.',
      why: ['A „weil“ mellékmondatot vezet be – a „bin“ igének a végén kell állnia.', 'Egyszeri múltbeli esemény („tegnap“) → als.'],
    },
  },
});

/* =====================================================================
   12 · Adjektive und Vergleiche
   ===================================================================== */
GB_CHAPTERS.push({
  id: 'adjektive', icon: '🎨', levels: ['A2', 'B1', 'B2'],
  rules: ['adj_def', 'adj_indef', 'adj_null', 'komparativ', 'so_wie', 'ordinal', 'partizip_attr'],
  tables: [{
    head: ['nach der/die/das', 'maskulin', 'feminin', 'neutrum', 'Plural'],
    rows: [
      ['Nominativ', 'der neue Tisch', 'die neue Lampe', 'das neue Bett', 'die neuen Stühle'],
      ['Akkusativ', 'den neuen Tisch', 'die neue Lampe', 'das neue Bett', 'die neuen Stühle'],
      ['Dativ', 'dem neuen Tisch', 'der neuen Lampe', 'dem neuen Bett', 'den neuen Stühlen'],
    ],
  }, {
    head: ['nach ein/kein/mein', 'maskulin', 'feminin', 'neutrum', 'Plural'],
    rows: [
      ['Nominativ', 'ein neuer Tisch', 'eine neue Lampe', 'ein neues Bett', 'keine neuen Stühle'],
      ['Akkusativ', 'einen neuen Tisch', 'eine neue Lampe', 'ein neues Bett', 'keine neuen Stühle'],
      ['Dativ', 'einem neuen Tisch', 'einer neuen Lampe', 'einem neuen Bett', 'keinen neuen Stühlen'],
    ],
  }, {
    head: ['ohne Artikel', 'maskulin', 'feminin', 'neutrum', 'Plural'],
    rows: [
      ['Nominativ', 'kalter Kaffee', 'kalte Milch', 'kaltes Wasser', 'kalte Getränke'],
      ['Akkusativ', 'kalten Kaffee', 'kalte Milch', 'kaltes Wasser', 'kalte Getränke'],
      ['Dativ', 'kaltem Kaffee', 'kalter Milch', 'kaltem Wasser', 'kalten Getränken'],
    ],
  }, {
    head: ['Grundform', 'Komparativ', 'Superlativ'],
    rows: [
      ['schnell', 'schneller', 'am schnellsten'],
      ['alt', 'älter', 'am ältesten'],
      ['groß', 'größer', 'am größten'],
      ['hoch', 'höher', 'am höchsten'],
      ['gut', 'besser', 'am besten'],
      ['viel', 'mehr', 'am meisten'],
      ['gern', 'lieber', 'am liebsten'],
    ],
  }],
  examples: [
    { de: 'Das ist ein [neues] Auto.', ru: 'Это новая машина.', uk: 'Це нова машина.', hy: 'Սա նոր մեքենա է։', ka: 'ეს ახალი მანქანაა.', hu: 'Ez egy új autó.' },
    { de: 'Das Auto ist [neu].', ru: 'Машина новая.', uk: 'Машина нова.', hy: 'Մեքենան նոր է։', ka: 'მანქანა ახალია.', hu: 'Az autó új.' },
    { de: 'Wir wohnen in einem [kleinen] Dorf.', ru: 'Мы живём в маленькой деревне.', uk: 'Ми живемо в маленькому селі.', hy: 'Մենք ապրում ենք մի փոքրիկ գյուղում։', ka: 'ჩვენ პატარა სოფელში ვცხოვრობთ.', hu: 'Egy kis faluban lakunk.' },
    { de: 'Mein Bruder ist [größer als] ich.', ru: 'Мой брат выше меня.', uk: 'Мій брат вищий за мене.', hy: 'Եղբայրս ինձնից բարձրահասակ է։', ka: 'ჩემი ძმა ჩემზე მაღალია.', hu: 'A bátyám magasabb nálam.' },
    { de: 'Anna ist [so alt wie] Peter.', ru: 'Анна такого же возраста, как Петер.', uk: 'Анна такого ж віку, як Петер.', hy: 'Աննան Պետերի տարիքին է։', ka: 'ანა პეტერის ტოლია.', hu: 'Anna ugyanolyan idős, mint Peter.' },
    { de: 'Das ist der [schnellste] Zug.', ru: 'Это самый быстрый поезд.', uk: 'Це найшвидший потяг.', hy: 'Սա ամենաարագ գնացքն է։', ka: 'ეს ყველაზე სწრაფი მატარებელია.', hu: 'Ez a leggyorsabb vonat.' },
  ],
  mistakes: [
    { w: 'Das ist ein neue Auto.', r: 'Das ist ein neues Auto.' },
    { w: 'Er ist größer wie ich.', r: 'Er ist größer als ich.' },
  ],
  text: {
    de: {
      title: 'Adjektivendungen, Komparativ und Superlativ',
      sum: 'Vor einem Nomen bekommt das Adjektiv eine Endung – welche, hängt vom Artikel davor ab.',
      pts: [
        'Nach dem Nomen (nach sein, werden, bleiben) hat das Adjektiv keine Endung: Das Auto ist neu. Vor dem Nomen bekommt es eine: das neue Auto.',
        'Nach der/die/das (auch dieser, jeder, welcher): nur -e oder -en. -e im Nominativ Singular und im Akkusativ feminin/neutrum, sonst überall -en.',
        'Nach ein/kein/mein: Wo der Artikel das Genus nicht zeigt, zeigt es das Adjektiv: ein neuer Tisch, ein neues Bett.',
        'Ohne Artikel übernimmt das Adjektiv die Endung des Artikels: kalter Kaffee (der), kaltes Wasser (das), mit kaltem Wasser (dem).',
        'Komparativ: Adjektiv + -er + als: schneller als. Gleichheit: so … wie: so alt wie. Kurze Adjektive bekommen oft einen Umlaut: alt – älter, groß – größer.',
        'Superlativ: am …-sten (Er läuft am schnellsten) oder vor dem Nomen der/die/das …-ste (der schnellste Zug).',
        'Ordnungszahlen und Partizipien bekommen dieselben Endungen: am ersten Mai, im dritten Stock, das weinende Kind, das reparierte Auto.',
      ],
      tip: 'Faustregel: Zeigt schon der Artikel ein deutliches Signal (der, dem, den …)? → meistens -en (nur Nominativ Singular und Akk. f/n: -e). Kein Signal? → Das Adjektiv trägt es selbst: -er, -es, -em.',
      why: ['„ein“ zeigt nicht, ob das Wort maskulin oder neutrum ist – darum zeigt das Adjektiv das Neutrum: neues.', 'Nach dem Komparativ steht „als“. „wie“ steht nur bei Gleichheit: so groß wie.'],
    },
    ru: {
      title: 'Окончания прилагательных, сравнительная и превосходная степень',
      sum: 'Перед существительным прилагательное получает окончание — какое, зависит от артикля перед ним.',
      pts: [
        'В русском прилагательное меняется и после существительного («машина новая»). В немецком после sein, werden, bleiben окончания нет: Das Auto ist neu. Перед существительным — есть: das neue Auto.',
        'После der/die/das (а также dieser, jeder, welcher): только -e или -en. -e — в Nominativ ед. ч. и в Akkusativ ж. и ср. рода, везде остальное — -en.',
        'После ein/kein/mein: где артикль не показывает род, его показывает прилагательное: ein neuer Tisch, ein neues Bett.',
        'Без артикля прилагательное берёт окончание артикля: kalter Kaffee (der), kaltes Wasser (das), mit kaltem Wasser (dem).',
        'Сравнительная степень: прилагательное + -er + als (= чем): schneller als. Внимание: по-русски «выше меня» (родительный падеж), а по-немецки «größer als ich» — Nominativ! Равенство: so … wie (такой же …, как): so alt wie. Короткие прилагательные часто получают умлаут: alt – älter.',
        'Превосходная степень: am …-sten (Er läuft am schnellsten) или перед существительным der/die/das …-ste (der schnellste Zug = самый быстрый поезд).',
        'Порядковые числительные и причастия получают те же окончания: am ersten Mai, im dritten Stock, das weinende Kind (плачущий ребёнок), das reparierte Auto (отремонтированная машина).',
      ],
      tip: 'Правило: если артикль уже ясно показывает род и падеж (der, dem, den …) — обычно -en (только Nominativ ед. ч. и Akk. ж./ср. р.: -e). Если сигнала нет — его несёт прилагательное: -er, -es, -em.',
      why: ['«ein» не показывает, мужской это род или средний, — поэтому средний род показывает прилагательное: neues.', 'После сравнительной степени стоит «als» (чем). «wie» — только при равенстве: so groß wie.'],
    },
    uk: {
      title: 'Закінчення прикметників, вищий і найвищий ступінь',
      sum: 'Перед іменником прикметник отримує закінчення — яке саме, залежить від артикля перед ним.',
      pts: [
        'В українській прикметник змінюється й після іменника («машина нова»). У німецькій після sein, werden, bleiben закінчення немає: Das Auto ist neu. Перед іменником — є: das neue Auto.',
        'Після der/die/das (а також dieser, jeder, welcher): лише -e або -en. -e — у Nominativ однини та в Akkusativ ж. і с. роду, скрізь решта — -en.',
        'Після ein/kein/mein: де артикль не показує рід, його показує прикметник: ein neuer Tisch, ein neues Bett.',
        'Без артикля прикметник бере закінчення артикля: kalter Kaffee (der), kaltes Wasser (das), mit kaltem Wasser (dem).',
        'Вищий ступінь: прикметник + -er + als (= ніж): schneller als. Увага: українською «вищий за мене», а німецькою «größer als ich» — Nominativ! Рівність: so … wie (такий самий …, як): so alt wie. Короткі прикметники часто отримують умлаут: alt – älter.',
        'Найвищий ступінь: am …-sten (Er läuft am schnellsten) або перед іменником der/die/das …-ste (der schnellste Zug = найшвидший потяг).',
        'Порядкові числівники й дієприкметники отримують ті самі закінчення: am ersten Mai, im dritten Stock, das weinende Kind (дитина, що плаче), das reparierte Auto (відремонтована машина).',
      ],
      tip: 'Правило: якщо артикль уже чітко показує рід і відмінок (der, dem, den …) — зазвичай -en (лише Nominativ однини та Akk. ж./с. р.: -e). Якщо сигналу немає — його несе прикметник: -er, -es, -em.',
      why: ['«ein» не показує, чоловічий це рід чи середній, — тому середній рід показує прикметник: neues.', 'Після вищого ступеня стоїть «als» (ніж). «wie» — лише за рівності: so groß wie.'],
    },
    hy: {
      title: 'Ածականների վերջավորություններ, համեմատական և գերադրական աստիճան',
      sum: 'Գոյականից առաջ ածականը վերջավորություն է ստանում. որը՝ կախված է դրանից առաջ եղած հոդից։',
      pts: [
        'Հայերենում ածականը չի փոխվում (նոր մեքենա, նոր տուն, նոր տները)։ Գերմաներենում գոյականից առաջ այն ստանում է վերջավորություն՝ das neue Auto, իսկ sein, werden, bleiben-ից հետո՝ ոչ՝ Das Auto ist neu։',
        'der/die/das-ից հետո (նաև dieser, jeder, welcher)՝ միայն -e կամ -en։ -e՝ Nominativ եզակիում և Akkusativ իգական/չեզոքում, մնացած բոլոր դեպքերում՝ -en։',
        'ein/kein/mein-ից հետո՝ որտեղ հոդը սեռը ցույց չի տալիս, ցույց է տալիս ածականը՝ ein neuer Tisch, ein neues Bett։',
        'Առանց հոդի ածականը վերցնում է հոդի վերջավորությունը՝ kalter Kaffee (der), kaltes Wasser (das), mit kaltem Wasser (dem)։',
        'Համեմատական՝ ածական + -er + als (= քան)՝ schneller als (ավելի արագ, քան)։ Հայերենի «ինձնից» ձևի փոխարեն՝ als ich (Nominativ)։ Հավասարություն՝ so … wie (նույնքան …, որքան)՝ so alt wie։ Կարճ ածականները հաճախ ստանում են ումլաուտ՝ alt – älter։',
        'Գերադրական՝ am …-sten (Er läuft am schnellsten) կամ գոյականից առաջ der/die/das …-ste (der schnellste Zug = ամենաարագ գնացքը)։',
        'Դասական թվականները և դերբայները ստանում են նույն վերջավորությունները՝ am ersten Mai, im dritten Stock, das weinende Kind (լացող երեխան), das reparierte Auto (վերանորոգված մեքենան)։',
      ],
      tip: 'Կանոն. եթե հոդն արդեն հստակ ցույց է տալիս սեռն ու հոլովը (der, dem, den …) → սովորաբար -en (միայն Nominativ եզակի և Akk. իգ./չեզ.՝ -e)։ Եթե ազդանշան չկա, այն կրում է ածականը՝ -er, -es, -em։',
      why: ['«ein»-ը ցույց չի տալիս՝ արակա՞ն է, թե՞ չեզոք, ուստի չեզոք սեռը ցույց է տալիս ածականը՝ neues։', 'Համեմատականից հետո գալիս է «als» (քան)։ «wie»՝ միայն հավասարության դեպքում՝ so groß wie։'],
    },
    ka: {
      title: 'ზედსართავის დაბოლოებები, უფროობითი და უაღმატესი ხარისხი',
      sum: 'არსებითი სახელის წინ ზედსართავი დაბოლოებას იღებს — რომელს, ეს მის წინ მდგარ არტიკლზეა დამოკიდებული.',
      pts: [
        'ქართულში ზედსართავი ცოტას იცვლება (ახალი მანქანა, ახალ მანქანას). გერმანულში არსებითის წინ მას დაბოლოება აქვს: das neue Auto, sein-ის, werden-ისა და bleiben-ის შემდეგ კი — არა: Das Auto ist neu.',
        'der/die/das-ის შემდეგ (ასევე dieser, jeder, welcher): მხოლოდ -e ან -en. -e — Nominativ მხოლობითსა და Akkusativ მდედრ./საშ. სქესში, დანარჩენ ყველგან — -en.',
        'ein/kein/mein-ის შემდეგ: სადაც არტიკლი სქესს არ აჩვენებს, მას ზედსართავი აჩვენებს: ein neuer Tisch, ein neues Bett.',
        'არტიკლის გარეშე ზედსართავი არტიკლის დაბოლოებას იღებს: kalter Kaffee (der), kaltes Wasser (das), mit kaltem Wasser (dem).',
        'უფროობითი: ზედსართავი + -er + als: schneller als (უფრო სწრაფი, ვიდრე). ქართული „ჩემზე“-ს ნაცვლად — als ich (Nominativ). თანასწორობა: so … wie (ისეთივე …, როგორც): so alt wie. მოკლე ზედსართავები ხშირად უმლაუტს იღებს: alt – älter.',
        'უაღმატესი: am …-sten (Er läuft am schnellsten) ან არსებითის წინ der/die/das …-ste (der schnellste Zug = ყველაზე სწრაფი მატარებელი).',
        'რიგობითი რიცხვითები და მიმღეობები იმავე დაბოლოებებს იღებს: am ersten Mai, im dritten Stock, das weinende Kind (მტირალი ბავშვი), das reparierte Auto (შეკეთებული მანქანა).',
      ],
      tip: 'წესი: თუ არტიკლი უკვე ნათლად აჩვენებს სქესსა და ბრუნვას (der, dem, den …) → ჩვეულებრივ -en (მხოლოდ Nominativ მხოლ. და Akk. მდედრ./საშ.: -e). თუ სიგნალი არ არის — მას ზედსართავი ატარებს: -er, -es, -em.',
      why: ['„ein“ არ აჩვენებს, მამრობითია თუ საშუალო, ამიტომ საშუალო სქესს ზედსართავი აჩვენებს: neues.', 'უფროობითის შემდეგ „als“ დგას (ვიდრე). „wie“ — მხოლოდ თანასწორობისას: so groß wie.'],
    },
    hu: {
      title: 'Melléknévvégződések, középfok és felsőfok',
      sum: 'A főnév előtt a melléknév végződést kap – hogy melyiket, az az előtte álló névelőtől függ.',
      pts: [
        'A magyar jelző a főnév előtt nem változik (új autó, új autót, új autók). A németben a főnév előtt végződést kap: das neue Auto. A sein, werden, bleiben után viszont nincs végződés: Das Auto ist neu.',
        'A der/die/das után (és a dieser, jeder, welcher után): csak -e vagy -en. -e: Nominativ egyes szám és Akkusativ nő-/semlegesnem, minden más esetben -en.',
        'Az ein/kein/mein után: ahol a névelő nem mutatja a nemet, ott a melléknév mutatja: ein neuer Tisch, ein neues Bett.',
        'Névelő nélkül a melléknév veszi át a névelő végződését: kalter Kaffee (der), kaltes Wasser (das), mit kaltem Wasser (dem).',
        'Középfok: melléknév + -er + als (= mint): schneller als (gyorsabb, mint). Egyenlőség: so … wie (ugyanolyan …, mint): so alt wie. A rövid melléknevek gyakran umlautot kapnak: alt – älter.',
        'Felsőfok: am …-sten (Er läuft am schnellsten) vagy a főnév előtt der/die/das …-ste (der schnellste Zug = a leggyorsabb vonat).',
        'A sorszámnevek és a melléknévi igenevek ugyanezeket a végződéseket kapják: am ersten Mai, im dritten Stock, das weinende Kind (a síró gyerek), das reparierte Auto (a megjavított autó).',
      ],
      tip: 'Ökölszabály: ha a névelő már világosan jelzi a nemet és az esetet (der, dem, den …) → többnyire -en (csak Nominativ egyes szám és Akk. nő-/semlegesnem: -e). Ha nincs jelzés, a melléknév viszi: -er, -es, -em.',
      why: ['Az „ein“ nem mutatja, hogy hím- vagy semlegesnemű a szó – ezért a melléknév jelzi a semlegesnemet: neues.', 'Középfok után „als“ áll (mint). A „wie“ csak egyenlőségnél: so groß wie.'],
    },
  },
});
