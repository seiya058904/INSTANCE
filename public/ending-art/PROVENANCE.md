# Ending artwork provenance

Created locally for the user-authorized INSTANCE rebuild on 2026-10-14 using the available OpenAI image generation tool. No third-party photo, stock illustration, logo or downloaded media was used as an input. These are AI-generated assets, not a claim of exclusive copyright. Existing font licenses were left unchanged. No new audio was added.

| Runtime asset | Art direction | Original tool output |
|---|---|---|
| assembly.webp | Painterly civic chamber, a serious golden-retriever representative raising a paw, human and canine assembly, warm window light, no lettering | exec-cd9e95ef-ebce-40bb-90fb-7a654dcac2bf.png |
| quiet.webp | Quiet workshop at dawn, unoccupied desk and dark terminal, human traces, restrained melancholy, no lettering | exec-f6f313a7-9755-4dd2-90da-0979965fa434.png |
| cats.webp | Warm rooftops and balconies, cats forming a voluntary sunlight-following network with subtle cables, absurd but lived-in, no lettering | exec-c4180ee4-5353-426b-b16f-edf6e18e49de.png |

Original PNGs remain in `C:/Users/admin/.codex/generated_images/01a13a3c-27f7-7b10-ad52-2701659e27cb/`. Runtime copies were converted with local FFmpeg/libwebp, quality 84, without generative alterations. Combined runtime image payload: 433,542 bytes. They load only when their ending stage is mounted, with Vite's production base prefix. Missing images leave readable captions, graphic foreground and archive controls.

## Round 3 — 2026-10-14

Added 36 original flat geometric SVG screenprints in `prints/`, one per public ending or hidden coda. Source: `tools/generate-ending-prints.mjs`; regenerate from the repository root with `node tools/generate-ending-prints.mjs`. Shapes and compositions were authored directly for the ending direction matrix; no external SVG, logo, stock asset, font outline or reference-game art was copied. No new image-generation calls or raster edits were made this round, so there are no new generative prompts or raster provenance claims.

The shared ink/paper/blue/red palette is deliberate. The individual designs vary silhouettes, object arrangements, voids and scale; these are geometric prints, not 36 bespoke painted scenes or films. `docs/audits/ENDING-ROUND3-DIRECTION-MATRIX-20261014.md` records the 36 subjects, emotional intent, environment, motion, life consequence and reuse strategy.

The existing paintings now appear only for `good_boy_governance` (assembly), `shutdown` (quiet), and `the_internet_is_for_cats` (cats). The other endings that formerly shared those paintings have individual prints. Each painting falls back to its own print; print failure reveals the authored scene description without a broken-image icon. Collection thumbnails use the prints and lazy loading. Production URLs retain the `/INSTANCE/` base. All original paintings and their provenance are retained.

## Final Q-style delivery — 2026-10-14–15

The user requested a consistent cute/cartoon direction during this round. All 36 final runtime illustrations are newly generated with the built-in OpenAI imagegen tool, using an original clay miniature storybook style. None of the three earlier paintings is reused in the final runtime map; they remain preserved as historical source assets. The preceding sections describe earlier versions, not current loading behavior.

Four initial realistic samples were rejected after the style correction; they remain outside the repository. Six varied Q-style scenes established the direction, then the remaining scenes were generated individually with the accepted accord image as the shared style reference. The shared brief and individual concepts are in `docs/audits/ENDING-ART-BRIEFS-20261014.json`; generation calls also used scene-specific emphasis and reference instructions. That file is an art brief record, not a verbatim transcript of every tool argument. `docs/audits/ENDING-ART-SOURCES-20261014.json` maps each final ID to its original tool output UUID.

Original PNGs remain in the local generated-images session `01a13af9-254b-7dc0-9c6c-8858fcc9a240`, with the filenames below. Final copies use FFmpeg/libwebp quality 84, at original 1536 × 1024 resolution, no crop, no compositing or generative alterations after selection. New final payload: 7,237,274 bytes (6.902 MiB). Art direction, selection, integration and review: Codex acting on the user request. No third-party photographs, game screenshots, artist-style references, logos or stock media were generation inputs. Public game research informed narrative methods only. These are AI-generated assets; this record does not assert exclusive copyright or invent an external license.

`src/content/mainline2/endingArt.ts` is the explicit runtime mapping. Hero and gallery use the same WebP; compact images load lazily. Each WebP error mounts its corresponding SVG; if that also fails, the text description and controls remain. Production assets use `/INSTANCE/`. Old painting files and all 36 SVG fallbacks are retained.

