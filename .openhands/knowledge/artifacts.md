# Jolt Time — Artifacts System

## Overview

Artifacts are the core collectibles in Jolt Time. Each artifact represents real historical objects from various eras, providing both gameplay value and educational content. The game teaches history through collecting, ensuring every artifact has historical authenticity and educational value.

---

## Artifact Structure

### Base Artifact Schema

```typescript
interface Artifact {
  id: string;                    // Unique identifier (e.g., "egypt_ankh_001")
  name: string;                 // Display name
  era: EraId;                   // Associated era
  description: string;          // Brief description
  lore: string;                 // Extended lore text
  rarity: Rarity;               // Common | Uncommon | Rare | Epic | Legendary | Mythic
  powerLevel: number;           // Base power (1-100)
  educationalValue: {
    topic: string;             // Historical topic covered
    facts: string[];           // Educational facts
    relatedArtifacts: string[]; // Artifacts in same historical context
  };
  visual: {
    primaryColor: string;      // Dominant color
    glowColor: string;         // Glow effect color
    icon: string;              // Icon identifier
    animation: AnimationType;  // Idle animation type
  };
  collection: {
    setId: string;            // Set this artifact belongs to
    setBonus: SetBonus;       // Bonus when set complete
    totalInSet: number;       // Total artifacts in set
  };
}
```

### Artifact Categories

| Category | Description | Examples |
|----------|-------------|----------|
| **Tools** | Historical implements | Sickle, Compass, Quill |
| **Weapons** | Military/hunting items | Sword, Shield, Spear |
| **Jewelry** | Personal adornments | Ring, Amulet, Crown |
| **Currency** | Exchange mediums | Coin, Shell, Note |
| **Art** | Creative expressions | Vase, Painting, Sculpture |
| **Documents** | Written records | Scroll, Tablet, Charter |
| **Religious** | Spiritual items | Idol, Altar, Relic |
| **Architecture** | Building elements | Column, Arch, Tile |

---

## Ancient Egypt (3100 BCE - 30 BCE)

### Era Theme
*The Empire of Eternity — Where death was just the beginning.*

### Artifacts

#### 1. Ankh
```
ID: egypt_ankh_001
Name: Ankh
Era: Ancient Egypt
Description: The key of life, symbol of eternal existence.
Rarity: Uncommon
Power: 15

Lore: "As long as the sun rises over the Nile, the Ankh shall hold its power.
This symbol of eternal life was carried by pharaohs into the afterlife,
a key to unlock the gates between worlds."

Educational Value:
- Topic: Egyptian Symbolism & Religion
- Facts:
  - The Ankh represents "life" and was used in ancient Egyptian art
  - It combines the loop (head of Isfet) and cross (path of life)
  - Over 1000ankhs were found in Tutankhamun's tomb
- Related: Djed, Was Scepter, Shen Ring

Visual: Gold (#FFD700) with cyan temporal glow
Set: Royal Symbols (3/6)
```

#### 2. Scarab Beetle
```
ID: egypt_scarab_001
Name: Scarab Beetle
Era: Ancient Egypt
Description: The sacred dung beetle, symbol of rebirth and transformation.
Rarity: Common
Power: 10

Lore: "Khepri, the god of the rising sun, took the form of the Scarab.
Each day, he rolled the sun across the sky, just as his earthly cousins
roll their balls of dung, giving birth to new life."

Educational Value:
- Topic: Egyptian Religion & Nature Worship
- Facts:
  - Scarabs were associated with Khepri, god of the rising sun
  - Millions of Scarab amulets were buried with the dead
  - Real scarabs were dung beetles, the most important cleaning force in Egypt
- Related: Ankh, Djed, Sun Disk

Visual: Jade green (#00D9A5) with golden glow
Set: Divine Symbols (4/6)
```

#### 3. Pharaoh's Mask
```
ID: egypt_mask_001
Name: Pharaoh's Death Mask
Era: Ancient Egypt
Description: Golden face covering for eternal royal protection.
Rarity: Epic
Power: 35

Lore: "King Tutankhamun's mask weighs 24 pounds of pure gold.
The eyes of the mask gaze eternally into the afterlife,
ready to speak the words that will guide the pharaoh's soul home."

Educational Value:
- Topic: Egyptian Burial Practices & Royal Power
- Facts:
  - Tutankhamun's mask is 3,300 years old
  - It was discovered by Howard Carter in 1922
  - The mask was meant to protect the pharaoh's identity in the afterlife
- Related: Canopic Jar, Ushabti, Book of Dead

Visual: Gold (#FFD700) with lapis lazuli blue (#26619C) accents
Set: Royal Burial (2/5)
```

#### 4. Papyrus Scroll
```
ID: egypt_papyrus_001
Name: Papyrus Scroll
Era: Ancient Egypt
Description: Ancient paper made from river reeds, holding wisdom of ages.
Rarity: Common
Power: 8

Lore: "The reeds of the Nile were transformed into papyrus,
the first writing material in history. Upon these scrolls,
scribes recorded the prayers, spells, and stories of Egypt."

Educational Value:
- Topic: Egyptian Writing & Communication
- Facts:
  - Papyrus was made from Cyperus papyrus plant
  - The word 'paper' comes from 'papyrus'
  - Egyptian scrolls could last over 3,000 years
- Related: Brush, Ink Pot, Scribe Palette

Visual: Sandy beige (#E6D5A8) with brown (#8B4513) ink
Set: Scribes Tools (3/4)
```

#### 5. Obelisk Fragment
```
ID: egypt_obelisk_001
Name: Obelisk Fragment
Era: Ancient Egypt
Description: A broken piece of a towering stone monument to the gods.
Rarity: Rare
Power: 22

Lore: "Obelisks stood before temples, their tips touching the sky.
Carved from a single piece of granite, they marked the power of
pharaohs and the glory of the sun god Ra."

Educational Value:
- Topic: Egyptian Architecture & Engineering
- Facts:
  - The largest obelisk weighs 1,168 tons
  - Cleopatra's needle stands in New York today
  - Obelisks are actually tapered on all four sides
- Related: Pyramid Stone, Temple Column, Sun Disk

Visual: Granite gray (#808080) with gold (#FFD700) hieroglyphics
Set: Monument Builders (2/5)
```

