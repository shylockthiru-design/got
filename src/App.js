import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Particles } from "./components";
import CursorSparkles from "./CursorSparkles";
import { HomePage } from "./HomePage";
import { MapPage } from "./MapPage";
import { WeaponsPage } from "./WeaponsPage";
import { HousesPage, CharactersPage, TimelinePage, CharacterDetailPage } from "./Pages";
import { ShowsPage } from "./ShowsPage";
import { QuotesPage } from "./QuotesPage";
import { SHOWS } from "./expandedData";

/* ═══ SHOWS DROPDOWN ═══ */
function ShowsDropdown({ setPage }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button style={{
        background: "transparent", border: "1px solid transparent",
        borderRadius: "4px", padding: "0.38rem 0.9rem",
        color: "rgba(255,255,255,0.5)", fontFamily: "'Cinzel',serif",
        fontSize: "0.68rem", letterSpacing: "0.1em", cursor: "pointer",
        textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.35rem",
        transition: "all 0.2s",
      }}
        onMouseEnter={e => { e.currentTarget.style.color = "rgba(212,175,55,0.75)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "transparent"; }}
      >
        Shows <span style={{ fontSize: "0.5rem", opacity: 0.6 }}>▼</span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "100%", right: 0, marginTop: "0.3rem",
          background: "rgba(8,8,18,0.95)", backdropFilter: "blur(24px)",
          border: "1px solid rgba(212,175,55,0.2)", borderRadius: "8px",
          padding: "0.5rem", minWidth: "260px", zIndex: 300,
          boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
          animation: "fadeUp 0.2s ease",
        }}>
          {SHOWS.map(s => (
            <button key={s.id} onClick={() => { setPage(`shows-${s.id}`); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem", width: "100%",
                padding: "0.65rem 0.75rem", borderRadius: "6px",
                background: "transparent", border: "none", cursor: "pointer",
                transition: "background 0.2s",
                textAlign: "left",
              }}
              onMouseEnter={e => e.currentTarget.style.background = s.bg || "rgba(212,175,55,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontSize: "1.3rem", filter: `drop-shadow(0 0 8px ${s.color}80)` }}>{s.icon}</span>
              <div>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.7rem", color: s.color, letterSpacing: "0.05em" }}>{s.name}</div>
                <div style={{ fontFamily: "'Crimson Text',serif", fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>{s.years} · {s.seasons} season{s.seasons > 1 ? "s" : ""}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══ NAV ═══ */
function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  useState(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  });
  const links = [
    { id: "home", label: "Home" }, { id: "characters", label: "Characters" },
    { id: "houses", label: "Houses" }, { id: "weapons", label: "Weapons" },
    { id: "map", label: "Atlas (Map)" }, { id: "quotes", label: "Quotes" },
    { id: "battles", label: "Battles" }, { id: "timeline", label: "Timeline" },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0.9rem 2.5rem",
      background: scrolled ? "rgba(10,10,15,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(212,175,55,0.12)" : "none",
      transition: "all 0.5s ease",
    }}>
      <button onClick={() => setPage("home")} style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: "0.6rem",
      }}>
        <span style={{ fontSize: "1.4rem", filter: "drop-shadow(0 0 8px rgba(212,175,55,0.5))" }}>⚔️</span>
        <span style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "1rem", color: "#d4af37", letterSpacing: "0.12em" }}>THRONE</span>
      </button>
      <div style={{ display: "flex", gap: "0.15rem", alignItems: "center" }}>
        {links.map(l => (
          <button key={l.id} onClick={() => setPage(l.id)} style={{
            background: page === l.id ? "rgba(212,175,55,0.12)" : "transparent",
            border: page === l.id ? "1px solid rgba(212,175,55,0.35)" : "1px solid transparent",
            borderRadius: "4px", padding: "0.38rem 0.7rem",
            color: page === l.id ? "#d4af37" : "rgba(255,255,255,0.5)",
            fontFamily: "'Cinzel',serif", fontSize: "0.62rem", letterSpacing: "0.08em",
            cursor: "pointer", transition: "all 0.2s ease", textTransform: "uppercase",
          }}
            onMouseEnter={e => { if (page !== l.id) { e.currentTarget.style.color = "rgba(212,175,55,0.75)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)"; } }}
            onMouseLeave={e => { if (page !== l.id) { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "transparent"; } }}
          >{l.label}</button>
        ))}
        <div style={{ width: "1px", height: "16px", background: "rgba(212,175,55,0.15)", margin: "0 0.3rem" }} />
        <ShowsDropdown setPage={setPage} />
      </div>
    </nav>
  );
}

