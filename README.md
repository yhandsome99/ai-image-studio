# 🎨 AI Image Style Transfer Studio

> **学号**: 423830119 | **姓名**: 杨梓豪

基于 AI 的图像风格迁移 Web 应用，支持将任意图片转换为艺术风格。

## ✨ 功能特性

- 🖼️ **风格迁移**：将照片转换为梵高、莫奈、毕加索等艺术风格
- 🤖 **AI 驱动**：基于 Hugging Face Stable Diffusion img2img 模型
- 🎛️ **参数调节**：可调节风格强度、推理步数、引导系数
- 📱 **响应式设计**：支持桌面和移动端
- ⚡ **实时预览**：上传即处理，结果即时展示

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TailwindCSS + Vite |
| 后端 | Python FastAPI |
| AI模型 | Hugging Face Diffusers (Stable Diffusion) |
| 部署 | GitHub Pages (前端) + Hugging Face Spaces (后端) |

## 🚀 快速开始

### 前端
```bash
cd frontend
npm install
npm run dev
```

### 后端
```bash
cd backend
pip install -r requirements.txt
python main.py
```

## 🎯 AI 模型说明

本项目使用 **Stable Diffusion img2img** 管道：
- 模型：
unwayml/stable-diffusion-v1-5
- 任务：图像到图像风格迁移
- 参数：
  - strength：风格强度 (0.0-1.0)
  - 
um_inference_steps：推理步数 (20-50)
  - guidance_scale：引导系数 (1-20)

## 📸 使用方法

1. 上传原始图片
2. 选择艺术风格（或输入自定义 prompt）
3. 调节 AI 参数
4. 点击「生成」等待 AI 处理
5. 下载生成结果

## 👤 作者信息

- **学号**：423830113
- **姓名**：浮标
- **项目**：AI 图像风格迁移 Web 应用

## 📄 License

MIT License
