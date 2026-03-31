# 🚀 部署和运行指南

## 学号: 423830113 | 姓名: 浮标

### 前置要求

- Node.js 16+ (前端)
- Python 3.8+ (后端)
- CUDA 11.8+ (可选，用于GPU加速)
- 至少 8GB RAM (推荐 16GB)

### 快速开始

#### 1. 克隆仓库

\\\ash
git clone https://github.com/yhandsome99/ai-image-studio.git
cd ai-image-studio
\\\

#### 2. 启动后端

\\\ash
cd backend
pip install -r requirements.txt
python main.py
\\\

后端将在 http://localhost:8000 启动

#### 3. 启动前端

在新的终端窗口：

\\\ash
cd frontend
npm install
npm run dev
\\\

前端将在 http://localhost:5173 启动

#### 4. 打开浏览器

访问 http://localhost:5173，你会看到：
- 学号: 423830113
- 姓名: 浮标

### 使用方法

1. **上传图片**：点击上传区域选择或拖拽图片
2. **调节参数**：
   - 风格提示词：输入想要的艺术风格
   - 风格强度：0.0-1.0，越高越接近提示词
   - 推理步数：20-50，越多质量越好但越慢
   - 引导系数：1-20，控制对提示词的遵循程度
3. **生成**：点击"生成风格图"按钮
4. **下载**：等待处理完成后下载结果

### 参数说明

| 参数 | 范围 | 说明 |
|------|------|------|
| strength | 0.0-1.0 | 风格迁移强度，0=原图，1=完全按提示词生成 |
| num_inference_steps | 20-50 | 推理步数，越多越好但越慢 |
| guidance_scale | 1-20 | 引导系数，越高越遵循提示词 |

### 推荐参数组合

**快速预览**：
- strength: 0.5
- steps: 20
- guidance: 5

**高质量输出**：
- strength: 0.75
- steps: 50
- guidance: 7.5

**创意风格**：
- strength: 0.9
- steps: 40
- guidance: 10

### 常见问题

**Q: 生成很慢怎么办？**
A: 
- 减少 num_inference_steps (改为20)
- 确保使用 GPU (CUDA)
- 减小图片尺寸

**Q: 显存不足？**
A:
- 在 main.py 中改为 torch.float32
- 减少图片尺寸
- 使用 CPU (会很慢)

**Q: 如何使用不同的模型？**
A: 在 main.py 中修改模型名称：
\\\python
pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",  # 改这里
    ...
)
\\\

### 项目信息

- **学号**: 423830113
- **姓名**: 浮标
- **GitHub**: https://github.com/yhandsome99/ai-image-studio
- **AI模型**: Stable Diffusion v1.5
- **框架**: React + FastAPI