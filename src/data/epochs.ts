import { Epoch, EpochId, Generator, Artifact } from '../types/game';

// ═══════════════════════════════════════════════════════════════════════
// STORY SYSTEM - Engaging narrative to keep players until March 2027
// Story unfolds as player progresses through prestige levels
// ═══════════════════════════════════════════════════════════════════════

export interface StoryChapter {
  id: string;
  title: { ua: string; en: string };
  content: { ua: string; en: string };
  prestigeRequired: number;
  epochRequired?: EpochId;
  reward: { xp?: number; currency?: number; artifact?: string };
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'prologue',
    title: { ua: 'Пробудження', en: 'Awakening' },
    content: {
      ua: 'Ти відкриваєш очі. Навколо — тьмяне світло старого музею. Експонати оживають... Трипільська культура кличе тебе. Твоя подорож крізь час починається.',
      en: 'You open your eyes. Around you - the dim light of an old museum. Exhibits come to life... Trypillian culture calls to you. Your journey through time begins.'
    },
    prestigeRequired: 0,
    reward: { xp: 100 }
  },
  {
    id: 'chapter1',
    title: { ua: 'Золото Скіфії', en: 'Gold of Scythia' },
    content: {
      ua: 'Пектораль розповідає історію могутньої імперії кочівників. Золоті кургани ховають таємниці тисячолітньої давності... Що вони приховують?',
      en: 'The pectoral tells the story of a mighty empire of nomads. Golden kurgans hide secrets of millennia... What are they concealing?'
    },
    prestigeRequired: 0,
    epochRequired: 'scythia',
    reward: { currency: 500 }
  },
  {
    id: 'chapter2',
    title: { ua: 'Грецький слід', en: 'Greek Trail' },
    content: {
      ua: 'Ольвія та Херсонес — ворота до античного світу. Торгові шляхи ведуть до нових земель. Та хто спостерігає за тобою з тіней?',
      en: 'Olbia and Chersonesus - gateways to the ancient world. Trade routes lead to new lands. But who is watching you from the shadows?'
    },
    prestigeRequired: 0,
    epochRequired: 'antiquity',
    reward: { xp: 1000 }
  },
  {
    id: 'chapter3',
    title: { ua: 'Хрещення Русі', en: 'Baptism of Rus' },
    content: {
      ua: 'Володимир Великий стоїть перед вибором. Дзвони Софійського собору дзвенять у твоїй пам\'яті. Це лише початок великої історії...',
      en: 'Vladimir the Great stands before a choice. Bells of St. Sophia ring in your memory. This is just the beginning of a great history...'
    },
    prestigeRequired: 0,
    epochRequired: 'kyiv_rus',
    reward: { artifact: 'kyiv_gospels' }
  },
  {
    id: 'chapter4',
    title: { ua: 'Корона Данила', en: "Danylo's Crown" },
    content: {
      ua: 'Король Данило будує нову державу. Галич, Львів, Холм — осередки могутності. Та темні сили збираються на сході...',
      en: 'King Danylo builds a new state. Halych, Lviv, Kholm - centers of power. But dark forces gather in the east...'
    },
    prestigeRequired: 0,
    epochRequired: 'halych_volhynia',
    reward: { currency: 2000 }
  },
  {
    id: 'prestige1',
    title: { ua: 'Перше Переродження', en: 'First Rebirth' },
    content: {
      ua: 'Тисячу років історії ти пережили. Перші ворота часу відкриваються... Нові епохи чекають.Світова історія розкривається перед тобою.',
      en: 'A thousand years of history you have lived through. The first time gates open... New epochs await. World history unfolds before you.'
    },
    prestigeRequired: 1,
    reward: { xp: 10000 }
  },
  {
    id: 'world_epic1',
    title: { ua: 'Давній Єгипет', en: 'Ancient Egypt' },
    content: {
      ua: 'Піраміди Гізи виростають перед тобою. Фараони охороняють таємниці Нілу. Це новий вимір історії — світовий!',
      en: 'Pyramids of Giza rise before you. Pharaohs guard the secrets of the Nile. This is a new dimension of history - world history!'
    },
    prestigeRequired: 1,
    reward: { xp: 5000 }
  },
  {
    id: 'prestige2',
    title: { ua: 'Хранитель Часу II', en: 'Time Keeper II' },
    content: {
      ua: 'Друге переродження. Тепер ти бачиш зв\'язок між епохами. Українська історія переплітається зі світовою. Скіфи торгували з греками... Русь з Візантією...',
      en: 'Second rebirth. Now you see the connection between epochs. Ukrainian history intertwines with world history. Scythians traded with Greeks... Rus with Byzantium...'
    },
    prestigeRequired: 2,
    reward: { xp: 25000 }
  },
  {
    id: 'prestige3',
    title: { ua: 'Майстер Часу', en: 'Time Master' },
    content: {
      ua: 'Ти — Майстер Часу. Три переродження дали тобі знання. Козацька доба, Революція, Незалежність... Історія повторюється. Та що ти зробиш з цим знанням?',
      en: 'You are the Time Master. Three rebirths gave you knowledge. Cossack era, Revolution, Independence... History repeats. But what will you do with this knowledge?'
    },
    prestigeRequired: 3,
    reward: { artifact: 'secret_independence_charter' }
  },
  {
    id: 'final',
    title: { ua: 'Березень 2027', en: 'March 2027' },
    content: {
      ua: 'Ти досяг кінця підготовки. Новий етап наближається. Sit Studio готує щось особливе... Продовжуй грати, і побачиш!',
      en: 'You have reached the end of preparation. A new stage approaches. Sit Studio prepares something special... Keep playing and you will see!'
    },
    prestigeRequired: 5,
    reward: { xp: 100000, currency: 100000 }
  }
];

// Helper to create generators
const createGenerators = (templates: Array<{ id: string; icon: string; name: { ua: string; en: string }; desc: { ua: string; en: string }; baseCost: number; baseProd: number }>): Generator[] =>
  templates.map(t => ({
    id: t.id,
    name: t.name,
    description: t.desc,
    baseCost: t.baseCost,
    baseProduction: t.baseProd,
    costMultiplier: 1.15,
    icon: t.icon,
  }));

// EPOCH 1: Трипільська культура (5000-2750 BC)
const trypilliaGenerators = createGenerators([
  { id: 'clay_pit', icon: '🏺', name: { ua: 'Глиняна яма', en: 'Clay Pit' }, desc: { ua: 'Видобування глини для кераміки', en: 'Clay extraction for ceramics' }, baseCost: 10, baseProd: 2 },
  { id: 'pottery', icon: '🎨', name: { ua: 'Гончарна майстерня', en: 'Pottery Workshop' }, desc: { ua: 'Виробництво кераміки', en: 'Ceramics production' }, baseCost: 50, baseProd: 8 },
  { id: 'settlement', icon: '🏘️', name: { ua: 'Поселення', en: 'Settlement' }, desc: { ua: 'Трипільська община', en: 'Trypillian community' }, baseCost: 300, baseProd: 40 },
  { id: 'megastructure', icon: '🏛️', name: { ua: 'Мега-структура', en: 'Mega-Structure' }, desc: { ua: 'Величезна споруда', en: 'Massive structure' }, baseCost: 3000, baseProd: 200 },
  { id: 'temple', icon: '✨', name: { ua: 'Храм Богині', en: 'Temple of Goddess' }, desc: { ua: 'Священне місце', en: 'Sacred place' }, baseCost: 30000, baseProd: 1000 },
]);

// EPOCH 2: Скіфія (7th-3rd c. BC)
const scythiaGenerators = createGenerators([
  { id: 'pasture', icon: '🐎', name: { ua: 'Пасовище', en: 'Pasture' }, desc: { ua: 'Коні та худоба', en: 'Horses and cattle' }, baseCost: 10, baseProd: 5 },
  { id: 'gold_mine', icon: '⛏️', name: { ua: 'Золота копальня', en: 'Gold Mine' }, desc: { ua: 'Скіфське золото', en: 'Scythian gold' }, baseCost: 50, baseProd: 20 },
  { id: 'kurgan', icon: '🎖️', name: { ua: 'Курган', en: 'Kurgan' }, desc: { ua: 'Поховання', en: 'Burial mound' }, baseCost: 300, baseProd: 100 },
  { id: 'fortress', icon: '🏰', name: { ua: 'Фортеця', en: 'Fortress' }, desc: { ua: 'Захисна споруда', en: 'Defensive structure' }, baseCost: 3000, baseProd: 500 },
  { id: 'royal_tomb', icon: '👑', name: { ua: 'Царська гробниця', en: 'Royal Tomb' }, desc: { ua: 'Золота гробниця', en: 'Golden tomb' }, baseCost: 30000, baseProd: 2500 },
]);

// EPOCH 3: Античність - Грецькі колонії (7th c. BC - 5th c. AD)
const antiquityGenerators = createGenerators([
  { id: 'port', icon: '⚓', name: { ua: 'Порт', en: 'Port' }, desc: { ua: 'Торговий порт', en: 'Trading port' }, baseCost: 10, baseProd: 10 },
  { id: 'agora', icon: '🏛', name: { ua: 'Агора', en: 'Agora' }, desc: { ua: 'Торговельна площа', en: 'Market square' }, baseCost: 50, baseProd: 40 },
  { id: 'colony', icon: '🏪', name: { ua: 'Грецька колонія', en: 'Greek Colony' }, desc: { ua: 'Ольвія, Херсонес', en: 'Olbia, Chersonesus' }, baseCost: 300, baseProd: 200 },
  { id: 'amphitheater', icon: '🎭', name: { ua: 'Амфітеатр', en: 'Amphitheater' }, desc: { ua: 'Культурний центр', en: 'Cultural center' }, baseCost: 3000, baseProd: 1000 },
  { id: 'acropolis', icon: '🏛️', name: { ua: 'Акрополь', en: 'Acropolis' }, desc: { ua: 'Верхнє місто', en: 'Upper city' }, baseCost: 30000, baseProd: 5000 },
]);

