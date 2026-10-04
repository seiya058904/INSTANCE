# Product typography

Self-hosted fonts; the UI makes no runtime font-service requests.

- `charter-regular.woff2`: Bitstream Charter Regular, used for English responses
  and archive display type. Source: https://github.com/chawyehsu/charter-webfont.
  `LICENSE.charter.txt` preserves the original redistribution notice.
- The UI and Chinese text use the platform sans-serif stack, with explicit
  PingFang SC / Microsoft YaHei UI / Microsoft YaHei fallbacks. The Claude
  wordmark is a vector. The Windows acceptance run confirmed that Chinese
  glyphs resolve to Microsoft YaHei UI rather than a serif fallback.
- `source-serif-4-latin.woff2`: retained Source Serif 4 asset from the previous
  presentation. It is no longer requested by the stylesheet.
- `noto-serif-sc-titles.woff2`: Noto Serif SC Regular, a display-only subset of
  the existing localized ending titles, section headings, and character labels.
  Retained from the previous presentation; no longer requested by the stylesheet.

Sources: https://github.com/google/fonts/tree/main/ofl/sourceserif4 and
https://github.com/google/fonts/tree/main/ofl/notoserifsc. Both are SIL OFL 1.1;
their license texts are included alongside the fonts. Anthropic's proprietary
typefaces are not bundled. Public Claude vectors are in `../claude/`, with their
SVGL source license and attribution recorded in the visual audit.
