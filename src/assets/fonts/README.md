# Unified typography

The entire interface uses one serif stack: Anthropic Serif for Latin text and
Noto Serif SC for Chinese. Replies, NPC messages, headings, wordmark, sidebar,
menus, controls, status text and ending/evaluation archives use this same stack.
Font sizes, line heights, spacing, colors and layout keep the restored interface.

- `anthropic-serif-roman.woff2` and `anthropic-serif-italic.woff2`: original,
  unmodified Anthropic Serif Web files from the public URLs in Anthropic's live
  official stylesheet, retrieved 2026-10-04. Font metadata confirms family,
  version 26.043.1, variable weight 300–800 and optical size 16–48. These files
  contain no Chinese glyphs. Copyright, URLs, byte counts, hashes and the
  unresolved redistribution status are in `PROVENANCE.anthropic.txt`.
- `noto-serif-sc-prose.woff2`: Noto Serif SC, variable weight 400–600, subset of
  the official Google Fonts source. Covers all 2,191 CJK characters currently
  present in `src/` and `docs/narrative-libraries/`, including punctuation.
  Uncovered characters fall back to Songti / SimSun. License: `noto-serif-OFL.txt`.
- `charter-regular.woff2`, `source-serif-4-latin.woff2` and
  `noto-serif-sc-titles.woff2`: retained earlier font assets and their licenses.
  The current stylesheet no longer references them.

Fonts are local resources and preserve the original files' embedded metadata.
Official Anthropic font source: https://www.anthropic.com/.
Noto source: https://github.com/google/fonts/tree/main/ofl/notoserifsc.