// EPOCH 4: Київська Русь (9th-13th c.)
const kyivRusGenerators = createGenerators([
  { id: 'field', icon: '🌾', name: { ua: 'Поле', en: 'Field' }, desc: { ua: 'Землеробство', en: 'Agriculture' }, baseCost: 10, baseProd: 15 },
  { id: 'craft_workshop', icon: '⚒️', name: { ua: 'Реміснича майстерня', en: 'Craft Workshop' }, desc: { ua: 'Ремесла', en: 'Crafts' }, baseCost: 50, baseProd: 60 },
  { id: 'city', icon: '🏰', name: { ua: 'Місто', en: 'City' }, desc: { ua: 'Київ, Чернігів', en: 'Kyiv, Chernihiv' }, baseCost: 300, baseProd: 300 },
  { id: 'saint_sophia', icon: '☦️', name: { ua: 'Софійський собор', en: 'St. Sophia Cathedral' }, desc: { ua: 'Головна святиня', en: 'Main shrine' }, baseCost: 3000, baseProd: 1500 },
  { id: 'golden_gate', icon: '🚪', name: { ua: 'Золоті ворота', en: 'Golden Gate' }, desc: { ua: 'Головна брама Києва', en: 'Main gate of Kyiv' }, baseCost: 30000, baseProd: 7500 },
]);

// EPOCH 5: Галицько-Волинська держава (1199-1349)
const halychVolhyniaGenerators = createGenerators([
  { id: 'salt_mine', icon: '🧂', name: { ua: 'Соляна копальня', en: 'Salt Mine' }, desc: { ua: 'Видобуток солі', en: 'Salt extraction' }, baseCost: 10, baseProd: 20 },
  { id: 'caravan', icon: '🐪', name: { ua: 'Купецький караван', en: 'Merchant Caravan' }, desc: { ua: 'Торгівля', en: 'Trade' }, baseCost: 50, baseProd: 80 },
  { id: 'castle', icon: '🏯', name: { ua: 'Замок', en: 'Castle' }, desc: { ua: 'Львів, Камянець', en: 'Lviv, Kamenets' }, baseCost: 300, baseProd: 400 },
  { id: 'cathedral', icon: '⛪', name: { ua: 'Собор', en: 'Cathedral' }, desc: { ua: 'Релігійний центр', en: 'Religious center' }, baseCost: 3000, baseProd: 2000 },
  { id: 'principality', icon: '👑', name: { ua: 'Князівство', en: 'Principality' }, desc: { ua: 'Данило Галицький', en: 'Danylo of Halych' }, baseCost: 30000, baseProd: 10000 },
]);

// EPOCH 6: Річ Посполита & Запорозька Січ (14th-17th c.)
const polishLithuanianGenerators = createGenerators([
  { id: 'manor', icon: '🏡', name: { ua: 'Маєток', en: 'Manor' }, desc: { ua: 'Шляхетська власність', en: 'Noble estate' }, baseCost: 10, baseProd: 25 },
  { id: 'market', icon: '🛒', name: { ua: 'Ринок', en: 'Market' }, desc: { ua: 'Торгівля', en: 'Trade' }, baseCost: 50, baseProd: 100 },
  { id: 'cossack_sich', icon: '⚔️', name: { ua: 'Січ', en: 'Sich' }, desc: { ua: 'Запорозька Січ', en: 'Zaporizhian Sich' }, baseCost: 300, baseProd: 500 },
  { id: 'brotherhood', icon: '📚', name: { ua: 'Братство', en: 'Brotherhood' }, desc: { ua: 'Культурний рух', en: 'Cultural movement' }, baseCost: 3000, baseProd: 2500 },
  { id: 'university', icon: '🎓', name: { ua: 'Острозька академія', en: 'Ostroh Academy' }, desc: { ua: 'Перший університет', en: 'First university' }, baseCost: 30000, baseProd: 12500 },
]);

// EPOCH 7: Козацька доба - Хмельниччина (1648-1764)
const cossackGenerators = createGenerators([
  { id: 'homestead', icon: '🏠', name: { ua: 'Хутір', en: 'Homestead' }, desc: { ua: 'Козацьке господарство', en: 'Cossack farm' }, baseCost: 10, baseProd: 30 },
  { id: 'cannon', icon: '💣', name: { ua: 'Гармата', en: 'Cannon' }, desc: { ua: 'Артилерія', en: 'Artillery' }, baseCost: 50, baseProd: 120 },
  { id: 'regiment', icon: '⚠️', name: { ua: 'Полк', en: 'Regiment' }, desc: { ua: 'Козацьке військо', en: 'Cossack army' }, baseCost: 300, baseProd: 600 },
  { id: 'fortress_sich', icon: '🏰', name: { ua: 'Фортеця Січ', en: 'Sich Fortress' }, desc: { ua: 'Головна база', en: 'Main base' }, baseCost: 3000, baseProd: 3000 },
  { id: 'hetman_capital', icon: '🏛️', name: { ua: 'Гетьманська столиця', en: "Hetman's Capital" }, desc: { ua: 'Чигирин, Глухів', en: 'Chyhyryn, Hlukhiv' }, baseCost: 30000, baseProd: 15000 },
]);

// EPOCH 8: Гетьманат (1764-1917)
const hetmanateGenerators = createGenerators([
  { id: 'farm', icon: '🐄', name: { ua: 'Ферма', en: 'Farm' }, desc: { ua: 'Сільське господарство', en: 'Agriculture' }, baseCost: 10, baseProd: 40 },
  { id: 'factory', icon: '🏭', name: { ua: 'Мануфактура', en: 'Manufactory' }, desc: { ua: 'Рання промисловість', en: 'Early industry' }, baseCost: 50, baseProd: 160 },
  { id: 'gymnasium', icon: '📖', name: { ua: 'Гімназія', en: 'Gymnasium' }, desc: { ua: 'Освіта', en: 'Education' }, baseCost: 300, baseProd: 800 },
  { id: 'theater', icon: '🎭', name: { ua: 'Театр', en: 'Theater' }, desc: { ua: 'Культура', en: 'Culture' }, baseCost: 3000, baseProd: 4000 },
  { id: 'railway', icon: '🚂', name: { ua: 'Залізниця', en: 'Railway' }, desc: { ua: 'Транспорт', en: 'Transport' }, baseCost: 30000, baseProd: 20000 },
]);

// EPOCH 9: Російська імперія в Україні (19th - early 20th c.)
const empireGenerators = createGenerators([
  { id: 'mine', icon: '⚫', name: { ua: 'Шахта', en: 'Mine' }, desc: { ua: 'Донбас', en: 'Donbas' }, baseCost: 10, baseProd: 50 },
  { id: 'mill', icon: '🏭', name: { ua: 'Фабрика', en: 'Factory' }, desc: { ua: 'Індустріалізація', en: 'Industrialization' }, baseCost: 50, baseProd: 200 },
  { id: 'university_city', icon: '🎓', name: { ua: 'Університетське місто', en: 'University City' }, desc: { ua: 'Харків, Одеса', en: 'Kharkiv, Odesa' }, baseCost: 300, baseProd: 1000 },
  { id: 'opera', icon: '🎵', name: { ua: 'Оперний театр', en: 'Opera House' }, desc: { ua: 'Мистецтво', en: 'Art' }, baseCost: 3000, baseProd: 5000 },
  { id: 'skyscraper', icon: '🏙️', name: { ua: 'Хмарочос', en: 'Skyscraper' }, desc: { ua: 'Сучасна архітектура', en: 'Modern architecture' }, baseCost: 30000, baseProd: 25000 },
]);

// EPOCH 10: Революція та УНР (1917-1921)
const revolutionGenerators = createGenerators([
  { id: 'printing', icon: '📰', name: { ua: 'Друкарня', en: 'Printing Press' }, desc: { ua: 'Преса та агітація', en: 'Press and propaganda' }, baseCost: 10, baseProd: 60 },
  { id: 'military_unit', icon: '🎖️', name: { ua: 'Військова частина', en: 'Military Unit' }, desc: { ua: 'Армія УНР', en: 'UNR Army' }, baseCost: 50, baseProd: 250 },
  { id: 'rada', icon: '🏛️', name: { ua: 'Центральна Рада', en: 'Central Rada' }, desc: { ua: 'Уряд УНР', en: 'UNR Government' }, baseCost: 300, baseProd: 1200 },
  { id: 'embassy', icon: '🌐', name: { ua: 'Посольство', en: 'Embassy' }, desc: { ua: 'Міжнародні відносини', en: 'International relations' }, baseCost: 3000, baseProd: 6000 },
  { id: 'independence_hall', icon: '📜', name: { ua: 'Акт Незалежности', en: 'Independence Act' }, desc: { ua: 'IV Універсал', en: 'IV Universal' }, baseCost: 30000, baseProd: 30000 },
]);

