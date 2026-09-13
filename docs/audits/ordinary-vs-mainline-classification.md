# Ordinary vs Mainline Content Classification

> This is an audit artifact. The first-level states are exactly MAINLINE, NON_MAINLINE, and UNCERTAIN.

| Metric | Count |
| --- | ---: |
| Total scanned content records | 719 |
| MAINLINE | 349 |
| NON_MAINLINE | 369 |
| MAINLINE / UNUSED | 46 |
| UNCERTAIN | 1 |

## NON_MAINLINE subcategories

| Subcategory | Count |
| --- | ---: |
| LIFE | 22 |
| RELATIONSHIP | 50 |
| OTHER | 200 |
| WORK | 43 |
| STUDY | 23 |
| PROGRAMMING | 14 |
| WRITING | 15 |
| HUMOR | 2 |

## UNCERTAIN records

- `batch02:25`: 内容含有可能指向 INSTANCE 能力或世界变化的表述，缺少人工确认前不得进入普通内容评分页。

## Classification policy

A record enters NON_MAINLINE only after human review confirms that it remains a fully ordinary AI conversation when all INSTANCE-specific people, events, abilities, institutions, world changes, and endings are removed. Any direct or indirect world echo remains MAINLINE; unresolved cases remain UNCERTAIN. Story Plan absence is never sufficient evidence for NON_MAINLINE.