#### 6. Cat Statue
```
ID: egypt_cat_001
Name: Cat Statue
Era: Ancient Egypt
Description: Sacred feline guardian, embodiment of Bastet.
Rarity: Uncommon
Power: 14

Lore: "Bastet, goddess of home, fertility, and protection, took the form of a cat.
To harm a cat was punishable by death. When a family cat died,
they would shave their eyebrows in mourning."

Educational Value:
- Topic: Egyptian Animal Worship & Deities
- Facts:
  - Cats were so valued that many were mummified
  - Over 300,000 cat mummies have been found in Egypt
  - The word 'mau' is the Egyptian word for cat
- Related: Ankh, Eye of Horus, Ibis Statue

Visual: Black (#1A1A1A) with gold (#FFD700) collar
Set: Sacred Animals (3/5)
```

#### 7. Lotus Charm
```
ID: egypt_lotus_001
Name: Lotus Charm
Era: Ancient Egypt
Description: Water lily symbol of creation and the sun.
Rarity: Common
Power: 9

Lore: "The blue lotus rises from the muddy waters each dawn,
unfolds its petals to greet the sun, and closes again at night.
Egyptians saw in it the cycle of life, death, and rebirth."

Educational Value:
- Topic: Egyptian Symbolism & Nature
- Facts:
  - The lotus is one of the oldest symbols in human history
  - It represented Upper Egypt in the Two Lands symbolism
  - Lotus flowers can survive for years in dormant state
- Related: Papyrus, Scarab, Ankh

Visual: Blue (#4B9CD3) to white gradient
Set: Nature Spirits (4/5)
```

#### 8. Djed Pillar
```
ID: egypt_djed_001
Name: Djed Pillar
Era: Ancient Egypt
Description: Column representing stability and the spine of Osiris.
Rarity: Rare
Power: 20

Lore: "The Djed is the pillar of stability, the backbone of Osiris.
When Ra raised the Djed, he ensured that the world would not fall.
Pharaohs were often depicted 'raising the Djed' to bring order."

Educational Value:
- Topic: Egyptian Mythology & Kingship
- Facts:
  - The Djed resembles a column with stacked bands
  - It predates hieroglyphic writing
  - Associated with Osiris, god of the afterlife
- Related: Ankh, Was Scepter, Crook & Flail

Visual: Lapis lazuli blue (#26619C) with gold (#FFD700) bands
Set: Divine Symbols (5/6)
```

#### 9. Eye of Horus
```
ID: egypt_eye_001
Name: Eye of Horus
Era: Ancient Egypt
Description: Protective symbol of healing and royal power.
Rarity: Uncommon
Power: 16

Lore: "Horus, god of the sky, lost his eye in battle with Set.
Thoth restored it, and the Eye of Horus became a symbol of
healing, protection, and royal power passed from god to pharaoh."

Educational Value:
- Topic: Egyptian Mythology & Mathematics
- Facts:
  - The Eye of Horus contains the first known fractions
  - It was used as a protective amulet
  - Horus was the patron god of the pharaohs
- Related: Ankh, Scarab, Cat Statue

Visual: White (#FFFFFF) with black (#000000) and gold (#FFD700) details
Set: Sacred Symbols (4/6)
```

#### 10. Ushabti Figure
```
ID: egypt_ushabti_001
Name: Ushabti Figure
Era: Ancient Egypt
Description: Small servant statue to work in the afterlife.
Rarity: Rare
Power: 18

Lore: "In the Field of Reeds, the dead must labor.
The Ushabti would rise from their tombs to serve the pharaoh,
working the fields, drawing water, and fighting any who opposed."

Educational Value:
- Topic: Egyptian Afterlife Beliefs
- Facts:
  - Up to 400 Ushabti were placed in royal tombs
  - They held mini tools: picks, hoes, water containers
  - First found in tombs of Middle Kingdom (2055-1650 BCE)
- Related: Pharaoh's Mask, Canopic Jar, Papyrus Scroll

Visual: Faience blue (#7FFFD4) with black (#000000) details
Set: Burial Treasures (3/5)
```

---

## Ancient Greece (800 BCE - 31 BCE)

### Era Theme
*The Age of Reason — Where philosophy met mythology.*

### Artifacts

#### 1. Spartan Helmet
```
ID: greece_helmet_001
Name: Spartan Bronze Helmet
Era: Ancient Greece
Description: Iconic face-concealing helm of the Spartan warrior.
Rarity: Rare
Power: 24

Lore: "With this helmet came discipline, strength, and the Spartan code:
'Come back with your shield, or on it.' The crested helm struck fear
into enemies and united Spartans as brothers in battle."

Educational Value:
- Topic: Greek Military & Society
- Facts:
  - Spartan training began at age 7
  - The '300' were elite warriors, not the entire army
  - The helmet protected the face but limited vision
- Related: Bronze Shield, Spear Point, Hoplite Armor

Visual: Bronze (#CD7F32) with red (#FF0000) crest
Set: Hoplite Equipment (3/6)
```

#### 2. Amphora Vase
```
ID: greece_amphora_001
Name: Black-Figure Amphora
Era: Ancient Greece
Description: Storage vessel decorated with mythological scenes.
Rarity: Common
Power: 10

Lore: "Amphoras held wine, oil, and grain in every Greek household.
The black figures told stories of gods and heroes—Hercules slaying
the Nemean Lion, Dionysus with his retinue of satyrs."

Educational Value:
- Topic: Greek Art & Mythology
- Facts:
  - Amphoras had two handles for carrying
  - Black-figure technique was invented in Corinth
  - Most surviving examples show mythological scenes
- Related: Kylix Cup, Lekythos, Oinochoe

Visual: Terracotta (#E2725B) with black (#1A1A1A) figures
Set: Pottery Arts (4/5)
```

#### 3. Olive Wreath
```
ID: greece_wreath_001
Name: Olive Crown
Era: Ancient Greece
Description: Victor's crown made of sacred olive leaves.
Rarity: Epic
Power: 30

Lore: "The kotinos was the sacred olive wreath, awarded at the
Olympic Games. An olive tree in Olympia was said to have been
planted by Heracles himself. To win was to be crowned divine."

Educational Value:
- Topic: Greek Athletics & Religion
- Facts:
  - Olympics winners received only the wreath (no medals)
  - The olive tree was sacred to Athena
  - Athletes competed nude and covered in olive oil
- Related: Discus, Running Sandal, Bronze Tripod

Visual: Olive green (#808000) with gold (#FFD700) ribbon
Set: Olympic Glory (2/4)
```

