# WiseOwl Brandbook

## 1. Brand Colors

### Primary Palette

| Role    | Name         | Hex       | Meaning                   |
| ------- | ------------ | --------- | ------------------------- |
| Primary | Owl Gold     | `#F2B705` | Wisdom, focus, trust      |
| Dark    | Midnight Ink | `#1C1E26` | Intelligence, seriousness |
| Neutral | Parchment    | `#F7F5F0` | Documents, clarity        |
| Accent  | Scholar Blue | `#2C5CC5` | Knowledge, links, actions |
| Success | Sage Green   | `#2FA36B` | Completion, calm          |
| Danger  | Legal Red    | `#C94242` | Warnings, compliance      |

### Dark Mode Mapping

- Background: `#0E0F14`
- Surface: `#1C1E26`
- Text primary: `#EDEDED`
- Owl Gold stays unchanged (brand anchor)

Rule: Owl Gold is never muted or disabled. It is the "mind spark."

---

## 2. Mascot Usage Rules

### Allowed

- Landing pages
- Onboarding screens
- Empty states ("No tasks yet")
- AI responses / assistants
- Docs and blog illustrations
- Social media

### Restricted

- Dashboard headers (small icon only)
- Legal documents (icon only, no character pose)

### Forbidden

- Error states (use neutral icons)
- Security alerts
- Anything that implies legal judgment or authority

### Personality Rules

- Wise, calm, slightly playful
- Never sarcastic
- Never childish
- Never expressive during failures

Mascot emotion scale:

😐 → 🙂 → 🤔 → 🙂‍💡  
Never beyond that.

---

## 3. SVG Logo (Clean, Flat, Recolorable)

This SVG works as a favicon, header icon, or future animation base.

```svg
<svg
  width="120"
  height="120"
  viewBox="0 0 120 120"
  xmlns="http://www.w3.org/2000/svg"
  aria-label="WiseOwl logo"
  role="img"
>
  <!-- Head -->
  <circle cx="60" cy="60" r="48" fill="#1C1E26"/>

  <!-- Face -->
  <ellipse cx="60" cy="68" rx="30" ry="26" fill="#F7F5F0"/>

  <!-- Eyes -->
  <circle cx="45" cy="60" r="10" fill="#F2B705"/>
  <circle cx="75" cy="60" r="10" fill="#F2B705"/>

  <circle cx="45" cy="60" r="5" fill="#1C1E26"/>
  <circle cx="75" cy="60" r="5" fill="#1C1E26"/>

  <!-- Glasses -->
  <circle cx="45" cy="60" r="13" stroke="#F2B705" stroke-width="2" fill="none"/>
  <circle cx="75" cy="60" r="13" stroke="#F2B705" stroke-width="2" fill="none"/>
  <line x1="58" y1="60" x2="62" y2="60" stroke="#F2B705" stroke-width="2"/>

  <!-- Beak -->
  <polygon points="60,70 54,80 66,80" fill="#F2B705"/>

  <!-- Subtle thinking mark -->
  <circle cx="85" cy="35" r="3" fill="#F2B705"/>
  <circle cx="92" cy="28" r="2" fill="#F2B705"/>
</svg>
```

Tailwind-friendly usage:

- Replace fills with `currentColor` for icons
- Wrap in `<span className="text-amber-400">`

---

## 4. Sub-brand Mapping

| Product                | Mascot Variant               |
| ---------------------- | ---------------------------- |
| wiseowl.info           | Base owl (neutral)           |
| lexdraft.info          | Owl + subtle book/scale icon |
| swiftcall.wiseowl      | Owl + headset icon           |
| pulsetasks.wiseowl     | Owl + checklist dot          |
| postmanpigeons.wiseowl | Owl + envelope               |

Rule: One owl. Accessories change, face never changes.

---

## 5. Brand Sentence

**WiseOwl**  
Tools that think with you.

---

## 6. Why This Works

- Cute enough for humans
- Serious enough for lawyers
- Neutral enough for enterprises
- Distinct enough to remember
- Flexible enough to evolve
