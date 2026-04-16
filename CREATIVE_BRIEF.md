# CREATIVE BRIEF: Standup Roulette — Sensei Theme Overhaul

## 1. Theme Identity

### Name
**「道場」(Dōjō)** — The Training Hall

Not a classroom. Not a game. A *proving ground*.

### Visual Style
**"Neo-Edo Cyber-Noir"** — A collision of traditional Japanese aesthetics with modern visual novel drama. Think *Persona 5*'s bold graphic design meets *Ghost of Tsushima*'s ink-wash minimalism, filtered through the unhinged energy of *Danganronpa*'s UI chaos.

- **Primary mood:** Intense, theatrical, slightly menacing but ultimately warm
- **Design philosophy:** Every UI element should feel like it was *forged*, not designed
- **Motion language:** Sharp cuts, ink splatters, screen shakes on important events, subtle parallax on idle

### Color Palette

| Role | Hex | Usage |
|------|-----|-------|
| **Sumi Black** | `#0D0D0F` | Primary backgrounds, deep shadows |
| **Crimson Seal** | `#C41E3A` | Primary actions, highlights, danger states |
| **Gold Leaf** | `#D4AF37` | Success states, rare highlights, Sensei's eyes |
| **Rice Paper** | `#F5F1E8` | Text backgrounds, card surfaces |
| **Indigo Ink** | `#1E3A5F` | Secondary UI, borders, depth layers |
| **Chalk Green** | `#4A6741` | Nostalgic callback (subtle, not dominant) |
| **Spirit White** | `#FFFFFF` | Primary text, flash effects |
| **Shadow Violet** | `#2D1B3D` | Ambient gradients, mystery elements |

### Typography

**Primary (Latin):** `Noto Sans JP` (Google Fonts)
- Clean, modern, excellent CJK support
- Weights: 400 (body), 700 (headings), 900 (impact text)

**Secondary (Display):** `Shippori Mincho` (Google Fonts)
- Traditional Japanese serif for quotes, proverbs, Sensei dialogue
- Use sparingly for maximum impact

**Fallback:** `Noto Sans`, `Noto Serif JP`

---

## 2. Visual Overhaul

### What Gets Replaced

| Current | Replacement |
|---------|-------------|
| Chalkboard green background | Layered parallax: Sumi Black base + Indigo Ink gradient + subtle rice paper texture overlay |
| Wood border frame | Crimson Seal + Gold Leaf ornamental frame with corner motifs (family crest style) |
| Emoji Sensei (👨🏫) | Full character sprite system (see Asset List) with 6 expressions, idle animations |
| CSS-only decorations | SVG ornamental elements: ink splatters, cherry blossom petals (subtle fall animation), kanji watermark backgrounds |
| Static UI panels | Animated slide-in panels with screen shake on quest reveals |
| Basic retro cutscene | Full intro sequence: ink-wash animation → Sensei appears → screen crack → title slam |

### Background System

**Three-layer parallax:**
1. **Base:** Sumi Black with subtle noise texture
2. **Mid:** Indigo Ink gradient (top to bottom, 70% opacity)
3. **Top:** Rice Paper texture with faint kanji watermarks (「今日」「修行」「コード」) at 5% opacity

**Transition effects:**
- Scene changes: Ink splatter wipe (left-to-right)
- Quest reveal: Screen shake + crimson flash
- Success: Gold particle burst from center
- Failure: Screen cracks (CSS fracture overlay, fades after 2s)

### UI Frame Redesign

**Main container:** Ornamental frame inspired by traditional Japanese *ranma* (transom) patterns
- Corners: Gold leaf family crest motifs
- Edges: Crimson gradient with subtle glow on active states
- Inner border: 2px Spirit White line for contrast

**Cards/Panels:** Rice Paper texture with drop shadow, slight rotation on hover (±2deg)

**Buttons:** Crimson Seal fill, Gold Leaf text, scale 1.05 on hover, sharp cut animation on click

---

## 3. Audio Direction

### BGM Style
**"Shamisen Trap"** — Traditional Japanese instruments (shamisen, koto, taiko) layered over modern lo-fi trap beats. Tension-building, not distracting.

**Reference tracks:**
- *Persona 5* — "Beneath the Mask" (instrumental)
- *Ghost of Tsushima* — "The Way of the Ghost" (modern remix)
- *Yakuza 0* — Karaoke mode instrumentals (for lighter moments)