// EPOCH 11: Радянський період (1922-1991)
const sovietGenerators = createGenerators([
  { id: 'kolkhoz', icon: '🚜', name: { ua: 'Колгосп', en: 'Kolkhoz' }, desc: { ua: 'Колективізація', en: 'Collectivization' }, baseCost: 10, baseProd: 80 },
  { id: 'power_plant', icon: '⚡', name: { ua: 'Електростанція', en: 'Power Plant' }, desc: { ua: 'ЕНС, ГЕС', en: 'NPP, HPP' }, baseCost: 50, baseProd: 320 },
  { id: 'research_institute', icon: '🔬', name: { ua: 'НДІ', en: 'Research Institute' }, desc: { ua: 'Наука', en: 'Science' }, baseCost: 300, baseProd: 1600 },
  { id: 'space_factory', icon: '🚀', name: { ua: 'Космічний завод', en: 'Space Factory' }, desc: { ua: 'Антонов, Південмаш', en: 'Antonov, Pivdenmash' }, baseCost: 3000, baseProd: 8000 },
  { id: 'city_million', icon: '🌃', name: { ua: 'Місто-мільйонник', en: 'Million City' }, desc: { ua: 'Київ, Харків', en: 'Kyiv, Kharkiv' }, baseCost: 30000, baseProd: 40000 },
]);

// EPOCH 12: Незалежність (1991+)
const independenceGenerators = createGenerators([
  { id: 'startup', icon: '💻', name: { ua: 'Стартап', en: 'Startup' }, desc: { ua: 'IT-індустрія', en: 'IT industry' }, baseCost: 10, baseProd: 100 },
  { id: 'logistics', icon: '🚛', name: { ua: 'Логістика', en: 'Logistics' }, desc: { ua: 'Транспорт', en: 'Transport' }, baseCost: 50, baseProd: 400 },
  { id: 'tech_park', icon: '🏗️', name: { ua: 'Технопарк', en: 'Tech Park' }, desc: { ua: 'Інновації', en: 'Innovation' }, baseCost: 300, baseProd: 2000 },
  { id: 'eu_integration', icon: '🇪🇺', name: { ua: 'Євроінтеграція', en: 'EU Integration' }, desc: { ua: 'Європа', en: 'Europe' }, baseCost: 3000, baseProd: 10000 },
  { id: 'new_ukraine', icon: '🇺🇦', name: { ua: 'Нова Україна', en: 'New Ukraine' }, desc: { ua: 'Майбутнє', en: 'Future' }, baseCost: 30000, baseProd: 50000 },
]);

// ═══════════════════════════════════════════════════════════════════════
// WORLD HISTORY EPOCHS (Prestige 1+)
// These unlock after completing Ukrainian history (first prestige)
// ═══════════════════════════════════════════════════════════════════════

// WORLD EPOCH 1: Ancient Egypt (Prestige 1)
const egyptGenerators = createGenerators([
  { id: 'pyramid', icon: '🔺', name: { ua: 'Піраміда', en: 'Pyramid' }, desc: { ua: 'Гробниця фараона', en: 'Pharaoh tomb' }, baseCost: 15, baseProd: 120 },
  { id: 'sphinx', icon: '🦁', name: { ua: 'Сфінкс', en: 'Sphinx' }, desc: { ua: 'Охоронець', en: 'Guardian' }, baseCost: 75, baseProd: 480 },
  { id: 'temple_ra', icon: '☀️', name: { ua: 'Храм Ра', en: 'Temple of Ra' }, desc: { ua: 'Бог сонця', en: 'Sun god' }, baseCost: 450, baseProd: 2400 },
  { id: 'library_alexandria', icon: '📚', name: { ua: 'Бібліотека Олександрії', en: 'Library of Alexandria' }, desc: { ua: 'Знання', en: 'Knowledge' }, baseCost: 4500, baseProd: 12000 },
  { id: 'pharaoh_palace', icon: '👑', name: { ua: 'Палац фараона', en: 'Pharaoh Palace' }, desc: { ua: 'Влада', en: 'Power' }, baseCost: 45000, baseProd: 60000 },
]);

// WORLD EPOCH 2: Roman Empire (Prestige 1)
const romeGenerators = createGenerators([
  { id: 'legion_camp', icon: '⚔️', name: { ua: 'Легіон', en: 'Legion Camp' }, desc: { ua: 'Римська армія', en: 'Roman army' }, baseCost: 15, baseProd: 150 },
  { id: 'aqueduct', icon: '🏛️', name: { ua: 'Акведук', en: 'Aqueduct' }, desc: { ua: 'Інженерія', en: 'Engineering' }, baseCost: 75, baseProd: 600 },
  { id: 'colosseum', icon: '🏟️', name: { ua: 'Колізей', en: 'Colosseum' }, desc: { ua: 'Розваги', en: 'Entertainment' }, baseCost: 450, baseProd: 3000 },
  { id: 'senate', icon: '🏛️', name: { ua: 'Сенат', en: 'Senate' }, desc: { ua: 'Республіка', en: 'Republic' }, baseCost: 4500, baseProd: 15000 },
  { id: 'imperial_palace', icon: '🦅', name: { ua: 'Імператорський палац', en: 'Imperial Palace' }, desc: { ua: 'Римська імперія', en: 'Roman Empire' }, baseCost: 45000, baseProd: 75000 },
]);

// WORLD EPOCH 3: Ancient China (Prestige 2)
const chinaGenerators = createGenerators([
  { id: 'rice_farm', icon: '🌾', name: { ua: 'Рисове поле', en: 'Rice Farm' }, desc: { ua: 'Сільське господарство', en: 'Agriculture' }, baseCost: 20, baseProd: 180 },
  { id: 'silk_workshop', icon: '🧵', name: { ua: 'Шовкова майстерня', en: 'Silk Workshop' }, desc: { ua: 'Шовковий шлях', en: 'Silk Road' }, baseCost: 100, baseProd: 720 },
  { id: 'great_wall', icon: '🧱', name: { ua: 'Великий мур', en: 'Great Wall' }, desc: { ua: 'Захист', en: 'Defense' }, baseCost: 600, baseProd: 3600 },
  { id: 'terracotta', icon: '🗿', name: { ua: 'Теракотова армія', en: 'Terracotta Army' }, desc: { ua: 'Могила Цінь', en: 'Qin tomb' }, baseCost: 6000, baseProd: 18000 },
  { id: 'forbidden_city', icon: '🏯', name: { ua: 'Заборонене місто', en: 'Forbidden City' }, desc: { ua: 'Імперія', en: 'Empire' }, baseCost: 60000, baseProd: 90000 },
]);

// WORLD EPOCH 4: Byzantine Empire (Prestige 2)
const byzantineGenerators = createGenerators([
  { id: 'orthodox_church', icon: '☦️', name: { ua: 'Церква', en: 'Orthodox Church' }, desc: { ua: 'Православ\'я', en: 'Orthodoxy' }, baseCost: 20, baseProd: 200 },
  { id: 'icon_workshop', icon: '🖼️', name: { ua: 'Іконна майстерня', en: 'Icon Workshop' }, desc: { ua: 'Мистецтво', en: 'Art' }, baseCost: 100, baseProd: 800 },
  { id: 'hippodrome', icon: '🏇', name: { ua: 'Іподром', en: 'Hippodrome' }, desc: { ua: 'Перегони', en: 'Races' }, baseCost: 600, baseProd: 4000 },
  { id: 'hagia_sophia', icon: '🕌', name: { ua: 'Свята Софія', en: 'Hagia Sophia' }, desc: { ua: 'Архітектура', en: 'Architecture' }, baseCost: 6000, baseProd: 20000 },
  { id: 'constantinople', icon: '🏛️', name: { ua: 'Константинополь', en: 'Constantinople' }, desc: { ua: 'Столиця', en: 'Capital' }, baseCost: 60000, baseProd: 100000 },
]);

// WORLD EPOCH 5: Medieval Europe (Prestige 3)
const medievalGenerators = createGenerators([
  { id: 'blacksmith', icon: '🔨', name: { ua: 'Кузня', en: 'Blacksmith' }, desc: { ua: 'Ремесло', en: 'Craft' }, baseCost: 25, baseProd: 220 },
  { id: 'castle', icon: '🏰', name: { ua: 'Замок', en: 'Castle' }, desc: { ua: 'Феодалізм', en: 'Feudalism' }, baseCost: 125, baseProd: 880 },
  { id: 'cathedral', icon: '⛪', name: { ua: 'Катедра', en: 'Cathedral' }, desc: { ua: 'Релігія', en: 'Religion' }, baseCost: 750, baseProd: 4400 },
  { id: 'guild_hall', icon: '📜', name: { ua: 'Гільдія', en: 'Guild Hall' }, desc: { ua: 'Торгівля', en: 'Trade' }, baseCost: 7500, baseProd: 22000 },
  { id: 'kings_court', icon: '👑', name: { ua: 'Королівський двір', en: 'King Court' }, desc: { ua: 'Монархія', en: 'Monarchy' }, baseCost: 75000, baseProd: 110000 },
]);

// WORLD EPOCH 6: Ottoman Empire (Prestige 3)
const ottomanGenerators = createGenerators([
  { id: 'bazaar', icon: '🛒', name: { ua: 'Базар', en: 'Bazaar' }, desc: { ua: 'Торгівля', en: 'Trade' }, baseCost: 25, baseProd: 250 },
  { id: 'mosque', icon: '🕌', name: { ua: 'Мечеть', en: 'Mosque' }, desc: { ua: 'Іслам', en: 'Islam' }, baseCost: 125, baseProd: 1000 },
  { id: 'janissary_barracks', icon: '⚔️', name: { ua: 'Казарми яничар', en: 'Janissary Barracks' }, desc: { ua: 'Армія', en: 'Army' }, baseCost: 750, baseProd: 5000 },
  { id: 'topkapi', icon: '🏛️', name: { ua: 'Топкапи', en: 'Topkapi Palace' }, desc: { ua: 'Палац султана', en: 'Sultan palace' }, baseCost: 7500, baseProd: 25000 },
  { id: 'constantinople_ottoman', icon: '🌆', name: { ua: 'Стамбул', en: 'Istanbul' }, desc: { ua: 'Завоювання', en: 'Conquest' }, baseCost: 75000, baseProd: 125000 },
]);