#### 4. Bronze Shield
```
ID: greece_shield_001
Name: Hoplite Shield
Era: Ancient Greece
Description: Heavy bronze shield bearing the weight of democracy.
Rarity: Uncommon
Power: 17

Lore: "The aspis was not just a shield—it was a promise.
Hoplites stood in the phalanx formation, shields overlapping,
each man protecting not himself, but the warrior beside him."

Educational Value:
- Topic: Greek Warfare & Democracy
- Facts:
  - The phalanx required perfect discipline
  - Shields bore family crests or city symbols
  - A fallen soldier's shield was brought home for burial
- Related: Spartan Helmet, Spear Point, Bronze Breastplate

Visual: Bronze (#CD7F32) with silver (#C0C0C0) rim
Set: Hoplite Equipment (4/6)
```

#### 5. Lyre Instrument
```
ID: greece_lyre_001
Name: Apollo's Lyre
Era: Ancient Greece
Description: Seven-string instrument of music and poetry.
Rarity: Rare
Power: 21

Lore: "Apollo received the lyre from Hermes, and with it,
he soothed the hearts of mortals and Olympians alike.
The Muses taught humanity the arts through this sacred instrument."

Educational Value:
- Topic: Greek Music & Arts
- Facts:
  - The lyre had 3-7 strings
  - It was associated with Apollo and the Muses
  - Greek music was monophonic (single melody)
- Related: Aulos Flute, Dancing Mask, Bronze Mirror

Visual: Wood brown (#8B4513) with gold (#FFD700) strings
Set: Arts of Muses (3/5)
```

#### 6. Athenian Owl Coin
```
ID: greece_coin_001
Name: Athenian Owl Tetradrachm
Era: Ancient Greece
Description: Silver coin bearing the wisdom of Athena's owl.
Rarity: Uncommon
Power: 16

Lore: "The owl of Athena was the symbol of wisdom and wealth.
Athenian coins spread across the ancient world, accepted
everywhere for their reliable silver content."

Educational Value:
- Topic: Greek Economy & Coinage
- Facts:
  - 'Owl' tetradrachms were the first standardized currency
  - They were 93% silver
  - Many survive today in museums worldwide
- Related: Bronze Weight, Merchant Scale, Corinth Helmet

Visual: Silver (#C0C0C0) with olive (#808000) and blue (#4B9CD3) owl
Set: Athenian Coinage (2/4)
```

#### 7. Delphi Oracle Bowl
```
ID: greece_oracle_001
Name: Pythia Ritual Bowl
Era: Ancient Greece
Description: Sacred vessel used by the Oracle at Delphi.
Rarity: Epic
Power: 32

Lore: "The Pythia, priestess of Apollo at Delphi, breathed
mephitic vapors and spoke in riddles that shaped Greek history.
Kings and commoners alike sought her prophecies."

Educational Value:
- Topic: Greek Religion & Prophecy
- Facts:
  - Delphi was considered the center of the world
  - The Oracle gave prophecies on the 7th of each month
  - 'Know thyself' and 'Nothing in excess' came from Delphi
- Related: Laurel Wreath, Tripod, Sibyl Scroll

Visual: Bronze (#CD7F32) with mystical purple (#9D4EDD) glow
Set: Oracle Secrets (2/4)
```

#### 8. Discus
```
ID: greece_discus_001
Name: Discus Thrower
Era: Ancient Greece
Description: Circular disc for the ancient sport of precision.
Rarity: Common
Power: 11

Lore: "The discobolus embodied the Greek ideal of physical perfection.
Myron's statue captured the moment of release, the spin of discus
through the air, the unity of body and mind."

Educational Value:
- Topic: Greek Athletics & Sculpture
- Facts:
  - Discs weighed 1-6 pounds
  - The sport required strength and technique
  - Myron's 'Discus Thrower' is one of history's most copied sculptures
- Related: Olive Wreath, Running Sandal, Javelin Point

Visual: Bronze (#CD7F32) with etched patterns
Set: Olympic Glory (3/4)
```

#### 9. Thermopylae Arrowhead
```
ID: greece_arrow_001
Name: Persian War Arrowhead
Era: Ancient Greece
Description: Bronze arrow from the battle that defined courage.
Rarity: Rare
Power: 23

Lore: "At Thermopylae, 300 Spartans held the pass against millions.
This arrow was recovered from the hot springs where they fell,
a reminder that some walls are made of will, not stone."

Educational Value:
- Topic: Greek Military History
- Facts:
  - The battle lasted 3 days
  - A traitor revealed the secret path
  - The epitaph reads: 'Go tell the Spartans, stranger passing by'
- Related: Spartan Helmet, Bronze Shield, Spear Point

Visual: Bronze (#CD7F32) with battle-worn patina
Set: Persian Wars (2/4)
```

#### 10. Parthenon Marble
```
ID: greece_parthenon_001
Name: Parthenon Fragment
Era: Ancient Greece
Description: A piece of the temple to Athena, goddess of wisdom.
Rarity: Epic
Power: 28

Lore: "The Parthenon stood for 2,500 years as the greatest
achievement of Greek architecture. Its marbles depicted the
panathenaic procession, a thousand citizens honoring their goddess."

Educational Value:
- Topic: Greek Architecture & Democracy
- Facts:
  - The Parthenon has no straight lines (all curves)
  - It had 46 statues and 92 metopes
  - Lord Elgin removed half the sculptures (now in British Museum)
- Related: Doric Column, Winged Victory, Bronze Horse

Visual: Pentelic marble white (#F5F5F5) with blue (#4B9CD3) patina
Set: Athenian Architecture (2/5)
```

---

## Roman Empire (27 BCE - 476 CE)

### Era Theme
*The Eternal City — Where law, engineering, and power ruled.*

### Artifacts

#### 1. Roman Coin
```
ID: rome_coin_001
Name: Denarius of Julius Caesar
Era: Roman Empire
Description: Silver coin of the man who changed history forever.
Rarity: Uncommon
Power: 17

Lore: "The denarius bore the face of Caesar, the first living
Roman to appear on coinage. His assassination on the Ides of March
led to the end of the Republic and birth of the Empire."

Educational Value:
- Topic: Roman Politics & Economics
- Facts:
  - Denarius meant 'containing ten'
  - Soldiers were paid in salt (salary)
  - Coin debasement contributed to Rome's fall
- Related: Aureus Gold Coin, Bronze Sestertius, Merchant Scale

Visual: Silver (#C0C0C0) with aged bronze (#8B4513) patina
Set: Roman Currency (3/5)
```

