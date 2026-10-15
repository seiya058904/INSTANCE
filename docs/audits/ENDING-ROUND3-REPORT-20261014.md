# INSTANCE Next Round 3：结局呈现与收尾报告

日期：2026-10-14。依据用户提供的 `INSTANCE_NEXT_Round3_Ending_Presentation_Finale_Polish_Codex_20261014.md` 执行。本地工作完成，未提交、推送或部署。

## 玩家能看到的变化

32 个公开世界与 4 个隐藏余波现在分别拥有自己的版画构图。相邻结局不再仅换标题与颜色：授权书的空白签名、十七路分叉、两只不同步的时钟、被框定的自由时间，各自指向一个具体后果。犬类议会、停机与猫网络保留既有绘画。

演出支持带名称的分镜回看，手动翻幕暂停自动播放。世界末幕不会被隐藏余波抢走；玩家决定何时继续。档案开头有本局主视觉与末句，并能打开已抵达世界的收藏画廊，按图回顾每个世界的生活场景。

## 审计范围、证据和结论

读取当前 EndingCinema、EndingScreen、endingCinema 定义、endingPlayerFacingCopy、公开/隐藏结局定义、App 的完成与 meta 接线、endingArchive、合法路线目录及现有测试；对照 MAINLINE-NEXT 与 M17 作者源。codebase-memory 用于调用链定位；覆盖检查报告 metadata_changed，相关路径均以当前源码读取为准。没有将旧审计结论当成当前运行事实。

审计覆盖所有 32+4，逐行方向见 [36 结局矩阵](ENDING-ROUND3-DIRECTION-MATRIX-20261014.md)。修改前截图保留在 `temp/round3/before-accord.png`。

|审计项|原有问题|处理|
|---|---|---|
|结局身份|11 类 motif 覆盖 36 个结果；相邻的授权、行政、接触、安全结局形状相同|每个 ID 单独的主体、构图、场所说明与情绪定义；矩阵覆盖所有结果|
|图像|犬类与物种议会共用 assembly；待命巨人、停机、私人消息共用 quiet|绘画只留给主体准确的犬类、停机、猫；其他结果改为独立版画|
|叙事价值|Round 2 已有 32 个具体生活后果，重写会损伤已成立的区分|保留其中文内容、因果、作者 ID；用对应物件强化，未泛化或扩写普通对话|
|节奏|固定 6.5/8.5 秒；有余波时世界末句会自动离场|首幕按情绪 8–11 秒，回声按长度延长；末幕与尾声手动停留|
|回看|只有细小进度条，翻回去可能被计时器再次推进|世界/回声/后来/余波按钮；手动导航暂停，减少动态效果与后台暂停|
|收藏|已有 meta 仅记完成标题，没有可浏览画廊|只读画廊，沿用现有标题账本；只显示已抵达公开结局，不生成旧局历史|
|可访问性|新画廊图片描述会加入按钮名称；隐藏导航换名会丢焦点|明确按钮 aria-label，分镜稳定 key，键盘 Enter 和焦点保持测试|
|失败状态|原图失败时没有明确移除 broken image|绘画→独立版画→文字场景，固定版面；没有历史时明确说明缺失|

## 参考研究及适用边界

这是根据公开的一手产品资料提炼的设计原则，不冒充亲自通关、研究内部实现或复刻其 UI。

