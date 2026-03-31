from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
from diffusers import StableDiffusionImg2ImgPipeline
import uuid
import os

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
device = "cuda" if torch.cuda.is_available() else "cpu"
pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    torch_dtype=torch.float16 if device == "cuda" else torch.float32,
)
pipe = pipe.to(device)

@app.get("/")
def read_root():
    return {
        "name": "AI Image Style Transfer API",
        "student_id": "423830113",
        "student_name": "娴爣",
        "version": "1.0.0"
    }

@app.post("/api/transfer")
async def transfer_style(
    image: UploadFile = File(...),
    prompt: str = Form("oil painting, masterpiece"),
    strength: float = Form(0.75),
    num_inference_steps: int = Form(30),
    guidance_scale: float = Form(7.5)
):
    try:
        # Read image
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        img = img.resize((512, 512))
        
        # Generate
        with torch.no_grad():
            result = pipe(
                prompt=prompt,
                image=img,
                strength=strength,
                num_inference_steps=num_inference_steps,
                guidance_scale=guidance_scale,
            ).images[0]
        
        # Save
        filename = f"result_{uuid.uuid4()}.png"
        result.save(filename)
        
        return {
            "status": "success",
            "result_url": f"/results/{filename}",
            "student_id": "423830113",
            "student_name": "娴爣"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/results/{filename}")
def get_result(filename: str):
    return FileResponse(filename)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)