// WORLD EPOCH 7: Renaissance Italy (Prestige 4)
const renaissanceGenerators = createGenerators([
  { id: 'artist_studio', icon: '🎨', name: { ua: 'Майстерня художника', en: 'Artist Studio' }, desc: { ua: 'Мистецтво', en: 'Art' }, baseCost: 30, baseProd: 280 },
  { id: 'bank', icon: '💰', name: { ua: 'Банк', en: 'Bank' }, desc: { ua: 'Медічі', en: 'Medici' }, baseCost: 150, baseProd: 1120 },
  { id: 'university', icon: '🎓', name: { ua: 'Університет', en: 'University' }, desc: { ua: 'Наука', en: 'Science' }, baseCost: 900, baseProd: 5600 },
  { id: 'dukes_palace', icon: '🏛️', name: { ua: 'Палац герцога', en: 'Duke Palace' }, desc: { ua: 'Флоренція', en: 'Florence' }, baseCost: 9000, baseProd: 28000 },
  { id: 'st_peters', icon: '⛪', name: { ua: 'Собор Святого Петра', en: 'St. Peter Basilica' }, desc: { ua: 'Рим', en: 'Rome' }, baseCost: 90000, baseProd: 140000 },
]);

// WORLD EPOCH 8: Age of Discovery (Prestige 4)
const discoveryGenerators = createGenerators([
  { id: 'shipyard', icon: '⚓', name: { ua: 'Верф', en: 'Shipyard' }, desc: { ua: 'Кораблі', en: 'Ships' }, baseCost: 30, baseProd: 300 },
  { id: 'trading_post', icon: '🧭', name: { ua: 'Торговий пост', en: 'Trading Post' }, desc: { ua: 'Картографія', en: 'Cartography' }, baseCost: 150, baseProd: 1200 },
  { id: 'colony', icon: '🏝️', name: { ua: 'Колонія', en: 'Colony' }, desc: { ua: 'Нові землі', en: 'New lands' }, baseCost: 900, baseProd: 6000 },
  { id: 'spice_route', icon: '🌶️', name: { ua: 'Шлях прянощів', en: 'Spice Route' }, desc: { ua: 'Торгівля', en: 'Trade' }, baseCost: 9000, baseProd: 30000 },
  { id: 'world_map', icon: '🗺️', name: { ua: 'Карта світу', en: 'World Map' }, desc: { ua: 'Глобалізація', en: 'Globalization' }, baseCost: 90000, baseProd: 150000 },
]);

// WORLD EPOCH 9: French Revolution Era (Prestige 5)
const revolutionEraGenerators = createGenerators([
  { id: 'cafe', icon: '☕', name: { ua: 'Кафе', en: 'Cafe' }, desc: { ua: 'Ідеї', en: 'Ideas' }, baseCost: 35, baseProd: 320 },
  { id: 'printing_press', icon: '📰', name: { ua: 'Друкарня', en: 'Printing Press' }, desc: { ua: 'Просвітництво', en: 'Enlightenment' }, baseCost: 175, baseProd: 1280 },
  { id: 'national_assembly', icon: '🏛️', name: { ua: 'Національні збори', en: 'National Assembly' }, desc: { ua: 'Демократія', en: 'Democracy' }, baseCost: 1050, baseProd: 6400 },
  { id: 'napoleon_army', icon: '⚔️', name: { ua: 'Армія Наполеона', en: 'Napoleon Army' }, desc: { ua: 'Імперія', en: 'Empire' }, baseCost: 10500, baseProd: 32000 },
  { id: 'arch_triumph', icon: '🏆', name: { ua: 'Тріумфальна арка', en: 'Arc de Triomphe' }, desc: { ua: 'Перемога', en: 'Victory' }, baseCost: 105000, baseProd: 160000 },
]);

// WORLD EPOCH 10: Industrial Britain (Prestige 5)
const industrialGenerators = createGenerators([
  { id: 'coal_mine', icon: '⚫', name: { ua: 'Вугільна шахта', en: 'Coal Mine' }, desc: { ua: 'Енергія', en: 'Energy' }, baseCost: 35, baseProd: 350 },
  { id: 'steam_engine', icon: '🚂', name: { ua: 'Паровий двигун', en: 'Steam Engine' }, desc: { ua: ' Індустріалізація', en: 'Industrialization' }, baseCost: 175, baseProd: 1400 },
  { id: 'factory', icon: '🏭', name: { ua: 'Фабрика', en: 'Factory' }, desc: { ua: 'Виробництво', en: 'Production' }, baseCost: 1050, baseProd: 7000 },
  { id: 'railway', icon: '🛤️', name: { ua: 'Залізниця', en: 'Railway' }, desc: { ua: 'Транспорт', en: 'Transport' }, baseCost: 10500, baseProd: 35000 },
  { id: 'london', icon: '🎡', name: { ua: 'Лондон', en: 'London' }, desc: { ua: 'Світова столиця', en: 'World capital' }, baseCost: 105000, baseProd: 175000 },
]);

// WORLD EPOCH 11: American Civil War Era (Prestige 6)
const civilWarGenerators = createGenerators([
  { id: 'plantation', icon: '🌻', name: { ua: 'Плантація', en: 'Plantation' }, desc: { ua: 'Сільське господарство', en: 'Agriculture' }, baseCost: 40, baseProd: 380 },
  { id: 'railroad_west', icon: '🚂', name: { ua: 'Залізниця на Захід', en: 'Western Railroad' }, desc: { ua: 'Експансія', en: 'Expansion' }, baseCost: 200, baseProd: 1520 },
  { id: 'factory_north', icon: '🏭', name: { ua: 'Фабрика Півночі', en: 'Northern Factory' }, desc: { ua: 'Індустрія', en: 'Industry' }, baseCost: 1200, baseProd: 7600 },
  { id: 'lincoln_memorial', icon: '🏛️', name: { ua: 'Меморіал Лінкольна', en: 'Lincoln Memorial' }, desc: { ua: 'Свобода', en: 'Freedom' }, baseCost: 12000, baseProd: 38000 },
  { id: 'statue_liberty', icon: '🗽', name: { ua: 'Статуя Свободи', en: 'Statue of Liberty' }, desc: { ua: 'Демократія', en: 'Democracy' }, baseCost: 120000, baseProd: 190000 },
]);

// WORLD EPOCH 12: Meiji Japan (Prestige 6)
const meijiGenerators = createGenerators([
  { id: 'rice_paddy', icon: '🍚', name: { ua: 'Рисове поле', en: 'Rice Paddy' }, desc: { ua: 'Традиція', en: 'Tradition' }, baseCost: 40, baseProd: 400 },
  { id: 'samurai_school', icon: '⚔️', name: { ua: 'Школа самураїв', en: 'Samurai School' }, desc: { ua: 'Бусідо', en: 'Bushido' }, baseCost: 200, baseProd: 1600 },
  { id: 'factory_meiji', icon: '🏭', name: { ua: 'Завод Мейдзі', en: 'Meiji Factory' }, desc: { ua: 'Модернізація', en: 'Modernization' }, baseCost: 1200, baseProd: 8000 },
  { id: 'railway_tokyo', icon: '🚄', name: { ua: 'Залізниця Токіо', en: 'Tokyo Railway' }, desc: { ua: 'Технології', en: 'Technology' }, baseCost: 12000, baseProd: 40000 },
  { id: 'imperial_palace', icon: '🏯', name: { ua: 'Імператорський палац', en: 'Imperial Palace' }, desc: { ua: 'Імперія', en: 'Empire' }, baseCost: 120000, baseProd: 200000 },
])