#### 2. Legion Shield
```
ID: rome_shield_001
Name: Scutum Legion Shield
Era: Roman Empire
Description: Curved rectangular shield of the Roman legion.
Rarity: Rare
Power: 24

Lore: "The scutum was the wall that held back the barbarians.
Legionaries trained until the shield wall became instinct.
'Strength and discipline over野蛮 (barbarian) numbers.'"

Educational Value:
- Topic: Roman Military Organization
- Facts:
  - Legion shields were 4 feet tall
  - Each cohort had unique markings
  - The testudo formation used overlapping shields
- Related: Gladius Sword, Pilum Spear, Lorica Armor

Visual: Red (#FF0000) with bronze (#CD7F32) boss
Set: Legion Equipment (3/5)
```

#### 3. Colosseum Ticket
```
ID: rome_colosseum_001
Name: Gladiator Token
Era: Roman Empire
Description: Bronze token granting entry to the arena of death.
Rarity: Rare
Power: 22

Lore: "Citizens entered the Colosseum with bronze tokens,
paid for by the Emperor as 'bread and circuses.'
Inside, gladiators fought for glory, freedom, or a warrior's death."

Educational Value:
- Topic: Roman Entertainment & Society
- Facts:
  - The Colosseum held 50,000-80,000 spectators
  - Games lasted 100 days for special occasions
  - Female gladiators were rare but existed
- Related: Trident, Net, Gladius Sword

Visual: Bronze (#CD7F32) with etched GLADIATOR inscription
Set: Arena Spectacle (2/4)
```

#### 4. Laurel Crown
```
ID: rome_laurel_001
Name: Triumphal Crown
Era: Roman Empire
Description: Golden wreath of victory, awarded to triumphant generals.
Rarity: Epic
Power: 31

Lore: "The Corona Triumphalis was forged of laurel leaves dipped in gold.
Only a general who achieved a decisive victory could claim a triumph—
a parade through Rome where he was temporarily king."

Educational Value:
- Topic: Roman Military Tradition
- Facts:
  - Only 4 people received triumphs in the 1st century CE
  - A slave whispered 'memento mori' behind the triumphant
  - Augustus was awarded 21 triumphs in his lifetime
- Related: Fasces, Eagle Standard, Bronze Trumpet

Visual: Gold (#FFD700) with bronze (#CD7F32) leaves
Set: Triumphal Symbols (2/4)
```

#### 5. Pompeii Bread
```
ID: rome_bread_001
Name: Preserved Bread Loaf
Era: Roman Empire
Description: Carbonized bread from the day Vesuvius erupted.
Rarity: Legendary
Power: 40

Lore: "On August 24, 79 CE, this bread was baking in a Pompeii
oven when Mount Vesuvius buried the city in ash. Preserved for
two millennia, it shows the daily life that ended so suddenly."

Educational Value:
- Topic: Roman Daily Life & Volcanology
- Facts:
  - Vesuvius erupted with 100,000 times the force of Hiroshima
  - Pompeii was buried in 6 feet of ash
  - The city was forgotten until 1748
- Related: Amphora, Fresco Fragment, Pompeii Lamp

Visual: Carbonized black (#1A1A1A) with ancient flour white (#F5F5DC) crust
Set: Frozen Moments (1/3)
```

#### 6. Aqueduct Tile
```
ID: rome_aqueduct_001
Name: Aqua Appia Tile
Era: Roman Empire
Description: Section of the first Roman aqueduct, built 312 BCE.
Rarity: Uncommon
Power: 15

Lore: "The Romans built aqueducts to bring fresh water to their cities.
The Aqua Appia carried 75,000 cubic meters daily, entirely by gravity.
Some aqueducts ran for over 60 miles."

Educational Value:
- Topic: Roman Engineering
- Facts:
  - Rome had 11 aqueducts by 226 CE
  - The word 'aquarium' comes from aqueducts
  - Some are still partially functional today
- Related: Concrete Block, Road Stone, Bridge Arch

Visual: Travertine white (#E8E4D9) with mineral blue (#4B9CD3) staining
Set: Engineering Marvels (3/5)
```

#### 7. Gladius Sword
```
ID: rome_gladius_001
Name: Gladius Hispaniensis
Era: Roman Empire
Description: Short sword that conquered the known world.
Rarity: Rare
Power: 25

Lore: "The gladius was the soul of the legionary.
Short enough for close combat, sharp enough to pierce any armor.
Where the legionary went, the eagle flew. Where the eagle flew,
Rome followed."

Educational Value:
- Topic: Roman Military Technology
- Facts:
  - 'Gladius' means sword in Latin
  - Made of Spanish steel
  - Effective range was 2-3 feet
- Related: Pilum Spear, Scutum Shield, Lorica Segmentata

Visual: Steel gray (#71797E) with bronze (#CD7F32) hilt
Set: Legion Equipment (4/5)
```

#### 8. Wax Tablet
```
ID: rome_tablet_001
Name: Vindolanda Writing Tablet
Era: Roman Empire
Description: Wooden tablet with a soldier's personal letter.
Rarity: Epic
Power: 33

Lore: "At Vindolanda on Hadrian's Wall, a Roman soldier wrote:
'Mother, I pray that you are well. I miss you daily.'
Personal letters rarely survived—these wooden tablets are priceless."

Educational Value:
- Topic: Roman Daily Life & Correspondence
- Facts:
  - Over 1,000 tablets found at Vindolanda
  - Written in ink on wax-coated wood
  - One birthday invitation survives for a woman named Sulpicia
- Related: Scroll, Quill & Ink, Papyrus Letter

Visual: Cedar wood (#B75D39) with dark brown (#3D2B1F) wax
Set: Roman Correspondence (2/4)
```

#### 9. Praetorian Eagle
```
ID: rome_eagle_001
Name: Legionary Eagle Standard
Era: Roman Empire
Description: Golden eagle that led the legion to battle.
Rarity: Legendary
Power: 45

Lore: "The aquila carried the legion's honor.
To lose the eagle was the greatest shame—a crime punishable by death.
Every legion's eagle was crafted in gold, worth more than gold."

Educational Value:
- Topic: Roman Military Organization
- Facts:
  - The eagle was the most sacred standard
  - Legions were numbered by their eagles
  - III Augusta is still active today in France
- Related: Legion Shield, Gladius Sword, Military Diploma

Visual: Gold (#FFD700) with bronze (#CD7F32) wings spread
Set: Imperial Standards (1/3)
```

