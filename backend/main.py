from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageFilter, ImageEnhance, ImageOps
import io
import uuid
import os
import numpy as np

app = FastAPI(title="AI Image Style Transfer API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 结果保存目录
os.makedirs("results", exist_ok=True)

def apply_style(img: Image.Image, style: str, strength: float, steps: int, guidance: float) -> Image.Image:
    """
    本地 AI 风格迁移（基于 Pillow 图像处理）
    strength: 风格强度 0.0-1.0
    steps: 处理迭代次数 20-50
    guidance: 效果引导系数 1-20
    """
    img = img.convert("RGB")
    result = img.copy()

    style_lower = style.lower()

    # ── 油画风格 ──────────────────────────────────────────────
    if any(k in style_lower for k in ["oil", "油画", "painting", "monet", "van gogh", "梵高", "莫奈"]):
        # 多次模糊叠加模拟笔触
        blur_radius = 1.5 + strength * 3
        for _ in range(max(1, int(steps / 10))):
            result = result.filter(ImageFilter.SMOOTH_MORE)
        result = result.filter(ImageFilter.GaussianBlur(radius=blur_radius * 0.5))
        # 增强饱和度和对比度
        result = ImageEnhance.Color(result).enhance(1.2 + strength * 0.8)
        result = ImageEnhance.Contrast(result).enhance(1.0 + strength * 0.5)
        result = ImageEnhance.Sharpness(result).enhance(0.5 + guidance * 0.05)

    # ── 水彩风格 ──────────────────────────────────────────────
    elif any(k in style_lower for k in ["water", "watercolor", "水彩"]):
        result = result.filter(ImageFilter.GaussianBlur(radius=1 + strength * 2))
        result = ImageEnhance.Color(result).enhance(0.8 + strength * 0.4)
        result = ImageEnhance.Brightness(result).enhance(1.1 + strength * 0.2)
        result = ImageEnhance.Contrast(result).enhance(0.8 + strength * 0.3)
        for _ in range(max(1, int(steps / 15))):
            result = result.filter(ImageFilter.SMOOTH)

    # ── 素描 / 铅笔风格 ───────────────────────────────────────
    elif any(k in style_lower for k in ["sketch", "pencil", "素描", "铅笔", "charcoal", "炭笔", "drawing"]):
        gray = result.convert("L")
        inv = ImageOps.invert(gray)
        blur = inv.filter(ImageFilter.GaussianBlur(radius=2 + strength * 4))
        # dodge blend
        arr_gray = np.array(gray, dtype=np.float32)
        arr_blur = np.array(blur, dtype=np.float32)
        dodge = np.clip(arr_gray * 255.0 / (255.0 - arr_blur + 1e-6), 0, 255).astype(np.uint8)
        sketch = Image.fromarray(dodge)
        # 根据 strength 混合彩色
        if strength > 0.5:
            colored = ImageEnhance.Color(result).enhance(0.3)
            result = Image.blend(sketch.convert("RGB"), colored, alpha=(strength - 0.5))
        else:
            result = sketch.convert("RGB")
        result = ImageEnhance.Contrast(result).enhance(1.0 + guidance * 0.05)

    # ── 赛博朋克 / 霓虹风格 ───────────────────────────────────
    elif any(k in style_lower for k in ["cyber", "neon", "punk", "赛博", "霓虹"]):
        result = ImageEnhance.Color(result).enhance(2.0 + strength)
        result = ImageEnhance.Contrast(result).enhance(1.5 + strength * 0.5)
        result = result.filter(ImageFilter.EDGE_ENHANCE_MORE)
        result = ImageEnhance.Brightness(result).enhance(0.8 + strength * 0.3)

    # ── 复古 / 胶片风格 ───────────────────────────────────────
    elif any(k in style_lower for k in ["vintage", "retro", "film", "复古", "胶片", "老照片"]):
        result = ImageEnhance.Color(result).enhance(0.6 + strength * 0.2)
        result = ImageEnhance.Contrast(result).enhance(0.9 + strength * 0.2)
        result = ImageEnhance.Brightness(result).enhance(0.9)
        # 添加暖色调
        r, g, b = result.split()
        r = ImageEnhance.Brightness(r).enhance(1.1)
        b = ImageEnhance.Brightness(b).enhance(0.85)
        result = Image.merge("RGB", (r, g, b))

    # ── 印象派 ────────────────────────────────────────────────
    elif any(k in style_lower for k in ["impressi", "印象"]):
        for _ in range(max(2, int(steps / 8))):
            result = result.filter(ImageFilter.SMOOTH_MORE)
        result = result.filter(ImageFilter.GaussianBlur(radius=strength * 2))
        result = ImageEnhance.Color(result).enhance(1.4 + strength * 0.6)
        result = ImageEnhance.Contrast(result).enhance(1.1)

    # ── 默认：艺术增强 ────────────────────────────────────────
    else:
        result = ImageEnhance.Color(result).enhance(1.0 + strength * 0.5)
        result = ImageEnhance.Contrast(result).enhance(1.0 + strength * 0.3)
        result = ImageEnhance.Sharpness(result).enhance(1.0 + strength * 0.5)
        result = result.filter(ImageFilter.SMOOTH)

    # 最终混合：根据 strength 与原图融合
    result = Image.blend(img, result, alpha=min(1.0, 0.3 + strength * 0.7))
    return result


@app.get("/")
def read_root():
    return {
        "name": "AI Image Style Transfer API",
        "student_id": "423830113",
        "student_name": "浮标",
        "version": "2.0.0",
        "engine": "Local Pillow AI Engine",
        "supported_styles": [
            "oil painting / 油画",
            "watercolor / 水彩",
            "pencil sketch / 素描",
            "charcoal drawing / 炭笔",
            "cyberpunk / 赛博朋克",
            "vintage / 复古胶片",
            "impressionist / 印象派",
            "Van Gogh / 梵高",
            "Monet / 莫奈",
        ]
    }


@app.post("/api/transfer")
async def transfer_style_api(
    image: UploadFile = File(...),
    prompt: str = Form("oil painting, masterpiece"),
    strength: float = Form(0.75),
    num_inference_steps: int = Form(30),
    guidance_scale: float = Form(7.5)
):
    try:
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        img = img.resize((512, 512))

        result = apply_style(img, prompt, strength, num_inference_steps, guidance_scale)

        filename = f"result_{uuid.uuid4().hex[:8]}.png"
        save_path = os.path.join("results", filename)
        result.save(save_path, "PNG")

        return {
            "status": "success",
            "result_url": f"/results/{filename}",
            "student_id": "423830113",
            "student_name": "浮标",
            "style": prompt,
            "params": {
                "strength": strength,
                "steps": num_inference_steps,
                "guidance": guidance_scale
            }
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})


@app.get("/results/{filename}")
def get_result(filename: str):
    path = os.path.join("results", filename)
    if os.path.exists(path):
        return FileResponse(path)
    return JSONResponse(status_code=404, content={"error": "File not found"})


if __name__ == "__main__":
    import uvicorn
    print("AI Image Style Transfer API starting...")
    print("API Docs: http://localhost:8000/docs")
    print("Student ID: 423830113 | Name: FuBiao")
    uvicorn.run(app, host="0.0.0.0", port=8000)