export const EPOCHS: Epoch[] = [
  {
    id: 'trypillia',
    name: { ua: 'Трипільська культура', en: 'Trypillian Culture' },
    description: { ua: 'Археологічна культура енеоліту (5500-2750 до н.е.)', en: 'Eneolithic culture (5500-2750 BC)' },
    period: { ua: '~5500-2750 до н.е.', en: '~5500-2750 BC' },
    levelRange: { min: 1, max: 50 },
    unlockLevel: 1,
    currency: 'Гривні',
    currencyIcon: '🏺',
    generators: trypilliaGenerators,
    color: '#D97706',
    bgGradient: 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)',
  },
  {
    id: 'scythia',
    name: { ua: 'Скіфія', en: 'Scythia' },
    description: { ua: 'Давня держава скіфів на півдні України', en: 'Ancient Scythian state in southern Ukraine' },
    period: { ua: 'VII-III ст. до н.е.', en: '7th-3rd c. BC' },
    levelRange: { min: 51, max: 100 },
    unlockLevel: 50,
    currency: 'Златники',
    currencyIcon: '🪙',
    generators: scythiaGenerators,
    color: '#22C55E',
    bgGradient: 'linear-gradient(135deg, #4ADE80 0%, #16A34A 100%)',
  },
  {
    id: 'antiquity',
    name: { ua: 'Античні колонії', en: 'Ancient Colonies' },
    description: { ua: 'Грецькі колонії на Чорному морі', en: 'Greek colonies on the Black Sea' },
    period: { ua: 'VII ст. до н.е. - V ст. н.е.', en: '7th c. BC - 5th c. AD' },
    levelRange: { min: 101, max: 150 },
    unlockLevel: 100,
    currency: 'Драхми',
    currencyIcon: '🏛',
    generators: antiquityGenerators,
    color: '#06B6D4',
    bgGradient: 'linear-gradient(135deg, #67E8F9 0%, #0891B2 100%)',
  },
  {
    id: 'kyiv_rus',
    name: { ua: 'Київська Русь', en: 'Kievan Rus' },
    description: { ua: 'Перша східнословянська держава', en: 'First East Slavic state' },
    period: { ua: 'IX-XIII ст.', en: '9th-13th c.' },
    levelRange: { min: 151, max: 250 },
    unlockLevel: 150,
    currency: 'Гривни',
    currencyIcon: '☦️',
    generators: kyivRusGenerators,
    color: '#DC2626',
    bgGradient: 'linear-gradient(135deg, #FCA5A5 0%, #DC2626 100%)',
  },
  {
    id: 'halych_volhynia',
    name: { ua: 'Галицько-Волинська держава', en: 'Halych-Volhynia' },
    description: { ua: 'Спадкоємець Київської Русі', en: 'Heir to Kievan Rus' },
    period: { ua: '1199-1349', en: '1199-1349' },
    levelRange: { min: 251, max: 320 },
    unlockLevel: 250,
    currency: 'Срібники',
    currencyIcon: '⚔️',
    generators: halychVolhyniaGenerators,
    color: '#7C3AED',
    bgGradient: 'linear-gradient(135deg, #C4B5FD 0%, #7C3AED 100%)',
  },
  {
    id: 'polish_lithuanian',
    name: { ua: 'Річ Посполита', en: 'Polish-Lithuanian Commonwealth' },
    description: { ua: 'Українські землі в складі Речі Посполитої', en: 'Ukrainian lands in Poland-Lithuania' },
    period: { ua: 'XIV-XVII ст.', en: '14th-17th c.' },
    levelRange: { min: 321, max: 420 },
    unlockLevel: 320,
    currency: 'Злоті',
    currencyIcon: '🦅',
    generators: polishLithuanianGenerators,
    color: '#EAB308',
    bgGradient: 'linear-gradient(135deg, #FDE047 0%, #CA8A04 100%)',
  },
  {
    id: 'cossack',
    name: { ua: 'Козацька доба', en: 'Cossack Era' },
    description: { ua: 'Хмельниччина та козацька революція', en: "Khmelnytsky and Cossack revolution" },
    period: { ua: '1648-1764', en: '1648-1764' },
    levelRange: { min: 421, max: 550 },
    unlockLevel: 420,
    currency: 'Червінці',
    currencyIcon: '⚔️',
    generators: cossackGenerators,
    color: '#EF4444',
    bgGradient: 'linear-gradient(135deg, #FCA5A5 0%, #EF4444 100%)',
  },
  {
    id: 'hetmanate',
    name: { ua: 'Гетьманщина', en: 'Hetmanate' },
    description: { ua: 'Козацька держава під проводом гетьмана', en: 'Cossack state led by Hetman' },
    period: { ua: 'XVIII-XIX ст.', en: '18th-19th c.' },
    levelRange: { min: 551, max: 650 },
    unlockLevel: 550,
    currency: 'Рублі',
    currencyIcon: '📜',
    generators: hetmanateGenerators,
    color: '#F97316',
    bgGradient: 'linear-gradient(135deg, #FDBA74 0%, #EA580C 100%)',
  },
  {
    id: 'empire',
    name: { ua: 'Імперська доба', en: 'Imperial Era' },
    description: { ua: 'Україна в Російській імперії', en: 'Ukraine in Russian Empire' },
    period: { ua: 'XIX - поч. XX ст.', en: '19th - early 20th c.' },
    levelRange: { min: 651, max: 780 },
    unlockLevel: 650,
    currency: 'Карбованці',
    currencyIcon: '🏭',
    generators: empireGenerators,
    color: '#1D4ED8',
    bgGradient: 'linear-gradient(135deg, #93C5FD 0%, #1D4ED8 100%)',
  },
  {
    id: 'revolution',
    name: { ua: 'Революція та УНР', en: 'Revolution & UNR' },
    description: { ua: 'Українська Народна Республіка', en: 'Ukrainian Peoples Republic' },
    period: { ua: '1917-1921', en: '1917-1921' },
    levelRange: { min: 781, max: 850 },
    unlockLevel: 780,
    currency: 'Гривні',
    currencyIcon: '🇺🇦',
    generators: revolutionGenerators,
    color: '#FBBF24',
    bgGradient: 'linear-gradient(135deg, #FEF08A 0%, #FACC15 100%)',
  },
  {
    id: 'soviet',
    name: { ua: 'Радянська доба', en: 'Soviet Era' },
    description: { ua: 'Україна в СРСР', en: 'Ukraine in USSR' },
    period: { ua: '1922-1991', en: '1922-1991' },
    levelRange: { min: 851, max: 950 },
    unlockLevel: 850,
    currency: 'Рублі',
    currencyIcon: '☭',
    generators: sovietGenerators,
    color: '#BE123C',
    bgGradient: 'linear-gradient(135deg, #FDA4AF 0%, #BE123C 100%)',
  },
  {
    id: 'independence',
    name: { ua: 'Незалежна Україна', en: 'Independent Ukraine' },
    description: { ua: 'Сучасна українська держава', en: 'Modern Ukrainian state' },
    period: { ua: '1991 - сьогодні', en: '1991 - today' },
    levelRange: { min: 951, max: 999 },
    unlockLevel: 950,
    currency: 'Гривні',
    currencyIcon: '🇺🇦',
    generators: independenceGenerators,
    color: '#FACC15',
    bgGradient: 'linear-gradient(135deg, #005bbb 0%, #FACC15 50%, #005bbb 100%)',
  },
  // ═══════════════════════════════════════════════════════════════════════
  // WORLD HISTORY EPOCHS (Prestige 1+)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'egypt',
    name: { ua: 'Давній Єгипет', en: 'Ancient Egypt' },
    description: { ua: 'Цивілізація фараонів на берегах Нілу', en: 'Pharaoh civilization on the Nile' },
    period: { ua: '3100-30 до н.е.', en: '3100-30 BC' },
    levelRange: { min: 1000, max: 1100 },
    unlockLevel: 999, // Prestige 1 only
    requiredPrestige: 1,
    currency: 'Динар',
    currencyIcon: '🔺',
    generators: egyptGenerators,
    color: '#D4A574',
    bgGradient: 'linear-gradient(135deg, #D4A574 0%, #8B6914 100%)',
  },
  {
    id: 'rome',
    name: { ua: 'Римська імперія', en: 'Roman Empire' },
    description: { ua: 'Вічне місто та його провінції', en: 'Eternal City and its provinces' },
    period: { ua: '753 до н.е. - 476 н.е.', en: '753 BC - 476 AD' },
    levelRange: { min: 1101, max: 1200 },
    unlockLevel: 1100,
    requiredPrestige: 1,
    currency: 'Сестерцій',
    currencyIcon: '🦅',
    generators: romeGenerators,
    color: '#8B0000',
    bgGradient: 'linear-gradient(135deg, #CD5C5C 0%, #8B0000 100%)',
  },
  {
    id: 'china',
    name: { ua: 'Давній Китай', en: 'Ancient China' },
    description: { ua: 'Імперії Сходу від Цінь до Хань', en: 'Eastern empires from Qin to Han' },
    period: { ua: '221 до н.е. - 220 н.е.', en: '221 BC - 220 AD' },
    levelRange: { min: 1201, max: 1300 },
    unlockLevel: 1200,
    requiredPrestige: 2,
    currency: 'Юань',
    currencyIcon: '🐉',
    generators: chinaGenerators,
    color: '#DC143C',
    bgGradient: 'linear-gradient(135deg, #FF6B6B 0%, #DC143C 100%)',
  },
  {
    id: 'byzantine',
    name: { ua: 'Візантійська імперія', en: 'Byzantine Empire' },
    description: { ua: 'Східна Римська імперія', en: 'Eastern Roman Empire' },
    period: { ua: '330-1453', en: '330-1453' },
    levelRange: { min: 1301, max: 1400 },
    unlockLevel: 1300,
    requiredPrestige: 2,
    currency: 'Номізма',
    currencyIcon: '☦️',
    generators: byzantineGenerators,
    color: '#8B4513',
    bgGradient: 'linear-gradient(135deg, #DEB887 0%, #8B4513 100%)',
  },
  {
    id: 'medieval',
    name: { ua: 'Середньовічна Європа', en: 'Medieval Europe' },
    description: { ua: 'Доба рицарів та замків', en: 'Age of knights and castles' },
    period: { ua: '500-1500', en: '500-1500' },
    levelRange: { min: 1401, max: 1500 },
    unlockLevel: 1400,
    requiredPrestige: 3,
    currency: 'Флорин',
    currencyIcon: '🏰',
    generators: medievalGenerators,
    color: '#4A4A4A',
    bgGradient: 'linear-gradient(135deg, #808080 0%, #4A4A4A 100%)',
  },
  {
    id: 'ottoman',
    name: { ua: 'Османська імперія', en: 'Ottoman Empire' },
    description: { ua: 'Турецька держава на трьох континентах', en: 'Turkish state on three continents' },
    period: { ua: '1299-1922', en: '1299-1922' },
    levelRange: { min: 1501, max: 1600 },
    unlockLevel: 1500,
    requiredPrestige: 3,
    currency: 'Акче',
    currencyIcon: '🌙',
    generators: ottomanGenerators,
    color: '#1E3A5F',
    bgGradient: 'linear-gradient(135deg, #4169E1 0%, #1E3A5F 100%)',
  },
  {
    id: 'renaissance',
    name: { ua: 'Італійське Відродження', en: 'Italian Renaissance' },
    description: { ua: 'Епоха мистецтва та науки', en: 'Age of art and science' },
    period: { ua: '1400-1600', en: '1400-1600' },
    levelRange: { min: 1601, max: 1700 },
    unlockLevel: 1600,
    requiredPrestige: 4,
    currency: 'Дукат',
    currencyIcon: '🎨',
    generators: renaissanceGenerators,
    color: '#8B008B',
    bgGradient: 'linear-gradient(135deg, #DA70D6 0%, #8B008B 100%)',
  },
  {
    id: 'discovery',
    name: { ua: 'Епоха відкриттів', en: 'Age of Discovery' },
    description: { ua: 'Європейські мореплавці', en: 'European explorers' },
    period: { ua: '1400-1600', en: '1400-1600' },
    levelRange: { min: 1701, max: 1800 },
    unlockLevel: 1700,
    requiredPrestige: 4,
    currency: 'Песо',
    currencyIcon: '🧭',
    generators: discoveryGenerators,
    color: '#006400',
    bgGradient: 'linear-gradient(135deg, #90EE90 0%, #006400 100%)',
  },
  {
    id: 'revolution_era',
    name: { ua: 'Епоха революцій', en: 'Revolution Era' },
    description: { ua: 'Французька революція та Наполеон', en: 'French Revolution and Napoleon' },
    period: { ua: '1789-1815', en: '1789-1815' },
    levelRange: { min: 1801, max: 1900 },
    unlockLevel: 1800,
    requiredPrestige: 5,
    currency: 'Франк',
    currencyIcon: '🇫🇷',
    generators: revolutionEraGenerators,
    color: '#00008B',
    bgGradient: 'linear-gradient(135deg, #4169E1 0%, #00008B 100%)',
  },
  {
    id: 'industrial',
    name: { ua: 'Промислова Британія', en: 'Industrial Britain' },
    description: { ua: 'Перша індустріальна держава', en: 'First industrial nation' },
    period: { ua: '1760-1840', en: '1760-1840' },
    levelRange: { min: 1901, max: 2000 },
    unlockLevel: 1900,
    requiredPrestige: 5,
    currency: 'Фунт',
    currencyIcon: '💷',
    generators: industrialGenerators,
    color: '#2F4F4F',
    bgGradient: 'linear-gradient(135deg, #708090 0%, #2F4F4F 100%)',
  },
  {
    id: 'civil_war_era',
    name: { ua: 'Епоха Громадянської війни', en: 'Civil War Era' },
    description: { ua: 'США: Північ проти Півдня', en: 'USA: North vs South' },
    period: { ua: '1861-1865', en: '1861-1865' },
    levelRange: { min: 2001, max: 2100 },
    unlockLevel: 2000,
    requiredPrestige: 6,
    currency: 'Долар',
    currencyIcon: '💵',
    generators: civilWarGenerators,
    color: '#191970',
    bgGradient: 'linear-gradient(135deg, #6495ED 0%, #191970 100%)',
  },
  {
    id: 'meiji',
    name: { ua: 'Японія Мейдзі', en: 'Meiji Japan' },
    description: { ua: 'Модернізація Японії', en: 'Japanese modernization' },
    period: { ua: '1868-1912', en: '1868-1912' },
    levelRange: { min: 2101, max: 2200 },
    unlockLevel: 2100,
    requiredPrestige: 6,
    currency: 'Єна',
    currencyIcon: '💴',
    generators: meijiGenerators,
    color: '#DC143C',
    bgGradient: 'linear-gradient(135deg, #FFB6C1 0%, #DC143C 100%)',
  },
];