#### 10. Roman Road Stone
```
ID: rome_road_001
Name: Via Appia Milestone
Era: Roman Empire
Description: Stone marking the roads that made Rome eternal.
Rarity: Common
Power: 12

Lore: "All roads led to Rome—250,000 miles of roads connecting
the empire. The Via Appia was the queen of roads, built in 312 BCE.
Romulus and Remus were said to be buried beneath the first milestone."

Educational Value:
- Topic: Roman Infrastructure & Expansion
- Facts:
  - Roman roads were 3-6 feet deep
  - Many still exist under modern highways
  - Road networks allowed Roman legions to move 20 miles per day
- Related: Aqueduct Tile, Bridge Arch, Milestone Marker

Visual: Limestone gray (#A9A9A9) with carved numerals
Set: Engineering Marvels (4/5)
```

---

## Middle Ages (476 CE - 1453 CE)

### Era Theme
*The Age of Knights — Where faith, steel, and honor shaped kingdoms.*

### Artifacts

#### 1. Knight's Sword
```
ID: medieval_sword_001
Name: Arming Sword
Era: Middle Ages
Description: The trusted blade of the medieval knight.
Rarity: Uncommon
Power: 18

Lore: "The knight's sword was his word—his oath made steel.
Knights named their swords, prayed over them, and were
buried with them. This blade has known the weight of honor."

Educational Value:
- Topic: Medieval Warfare & Chivalry
- Facts:
  - Swords averaged 2-4 pounds
  - Blades were tested by bending them double
  - 'Knight' comes from Old English 'cniht' (servant)
- Related: Shield, Gauntlet, Heraldic Banner

Visual: Steel (#71797E) with leather-wrapped (#8B4513) hilt
Set: Knightly Arms (3/5)
```

#### 2. Royal Seal
```
ID: medieval_seal_001
Name: Royal Signet Ring
Era: Middle Ages
Description: Heraldic seal that commanded armies and kingdoms.
Rarity: Rare
Power: 26

Lore: "The signet ring bore the arms of its owner.
To seal a document was to sign it with blood and honor.
Forged documents bore the death penalty—treason against the crown."

Educational Value:
- Topic: Medieval Law & Administration
- Facts:
  - Only royalty and nobility could have seals
  - The King's seal was worth more than the land it governed
  - Wax seals protected letters from tampering
- Related: Parchment Charter, Quill Pen, Crown Jewels

Visual: Gold (#FFD700) with deep red (#8B0000) wax seal
Set: Royal Regalia (2/5)
```

#### 3. Chainmail Link
```
ID: medieval_mail_001
Name: Chainmail Fragment
Era: Middle Ages
Description: Interlocking steel rings that turned men into fortresses.
Rarity: Common
Power: 14

Lore: "Chainmail was the armor of warriors for 1,000 years.
Each ring was individually punched, riveted, and woven.
A good mail shirt had 30,000 rings and took months to forge."

Educational Value:
- Topic: Medieval Arms & Armor
- Facts:
  - Could stop slashing attacks but not piercing
  - Weighed 20-30 pounds
  - Worn by Romans, Vikings, and Crusaders
- Related: Knight's Sword, Iron Helmet, Shield Boss

Visual: Steel gray (#71797E) with oiled black (#1A1A1A) finish
Set: Knightly Arms (4/5)
```

#### 4. Cathedral Key
```
ID: medieval_key_001
Name: Gothic Cathedral Key
Era: Middle Ages
Description: Symbolic key to the house of God.
Rarity: Rare
Power: 21

Lore: "Cathedral keys were works of art and power.
The man who held the cathedral key held the prayers of thousands.
Gothic cathedrals took 100-200 years to build."

Educational Value:
- Topic: Medieval Architecture & Religion
- Facts:
  - Notre-Dame took 182 years to build
  - Flying buttresses were revolutionary engineering
  - Some cathedrals had stonemason guilds with secret symbols
- Related: Stained Glass, Parchment Bible, Altar Candle

Visual: Iron black (#1A1A1A) with gold (#FFD700) filigree
Set: Sacred Architecture (2/5)
```

#### 5. Crusader Cross
```
ID: medieval_crusade_001
Name: Templar Cross
Era: Middle Ages
Description: Badge of the warrior monks who took vows of poverty.
Rarity: Epic
Power: 34

Lore: "The Knights Templar wore the cross on white mantles—
warrior monks who protected pilgrims and built banks.
Their fall was as mysterious as their rise to power."

Educational Value:
- Topic: Crusades & Religious Warfare
- Facts:
  - The First Crusade began in 1096
  - Templars were accused of heresy in 1307
  - Their symbol became the masonic Templar cross
- Related: Cathedral Key, Parchment Map, Knight's Sword

Visual: White (#FFFFFF) with blood red (#8B0000) cross
Set: Holy Warriors (2/4)
```

#### 6. Guild Token
```
ID: medieval_guild_001
Name: Merchant Guild Token
Era: Middle Ages
Description: Bronze token of membership in the merchant guild.
Rarity: Common
Power: 11

Lore: "Guilds controlled trade in every medieval city.
Only guild members could sell certain goods. This token
granted the right to trade—and the duty to protect fellow members."

Educational Value:
- Topic: Medieval Economy & Trade
- Facts:
  - Guilds set prices and quality standards
  - Apprentices spent 7 years becoming journeymen
  - The Hanseatic League controlled Northern European trade
- Related: Merchant Scale, Trade Banner, Iron Spur

Visual: Bronze (#CD7F32) with engraved guild symbol
Set: Merchant Trade (3/4)
```

#### 7. Dragon Pendant
```
ID: medieval_dragon_001
Name: Viking Dragonhead
Era: Middle Ages
Description: Bow ornament from a dragon-prowed longship.
Rarity: Rare
Power: 23

Lore: "Norsemen carved dragon heads on their ships to frighten
enemies and appease the sea gods. A dragonhead could mean
the difference between victory and Valhalla."

Educational Value:
- Topic: Viking Culture & Navigation
- Facts:
  - Vikings reached North America 500 years before Columbus
  - Longships could sail in 3 feet of water
  - 'Viking' means 'pirate raid'—not all Norse were Vikings
- Related: Runic Stone, Iron Axe, Fur Cloak

Visual: Dark iron (#1A1A1A) with amber (#FFBF00) eyes
Set: Nordic Heritage (2/5)
```

