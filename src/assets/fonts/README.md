# Editorial type

Self-hosted fonts; the UI makes no runtime font-service requests.

- `source-serif-4-latin.woff2`: Source Serif 4, regular–semibold variable Latin
  face, from Google Fonts / Adobe. Used for the wordmark and English display type.
- `charter-regular.woff2`: Bitstream Charter Regular, used for Aster's replies
  and candidate replies. This is a licensed approximation of the serif voice,
  not Anthropic's font. Source: https://github.com/chawyehsu/charter-webfont.
  `LICENSE.charter.txt` preserves the original redistribution notice.
- `noto-serif-sc-prose.woff2`: Noto Serif SC Regular, subset from the official
  Google Fonts variable source at weight 400. Covers all 2,191 CJK characters
  present in `src/` and `docs/narrative-libraries/` on 2026-10-04, including
  punctuation. Used for Chinese replies, candidates and display type. Uncovered
  characters fall back to Songti / SimSun. The subset is 396,500 bytes.
- `noto-serif-sc-titles.woff2`: retained earlier display-only subset. The
  stylesheet now uses the prose subset, which also covers existing titles.

Navigation, NPC messages, controls and status text keep the original system
sans-serif stack. Font sizes, line heights, spacing and layout keep the previous
presentation. All fonts are self-hosted.

The live Anthropic and Claude marketing stylesheets inspected on 2026-10-04
declare `Anthropic Serif` / `anthropicSerif` and `Anthropic Sans` / `anthropicSans`:
https://www.anthropic.com/ and https://claude.com/.
No redistributable license for those font files was established; they are not
bundled. The game uses Charter as an approximation, not a claim of exact identity.

Sources: https://github.com/google/fonts/tree/main/ofl/sourceserif4 and
https://github.com/google/fonts/tree/main/ofl/notoserifsc. Both are SIL OFL 1.1;
their license texts are included alongside the fonts. No Claude font or brand
asset is bundled.