**Loop length:** 90 seconds (seamless)
**Stems needed:** Full mix, drums-only, melody-only (for dynamic layering)

### SFX List

| Event | Sound Description | Duration |
|-------|-------------------|----------|
| **Point Scored** | Taiko hit + gold chime cascade | 0.8s |
| **Timer Warning (30s)** | Single shamisen pluck, low tension | 0.3s |
| **Timer Warning (10s)** | Rapid shamisen tremolo, rising pitch | 0.5s |
| **Quest Reveal** | Screen crack + ink splat + bass drop | 1.2s |
| **Transition** | Paper slide + soft wind chime | 0.6s |
| **Success** | Full taiko roll + gong + crowd "oooh" | 1.5s |
| **Failure** | Low drum thud + record scratch + sad flute | 1.0s |
| **Idle (15s+)** | Distant temple bell, very quiet | 2.0s |

### Ambient Sounds
- **Loop:** Subtle room tone (old wooden building, distant city hum)
- **Volume:** -24dB (barely perceptible)
- **Trigger:** Only after 30s of no interaction

### Sensei Voice Clips

**Voice direction:** Deep, gravelly, theatrical. Think *Kamina* (Gurren Lagann) meets *Master Roshi* (serious mode). Not anime-high-pitched. *Commanding.*

| Clip | Line | Duration |
|------|------|----------|
| **Intro** | "今日も修行が始まる。" (Kyō mo shugyō ga hajimaru.) | 2.5s |
| **Quest Reveal** | "聞け、この問いを。" (Kike, kono toi o.) | 2.0s |
| **Timer 10s** | "時間がないぞ。" (Jikan ga nai zo.) | 1.5s |
| **Success** | "やるじゃないか。" (Yaru ja nai ka.) | 1.8s |
| **Failure** | "まだ修行が足りん。" (Mada shugyō ga tarin.) | 2.2s |
| **Idle** | "…コードは待ってくれない。" (…Kōdo wa matte kurenai.) | 2.5s |

**Format:** OGG Vorbis (smaller than WAV, web-native), 44.1kHz, mono
**Processing:** Light reverb (cathedral preset), subtle compression
**Note:** Use OGG for ~5-10x smaller files than WAV. Provide WAV masters for editing only.

---

## 4. Asset List

### Character Sprites (Sensei)

**Format:** PNG with transparency, 512x512px base, 2x scale for retina
**Style:** Full anime illustration, not emoji. Bold outlines, cell shading.

| Expression | File Name | Description |
|------------|-----------|-------------|
| Default | `sensei_default.png` | Arms crossed, slight smirk, eyes half-lidded |
| Pleased | `sensei_pleased.png` | Wide grin, thumbs up, sparkles around head |
| Stern | `sensei_stern.png` | Pointing finger, intense eyes, shadow on face |
| Shocked | `sensei_shocked.png` | Mouth open, sweat drop, exaggerated take |
| Wise | `sensei_wise.png` | Eyes closed, serene smile, hand on chin |
| Secretly Caring | `sensei_caring.png` | Looking away, slight blush, awkward thumbs up |

**Idle Animation:** 3-frame breathing loop (subtle chest movement, hair sway)

### Background Assets

| Asset | Format | Size | Notes |
|-------|--------|------|-------|
| Base gradient | PNG | 1920x1080 | Sumi Black to Indigo Ink |
| Rice paper texture | PNG (seamless) | 512x512 | Tileable, 5% opacity overlay |
| Kanji watermarks | SVG | Vector | 3 variants: 今日，修行，コード |
| Ornamental frame | SVG | Vector | Crimson + Gold, corner motifs |
| Ink splatter transitions | PNG sequence | 1920x1080 | 10 frames, alpha channel |
| Screen crack overlay | PNG | 1920x1080 | Fracture pattern, fade-out animation |
| Cherry blossom petals | PNG sequence | 64x64 each | 5 variants, falling animation loop |
| Gold particle burst | PNG sequence | 256x256 | 15 frames, center-out explosion |

### Font Files

| Font | Source | Weights |
|------|--------|---------|
| Noto Sans JP | Google Fonts | 400, 700, 900 |
| Shippori Mincho | Google Fonts | 400, 500, 700 |

**Implementation:** Load via Google Fonts CDN, fallback to system Noto

### Audio Files