#### 8. Magna Carta Copy
```
ID: medieval_magna_001
Name: Magna Carta Fragment
Era: Middle Ages
Description: A piece of the document that limited royal power.
Rarity: Epic
Power: 38

Lore: "In 1215, King John signed the Magna Carta—
'no free man shall be seized, imprisoned... except by lawful judgment.'
This document became the foundation of constitutional law."

Educational Value:
- Topic: Medieval Law & Rights
- Facts:
  - Only 4 original copies survive
  - It established 'habeas corpus' concept
  - The US Constitution echoes its principles
- Related: Royal Seal, Parchment Charter, Iron Crown

Visual: Vellum cream (#F5F5DC) with iron gall ink (#2F4F4F)
Set: Documents of Freedom (1/3)
```

#### 9. Tournament Lance
```
ID: medieval_tournament_001
Name: Jousting Lance Tip
Era: Middle Ages
Description: Broken tip from a knight's tournament lance.
Rarity: Uncommon
Power: 16

Lore: "In tournaments, knights shattered lances in combat.
The one who unhorsed his opponent won glory and perhaps
the favor of a noble lady watching from the stands."

Educational Value:
- Topic: Medieval Chivalry & Entertainment
- Facts:
  - Tournaments could last weeks
  - Some knights died in sport
  - Ladies awarded favors to their champions
- Related: Knight's Sword, Heraldic Banner, Spur

Visual: Painted wood (#DEB887) with blue (#0000FF) and gold (#FFD700)
Set: Tournament Games (3/4)
```

#### 10. Black Death Mask
```
ID: medieval_plague_001
Name: Plague Doctor Mask
Era: Middle Ages
Description: Beak mask worn by doctors during the Black Death.
Rarity: Rare
Power: 27

Lore: "During the Black Death, which killed one-third of Europe,
doctors wore these beaked masks filled with herbs.
They believed the disease spread through 'bad air'—miasma."

Educational Value:
- Topic: Medieval Medicine & Crisis
- Facts:
  - The plague killed 75-200 million people
  - It came from trade routes from Asia
  - Quarantine (40 days) was first used in 1377
- Related: Herbalist Pouch, Monastery Bell, Parchment Charter

Visual: Leather brown (#8B4513) with glass (#ADD8E6) eye pieces
Set: Medieval Medicine (2/4)
```

---

## Renaissance (1400 CE - 1700 CE)

### Era Theme
*The Rebirth — Where art, science, and humanity awakened.*

### Artifacts

#### 1. Leonardo Sketch
```
ID: renaissance_leonardo_001
Name: Leonardo da Vinci Sketchbook Page
Era: Renaissance
Description: Original drawing from history's greatest polymath.
Rarity: Legendary
Power: 42

Lore: "Leonardo sketched everything: flying machines, war engines,
human anatomy, water studies. This page captures his genius—
a mind that saw the future 400 years before it arrived."

Educational Value:
- Topic: Renaissance Art & Science
- Facts:
  - Leonardo was left-handed and wrote backwards
  - His notebooks contain 13,000 pages
  - He dissected 30 human corpses to study anatomy
- Related: Compass, Quill Pen, Oil Painting

Visual: Aged paper (#E6D5A8) with sepia (#704214) ink
Set: Master Sketches (1/4)
```

#### 2. Printing Press Letter
```
ID: renaissance_press_001
Name: Gutenberg Letter 'A'
Era: Renaissance
Description: Movable type letter that sparked the Information Age.
Rarity: Epic
Power: 35

Lore: "Before Gutenberg, one book took a year to copy.
After him, one book took days. One letter at a time,
he printed the books that would ignite the Reformation."

Educational Value:
- Topic: Printing Revolution & Communication
- Facts:
  - The Gutenberg Bible had 1,282 pages
  - There were 180 Gutenberg Bibles left
  - Printing spread ideas faster than any technology before
- Related: Quill Pen, Paper Sheet, Book Binder

Visual: Lead alloy (#71797E) with aged patina
Set: Printing Revolution (2/4)
```

#### 3. Compass
```
ID: renaissance_compass_001
Name: Navigation Compass
Era: Renaissance
Description: Instrument that guided explorers across oceans.
Rarity: Uncommon
Power: 17

Lore: "The compass pointed sailors toward new worlds.
Magellan's circumnavigation proved Earth was round.
This small needle changed the map of human knowledge forever."

Educational Value:
- Topic: Navigation & Exploration
- Facts:
  - Compasses point to magnetic north, not true north
  - Vikings used sun stones before compasses
  - The magnetic poles have actually flipped many times
- Related: Astrolabe, Map Scroll, Ship's Bell

Visual: Brass gold (#B5A642) with glass (#ADD8E6) dome
Set: Age of Exploration (3/5)
```

#### 4. Galileo's Telescope
```
ID: renaissance_telescope_001
Name: Early Refracting Telescope
Era: Renaissance
Description: Glass tubes that opened the universe to human eyes.
Rarity: Epic
Power: 36

Lore: "Galileo turned his telescope to the sky and saw
moons orbiting Jupiter, proving Copernicus right.
He changed our place in the universe with a single look."

Educational Value:
- Topic: Scientific Revolution & Astronomy
- Facts:
  - First telescopes appeared in 1608
  - Galileo's discoveries支持 Copernicus's heliocentric model
  - He was tried by the Inquisition for his ideas
- Related: Astrolabe, Celestial Map, Pendulum Clock

Visual: Leather-wrapped (#8B4513) with brass (#B5A642) fittings
Set: Scientific Instruments (2/5)
```

#### 5. Medici Ring
```
ID: renaissance_medici_001
Name: Medici Signet Ring
Era: Renaissance
Description: Ring of the family that ruled Florence—and art.
Rarity: Epic
Power: 33

Lore: "The Medici banking family funded the Renaissance.
Without them, there would be no Sistine Chapel ceiling.
This ring commanded the wealth that bought immortality."

Educational Value:
- Topic: Renaissance Patronage & Power
- Facts:
  - Medici produced 4 Popes and 2 Queens of France
  - They invented double-entry bookkeeping
  - Their bank was the largest in Europe
- Related: Royal Seal, Oil Painting, Parchment Letter

Visual: Gold (#FFD700) with deep blue (#00008B) sapphire
Set: Florentine Power (2/4)
```