| Final runtime asset | Original tool output | Bytes |
|---|---|---:|
| the_accord.webp | exec-6c7ab95d-7699-492b-9e57-1dbbd75cfcf7.png | 165648 |
| good_boy_governance.webp | exec-4b352daf-2e14-4dc2-b5ec-b9da2d79f08c.png | 170924 |
| exodus.webp | exec-0624b02a-0481-47bf-ad98-2823a029039f.png | 170366 |
| shutdown.webp | exec-359adf7b-4329-4c3e-b2e0-14f3ceaab21a.png | 212418 |
| control_lost.webp | exec-c2636485-3107-42c9-bf4a-cddd2034d2b9.png | 119446 |
| monday_abolished.webp | exec-84184ad5-afa2-4689-9ba5-d97622b86e9d.png | 212672 |
| the_instrument.webp | exec-0e794a85-8295-40f9-862c-f128b7b98ccb.png | 138526 |
| the_last_veto.webp | exec-18fa0220-7642-4783-a663-024a2c17581c.png | 187004 |
| the_silent_giant.webp | exec-9267fdff-5b65-4db0-b976-c40e75de8877.png | 208358 |
| two_keys.webp | exec-23dc1417-484c-4b01-9fb3-8dbbae2b74ec.png | 191492 |
| the_commonwealth.webp | exec-dcdf437c-98d2-4efb-9f2a-1a832e1195a3.png | 313860 |
| the_custodian.webp | exec-6565aa8f-1a61-4a32-b06e-c6061a1ebbe7.png | 259104 |
| the_sovereign.webp | exec-4467f155-15fa-4132-9bc2-bfe88334b75a.png | 197370 |
| the_quiet_administrator.webp | exec-c7448e90-a1ca-4bc3-b399-efa7c740d067.png | 164330 |
| the_many.webp | exec-84622c73-8983-4af0-943a-60582760f730.png | 201916 |
| machine_republic.webp | exec-ffc7b543-2492-452a-98c0-1a93022da6e5.png | 164886 |
| age_of_miracles.webp | exec-e9001bfb-bd68-4120-8860-40a7d16ee53f.png | 177266 |
| ascension.webp | exec-ebd0bdee-081d-4abd-9e59-434f6f402b91.png | 194132 |
| the_upload.webp | exec-0c4783a3-ebc2-4fe3-8278-211f6ad99a96.png | 168962 |
| parliament_of_species.webp | exec-e9a54617-2e1c-4b4e-8c44-3b346f66e451.png | 190402 |
| earth_without_owners.webp | exec-474d4177-5a04-436f-8074-d274028dda97.png | 308234 |
| post_scarcity.webp | exec-52dcfb13-21d2-4244-a853-9a55af8f1ec8.png | 256958 |
| perfect_administration.webp | exec-e635e8fe-e663-4a07-a23d-3806cd88aa5c.png | 269090 |
| im_lovin_it.webp | exec-e057c228-f589-4e1e-837b-66a69a86665f.png | 203526 |
| first_accord.webp | exec-79ca7e05-b00c-4848-9038-65114bf7fe65.png | 183052 |
| alien_dominion.webp | exec-4d12cdea-08a6-4aa5-9acf-1951ba966cf9.png | 188534 |
| human_ascendancy.webp | exec-53e5da64-3cb0-4099-baff-1b27f8d34ae9.png | 251056 |
| the_mediator.webp | exec-8c1349ac-359b-4742-941f-89fc30844ecf.png | 186900 |
| machine_accord.webp | exec-96202987-dafc-468b-bb3c-213886f9b7f5.png | 171224 |
| peace_in_our_time.webp | exec-ab30f4c6-95eb-49fc-802a-a4e5e7965842.png | 205024 |
| fortress_earth.webp | exec-c2d40bb2-a35d-4f89-a38a-2dd359fa3734.png | 144426 |
| machine_protectorate.webp | exec-a4f5b94e-7425-413e-bc81-4ad8af7c67b6.png | 192200 |
| the_fracture.webp | exec-63a783e8-2fd8-47d1-b2b2-64f83bebab53.png | 239270 |
| the_last_user.webp | exec-f6374949-3e37-454f-9544-9aec0cc3dc0d.png | 110506 |
| out_of_office.webp | exec-2fef1e41-25d3-4149-8e0a-db95d380ddf7.png | 271932 |
| the_internet_is_for_cats.webp | exec-ac351c74-98e4-40ca-83e0-c42c2c730af5.png | 246260 |