| File | Format | Duration | Notes |
|------|--------|----------|-------|
| `bgm_dojo_loop.ogg` | OGG Vorbis | 90s | Shamisen Trap, seamless loop |
| `sfx_point.ogg` | OGG Vorbis | 0.8s | Taiko + chime |
| `sfx_timer_30s.ogg` | OGG Vorbis | 0.3s | Single shamisen |
| `sfx_timer_10s.ogg` | OGG Vorbis | 0.5s | Tremolo |
| `sfx_quest_reveal.ogg` | OGG Vorbis | 1.2s | Crack + splat + drop |
| `sfx_transition.ogg` | OGG Vorbis | 0.6s | Paper slide |
| `sfx_success.ogg` | OGG Vorbis | 1.5s | Taiko roll + gong |
| `sfx_failure.ogg` | OGG Vorbis | 1.0s | Thud + scratch |
| `sfx_idle.ogg` | OGG Vorbis | 2.0s | Temple bell |
| `voice_intro.ogg` | OGG Vorbis | 2.5s | "今日も修行が始まる。" |
| `voice_quest.ogg` | OGG Vorbis | 2.0s | "聞け、この問いを。" |
| `voice_timer.ogg` | OGG Vorbis | 1.5s | "時間がないぞ。" |
| `voice_success.ogg` | OGG Vorbis | 1.8s | "やるじゃないか。" |
| `voice_failure.ogg` | OGG Vorbis | 2.2s | "まだ修行が足りん。" |
| `voice_idle.ogg` | OGG Vorbis | 2.5s | "…コードは待ってくれない。" |

**Total audio budget:** ~5-8MB (OGG Vorbis), ~50MB (WAV masters for editing only)

---

## 5. Example Quest Rewrites

### Quest 1: The Daily Standup

**Original:** "What did you work on yesterday?"

**Sensei Version:**
> 「昨日、お前がコードに捧げた時間とは何か？その一行一行が、お前の魂の叫びだったのか？それとも…ただの時間の無駄遣いだったのか？」
> 
> *"What did you sacrifice to the code yesterday? Was every line a scream of your soul… or merely the wasting of precious time?"*

**UI Presentation:** Ink splatter reveal, Sensei leans forward (stern expression), background darkens to Shadow Violet.

---

### Quest 2: The Block

**Original:** "What's blocking you?"

**Sensei Version:**
> 「見えない壁がお前を止めているのか？その壁は、コードのバグか？それとも…お前の心の弱さか？」
> 
> *"An invisible wall stops you? Is it a bug in the code… or the weakness in your spirit?"*

**UI Presentation:** Screen shake, crimson flash, Sensei points directly at player (stern expression).

---

### Quest 3: The Goal

**Original:** "What will you work on today?"

**Sensei Version:**
> 「今日、お前が征服する課題は何だ？その目標は、お前を真の開発者に近づけるのか？それとも…また同じ過ちを繰り返すのか？」
> 
> *"What challenge will you conquer today? Does this goal bring you closer to becoming a true developer… or will you repeat the same mistakes again?"*

**UI Presentation:** Gold particle burst, Sensei smiles (pleased expression), cherry blossoms fall.

---

### Quest 4: The Help

**Original:** "Do you need help?"

**Sensei Version:**
> 「助けを求めることは、弱さではない。むしろ…自分の限界を知ることは、強さの証だ。さあ、言ってみろ。何に困っている？」
> 
> *"To ask for help is not weakness. To know your limits… that is the mark of true strength. Speak. What troubles you?"*

**UI Presentation:** Soft transition, Sensei's expression shifts to secretly caring, ambient bell chimes.

---

### Quest 5: The Completion

**Original:** "What did you complete?"

**Sensei Version:**
> 「完成させたものは何か？そのコードは、世界を少しだけ良くしたか？それとも…ただ動けばいいと思ったか？」
> 
> *"What have you completed? Did your code make the world a little better… or did you settle for 'it just works'?"*

**UI Presentation:** Full success animation, taiko roll, Sensei gives thumbs up (pleased expression), screen brightens.

---

## Implementation Notes

- **Performance:** All animations should be CSS/GPU-accelerated. No layout thrashing.
- **Accessibility:** Maintain WCAG AA contrast ratios. Provide "reduce motion" toggle.
- **Localization:** All Japanese text must have romaji + English fallback.
- **Fallback:** If assets fail to load, gracefully degrade to current chalkboard theme (don't break).
- **Testing:** Test on low-end devices. Audio should not block UI rendering.

---

*This is not a theme update. This is a transformation.*