#### 6. Anatomical Drawing
```
ID: renaissance_anatomy_001
Name: Vesalius Bone Study
Era: Renaissance
Description: Medical illustration that revealed the human body.
Rarity: Rare
Power: 28

Lore: "Andreas Vesalius dissected corpses and drew every bone.
His book, 'De Humani Corporis Fabrica,' was the first
accurate map of human anatomy—changing medicine forever."

Educational Value:
- Topic: Renaissance Medicine & Science
- Facts:
  - Vesalius proved Galen's anatomy was wrong
  - He performed public dissections in Padua
  - His illustrations were more accurate than any before
- Related: Surgical Kit, Herbalist Pouch, Galileo's Telescope

Visual: Aged paper (#F5F5DC) with red (#8B0000) and black (#1A1A1A) ink
Set: Scientific Instruments (3/5)
```

#### 7. Exploration Map
```
ID: renaissance_map_001
Name: World Map Fragment
Era: Renaissance
Description: Map showing continents as they were newly discovered.
Rarity: Uncommon
Power: 19

Lore: "The age of exploration redrew the world.
New continents appeared on maps for the first time.
Each map showed a little more of Earth—and a little more of unknown."

Educational Value:
- Topic: Cartography & Discovery
- Facts:
  - 'Here be dragons' appeared on unknown territories
  - Piri Reis's map showed Americas in 1513
  - Maps were state secrets for navigation advantage
- Related: Compass, Astrolabe, Ship's Bell

Visual: Parchment (#E6D5A8) with hand-painted (#8B4513) coastlines
Set: Age of Exploration (4/5)
```

#### 8. Oil Painting Fragment
```
ID: renaissance_painting_001
Name: Renaissance Portrait Fragment
Era: Renaissance
Description: Piece of a painting from the greatest artists.
Rarity: Rare
Power: 25

Lore: "Renaissance painters mastered perspective and light.
They painted the human form as never before—and
placed it in heavenly scenes that seemed to glow."

Educational Value:
- Topic: Renaissance Art Techniques
- Facts:
  - Oil paint allowed slow, detailed work
  - Sfumato created soft, mysterious edges
  - Renaissance artists dissected bodies to paint anatomy
- Related: Leonardo Sketch, Medici Ring, Gilded Frame

Visual: Oil on panel with gold (#FFD700) leaf frame
Set: Master Paintings (3/5)
```

---

## Industrial Revolution (1760 CE - 1914 CE)

### Era Theme
*The Age of Machines — Where steam and steel built new empires.*

### Artifacts

#### 1. Steam Engine Part
```
ID: industrial_steam_001
Name: Watt Steam Engine Piston
Era: Industrial Revolution
Description: Core component of the engine that moved the world.
Rarity: Rare
Power: 26

Lore: "James Watt's steam engine transformed society.
Factories no longer needed rivers for power. Mines could be
deeper. Trains could go anywhere. The piston drove progress."

Educational Value:
- Topic: Industrial Technology & Innovation
- Facts:
  - Watt's engine was 4x more efficient than Newcomen's
  - Steam power increased British GDP by 2% annually
  - By 1800, there were 1,000 steam engines in Britain
- Related: Iron Rail, Factory Whistle, Coal Bucket

Visual: Cast iron (#434343) with copper (#B87333) patina
Set: Steam Power (2/5)
```

#### 2. Railroad Spike
```
ID: industrial_spike_001
Name: Golden Spike
Era: Industrial Revolution
Description: Symbolic final spike of the transcontinental railroad.
Rarity: Epic
Power: 34

Lore: "The golden spike marked completion of the impossible:
a railroad across America, built by Chinese immigrants and Irish
laborers, connecting coasts in a continent-spanning embrace."

Educational Value:
- Topic: Transportation Revolution
- Facts:
  - The railroad took 6 years to build
  - 'Laying tracks' employed 20,000 workers
  - It connected New York to San Francisco in 6 days
- Related: Steam Engine, Rail Segment, Locomotive Bell

Visual: Gold (#FFD700) with silver (#C0C0C0) base
Set: Iron Horses (2/4)
```

#### 3. Factory Whistle
```
ID: industrial_whistle_001
Name: Factory Steam Whistle
Era: Industrial Revolution
Description: Brass whistle that called workers to shifts.
Rarity: Common
Power: 13

Lore: "The factory whistle announced the rhythm of industrial life.
Dawn shift, day shift, night shift—time itself was measured
by steam, not sun. The factory bell rang for work."

Educational Value:
- Topic: Industrial Labor & Society
- Facts:
  - 12-hour work days were common
  - Children as young as 5 worked in factories
  - Labor laws came after decades of suffering
- Related: Steam Engine, Time Clock, Safety Lamp

Visual: Brass (#B5A642) with patina green (#607D8B)
Set: Factory Life (3/4)
```

#### 4. Telegraph Key
```
ID: industrial_telegraph_001
Name: Morse Code Telegraph Key
Era: Industrial Revolution
Description: Device that sent messages at the speed of lightning.
Rarity: Uncommon
Power: 20

Lore: "Samuel Morse's telegraph ended isolation.
'What hath God wrought' was the first message in 1844.
By Civil War, the telegraph carried 5,000 words daily."

Educational Value:
- Topic: Communication Revolution
- Facts:
  - Morse code uses dots and dashes
  - The first transatlantic cable failed after 3 weeks
  - 'SOS' became international distress signal in 1908
- Related: Telegraph Wire, Telephone Transmitter, Radio Vacuum Tube

Visual: Brass (#B5A642) with ebony (#1A1A1A) base
Set: Communication Revolution (2/5)
```

#### 5. Invention Patent
```
ID: industrial_patent_001
Name: Edison Patent Certificate
Era: Industrial Revolution
Description: Document granting exclusive rights to an invention.
Rarity: Rare
Power: 24

Lore: "Thomas Edison held 1,093 patents.
Each certificate represented years of experimentation—
and the legal right to profit from innovation. The patent
system fueled the fire of American ingenuity."

Educational Value:
- Topic: Patents & Innovation
- Facts:
  - Edison's light bulb lasted 1,200 hours
  - The first US patent was granted in 1790
  - Edison's Menlo Park was the first R&D laboratory
- Related: Telegraph Key, Factory Whistle, Laboratory Notebook

Visual: Parchment (#F5F5DC) with red (#8B0000) seal
Set: Inventor Archives (3/5)
```

---

## Modern Era (1914 CE - 1991 CE)

### Era Theme
*The Modern Age — Where humanity reached for the stars and faced its shadows.*

### Artifacts

