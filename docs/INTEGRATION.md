# 模块采用与保留决定

## 基础与来源

- 基础：用户提供的 `doyin_ai_video-main`，源仓库 [LiChangZheng10086/doyin_ai_video](https://github.com/LiChangZheng10086/doyin_ai_video)。保留 Node/TypeScript、Electron、Whisper、HyperFrames 和真实数据流程。
- 视觉：用户提供的 `doyin-studio-ui`。采用导航分组、深色表面、细边框、珊瑚红、作品卡片、四步链路轨和视频监视器。该目录的简化数据类型、占位页面和模拟设置不进入生产入口。
- NewsNow：上游已有 [ourongxing/newsnow](https://github.com/ourongxing/newsnow) 的多平台热榜格式适配，保留 MIT 归属与 `docs/third-party/newsnow-LICENSE.txt`。共享缓存、过期提示与收藏实际读写继续沿用；新增官方相关视频搜索入口，不声称它是销量、成交或全市场视频榜。
- social-auto-upload：保留既有外部 CLI 适配，按需配置；不把整个 Python 项目和浏览器再塞进主应用。已有代码来源和补丁见 docs/patches 与上游文档。
- 微信编辑器样式：保留已有清理过的少量 MIT 样式及 `docs/third-party/wechat-article-editor.md` 的归属，不额外增加另一套编辑器。

## 暂不引入的项目

- MoneyPrinterTurbo：其完整视频服务会与现有 HyperFrames 主链路重叠，并增加 Python/媒体依赖。后续明确要自动配音和素材混剪时再选择服务模式，首轮不混用两套任务状态。
- DreamCreator：Go/Wails 桌面外壳与 Electron 重叠；借鉴字幕和导出流程无需将本项目全面改写成 Go。
- Easel、OpenCreator：主要供流程参考，不再加入另一套账户、AI Agent 与本地服务。
- yft-design：完整 Vue/Fabric 编辑器超出这轮风格替换需要，先保留图集与文章已有真实编辑功能。

## 本轮修复

保留生产 API、真实本机会话、主题存储和防未保存导航的 Data Router。新工作台用同一份颜色令牌。新卡片有键盘入口、图片失败回退和明确删除控件；详情始终提供完整视频监视器，同时保留产物和发布向导。

修复 Windows 动态导入 URL、asar 内后端路径、跨平台 CommonJS 标记文件，以及 Windows npm/npx 资源准备入口。新包采用 Doin Studio 品牌及独立应用数据位置；两个用户提供目录保持原样。

## 验证边界

Actions 的浏览器测试使用真实后端与临时文件夹；热点和任务样例只在云端隔离测试目录。Windows smoke 启动实际 win-unpacked 程序，检查 file/hash 路由、IPC、后端健康和任务刷新。安装器安装流程与真实账号发布不由这些检查证明。
