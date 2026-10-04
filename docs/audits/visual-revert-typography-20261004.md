# 视觉回退与字体验收 · 2026-10-04

按用户要求撤回 `c628d84` 的视觉改动，保留其中已验证的 Mainline 调整。

- App shell、聊天组件、侧栏、Aster 标识、结局档案组件恢复 `3941033` 的结构。
  删除本轮新增的 Claude SVG 和对应许可文件。NPC 在左、玩家 Aster 在右的原有关系保留。
- `App.css` 恢复原版；与 `3941033` 的差异仅为字体声明及字体应用。
  色彩、尺寸、段宽、字号、行高、间距、控件、动画及响应式规则未继续改动。
- 主线作者源、生成库、Story Plan、选择后果、Ending resolver、剧情回归测试和
  提取器与 `c628d84` 一致。保留“最后一位用户”不增加解释性旁白的文本调整。
  普通 Conversation 正文仍未改动。

## 字体依据与实现

直接读取 [Anthropic 官网](https://www.anthropic.com/) 和
[Claude 官网](https://claude.com/) 的现行 CSS，确认其官方字族包含
`Anthropic Serif` / `anthropicSerif` 和 `Anthropic Sans` / `anthropicSans`。
这确认的是官方品牌字体声明，未把未登录营销页当作登录后聊天页面的排版证据。

未建立 Anthropic 字体文件可再分发的授权依据，因此正文采用 Bitstream Charter
作近似匹配，并为中文 Aster 回复及候选回复使用 Noto Serif SC Regular。
导航、NPC 消息和状态文字保留原有无衬线体系；标题保留原有 Source Serif 4。
这是字体接近，不宣称使用了 Anthropic Serif 原字体。

字体为本地资源。新增中文子集覆盖当前源码与作者源中的全部 2,191 个 CJK 字符，
含标点；396,500 字节，无缺失字符。许可与来源见
[fonts/README](../../src/assets/fonts/README.md)。

## 当前验证

- 单元测试：77 文件、592 项通过，含主线选择后果、路线及结局回归。
- 构建：TypeScript 和 Vite 通过；保留原有的大 JS chunk 提示。
- 浏览器：17 项通过，覆盖完整主线、最后一位用户、Ending → Evaluation、普通
  对话 40 个会话、模式切换、存档恢复、双窗口冲突、流式文本和 320/390 小屏。
  默认 4180 被现有程序占用，使用仓库外配置仅将测试服务器改到 4295，未改仓库配置。
- 六尺寸截图与几何检查：1440×900、1920×1080、2560×1440、3840×2160、
  390×844、320×568；无横向溢出和运行错误，刷新保留普通对话进度。
  Chrome 实际字形检查确认中文回复使用 Noto Serif SC，英文字形使用 Charter。
- 本地生产预览 `/INSTANCE/`：1440 与 390 实际回复和刷新通过；每种尺寸加载的
  JS、CSS 和三个字体资源均与本次 `dist/` 的 SHA-256 一致，无资源失败和运行错误。

截图、字形检查、官网 CSS 摘要及生产构建检查保存在本次任务的仓库外证据目录
`C:/Users/admin/.codex/visualizations/2026/10/04/01a10602-47c3-7e71-b872-e32e1572f5d9/typography-revert/`。
没有推送、发布或改变项目依赖与部署配置。
