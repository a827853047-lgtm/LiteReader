# LiteReader 轻阅

极简本地电子书阅读器，支持离线阅读、深色模式和语音合成功能。

## 功能特性

### 📚 核心功能
- **本地阅读**：支持PDF、Word等多种格式电子书
- **离线使用**：PWA应用，可安装到设备并离线使用
- **深色模式**：自动适配系统主题或手动切换
- **语音合成**：支持TTS朗读功能，可调整语速和语音
- **进度同步**：自动保存阅读进度
- **字体切换**：支持无衬线和衬线字体
- **自定义阅读**：可调整字号、行高、页边距等

### 🎨 设计特点
- **极简界面**：专注阅读体验，无广告干扰
- **响应式设计**：适配手机、平板和桌面设备
- **安全区域适配**：完美适配刘海屏和全面屏设备
- **流畅动画**：页面切换和交互流畅自然

### 📱 移动端优化
- **手势操作**：支持滑动翻页
- **全屏阅读**：沉浸式阅读体验
- **状态栏适配**：自动适配系统状态栏颜色

## 技术栈

- **前端框架**：React 18
- **样式框架**：Tailwind CSS
- **构建工具**：Babel
- **文档处理**：
  - PDF：pdf.js
  - Word：mammoth.js
- **图标**：Lucide Icons
- **PWA支持**：Service Worker + Manifest

## 快速开始

### 1. 本地运行

```bash
# 克隆项目
git clone <repository-url>
cd LiteReader

# 使用任意HTTP服务器启动
python -m http.server 8080
# 或使用Node.js
npx http-server -p 8080

# 打开浏览器访问
# http://localhost:8080
```

### 2. 安装到设备（PWA）

#### 移动端
1. 使用Chrome浏览器访问应用
2. 点击地址栏右侧的「添加到主屏幕」按钮
3. 按照提示完成安装

#### 桌面端
1. 使用Chrome浏览器访问应用
2. 点击地址栏右侧的「安装LiteReader」按钮
3. 按照提示完成安装

## 支持的文件格式

- 📄 PDF (.pdf)
- 📝 Word (.docx)
- 📃 纯文本 (.txt)
- 🔖 EPUB (.epub) - 实验性支持

## 配置说明

### 阅读设置

- **字体**：无衬线字体 / 衬线字体
- **字号**：14px - 28px 可调
- **行高**：1.2 - 2.0 可调
- **页边距**：窄 / 中 / 宽 可选
- **主题**：浅色 / 深色 / 跟随系统

### TTS语音设置

- **语音选择**：支持多种语音（取决于设备）
- **语速**：0.5x - 2.0x 可调
- **播放控制**：播放/暂停、上一段/下一段

## 项目结构

```
LiteReader/
├── index.html          # 主页面
├── manifest.json       # PWA配置文件
├── sw.js              # Service Worker
├── icons/             # 应用图标
│   ├── icon-192x192.svg
│   └── icon-512x512.svg
├── electron/          # Electron桌面应用配置
│   ├── main.js
│   └── preload.js
├── ANDROID_TTS_CONFIG.md  # Android TTS配置指南
└── README.md          # 项目说明文档
```

## 开发说明

### 依赖项

所有依赖通过CDN加载，无需安装额外依赖：

- React 18
- React DOM 18
- Tailwind CSS
- Babel
- pdf.js
- mammoth.js
- Lucide Icons

### 自定义配置

#### Tailwind配置
在`index.html`中可自定义主题颜色和间距：

```javascript
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                dark: { bg: '#000000', surface: '#1c1c1e', text: '#e5e5e7', sub: '#8e8e93' },
                light: { bg: '#fcfcfc', surface: '#ffffff', text: '#000000', sub: '#8e8e93' },
                brand: '#0a84ff'
            }
        }
    }
}
```

#### PWA配置

`manifest.json`包含了PWA应用的核心配置：

```json
{
  "name": "LiteReader 轻阅",
  "short_name": "轻阅",
  "description": "极简本地电子书阅读器，支持离线阅读、深色模式和语音合成功能",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#fcfcfc",
  "theme_color": "#fcfcfc",
  "theme_color_dark": "#000000",
  "icons": [
    {
      "src": "icons/icon-192x192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "导入新书籍",
      "short_name": "导入",
      "description": "导入新的电子书文件",
      "url": "./?action=import"
    },
    {
      "name": "打开书架",
      "short_name": "书架",
      "description": "查看您的电子书库",
      "url": "./?action=bookshelf"
    }
  ],
  "share_target": {
    "action": ".",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "files": [
        {
          "name": "file",
          "accept": [".pdf", ".docx", ".txt", ".epub"]
        }
      ]
    }
  }
}```

**主要配置项说明：**

- `name` & `short_name`：应用名称和短名称
- `description`：应用描述，用于应用商店和安装提示
- `start_url`：应用启动时的URL
- `display`：显示模式（standalone/fullscreen/minimal-ui/browser）
- `background_color`：启动屏幕背景色
- `theme_color` & `theme_color_dark`：主题色和深色主题色
- `icons`：应用图标，支持多种尺寸和用途
- `shortcuts`：应用快捷方式，可在桌面或应用列表中快速访问功能
- `share_target`：支持从其他应用分享文件到LiteReader
```

## Android TTS配置

如需在Android设备上使用TTS功能，请参考[ANDROID_TTS_CONFIG.md](ANDROID_TTS_CONFIG.md)文件。

## 桌面应用

项目支持通过Electron构建桌面应用，配置文件位于`electron/`目录下。

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 隐私政策

- 所有数据存储在本地，不会上传到任何服务器
- 应用不会收集用户个人信息
- 支持本地文件系统访问，仅用于读取电子书文件

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 更新日志

### v1.0.0
- 初始版本发布
- 支持PDF和Word文档阅读
- 实现PWA功能
- 添加深色模式支持
- 集成TTS语音合成功能