// Artifacts for Gacha - Each epoch has themed artifacts
// FIX: Chest can only be opened for CURRENT epoch - no cross-epoch artifact farming
export const ARTIFACTS: Artifact[] = [
  // Trypillia (EPOCH 1) - Theme: Pottery & Agriculture → passive_boost
  { id: 'trypillia_bull', name: { ua: 'Бик-бикален', en: 'Bull Idol' }, epoch: 'trypillia', rarity: 'common', parts: 10, bonus: { type: 'passive_boost', value: 1.05 }, icon: '🐂' },
  { id: 'trypillia_pot', name: { ua: 'Трипільська піала', en: 'Trypillian Bowl' }, epoch: 'trypillia', rarity: 'rare', parts: 10, bonus: { type: 'passive_boost', value: 1.10 }, icon: '🏺' },
  { id: 'trypillia_goddess', name: { ua: 'Богиня-Мати', en: 'Mother Goddess' }, epoch: 'trypillia', rarity: 'legendary', parts: 10, bonus: { type: 'passive_boost', value: 1.20 }, icon: '👸' },

  // Scythia (EPOCH 2) - Theme: Warriors & Gold → xp_multiplier
  { id: 'scythia_arrow', name: { ua: 'Скіфська стріла', en: 'Scythian Arrow' }, epoch: 'scythia', rarity: 'common', parts: 10, bonus: { type: 'xp_multiplier', value: 1.05 }, icon: '🏹' },
  { id: 'scythia_rhyton', name: { ua: 'Золотий ритон', en: 'Golden Rhyton' }, epoch: 'scythia', rarity: 'rare', parts: 10, bonus: { type: 'xp_multiplier', value: 1.10 }, icon: '🎺' },
  { id: 'scythia_gold', name: { ua: 'Золота пектораль', en: 'Golden Pectoral' }, epoch: 'scythia', rarity: 'legendary', parts: 10, bonus: { type: 'xp_multiplier', value: 1.20 }, icon: '👑' },

  // Antiquity (EPOCH 3) - Theme: Trade & Culture → currency_multiplier
  { id: 'antiquity_amphora', name: { ua: 'Грецька амфора', en: 'Greek Amphora' }, epoch: 'antiquity', rarity: 'common', parts: 10, bonus: { type: 'currency_multiplier', value: 1.05 }, icon: '🏺' },
  { id: 'antiquity_coin', name: { ua: 'Ольвійська монета', en: 'Olbian Coin' }, epoch: 'antiquity', rarity: 'rare', parts: 10, bonus: { type: 'currency_multiplier', value: 1.10 }, icon: '🪙' },
  { id: 'antiquity_statue', name: { ua: 'Статуя Аполлона', en: 'Apollo Statue' }, epoch: 'antiquity', rarity: 'legendary', parts: 10, bonus: { type: 'currency_multiplier', value: 1.20 }, icon: '🏛' },

  // Kyiv Rus (EPOCH 4) - Theme: Religion & State
  { id: 'kyiv_icon', name: { ua: 'Ікона', en: 'Icon' }, epoch: 'kyiv_rus', rarity: 'common', parts: 10, bonus: { type: 'xp_multiplier', value: 1.06 }, icon: '🖼' },
  { id: 'kyiv_reliquary', name: { ua: 'Мощі Святих', en: 'Saints Relics' }, epoch: 'kyiv_rus', rarity: 'epic', parts: 10, bonus: { type: 'passive_boost', value: 1.12 }, icon: '☦️' },
  { id: 'kyiv_gospels', name: { ua: 'Остромирове Євангеліє', en: 'Ostromir Gospels' }, epoch: 'kyiv_rus', rarity: 'legendary', parts: 10, bonus: { type: 'currency_multiplier', value: 1.20 }, icon: '📖' },

  // Halych-Volhynia (EPOCH 5)
  { id: 'halych_seal', name: { ua: 'Печать князя', en: "Prince's Seal" }, epoch: 'halych_volhynia', rarity: 'rare', parts: 10, bonus: { type: 'currency_multiplier', value: 1.10 }, icon: '🔖' },
  { id: 'halych_crown', name: { ua: 'Корона Данила', en: "Danylo's Crown" }, epoch: 'halych_volhynia', rarity: 'legendary', parts: 10, bonus: { type: 'currency_multiplier', value: 1.20 }, icon: '👑' },

  // Polish-Lithuanian (EPOCH 6)
  { id: 'polish_sword', name: { ua: 'Рицарський меч', en: 'Knight Sword' }, epoch: 'polish_lithuanian', rarity: 'rare', parts: 10, bonus: { type: 'xp_multiplier', value: 1.10 }, icon: '⚔️' },
  { id: 'polish_crown', name: { ua: 'Корона короля', en: "King's Crown" }, epoch: 'polish_lithuanian', rarity: 'legendary', parts: 10, bonus: { type: 'passive_boost', value: 1.18 }, icon: '👑' },

  // Cossack (EPOCH 7)
  { id: 'cossack_pistol', name: { ua: 'Козацький пістоль', en: 'Cossack Pistol' }, epoch: 'cossack', rarity: 'common', parts: 10, bonus: { type: 'xp_multiplier', value: 1.06 }, icon: '🔫' },
  { id: 'cossack_flag', name: { ua: 'Козацький прапор', en: 'Cossack Banner' }, epoch: 'cossack', rarity: 'rare', parts: 10, bonus: { type: 'xp_multiplier', value: 1.12 }, icon: '🚩' },
  { id: 'cossack_mace', name: { ua: 'Булава Богдана', en: "Bohdan's Mace" }, epoch: 'cossack', rarity: 'legendary', parts: 10, bonus: { type: 'xp_multiplier', value: 1.20 }, icon: '🏏' },

  // Hetmanate (EPOCH 8)
  { id: 'hetman_seal', name: { ua: 'Печать гетьмана', en: "Hetman's Seal" }, epoch: 'hetmanate', rarity: 'rare', parts: 10, bonus: { type: 'currency_multiplier', value: 1.12 }, icon: '🔏' },
  { id: 'hetman_charter', name: { ua: 'Гетьманська грамота', en: 'Hetman Charter' }, epoch: 'hetmanate', rarity: 'legendary', parts: 10, bonus: { type: 'currency_multiplier', value: 1.20 }, icon: '📜' },

  // Empire (EPOCH 9)
  { id: 'empire_medal', name: { ua: 'Імперська медаль', en: 'Imperial Medal' }, epoch: 'empire', rarity: 'common', parts: 10, bonus: { type: 'passive_boost', value: 1.06 }, icon: '🏅' },
  { id: 'empire_factory', name: { ua: 'Заводський знак', en: 'Factory Badge' }, epoch: 'empire', rarity: 'rare', parts: 10, bonus: { type: 'passive_boost', value: 1.12 }, icon: '🏭' },

  // Revolution (EPOCH 10)
  { id: 'revolution_poster', name: { ua: 'Агітаційний плакат', en: 'Propaganda Poster' }, epoch: 'revolution', rarity: 'common', parts: 10, bonus: { type: 'xp_multiplier', value: 1.08 }, icon: '📰' },
  { id: 'revolution_flag', name: { ua: 'Прапор УНР', en: 'UNR Flag' }, epoch: 'revolution', rarity: 'legendary', parts: 10, bonus: { type: 'xp_multiplier', value: 1.20 }, icon: '🇺🇦' },

  // Soviet (EPOCH 11)
  { id: 'soviet_badge', name: { ua: 'Радянський значок', en: 'Soviet Badge' }, epoch: 'soviet', rarity: 'common', parts: 10, bonus: { type: 'passive_boost', value: 1.06 }, icon: '⭐' },
  { id: 'soviet_anthem', name: { ua: 'Ноти гімну УРСР', en: 'USSR Anthem Notes' }, epoch: 'soviet', rarity: 'rare', parts: 10, bonus: { type: 'currency_multiplier', value: 1.10 }, icon: '🎵' },
  { id: 'soviet_rocket', name: { ua: 'Модель ракети', en: 'Rocket Model' }, epoch: 'soviet', rarity: 'epic', parts: 10, bonus: { type: 'passive_boost', value: 1.15 }, icon: '🚀' },

  // Independence (EPOCH 12)
  { id: 'ind_flag', name: { ua: 'Національний прапор', en: 'National Flag' }, epoch: 'independence', rarity: 'common', parts: 10, bonus: { type: 'xp_multiplier', value: 1.08 }, icon: '🇺🇦' },
  { id: 'ind_passport', name: { ua: 'Перший паспорт', en: 'First Passport' }, epoch: 'independence', rarity: 'rare', parts: 10, bonus: { type: 'currency_multiplier', value: 1.12 }, icon: '🎫' },
  { id: 'ind_constitution', name: { ua: 'Конституція', en: 'Constitution' }, epoch: 'independence', rarity: 'legendary', parts: 10, bonus: { type: 'passive_boost', value: 1.20 }, icon: '📜' },

  // === SECRET ARTIFACTS (require Prestige 1+) ===
  // Fixed bonuses: +5% to +20% max (1.05 to 1.20) per specification
  // Drop chance: 3-5% when prestige >= 1
  { id: 'secret_trypillia_altar', name: { ua: 'Трипільський жертовник', en: 'Trypillian Altar' }, epoch: 'trypillia', rarity: 'secret', parts: 15, bonus: { type: 'passive_boost', value: 1.15 }, icon: '🔥', requiredPrestige: 1 },
  { id: 'secret_scythia_treasure', name: { ua: 'Скарб Скіфії', en: 'Scythian Treasure' }, epoch: 'scythia', rarity: 'secret', parts: 15, bonus: { type: 'xp_multiplier', value: 1.15 }, icon: '💎', requiredPrestige: 1 },
  { id: 'secret_antiquity_oracle', name: { ua: 'Оракул Аполлона', en: 'Apollo Oracle' }, epoch: 'antiquity', rarity: 'secret', parts: 15, bonus: { type: 'currency_multiplier', value: 1.15 }, icon: '🔮', requiredPrestige: 1 },
  { id: 'secret_kyiv_relic', name: { ua: 'Мощі Володимира', en: 'Vladimir Relics' }, epoch: 'kyiv_rus', rarity: 'secret', parts: 15, bonus: { type: 'xp_multiplier', value: 1.16 }, icon: '✝️', requiredPrestige: 1 },
  { id: 'secret_halych_throne', name: { ua: 'Трон Данила', en: "Danylo's Throne" }, epoch: 'halych_volhynia', rarity: 'secret', parts: 15, bonus: { type: 'currency_multiplier', value: 1.17 }, icon: '🪑', requiredPrestige: 1 },
  { id: 'secret_cossack_hetman_mace', name: { ua: 'Булава Хмельницького', en: "Khmelnytsky's Mace" }, epoch: 'cossack', rarity: 'secret', parts: 15, bonus: { type: 'xp_multiplier', value: 1.18 }, icon: '⚔️', requiredPrestige: 1 },
  { id: 'secret_hetman_oriflamma', name: { ua: 'Оріфлама Гетьманщини', en: 'Hetmanate Oriflamme' }, epoch: 'hetmanate', rarity: 'secret', parts: 15, bonus: { type: 'passive_boost', value: 1.17 }, icon: '🚩', requiredPrestige: 1 },
  { id: 'secret_empire_factory_secret', name: { ua: 'Секрет заводу', en: 'Factory Secret' }, epoch: 'empire', rarity: 'secret', parts: 15, bonus: { type: 'passive_boost', value: 1.16 }, icon: '⚙️', requiredPrestige: 1 },
  { id: 'secret_revolution_manifest', name: { ua: 'Маніфест УНР', en: 'UNR Manifest' }, epoch: 'revolution', rarity: 'secret', parts: 15, bonus: { type: 'xp_multiplier', value: 1.18 }, icon: '📜', requiredPrestige: 1 },
  { id: 'secret_soviet_space_secret', name: { ua: 'Таємниця космосу', en: 'Space Secret' }, epoch: 'soviet', rarity: 'secret', parts: 15, bonus: { type: 'passive_boost', value: 1.18 }, icon: '🌌', requiredPrestige: 1 },
  { id: 'secret_independence_charter', name: { ua: 'Акт Незалежності', en: 'Independence Act' }, epoch: 'independence', rarity: 'secret', parts: 15, bonus: { type: 'currency_multiplier', value: 1.20 }, icon: '🇺🇦', requiredPrestige: 1 },

  // ═══════════════════════════════════════════════════════════════════════
  // WORLD HISTORY ARTIFACTS (Prestige 1+)
  // ═══════════════════════════════════════════════════════════════════════

  // Egypt (World Epoch 1)
  { id: 'egypt_scarab', name: { ua: 'Скарб', en: 'Scarab' }, epoch: 'egypt', rarity: 'common', parts: 10, bonus: { type: 'xp_multiplier', value: 1.08 }, icon: '🪲' },
  { id: 'egypt_anubis', name: { ua: 'Статуя Анубіса', en: 'Anubis Statue' }, epoch: 'egypt', rarity: 'rare', parts: 10, bonus: { type: 'passive_boost', value: 1.12 }, icon: '🐺' },
  { id: 'egypt_mask', name: { ua: 'Маска Тутанхамона', en: 'Tutankhamun Mask' }, epoch: 'egypt', rarity: 'legendary', parts: 10, bonus: { type: 'xp_multiplier', value: 1.25 }, icon: '👑' },

  // Rome (World Epoch 2)
  { id: 'rome_gladius', name: { ua: 'Гладіус', en: 'Gladius' }, epoch: 'rome', rarity: 'common', parts: 10, bonus: { type: 'xp_multiplier', value: 1.08 }, icon: '🗡️' },
  { id: 'rome_eagle', name: { ua: 'Орел легіону', en: 'Legion Eagle' }, epoch: 'rome', rarity: 'rare', parts: 10, bonus: { type: 'currency_multiplier', value: 1.12 }, icon: '🦅' },
  { id: 'rome_laurel', name: { ua: 'Імператорський вінок', en: 'Imperial Laurel' }, epoch: 'rome', rarity: 'legendary', parts: 10, bonus: { type: 'passive_boost', value: 1.25 }, icon: '🌿' },

  // China (World Epoch 3)
  { id: 'china_jade', name: { ua: 'Нефритовий дракон', en: 'Jade Dragon' }, epoch: 'china', rarity: 'common', parts: 10, bonus: { type: 'currency_multiplier', value: 1.08 }, icon: '🐉' },
  { id: 'china_bell', name: { ua: 'Дзвін династії Цінь', en: 'Qin Dynasty Bell' }, epoch: 'china', rarity: 'rare', parts: 10, bonus: { type: 'passive_boost', value: 1.12 }, icon: '🔔' },
  { id: 'china_scroll', name: { ua: 'Імператорський указ', en: 'Imperial Scroll' }, epoch: 'china', rarity: 'legendary', parts: 10, bonus: { type: 'xp_multiplier', value: 1.25 }, icon: '📜' },

  // Byzantine (World Epoch 4)
  { id: 'byzantine_mosaic', name: { ua: 'Мозаїка', en: 'Mosaic' }, epoch: 'byzantine', rarity: 'common', parts: 10, bonus: { type: 'passive_boost', value: 1.08 }, icon: '🎨' },
  { id: 'byzantine_crown', name: { ua: 'Вінець імператора', en: 'Emperor Crown' }, epoch: 'byzantine', rarity: 'rare', parts: 10, bonus: { type: 'currency_multiplier', value: 1.12 }, icon: '👑' },
  { id: 'byzantine_icon', name: { ua: 'Ікона Вседержитель', en: 'Pantocrator Icon' }, epoch: 'byzantine', rarity: 'legendary', parts: 10, bonus: { type: 'xp_multiplier', value: 1.25 }, icon: '🖼️' },

  // Medieval (World Epoch 5)
  { id: 'medieval_sword', name: { ua: 'Меч хрестоносця', en: 'Crusader Sword' }, epoch: 'medieval', rarity: 'common', parts: 10, bonus: { type: 'xp_multiplier', value: 1.08 }, icon: '⚔️' },
  { id: 'medieval_shield', name: { ua: 'Гербовий щит', en: 'Coat of Arms Shield' }, epoch: 'medieval', rarity: 'rare', parts: 10, bonus: { type: 'passive_boost', value: 1.12 }, icon: '🛡️' },
  { id: 'medieval_grail', name: { ua: 'Грааль', en: 'Holy Grail' }, epoch: 'medieval', rarity: 'legendary', parts: 10, bonus: { type: 'currency_multiplier', value: 1.25 }, icon: '🏆' },

  // Ottoman (World Epoch 6)
  { id: 'ottoman_turban', name: { ua: 'Тюрбан', en: 'Turban' }, epoch: 'ottoman', rarity: 'common', parts: 10, bonus: { type: 'passive_boost', value: 1.08 }, icon: '👳' },
  { id: 'ottoman_dagger', name: { ua: 'Ятаган', en: 'Yatagan' }, epoch: 'ottoman', rarity: 'rare', parts: 10, bonus: { type: 'xp_multiplier', value: 1.12 }, icon: '🗡️' },
  { id: 'ottoman_throne', name: { ua: 'Трон султана', en: 'Sultan Throne' }, epoch: 'ottoman', rarity: 'legendary', parts: 10, bonus: { type: 'passive_boost', value: 1.25 }, icon: '🪑' },

  // Renaissance (World Epoch 7)
  { id: 'renaissance_palette', name: { ua: 'Палітра художника', en: 'Artist Palette' }, epoch: 'renaissance', rarity: 'common', parts: 10, bonus: { type: 'xp_multiplier', value: 1.08 }, icon: '🎨' },
  { id: 'renaissance_clock', name: { ua: 'Годинник да Вінчі', en: 'Da Vinci Clock' }, epoch: 'renaissance', rarity: 'rare', parts: 10, bonus: { type: 'passive_boost', value: 1.12 }, icon: '⏰' },
  { id: 'renaissance_david', name: { ua: 'Давид', en: 'David' }, epoch: 'renaissance', rarity: 'legendary', parts: 10, bonus: { type: 'currency_multiplier', value: 1.25 }, icon: '🗿' },

  // Discovery (World Epoch 8)
  { id: 'discovery_compass', name: { ua: 'Компас', en: 'Compass' }, epoch: 'discovery', rarity: 'common', parts: 10, bonus: { type: 'xp_multiplier', value: 1.08 }, icon: '🧭' },
  { id: 'discovery_telescope', name: { ua: 'Телескоп', en: 'Telescope' }, epoch: 'discovery', rarity: 'rare', parts: 10, bonus: { type: 'passive_boost', value: 1.12 }, icon: '🔭' },
  { id: 'discovery_globe', name: { ua: 'Глобус', en: 'Globe' }, epoch: 'discovery', rarity: 'legendary', parts: 10, bonus: { type: 'xp_multiplier', value: 1.25 }, icon: '🌍' },

  // Revolution Era (World Epoch 9)
  { id: 'revolution_guillotine', name: { ua: 'Модель гільйотини', en: 'Guillotine Model' }, epoch: 'revolution_era', rarity: 'common', parts: 10, bonus: { type: 'passive_boost', value: 1.08 }, icon: '⚔️' },
  { id: 'revolution_cockade', name: { ua: 'Кокарда', en: 'Cockade' }, epoch: 'revolution_era', rarity: 'rare', parts: 10, bonus: { type: 'currency_multiplier', value: 1.12 }, icon: '🎀' },
  { id: 'revolution_code', name: { ua: 'Кодекс Наполеона', en: 'Napoleonic Code' }, epoch: 'revolution_era', rarity: 'legendary', parts: 10, bonus: { type: 'passive_boost', value: 1.25 }, icon: '📖' },

  // Industrial (World Epoch 10)
  { id: 'industrial_gear', name: { ua: 'Зубчасте колесо', en: 'Gear' }, epoch: 'industrial', rarity: 'common', parts: 10, bonus: { type: 'passive_boost', value: 1.08 }, icon: '⚙️' },
  { id: 'industrial_loom', name: { ua: 'Ткацький верстат', en: 'Loom' }, epoch: 'industrial', rarity: 'rare', parts: 10, bonus: { type: 'currency_multiplier', value: 1.12 }, icon: '🧵' },
  { id: 'industrial_telegraph', name: { ua: 'Телеграф', en: 'Telegraph' }, epoch: 'industrial', rarity: 'legendary', parts: 10, bonus: { type: 'xp_multiplier', value: 1.25 }, icon: '📡' },

  // Civil War Era (World Epoch 11)
  { id: 'civil_cannon', name: { ua: 'Гармата', en: 'Cannon' }, epoch: 'civil_war_era', rarity: 'common', parts: 10, bonus: { type: 'xp_multiplier', value: 1.08 }, icon: '💣' },
  { id: 'civil_flag', name: { ua: 'Прапор Союзу', en: 'Union Flag' }, epoch: 'civil_war_era', rarity: 'rare', parts: 10, bonus: { type: 'passive_boost', value: 1.12 }, icon: '🇺🇸' },
  { id: 'civil_emancipation', name: { ua: 'Прокламація', en: 'Emancipation' }, epoch: 'civil_war_era', rarity: 'legendary', parts: 10, bonus: { type: 'currency_multiplier', value: 1.25 }, icon: '📜' },

  // Meiji (World Epoch 12)
  { id: 'meiji_katana', name: { ua: 'Катана', en: 'Katana' }, epoch: 'meiji', rarity: 'common', parts: 10, bonus: { type: 'xp_multiplier', value: 1.08 }, icon: '⚔️' },
  { id: 'meiji_fan', name: { ua: 'Віяло', en: 'Fan' }, epoch: 'meiji', rarity: 'rare', parts: 10, bonus: { type: 'passive_boost', value: 1.12 }, icon: '🪭' },
  { id: 'meiji_chrysanthemum', name: { ua: 'Хризантема', en: 'Chrysanthemum' }, epoch: 'meiji', rarity: 'legendary', parts: 10, bonus: { type: 'xp_multiplier', value: 1.25 }, icon: '🌸' },
];