- [80 Days / inkle](https://www.inklestudios.com/80days/) 强调独特旅程、路线复玩与鲜明美术。这里借鉴“用可认出的地方/物件记住一次旅程”，应用为结局版画和收藏，而非复制其城市图或旅行界面。
- [The Stanley Parable: Ultra Deluxe 官方介绍](https://www.stanleyparable.com/) 将选择、意外与反复抵达不同结果作为体验本身。这里的推导是：让荒诞落在具体物件与制度反差上，保留犬类反对票、周一缺席、猫不回复等既有笑点，不再叠加泛泛的宏大解释。
- [Pyre / Supergiant 官方介绍](https://www.supergiantgames.com/games/pyre/) 的角色旅程与分支结果提供“后果应落在人身上”的参考。INSTANCE 保留 Round 2 的汤、聚餐邀请、郊游车辆等生活细节；真实人物回访仍由本局档案提供。

## 实现与资产

|文件/区域|本轮变更|
|---|---|
|`src/content/mainline2/endingDirection.ts`|36 个独立主体、语气、场所、运动和首幕时长；用联合 ID 类型约束覆盖|
|`tools/generate-ending-prints.mjs`、`public/ending-art/prints/`|可重复生成的 36 个原创 SVG，合计 44,638 字节；无外部引用或新依赖|
|`src/components/EndingVisual.tsx`|演出/收藏共用视觉，三张原插画限定到准确主体，加载失败逐级回退|
|`src/components/EndingCinema.tsx`|按长度计时、末幕停留、明确分镜、暂停与后台处理、缺失历史说明|
|`src/components/EndingCollection.tsx`|已抵达公开世界的缩略图、选择预览、本局隐藏余波；旧局仅看未来场景|
|`src/components/EndingScreen.tsx`|本局主视觉、收藏跳转、画廊接入；保留个人尾声、评估、新局确认|
|`src/app/App.tsx`|本轮仅向 EndingScreen 传现有 completedEndings；其他 Git 差异属进入本轮前的工作|
|`src/content/mainline2/endingPlayerFacingCopy.ts`|导出已有中文标题查询函数；未重写旧结局翻译|
|`src/content/mainline2/endingCinema.ts`|移除失去用途的共享 image 字段；32 场景与 4 尾声文案保留|
|`src/app/endingCinema.css`|独立视觉布局、手机自然纵向排列、分镜导航、收藏双列；替换不再使用的旧 motif 样式|
|测试、DESIGN、素材来源、审计矩阵|与最终行为同步|

绘画原件、原来源、历史报告均保留。没有新生成式图片，因此本轮没有新的图片提示词。版画完全由本地几何指令生成；风格统一而构图独立。详见 `public/ending-art/PROVENANCE.md`。复用的是 palette、版面、四类轻量运动、三幕/可选尾声播放器及档案组件；没有声称每个结局是独立动画系统。

## 验证结果

使用项目已有 Playwright/Chrome，未安装依赖；Browser plugin 未提供，按前端测试技能使用现有 Playwright 流程。生产检查用独立 Chrome context，未访问玩家的真实浏览器存档。画面取样采用 headed Chrome，可见操作，合法引擎路线 fixture 抵达后在实际页面点击；不是声称正常速度手动通关全部 36 条路线。

|命令/检查|实际结果|证据|
|---|---|---|
|`npm test -- --run`|84 文件、641 项通过|`temp/round3/unit.log`|
|新增资产测试修正后的单测|3 项通过；首次 build 发现浏览器 TS 配置不接受 node:fs，改用 Vite raw glob，无依赖修改|`presentation-unit.log`|
|最终相关单测：presentation、EndingScreen、mainlineNext、player-facing copy|4 文件、25 项通过|`unit-confirm.log`|
|`npm run build`|最终通过，保留原有 >500 kB chunk 提示|`build.log`|
|完整 `npm run test:browser -- --workers=4`|首轮 67 项：64 通过，3 失败；两个为新收藏按钮的 accessible name，另一个为失败注入被已解码缓存绕过|`browser.log`|
|修复后 ending-cinema + ending-presentation|12/12 通过，包含三项原失败；覆盖 32 公开世界、四尾声、五种宽度、回看存档不变、图片回退|`browser-confirm.log`|
|最终稳定分镜 key 与键盘焦点验证|ending-presentation 5/5 通过|`keyboard-confirm.log`|
|生产 `/INSTANCE/`|14 条代表路线的首幕/后果、四个明确隐藏结果；资源加载成功，0 pageerror|`preview-evidence.json`、`preview-*.png`、`aftermath-*.png`、`coda-*.png`|
|视觉总览|36 幅版画逐图检查；桌面与手机集中检查，修正后一次确认|`prints-sheet-0.png`、`prints-sheet-1.png`|
|机械设计检查|检测返回 []，不是视觉质量或完整 WCAG 认证|`design-scan.json`|
|Git whitespace / diff / 状态|`git diff --check` 通过；已检查本轮接线及新增源码，保留进入时的 dirty tree|本地 Git 状态|

测试不是同一轮“67/67 全绿”：完整运行后的相关修复用 12 项定向重跑验证，另外 55 项来自完整运行的通过结果。避免把两个运行合成虚构的单轮结果。

### 生产预览与交互

预览命令：`npm run preview -- --host 127.0.0.1 --port 4193 --base /INSTANCE/`。4193 已被占用，本轮进程实际监听 `http://127.0.0.1:4194/INSTANCE/`；没有终止原有服务。检查页面标题、实际内容、无框架 overlay、图片 decode、分镜切换和档案回看。截图保存于仓库忽略的 `temp/round3/`。

代表世界：终局协约、机器共和国、出走、停机、断裂、失控、好狗治理、后稀缺社会、完美行政、首次协约；隐藏：最后一位用户、暂时离线、周一被废除、猫网络。截图中保留真实路线的实际末句和历史。

生产视口：1440×900，320/390/768×844；浏览器回归还覆盖 1920 宽。减少动态效果下无动画、默认暂停；运行时切换该偏好也会暂停。键盘可进入收藏、Enter 选中，aria-pressed 与预览同步；余波按钮改名仍保持焦点。原图失败保留版画，版画失败保留可读场景和控制；图片未阻塞正文和导航。

控制台只有浏览器自动请求 `http://127.0.0.1:4194/favicon.ico` 的 404，与结局资产无关；结局资源为 200/304，无失败。未把默认 favicon 的缺失修复扩展进本轮范围。保存、模式切换、冲突恢复、最后用户回复、真实按钮通关等现有回归在完整运行中通过。

## 仍然共享的部分与限制

- 36 个独立构图是几何版画，不是 36 张新绘画，更不是 36 部影片。只有三张既有 AI 绘画。没有新音效或配音。
- 故事后三幕结构共享，但主图、场所、末句、未来后果、时长/运动取向各有对应定义。历史幕仍只读取当前保存数据。
- completedEndings 只记录公开标题；旧局不能恢复详细历史或旧隐藏余波。收藏是静态世界回顾，本局提供完整演出重看。未改变 checkpoint schema、锁或 CAS。
- 视觉观察集中于 Chrome 与所列视口；未在实体手机、Safari/Firefox 或屏幕阅读器上做人工认证。没有正常阅读速度手动打完全部 36 个结果。
- 不改结局数量、门槛、日历、普通会话、图标旋转、远端设置或依赖。不执行提交、推送、发布；原有未提交工作仍在。
- 后续若用户需要更强绘画表现，可按这份矩阵逐步替换版画，同时保留独立构图和回退。跨局完整演出回放则需要另行设计可保存的历史快照，不能从标题反推。