/* ═══ BATTLES DATA ═══ */
const WARS = [
  {
    id: "war-of-dawn", era: "Age of Heroes", icon: "❄️", color: "#a0c8e8",
    name: "War for the Dawn",
    subtitle: "The Long Night · Battle Against the White Walkers",
    period: "~8,000 BC",
    image: "/images/Battles/War for the dawn.png",
    description: "The first and greatest conflict in the history of the Known World. During the Long Night, when darkness lasted a generation, the White Walkers descended upon the living. The Last Hero and the Children of the Forest stood against the dead. Azor Ahai, wielding Lightbringer, drove back the darkness. The Night's Watch was founded and the Wall raised to seal away the threat forever.",
    commanders: ["Azor Ahai (The Last Hero)", "The Children of the Forest", "The First Men"],
    outcome: "Victory for the living. The White Walkers were driven back into the uttermost north. The Wall was raised.",
    battles: [
      { name: "Battle for the Dawn", desc: "The decisive final battle of the Long Night. Azor Ahai slew the Great Other with Lightbringer, ending the age of darkness." },
      { name: "Battles of the Long Night", desc: "Countless engagements across Westeros as the Army of the Dead swept south during the generation-long winter." },
      { name: "The Last Hero's Quest", desc: "A legendary hero ventured beyond the Wall alone to seek the children of the forest, his companions dying one by one." },
    ],
  },
  {
    id: "aegons-conquest", era: "Conquest", icon: "🐉", color: "#c0392b",
    name: "Aegon's Conquest",
    subtitle: "Led by Aegon I Targaryen",
    period: "2 BC – 2 AC",
    image: "/images/Battles/Aegon's Conquest.png",
    description: "Aegon the Conqueror, his two sister-wives, and three dragons — Balerion, Vhagar, and Meraxes — landed at Dragonstone and swept across the continent. Six of the seven kingdoms fell to fire and sword. Only Dorne held out, and even then only through guerrilla warfare.",
    commanders: ["Aegon I Targaryen", "Visenya Targaryen", "Rhaenys Targaryen", "House Baratheon", "House Lannister (later)"],
    outcome: "Six kingdoms united under Targaryen rule. King's Landing founded. The Iron Throne forged.",
    battles: [
      { name: "Battle of Gulltown", desc: "Aegon's first battle; his fleet shattered the Arryn naval forces in Gulltown harbor as his dragons set ships ablaze." },
      { name: "Battle of the Last Storm", desc: "Orys Baratheon defeated and slew Argilac the Arrogant, the last Storm King. House Baratheon was founded." },
      { name: "Field of Fire", desc: "The only battle where all three dragons fought together. The combined Lannister-Gardener army of 55,000 was shattered; 4,000 burned alive. King Mern Gardener perished and House Gardener was destroyed." },
      { name: "Battle of the Wailing Willows", desc: "A naval engagement along the Mander river where Targaryen allies crushed Reach holdouts." },
      { name: "Battle of the Reeds", desc: "Fought in the Neck against Tully-aligned forces resisting northern expansion." },
      { name: "Battle of the Three Sisters", desc: "Visenya Targaryen swept the Three Sisters with Vhagar to bring the Vale's outlying territories to heel." },
      { name: "Conquest of Harrenhal", desc: "Harren the Black refused to yield. Balerion the Black Dread melted Harrenhal's towers from within while men burned inside. House Hoare was annihilated." },
    ],
  },
  {
    id: "faith-militant", era: "Targaryen Dynasty", icon: "✝️", color: "#8e44ad",
    name: "Faith Militant Uprising",
    subtitle: "The Faith vs. House Targaryen",
    period: "41 – 48 AC",
    image: "/images/Battles/Faith Militant uprising.png",
    description: "The Faith Militant — the military arm of the Faith of the Seven — rose against the Targaryens over issues of incest and piety. They imprisoned King Maegor's nephew, sparked years of guerrilla warfare, and were only crushed when Maegor the Cruel offered amnesty then executed those who surrendered.",
    commanders: ["The High Septon (Faith Militant)", "The Poor Fellows", "The Warrior's Sons", "King Maegor I Targaryen"],
    outcome: "The Faith Militant was disbanded. The Faith's military arm was permanently disarmed until the Faith Militant's revival under the High Sparrow.",
    battles: [
      { name: "Battle of the Starry Sept", desc: "The original outbreak of open conflict; the Faith Militant attacked Targaryen loyalists in Oldtown's streets." },
      { name: "Siege of Oldtown", desc: "The Faith Militant fortified Oldtown, forcing Maegor to besiege the holiest city in the Seven Kingdoms." },
      { name: "Battle at the Great Fork", desc: "The Poor Fellows ambushed a Targaryen column. Dragon intervention ended the engagement decisively." },
      { name: "Sack of the Great Sept of Remembrance", desc: "Maegor and Balerion burned the Great Sept of Remembrance on the hill of Rhaenys. Three hundred Warrior's Sons died within." },
    ],
  },
  {
    id: "dance-of-dragons", era: "Targaryen Dynasty", icon: "⚔️", color: "#e8a020",
    name: "The Dance of the Dragons",
    subtitle: "Blacks vs. Greens — The Targaryen Civil War",
    period: "129 – 131 AC",
    image: "/images/Battles/Dance of the dragons.png",
    description: "The most devastating civil war in Westeros history. When King Viserys I died, his daughter Rhaenyra and son Aegon II both claimed the Iron Throne. The resulting war consumed nearly every dragon alive and broke House Targaryen forever. The war was named for the dragons that fought overhead.",
    commanders: ["Rhaenyra Targaryen (the Blacks)", "Aegon II Targaryen (the Greens)", "Daemon Targaryen", "Aemond Targaryen", "Corlys Velaryon"],
    outcome: "Pyrrhic victory for the Blacks. Aegon II was poisoned. Rhaenyra had already died. All dragons perished. House Targaryen entered terminal decline.",
    battles: [
      { name: "Battle of the Gullet", desc: "The Velaryon fleet and three dragons shattered a Lys/Myr/Tyrosh allied fleet in Blackwater Bay. The bloodiest naval battle of the era." },
      { name: "Battle of Rook's Rest", desc: "Princess Rhaenys rode Meleys to relieve Rook's Rest and was ambushed by both Aegon II on Sunfyre and Aemond on Vhagar. Meleys and Rhaenys perished. Sunfyre was gravely wounded." },
      { name: "Battle of the Honeywine", desc: "The Hightower armies marched on Bitterbridge and were routed by a Tyrell-led counterattack, denying the Greens the Reach." },
      { name: "First Battle of Tumbleton", desc: "Two dragonseeds betrayed the Blacks and turned their dragons against their own side. The Reach town of Tumbleton was sacked and burned." },
      { name: "Second Battle of Tumbleton", desc: "A Black counterattack retook Tumbleton but one of their dragons was slain. The town was reduced to ash." },
      { name: "Battle of the Lakeshore", desc: "The Lannister armies were routed attempting to march east toward King's Landing." },
      { name: "Storming of the Dragonpit", desc: "A smallfolk mob stormed the Dragonpit in King's Landing and slew four chained dragons. The mob was slaughtered in turn." },
      { name: "Battle Above the Gods Eye", desc: "Daemon Targaryen on Caraxes fought Aemond Targaryen on Vhagar above the Gods Eye lake. Both riders and both dragons perished. Their bones lie in the lake to this day." },
      { name: "Battle of the Kingsroad", desc: "The final land engagement of the Dance, as the Stark-led northern army marched south. King Aegon II was poisoned before they arrived." },
    ],
  },
  {
    id: "blackfyre-rebellions", era: "Targaryen Dynasty", icon: "🗡️", color: "#e74c3c",
    name: "The Blackfyre Rebellions",
    subtitle: "Five Rebellions of House Blackfyre",
    period: "196 – 260 AC",
    image: "/images/Battles/Blackfyre Rebellion.png",
    description: "A series of five rebellions over sixty years, led by the bastard descendants of King Aegon IV Targaryen. When Aegon IV legitimized all his bastards on his deathbed, he created a rival Targaryen claimant in Daemon Blackfyre. The Blackfyres challenged the Iron Throne five times over three generations.",
    commanders: ["Daemon Blackfyre", "Brynden Rivers (Bloodraven)", "Aegor Rivers (Bittersteel)", "Quentyn Ball (Fireball)", "The Golden Company"],
    outcome: "All five rebellions were crushed. The male Blackfyre line was extinguished. The Golden Company (founded by exiled Blackfyre supporters) survived as a sellsword company.",
    battles: [
      { name: "Battle of the Redgrass Field", desc: "The decisive battle of the First Blackfyre Rebellion. Daemon Blackfyre died here, cut down by a rain of arrows fired by Bloodraven and the Raven's Teeth. His twin sons died beside him." },
      { name: "Battle of Wendwater Bridge", desc: "An early engagement of the First Rebellion where Blackfyre forces swept aside loyalist defenders crossing the Wendwater." },
      { name: "Battle of the Mander", desc: "A riverine battle in the Reach during the Second Blackfyre Rebellion; loyalist forces repelled a Blackfyre river crossing." },
      { name: "Battle of the Ninepenny Kings", desc: "Part of the War of the Ninepenny Kings (Fifth Blackfyre Rebellion). Fought in the Stepstones. The young Barristan Selmy won his first knighthood here. Maelys the Monstrous, last male Blackfyre, was slain by Barristan." },
    ],
  },
  {
    id: "roberts-rebellion", era: "Modern Era", icon: "🦌", color: "#d4a017",
    name: "Robert's Rebellion",
    subtitle: "The War of the Usurper — Led by Robert Baratheon",
    period: "282 – 283 AC",
    image: "/images/Battles/Roberts Rebellion.jpg",
    description: "When Crown Prince Rhaegar Targaryen 'abducted' Lyanna Stark, her father and brother traveled to court to demand justice — and were burned alive by the Mad King Aerys II. Robert Baratheon, Ned Stark, Jon Arryn, and Hoster Tully raised their banners in revolt. Within a year the Targaryen dynasty that had ruled for nearly three centuries was ashes.",
    commanders: ["Robert Baratheon", "Eddard Stark", "Jon Arryn", "Hoster Tully", "Stannis Baratheon", "King Aerys II Targaryen (the Mad King)", "Prince Rhaegar Targaryen"],
    outcome: "Total Targaryen defeat. King Aerys II was slain by Jaime Lannister. Rhaegar died at the Trident. King's Landing was sacked. Robert Baratheon became King.",
    battles: [
      { name: "Battle of Summerhall", desc: "Robert Baratheon defeated three Targaryen loyalist armies in a single day, fighting three separate engagements on the same field." },
      { name: "Battle of Ashford", desc: "Robert was defeated and wounded by the Targaryen loyalists — one of his few setbacks in the war." },
      { name: "Battle of the Bells", desc: "Fought at Stoney Sept. Robert was sheltered by smallfolk while Ned Stark and Hoster Tully's forces arrived to rout the Targaryen army. Jon Connington was blamed for defeat." },
      { name: "Battle of the Trident", desc: "The decisive battle of the war. Robert faced Rhaegar Targaryen directly in single combat in the river. Robert caved in Rhaegar's chest with his warhammer, scattering the rubies of his armor across the Trident." },
      { name: "Sack of King's Landing", desc: "The Lannister army sacked King's Landing while the gates were opened to them. Jaime Lannister slew King Aerys II before he could ignite the wildfire caches beneath the city. Rhaegar's children were murdered." },
      { name: "Siege of Storm's End", desc: "Stannis Baratheon held Storm's End for over a year against Mace Tyrell's besieging army, surviving near starvation thanks to Davos Seaworth smuggling in onions." },
      { name: "Tower of Joy", desc: "Eddard Stark and six companions faced three remaining Kingsguard — including Ser Arthur Dayne, the Sword of the Morning — at the Tower of Joy in Dorne. All died except Ned, who found Lyanna within, dying in childbirth. Her son was Jon Snow." },
    ],
  },
  {
    id: "greyjoy-rebellion", era: "Modern Era", icon: "🦑", color: "#2c9a9a",
    name: "Greyjoy Rebellion",
    subtitle: "Led by Balon Greyjoy of the Iron Islands",
    period: "289 AC",
    image: "/images/Battles/Greyjoy Rebellion.png",
    description: "Nine years after the end of Robert's Rebellion, Balon Greyjoy declared independence and proclaimed himself King of the Iron Islands. The Ironborn launched devastating raids on the mainland coastlines. Robert Baratheon, with Ned Stark and Stannis, crushed the rebellion within a year. Balon's eldest son Rodrik died in battle; his youngest, Theon, was taken as a ward (hostage) to Winterfell.",
    commanders: ["Balon Greyjoy", "Victarion Greyjoy", "Robert Baratheon", "Eddard Stark", "Stannis Baratheon"],
    outcome: "Greyjoy defeat. Balon bent the knee. Theon Greyjoy taken as hostage. The Ironborn returned to submission under the Iron Throne.",
    battles: [
      { name: "Battle of Seagard", desc: "Rodrik Greyjoy led the assault on Seagard but was slain by Lord Jason Mallister in single combat. A devastating blow to the Greyjoy cause." },
      { name: "Battle of Fair Isle", desc: "Stannis Baratheon destroyed the Greyjoy fleet in a devastating naval engagement, crushing Ironborn sea power and opening the Iron Islands to invasion." },
      { name: "Battle of Lordsport", desc: "Robert, Ned Stark, and their forces stormed Lordsport on Great Wyk island. The Ironborn defenders were routed." },
      { name: "Siege of Pyke", desc: "Robert's forces besieged the Greyjoy seat of Pyke. Bombardment breached the walls; Ned Stark, Robert, and Jorah Mormont led the assault. The castle fell. Balon Greyjoy surrendered." },
    ],
  },
  {
    id: "war-of-five-kings", era: "Modern Era", icon: "👑", color: "#9b59b6",
    name: "War of the Five Kings",
    subtitle: "The Main War — Five Kings, One Throne",
    period: "298 – 300 AC",
    image: "/images/Battles/War of five kings.png",
    description: "The catastrophic war that consumed the Seven Kingdoms during the events of Game of Thrones. Five men simultaneously claimed kingship: Joffrey Baratheon held King's Landing, Robb Stark rose as King in the North, Stannis Baratheon claimed his right by birth, Renly Baratheon raised the south, and Balon Greyjoy again proclaimed himself King of the Iron Islands. The realm bled for years.",
    commanders: ["Robb Stark (King in the North)", "Joffrey Baratheon (King on the Iron Throne)", "Stannis Baratheon (King by Right)", "Renly Baratheon (King of the Reach & Stormlands)", "Balon Greyjoy (King of the Iron Islands)"],
    outcome: "All five kings died. No definitive victor. Joffrey, Robb, Renly, and Balon were all slain. Stannis died at Winterfell. Tommen Baratheon briefly ruled before Cersei took the throne.",
    battles: [
      { name: "Battle of the Whispering Wood", desc: "Robb Stark's cavalry ambushed Jaime Lannister's force in the trees. Jaime was personally captured by Robb. Stark forces suffered major losses drawing Jaime's attention." },
      { name: "Battle of the Camps", desc: "While Robb engaged Jaime, his remaining forces destroyed the Lannister main camp across the Green Fork. Roose Bolton devastated the Lannister siege of Riverrun." },
      { name: "Battle of the Green Fork", desc: "Tywin Lannister's massive main army defeated a feint force led by Roose Bolton. Bolton survived; thousands did not." },
      { name: "Battle of Oxcross", desc: "Robb Stark crushed a Lannister army under Stafford Lannister in the Westerlands, taking the fight directly to Lannister lands." },
      { name: "Battle of the Yellow Fork", desc: "Another Stark victory in the Westerlands, further ravaging Lannister territories." },
      { name: "Battle of the Fords", desc: "Robb Stark attempted to hold the Trident fords. Only Edmure Tully succeeded at his ford, denying Tywin's crossing — though it inadvertently prevented Robb from springing his trap." },
      { name: "Battle of the Blackwater", desc: "Stannis Baratheon's massive fleet attacked King's Landing by sea. Tyrion Lannister deployed the wildfire chain. Half the fleet was incinerated. The Lannister-Tyrell alliance arrived to crush Stannis's remaining forces on the banks." },
      { name: "Red Wedding", desc: "Not a battle but a massacre. Robb Stark, Catelyn Tully, and the northern army were murdered by the Freys and Boltons during a wedding feast — orchestrated by Tywin Lannister." },
      { name: "Battle of Castle Black", desc: "Mance Rayder's hundred-thousand-strong wildling army assaulted the Wall from both sides simultaneously. The Night's Watch held until Stannis Baratheon arrived to destroy the wildling host." },
      { name: "Battle of the Blackwater (Ironborn)", desc: "Ironborn forces under Victarion Greyjoy seized Moat Cailin and raided the western coasts while the northern army fought in the south." },
      { name: "Battle of the Bastards", desc: "Ramsay Bolton versus Jon Snow outside Winterfell. Jon's forces were nearly annihilated before Sansa Stark arrived with the Knights of the Vale. Ramsay was captured and fed to his own hounds." },
    ],
  },
];