// Get regular artifacts (no prestige requirement)
export function getRegularArtifacts(): Artifact[] {
  return ARTIFACTS.filter(a => !a.requiredPrestige || a.requiredPrestige === 0);
}

// Get secret artifacts available at given prestige level
export function getSecretArtifacts(prestigeLevel: number): Artifact[] {
  return ARTIFACTS.filter(a => a.requiredPrestige && a.requiredPrestige <= prestigeLevel);
}

// Get artifacts for a specific epoch (exploit fix: only current epoch)
export function getArtifactsForEpoch(epochId: EpochId, prestigeLevel: number = 0): Artifact[] {
  return ARTIFACTS.filter(a => {
    // Must match epoch
    if (a.epoch !== epochId) return false;
    // Check prestige requirement
    if (a.requiredPrestige && a.requiredPrestige > prestigeLevel) return false;
    return true;
  });
}

export function getEpochById(id: EpochId): Epoch {
  return EPOCHS.find(e => e.id === id) || EPOCHS[0];
}

export function getCurrentEpochByLevel(level: number, prestigeLevel: number = 0): Epoch {
  // Filter epochs by prestige requirement
  const availableEpochs = EPOCHS.filter(e => !e.requiredPrestige || e.requiredPrestige <= prestigeLevel);

  for (let i = availableEpochs.length - 1; i >= 0; i--) {
    if (level >= availableEpochs[i].levelRange.min) {
      return availableEpochs[i];
    }
  }
  return availableEpochs[0] || EPOCHS[0];
}

export function getEpochByIndex(index: number, prestigeLevel: number = 0): Epoch {
  const availableEpochs = EPOCHS.filter(e => !e.requiredPrestige || e.requiredPrestige <= prestigeLevel);
  return availableEpochs[Math.min(index, availableEpochs.length - 1)] || EPOCHS[0];
}

export function getAvailableEpochs(prestigeLevel: number = 0): Epoch[] {
  return EPOCHS.filter(e => !e.requiredPrestige || e.requiredPrestige <= prestigeLevel);
}

export function canAccessEpoch(epochId: EpochId, prestigeLevel: number = 0): boolean {
  const epoch = EPOCHS.find(e => e.id === epochId);
  if (!epoch) return false;
  return !epoch.requiredPrestige || epoch.requiredPrestige <= prestigeLevel;
}

export function getGeneratorCost(generator: Generator, currentLevel: number): number {
  return Math.floor(generator.baseCost * Math.pow(generator.costMultiplier, currentLevel));
}

export function getGeneratorProduction(generator: Generator, currentLevel: number): number {
  return generator.baseProduction * currentLevel;
}
