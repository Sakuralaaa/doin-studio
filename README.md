# Doin Studio

个人学习研究用的本地创作工作台。基于抖创工坊的真实后端和桌面流程，采用用户提供的 `doyin-studio-ui` 深色界面风格。

本项目沿用上游的非商业学习研究限制，不宣称获得商用授权。上游 README 的 MIT 徽章与实际用途声明存在差异；这里没有将整份项目重新授权为 MIT。原始说明保存在 [docs/UPSTREAM_README.md](docs/UPSTREAM_README.md)。

## 能做什么

- 视频链接和分享文本导入、主页合集、分步转录、文案改写、分镜及本地 HyperFrames 竖屏视频。
- 抖音、头条、百度、知乎、B站公开热榜，收藏与备注；抖音选题可打开官方相关视频搜索。
- 图片/音频素材、图片提示词、字幕图集、独立文章、公众号对标、技能资料和回收站。
- 发布包预览与人工交付；既有平台草稿与提交通路保持原权限、预览和确认规则。
- 深色、浅色、跟随系统；桌面可折叠侧栏、手机导航、完整视频预览和明确错误提示。

## 界面改造

使用所提供前端的曜石黑、珊瑚红、细边框、商品/作品卡片、流水线和监视器布局。原项目完整的设置、图集、文章、发布操作保留并统一外观；不采用新前端里的模拟“已就绪”、假保存和未接通页面。导入任务与本地转录无需先配置文本模型。

## 下载和使用

在 GitHub [Actions](https://github.com/Sakuralaaa/doin-studio/actions) 中选择成功的 `Desktop validation and Windows installer`，下载 `doin-studio-windows-<提交SHA>` Artifact，解压后运行 `Doin-Studio-0.1.0-windows-x64.exe`。安装器尚未进行代码签名，SHA256 随安装器提供。只采用 Windows job 成功的版本。

应用启动后自动创建或恢复本机操作者，无需 SaaS 账号。资料存于 Windows 用户的 Electron 数据目录，可在设置中修改存储目录。AI 文案需配置兼容 API，抖音采集需有效登录态；图片目前是提示词和素材工作流，并不自动调用图片生成接口。当前成片为图文动画，不含自动 TTS 配音。

## 云端验证

所有安装、检查、测试、构建和打包都在 GitHub Actions 运行。本机仅编辑源码与提交 Git。

流水线包含 TypeScript 与凭据检查、完整上游回归测试、生产前端构建、真实 Express API 的浏览器交互与多尺寸截图、Windows 安装器打包和实际打包程序启动。外部热点测试使用隔离缓存，不消耗真实 AI 费用，也不向任何平台发布内容。真实登录、ASR 性能、AI 输出和平台提交需要用户配置后分别验证。

开发与测试命令、架构和上游不变式见 [AGENTS.md](AGENTS.md)。模块采用决策见 [docs/INTEGRATION.md](docs/INTEGRATION.md)。