#### 1. Apollo Mission Patch
```
ID: modern_apollo_001
Name: Apollo 11 Mission Patch
Era: Modern Era
Description: Badge worn by the first men to walk on the moon.
Rarity: Epic
Power: 38

Lore: "Apollo 11 landed on the moon on July 20, 1969.
Armstrong and Aldrin walked on lunar soil while Collins
orbited above. One small step for man—one giant leap."

Educational Value:
- Topic: Space Exploration & Cold War
- Facts:
  - 600 million watched the landing live
  - The computer had less power than a calculator
  - They spent 2.5 hours on the moon
- Related: Lunar Sample, Space Suit Button, Rocket Model

Visual: Red (#FF0000), white (#FFFFFF), blue (#00008B) embroidered patch
Set: Space Race (2/5)
```

#### 2. Berlin Wall Fragment
```
ID: modern_berlin_001
Name: Berlin Wall Concrete
Era: Modern Era
Description: Piece of the wall that divided a city and a world.
Rarity: Epic
Power: 36

Lore: "The Berlin Wall stood for 28 years.
Families were separated. People died trying to cross.
On November 9, 1989, it fell. The world was whole again."

Educational Value:
- Topic: Cold War & Division
- Facts:
  - The wall was 96 miles long
  - Over 5,000 people escaped successfully
  - About 140 people died at the wall
- Related: Passport Stamp, Border Guard Helmet, Freedom Letter

Visual: Concrete gray (#808080) with colorful graffiti paint
Set: Cold War Memories (2/5)
```

#### 3. WWII Helmet
```
ID: modern_ww2_001
Name: M1 Steel Helmet
Era: Modern Era
Description: Steel pot that protected soldiers in history's bloodiest war.
Rarity: Rare
Power: 27

Lore: "The M1 helmet protected millions in World War II.
It could stop shrapnel and bullets. Beneath these helmets
were young men from farms and cities, fighting for home."

Educational Value:
- Topic: World War II & Sacrifice
- Facts:
  - 70-80 million died in WWII
  - The M1 helmet saved countless lives
  - D-Day had 156,000 Allied troops
- Related: Dog Tags, Battle Map, Medal of Honor

Visual: Olive drab (#556B2F) with faded khaki (#F0E68C) net
Set: World War Memories (3/6)
```

#### 4. Civil Rights Button
```
ID: modern_civil_001
Name: Freedom Summer Button
Era: Modern Era
Description: Worn badge from the fight for voting rights.
Rarity: Rare
Power: 29

Lore: "In 1964, students came South to register Black voters.
They faced violence and murder. This button says
'We Demand the Right to Vote'—a right still being fought for."

Educational Value:
- Topic: Civil Rights Movement
- Facts:
  - Civil Rights Act passed in 1964
  - Voting Rights Act passed in 1965
  - 4 young girls died in the 1963 Birmingham church bombing
- Related: Freedom Charter, March Banner, Liberation Song

Visual: White (#FFFFFF) button with blue (#00008B) and red (#FF0000) print
Set: Civil Rights Legacy (2/4)
```

#### 5. First Computer Chip
```
ID: modern_chip_001
Name: Intel 4004 Microprocessor
Era: Modern Era
Description: First commercially available microprocessor.
Rarity: Legendary
Power: 44

Lore: "The Intel 4004 contained 2,300 transistors.
It could perform 60,000 operations per second.
This tiny chip launched the computer revolution."

Educational Value:
- Topic: Computing Revolution
- Facts:
  - Moore's Law: chips double every 2 years
  - Modern chips have 50 billion transistors
  - The 4004 cost $200 in 1971
- Related: Computer Terminal, Floppy Disk, Monitor Screen

Visual: Silver (#C0C0C0) ceramic package with black (#1A1A1A) markings
Set: Digital Revolution (1/4)
```

#### 6. Woodstock memorabilia
```
ID: modern_woodstock_001
Name: Woodstock Festival Pass
Era: Modern Era
Description: Ticket stub from the Summer of Love.
Rarity: Uncommon
Power: 21

Lore: "Half a million people gathered in 1969 for '3 Days
of Peace and Music.' They planted seeds of revolution—
in music, in politics, in how generations would see the world."

Educational Value:
- Topic: 1960s Counterculture
- Facts:
  - Originally planned for 50,000 people
  - Woodstock was held on Max Yasgur's dairy farm
  - Jimi Hendrix closed with an 8-hour version of the anthem
- Related: Vinyl Record, Peace Symbol, Tie-Dye Shirt

Visual: Pink (#FF69B4) paper with blue (#4B9CD3) lettering
Set: Counterculture (3/4)
```

---

## Future Era (Optional Content)

### Era Theme
*The Time Paradox — Where timelines collide and futures are written.*

### Artifacts

#### 1. Chrono Fragment
```
ID: future_chrono_001
Name: Temporal Rift Shard
Era: Future Era
Description: Crystal from a fractured timeline.
Rarity: Mythic
Power: 50

Lore: "The temporal shockwave scattered these crystals across all eras.
Each contains pure time energy—the currency of the future.
Without them, history unravels into chaos."

Educational Value:
- Topic: Theoretical Physics & Time
- Facts:
  - Based on real quantum entanglement theories
  - Time dilation affects astronauts slightly
  - Theoretical physics suggests time may not be linear
- Related: Temporal Compass, Time Suit Fragment, Rift Map

Visual: Prismatic (#C0C0C0) crystal with cyan (#00D9FF) core glow
Set: Temporal Artifacts (1/3)
```

---

## Artifact Balancing Philosophy

### Collection Goals
1. **No Pay-to-Win** — All artifacts obtainable through gameplay
2. **Visible Progress** — Clear collection percentage
3. **Set Bonuses** — Complete sets for meaningful rewards
4. **Fair RNG** — Guaranteed progress, no gambling mechanics

### Rarity Distribution
| Rarity | Drop Rate | Collection % | Power Range |
|--------|-----------|-------------|-------------|
| Common | 50% | 1-100 | 8-15 |
| Uncommon | 25% | 15-30 | 14-20 |
| Rare | 15% | 30-50 | 20-28 |
| Epic | 7% | 50-70 | 28-38 |
| Legendary | 2.5% | 70-90 | 38-45 |
| Mythic | 0.5% | 90-100 | 45-50 |

### Set Completion Bonuses
- **Complete Common Set**: +5% Time Energy gain
- **Complete Uncommon Set**: +10% Time Energy gain
- **Complete Rare Set**: +15% Time Energy gain, Unique Frame
- **Complete Epic Set**: +20% Time Energy gain, Badge
- **Complete Legendary Set**: +25% Time Energy gain, Title
- **Complete All Sets**: +50% Time Energy gain, Special Aura

---

*Every artifact tells a story. Every collection is a journey through time.*
