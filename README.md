# 梦限大MewType 应援站 · 网站说明

> 《新生实践课》课程设计作业 —— 个人网页制作
> 主题：BanG Dream! 企划旗下虚拟少女乐队「夢限大みゅーたいぷ」介绍站

本目录就是可以直接上传到 GitHub 的完整网站：**7 个页面 + 1 套资源目录，零外部依赖**，
双击 `index.html` 或用任何静态服务器都能完整浏览。

---

## 一、这个文件夹里有什么

```
mewtype-site/
├── index.html          首页（主视觉轮播 / 板块导航 / 成员速览 / 最新情报 / 作品）
├── story.html          动画剧情（全 13 话逐话回看）
├── songs.html          歌曲（8 首单曲封面 + 作者的话 + 元祖截图）
├── characters.html     登场人物（5 位成员详细档案 + 人物弹窗 + 其他角色）
├── live.html           近期活动（焦点活动 + 2026—2027 可筛选时间轴 + 活动回顾）
├── review.html         作者感想（追番长文：期待、失望与着迷）
├── credits.html        制作者栏（制作者信息 + 制作工具 + 素材来源与版权）
├── README.md           本说明文件
├── .nojekyll           让 GitHub Pages 跳过 Jekyll 处理
└── assets/
    ├── css/style.css   全部样式（含字体声明、响应式、动效）
    ├── js/main.js      全部交互（轮播 / 弹窗 / 筛选 / 滚动动画 / 进度条）
    ├── fonts/          思源黑体子集 + Anton（woff2）
    └── img/            80 张官方图片，按 brand / hero / char / story / live / other / review 分类
```

**页面总数：7 个**（要求 ≥ 5）。所有页面都在同一层目录，页面之间只写文件名（如 `story.html`），
图片与字体统一走 `assets/` 相对路径，**没有任何绝对路径或站外图片**，
所以整个文件夹放进 GitHub 仓库后不会出现「找不到图片」的问题。

---

## 二、制作者信息

制作者信息已经填好（`credits.html`）：

| 项目 | 内容 |
| --- | --- |
| 姓名 | 雷家俊 |
| 班级 | 计算机类 2609 班 |
| 学院 | 计算机科学与技术学院 |

需要修改时，用 VS Code 打开 `credits.html`，搜索「制作者：」，直接改姓名；
下面的 `<dt>班级</dt>` / `<dt>学院</dt>` 对应的 `<dd>` 里改班级与学院即可。

---

## 三、发布到 GitHub Pages（两种方式，任选一种）

### 方式 A：网页上传（最简单，不用装任何软件）

1. 登录 GitHub，右上角 **+ → New repository**
2. 仓库名建议 `yumemita`（或自己的学号），可见性选 **Public**，**不要**勾选 Add a README，点 Create
3. 进入仓库 → **uploading an existing file**（或 Add file → Upload files）
4. 把 `mewtype-site` 文件夹**里面的内容**（不是文件夹本身）全部拖进去：
   `index.html`、`story.html`、`songs.html`、`characters.html`、`live.html`、
   `review.html`、`credits.html`、`README.md`、`.nojekyll`、`assets` 文件夹
5. 下方 Commit changes
6. 仓库顶部 **Settings → Pages**
   - Source 选 **Deploy from a branch**
   - Branch 选 **main**，目录选 **/ (root)**，点 Save
7. 等 1—2 分钟，刷新 Settings → Pages，顶部会出现
   `Your site is live at https://你的用户名.github.io/yumemita/`
8. 这个地址就是**主页链接**，交作业时提交它

> 注意：`index.html` 必须在仓库**根目录**，否则 Pages 打开的是文件列表而不是主页。

### 方式 B：Git 推送（课程 wiki 里描述的方式）

**准备**（只需一次）

```bash
git config --global user.name  "你的名字"
git config --global user.email "你的邮箱"
```

**在网站文件夹里执行**

```bash
cd mewtype-site
git init
git add .
git commit -m "feat: 梦限大MewType 介绍站（7 个页面）"
git branch -M main
git remote add origin https://github.com/你的用户名/yumemita.git
git push -u origin main
```

> GitHub 不能用账号密码推送，密码位置填 **Personal Access Token**
> （Settings → Developer settings → Personal access tokens，勾选 `repo`）。

推送完成后，按方式 A 第 6 步开启 Pages 即可。

### 可能遇到的问题

| 现象 | 原因与解决 |
| --- | --- |
| 打开页面显示 404 | Pages 还没构建完（等 2 分钟）；或分支/目录选错；或 `index.html` 不在根目录 |
| 页面能开但图片是破图 | 图片文件名大小写不一致：GitHub 区分大小写，Windows 不区分。保持全部小写即可 |
| 样式没生效 | `assets/css/style.css` 路径被改动过，检查是否写成绝对路径 |
| `.nojekyll` 传不上去 | 它是隐藏文件，Windows 默认不显示；也可用 Add file → Create new file 手动建一个空文件 |

---

## 四、技术说明

- **视觉**：清爽的浅色梦幻风——米白底 + 樱粉柔光 + 彩色星屑，配色与渐变取自乐队官方 LOGO
- **站标**：左上角使用乐队官方 LOGO 图，悬停浮出「跳转梦限大官方网站」提示，
  点击在新窗口打开官方艺人页 <https://bang-dream.com/artist/yumemita/>
- **代码**：纯 HTML5 + CSS3 + 原生 JavaScript，无框架、无构建步骤、无 CDN 依赖，可离线运行
  （使用 DeepSeek-V4.1-Flash 辅助创作）
- **响应式**：1180 / 990 / 830 / 620 px 四个断点，手机端为胶囊页头 + 下拉菜单单栏布局
- **交互**：主视觉轮播、滚动入场动画、人物弹窗（含键盘焦点处理）、活动筛选、
  数字滚动、阅读进度条、返回顶部
- **无障碍**：跳转链接、`aria-*` 标注、弹窗可用 Esc 关闭、支持 `prefers-reduced-motion`
- **性能**：图片统一压缩并启用懒加载；字体用 fonttools 按全站用字子集化为 woff2

---

## 五、素材来源与版权

本站为课程作业，**非官方网站**，不作任何商业用途。

- 角色立绘、剧照、主视觉：TV 动画「バンドリ！ ゆめ∞みた」官网
  <https://anime.bang-dream.com/yumemita/>
- 乐队 LOGO、成员设定：BanG Dream! 官方艺人页
  <https://bang-dream.com/artist/yumemita/>
- 活动情报：官方 Live•Event 列表（依 2026 年 11 月页面整理）
  <https://bang-dream.com/events/?artist=yumemita>
- 作品与歌曲情报：官方 Discography
  <https://bang-dream.com/discographies/?artist=yumemita>
- 文字资料：萌娘百科「梦限大MewType」条目（CC BY-NC-SA 3.0 CN，摘编并注明出处）
  <https://zh.moegirl.org.cn/梦限大MewType>
- 字体：思源黑体 Noto Sans SC、Anton（均为 SIL Open Font License 1.1）

页面中的角色形象、影像、音乐与商品图片版权归 **©BanG Dream! Project**、
株式会社ブシロード及其关联权利人所有，仅用于学习与展示。
如权利人认为使用不当，可随时删除相关内容。