/* ═══ EMBER PARTICLES ═══ */
function EmberParticles({ color }) {
  const embers = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 3 }}>
      {embers.map(i => (
        <div key={i} style={{
          position: "absolute",
          width: `${2 + (i % 3)}px`,
          height: `${2 + (i % 3)}px`,
          borderRadius: "50%",
          background: i % 4 === 0 ? "#fff8e1" : color,
          left: `${8 + (i * 7.4) % 85}%`,
          bottom: `${10 + (i * 13) % 60}%`,
          opacity: 0,
          boxShadow: `0 0 6px ${color}`,
          animation: `emberFloat${i % 3} ${1.8 + (i % 4) * 0.6}s ease-in ${(i * 0.22) % 1.5}s infinite`,
        }} />
      ))}
    </div>
  );
}

/* ═══ SMOKE PARTICLES ═══ */
function SmokeParticles() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 2 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute",
          width: `${60 + i * 30}px`,
          height: `${60 + i * 30}px`,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(180,170,160,0.12) 0%, transparent 70%)",
          left: `${15 + i * 28}%`,
          bottom: `${5 + i * 8}%`,
          animation: `smokeRise ${3 + i}s ease-out ${i * 0.8}s infinite`,
          opacity: 0,
        }} />
      ))}
    </div>
  );
}

/* ═══ BATTLES PAGE ═══ */
function BattlesPage() {
  const [sel, setSel] = useState(null);
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ minHeight: "100vh", padding: "7rem 2rem 5rem", position: "relative" }}>
      <style>{`
        @keyframes emberFloat0 {
          0%   { opacity: 0; transform: translateY(0) translateX(0) scale(1); }
          20%  { opacity: 0.9; }
          80%  { opacity: 0.6; }
          100% { opacity: 0; transform: translateY(-80px) translateX(12px) scale(0.3); }
        }
        @keyframes emberFloat1 {
          0%   { opacity: 0; transform: translateY(0) translateX(0) scale(1); }
          25%  { opacity: 1; }
          75%  { opacity: 0.5; }
          100% { opacity: 0; transform: translateY(-65px) translateX(-18px) scale(0.2); }
        }
        @keyframes emberFloat2 {
          0%   { opacity: 0; transform: translateY(0) translateX(0) scale(1); }
          30%  { opacity: 0.8; }
          85%  { opacity: 0.4; }
          100% { opacity: 0; transform: translateY(-95px) translateX(6px) scale(0.15); }
        }
        @keyframes smokeRise {
          0%   { opacity: 0; transform: translateY(0) scale(1); }
          30%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(-120px) scale(2.5); }
        }
        @keyframes warBannerWave {
          0%,100% { transform: skewX(0deg) scaleX(1); }
          25%      { transform: skewX(1.5deg) scaleX(1.01); }
          75%      { transform: skewX(-1.5deg) scaleX(0.99); }
        }
        @keyframes battleGlow {
          0%,100% { box-shadow: 0 0 20px var(--war-color-glow), 0 8px 32px rgba(0,0,0,0.6); }
          50%     { box-shadow: 0 0 45px var(--war-color-glow), 0 8px 40px rgba(0,0,0,0.7); }
        }
        @keyframes swordSlash {
          0%   { opacity: 0; transform: rotate(-45deg) scaleX(0); }
          50%  { opacity: 0.6; }
          100% { opacity: 0; transform: rotate(-45deg) scaleX(3); }
        }
        .war-hero-card {
          cursor: pointer;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease;
          border: 1px solid rgba(212,175,55,0.18);
        }
        .war-hero-card:hover {
          transform: translateY(-6px) scale(1.008);
        }
        .war-hero-card.is-selected {
          border-color: var(--war-color-border);
          animation: battleGlow 2.5s ease-in-out infinite;
        }
        .battle-hero-img {
          transition: transform 7s cubic-bezier(0.23,1,0.32,1);
          transform: scale(1);
        }
        .war-hero-card:hover .battle-hero-img {
          transform: scale(1.1);
        }
        .war-hero-card.is-selected .battle-hero-img {
          transform: scale(1.05);
        }
        .battle-item-row { transition: background 0.2s; }
        .battle-item-row:hover { background: rgba(255,255,255,0.06) !important; }
        .war-banner-stripe {
          animation: warBannerWave 4s ease-in-out infinite;
          transform-origin: left center;
        }
        .sword-slash {
          position: absolute;
          top: 50%; left: 20%;
          width: 40%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent);
          transform: rotate(-45deg);
          pointer-events: none;
          z-index: 4;
          animation: swordSlash 0.5s ease forwards;
        }
      `}</style>

      {/* Page Header */}
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{
            fontFamily: "'Cinzel Decorative',serif", fontSize: "clamp(1.6rem,4vw,2.8rem)",
            color: "#d4af37", marginBottom: "0.6rem",
            textShadow: "0 0 60px rgba(212,175,55,0.4), 0 2px 4px rgba(0,0,0,0.8)",
          }}>The Great Wars</div>
          <div style={{ fontFamily: "'Crimson Text',serif", fontStyle: "italic", fontSize: "1.15rem", color: "rgba(255,255,255,0.45)" }}>
            Eight thousand years of blood, fire, and conquest
          </div>
          <div style={{ width: "120px", height: "1px", background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.6),transparent)", margin: "1.4rem auto 0" }} />
        </div>

        {/* War Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: "1.5rem" }}>
          {WARS.map((war) => (
            <div key={war.id}>
              {/* Hero Card */}
              <div
                className={`war-hero-card${sel?.id === war.id ? " is-selected" : ""}`}
                style={{
                  "--war-color-glow": `${war.color}40`,
                  "--war-color-border": `${war.color}60`,
                }}
                onClick={() => setSel(sel?.id === war.id ? null : war)}
                onMouseEnter={() => setHovered(war.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Hero Image Area */}
                <div style={{ position: "relative", height: "240px", overflow: "hidden", background: `radial-gradient(ellipse at center, ${war.color}25, #0a0a0f)` }}>
                  {war.image && (
                    <img
                      className="battle-hero-img"
                      src={war.image}
                      alt={war.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                    />
                  )}
                  {/* Dark gradient overlay */}
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(10,10,15,0.1) 0%, rgba(10,10,15,0.25) 40%, rgba(10,10,15,0.92) 100%)` }} />
                  {/* Color tint overlay */}
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${war.color}15 0%, transparent 60%)`, mixBlendMode: "screen" }} />
                  {/* Animated banner stripe */}
                  <div className="war-banner-stripe" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, transparent, ${war.color}, transparent)` }} />
                  {/* Ember particles on hover */}
                  {hovered === war.id && <EmberParticles color={war.color} />}
                  {hovered === war.id && <SmokeParticles />}
                  {/* Sword slash on select */}
                  {sel?.id === war.id && <div className="sword-slash" />}
                  {/* Overlay Text */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem 1.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                      <div style={{ background: `${war.color}25`, border: `1px solid ${war.color}55`, borderRadius: "20px", padding: "0.1rem 0.7rem", fontSize: "0.58rem", fontFamily: "'Cinzel',serif", color: war.color, letterSpacing: "0.12em", backdropFilter: "blur(8px)" }}>{war.era.toUpperCase()}</div>
                      <div style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "0.1rem 0.7rem", fontSize: "0.56rem", fontFamily: "'Cinzel',serif", color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em", backdropFilter: "blur(8px)" }}>{war.period}</div>
                      <div style={{ marginLeft: "auto", background: "rgba(0,0,0,0.4)", border: `1px solid ${war.color}35`, borderRadius: "20px", padding: "0.1rem 0.7rem", fontSize: "0.56rem", fontFamily: "'Cinzel',serif", color: war.color, letterSpacing: "0.1em", backdropFilter: "blur(8px)" }}>{war.battles.length} BATTLES</div>
                    </div>
                    <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "clamp(1rem,2.5vw,1.4rem)", color: "#fff", textShadow: `0 0 30px ${war.color}80, 0 2px 8px rgba(0,0,0,0.9)`, lineHeight: 1.2, marginBottom: "0.3rem" }}>
                      {war.icon} {war.name}
                    </div>
                    <div style={{ fontFamily: "'Crimson Text',serif", fontStyle: "italic", fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{war.subtitle}</div>
                  </div>
                  {/* Selected indicator */}
                  {sel?.id === war.id && (
                    <div style={{ position: "absolute", top: "1rem", right: "1rem", width: "28px", height: "28px", borderRadius: "50%", background: `${war.color}30`, border: `1px solid ${war.color}80`, display: "flex", alignItems: "center", justifyContent: "center", color: war.color, fontSize: "0.7rem", backdropFilter: "blur(8px)" }}>▼</div>
                  )}
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {sel?.id === war.id && (
                <div style={{
                  marginTop: "4px",
                  background: `linear-gradient(180deg, ${war.color}0a, rgba(10,10,15,0.97))`,
                  border: `1px solid ${war.color}30`,
                  borderRadius: "0 0 16px 16px",
                  backdropFilter: "blur(16px)",
                  overflow: "hidden",
                  animation: "fadeUp 0.35s ease",
                }}>
                  {/* Detail image strip */}
                  <div style={{ position: "relative", height: "120px", overflow: "hidden" }}>
                    {war.image && <img src={war.image} alt={war.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", filter: "blur(2px) brightness(0.4)" }} />}
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${war.color}30, transparent 60%)` }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 2rem", gap: "1rem" }}>
                      <div style={{ fontSize: "2.5rem", filter: `drop-shadow(0 0 20px ${war.color})` }}>{war.icon}</div>
                      <div>
                        <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "1.1rem", color: war.color, textShadow: `0 0 20px ${war.color}60` }}>{war.name}</div>
                        <div style={{ fontFamily: "'Crimson Text',serif", fontStyle: "italic", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>Detailed Chronicle</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "2rem 2rem" }}>
                    <p style={{ fontFamily: "'Crimson Text',serif", fontSize: "1.05rem", lineHeight: 1.82, color: "rgba(255,255,255,0.75)", marginBottom: "1.75rem" }}>{war.description}</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
                      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "1.25rem", border: `1px solid ${war.color}15`, position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, width: "3px", height: "100%", background: `linear-gradient(180deg, ${war.color}, transparent)` }} />
                        <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.58rem", color: war.color, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.9rem", paddingLeft: "0.75rem" }}>Commanders</div>
                        {war.commanders.map(c => <div key={c} style={{ fontFamily: "'Crimson Text',serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.65)", marginBottom: "0.3rem", paddingLeft: "0.75rem" }}>⚔ {c}</div>)}
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "1.25rem", border: `1px solid ${war.color}15`, position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, width: "3px", height: "100%", background: `linear-gradient(180deg, #d4af37, transparent)` }} />
                        <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.58rem", color: "rgba(212,175,55,0.7)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.9rem", paddingLeft: "0.75rem" }}>Outcome</div>
                        <div style={{ fontFamily: "'Crimson Text',serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.65, paddingLeft: "0.75rem" }}>{war.outcome}</div>
                      </div>
                    </div>

                    <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.6rem", color: "rgba(212,175,55,0.55)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      Notable Battles
                      <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(212,175,55,0.3), transparent)" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      {war.battles.map((b, bi) => (
                        <div key={bi} className="battle-item-row" style={{ display: "flex", gap: "1rem", alignItems: "flex-start", background: `${war.color}06`, borderRadius: "10px", padding: "0.9rem 1.1rem", border: `1px solid ${war.color}18`, transition: "background 0.2s" }}>
                          <div style={{ flexShrink: 0, width: "24px", height: "24px", borderRadius: "50%", background: `${war.color}20`, border: `1px solid ${war.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cinzel',serif", fontSize: "0.6rem", color: war.color, marginTop: "0.1rem" }}>{bi + 1}</div>
                          <div>
                            <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.78rem", color: war.color, marginBottom: "0.3rem", letterSpacing: "0.04em" }}>{b.name}</div>
                            <div style={{ fontFamily: "'Crimson Text',serif", fontSize: "0.93rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.65 }}>{b.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function GlobalVideoBackground({ page }) {
  const videoRef = useRef(null);
  const isHome = page === "home";
  const src = isHome ? "/Home.mp4" : "/2.mp4";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "#0a0a0f", overflow: "hidden", pointerEvents: "none" }}>
      <video
        key={src}
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: isHome ? 0.45 : 0.28, transition: "opacity 1s ease" }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,15,0.5) 0%, rgba(10,10,15,0.2) 40%, rgba(10,10,15,0.6) 75%, rgba(10,10,15,0.9) 100%)" }} />
    </div>
  );
}

/* ═══ ROOT ═══ */
export default function App() {
  const [page, setPage] = useState("home");
  const [scrollY, setScrollY] = useState(0);

  const navigate = useCallback((p) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setPage(p), 120);
  }, []);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });

    // Check for character param in URL
    const params = new URLSearchParams(window.location.search);
    const charId = params.get("char");
    if (charId) {
      setPage("char-detail-" + charId);
    }

    return () => window.removeEventListener("scroll", handler);
  }, []);

  const PAGES = {
    home: HomePage, map: MapPage, houses: HousesPage,
    characters: CharactersPage, weapons: WeaponsPage,
    battles: BattlesPage, quotes: QuotesPage,
    timeline: TimelinePage,
  };

  const renderPage = () => {
    if (page.startsWith("shows-")) {
      const showId = page.replace("shows-", "");
      return <ShowsPage showId={showId} setPage={navigate} />;
    }
    if (page.startsWith("char-detail-")) {
      const charId = page.replace("char-detail-", "");
      return <CharacterDetailPage charId={charId} />;
    }
    const PageComponent = PAGES[page] || HomePage;
    return <PageComponent setPage={navigate} />;
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(150deg,#0a0a0f 0%,#0c0c12 35%,#0b0b10 65%,#0a0a0f 100%)", color: "#fff", fontFamily: "'Crimson Text',serif", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;500;600&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body { background: #0a0a0f; }
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#0a0a0f}
        ::-webkit-scrollbar-thumb{background:rgba(212,175,55,0.28);border-radius:3px}
        @keyframes scrollBob{0%,100%{opacity:0.4;transform:scaleY(1)}50%{opacity:1;transform:scaleY(1.15)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatSigil{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-20px) rotate(3deg)}50%{transform:translateY(-8px) rotate(-2deg)}75%{transform:translateY(-25px) rotate(1deg)}}
        @keyframes filmGrain {
          0%   { background-position: 0% 0%; }
          20%  { background-position: 40% 10%; }
          40%  { background-position: 80% 40%; }
          60%  { background-position: 20% 70%; }
          80%  { background-position: 60% 30%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes grainFlicker {
          0%,100% { opacity: 0.032; }
          50%      { opacity: 0.045; }
        }
      `}</style>



      {/* Parchment UI texture — bg_lordui_002 as subtle section divider across entire page */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "4px", zIndex: 250, pointerEvents: "none",
        background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.15) 30%, rgba(212,175,55,0.25) 50%, rgba(212,175,55,0.15) 70%, transparent)",
      }} />

      <GlobalVideoBackground page={page} />
      <Particles />
      <CursorSparkles />
      <Nav page={page} setPage={navigate} />

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 80, scale: 0.96, filter: "blur(15px) brightness(0.3)" }}
          animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px) brightness(1)" }}
          exit={{ opacity: 0, x: -80, scale: 1.04, filter: "blur(15px) brightness(0.3)", transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "relative", zIndex: 1, width: "100%", transformOrigin: "center center" }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      {page !== "home" && (
        <footer style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "3rem 2rem 2rem", borderTop: "1px solid rgba(212,175,55,0.08)" }}>
          {/* Section divider texture strip */}
          <div style={{
            width: "100%", height: "80px", marginBottom: "1.5rem",
            backgroundImage: "url('/images/Images and extra textures/bg_lordui_002.png')",
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 0.07, borderRadius: "4px",
          }} />
          <div style={{ fontSize: "1.1rem", color: "rgba(212,175,55,0.3)", marginBottom: "0.6rem" }}>⚔️</div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.58rem", letterSpacing: "0.25em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase" }}>Valar Morghulis · All Men Must Die · Throne © MMXXVI</div>
        </footer>
      )}
    </div>
  );
}
