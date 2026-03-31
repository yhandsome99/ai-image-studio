import { useState } from 'react'
import axios from 'axios'

const STYLES = [
  { label: '油画', value: 'oil painting, masterpiece' },
  { label: '水彩', value: 'watercolor painting' },
  { label: '铅笔素描', value: 'pencil sketch' },
  { label: '炭笔画', value: 'charcoal drawing' },
  { label: '赛博朋克', value: 'cyberpunk neon' },
  { label: '复古胶片', value: 'vintage retro film' },
  { label: '印象派', value: 'impressionist painting' },
  { label: '梵高风格', value: 'Van Gogh style' },
  { label: '莫奈风格', value: 'Monet style' },
]

export default function App() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [strength, setStrength] = useState(0.75)
  const [steps, setSteps] = useState(30)
  const [guidance, setGuidance] = useState(7.5)
  const [prompt, setPrompt] = useState('oil painting, masterpiece')

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleGenerate = async () => {
    if (!image) { alert('请先上传图片'); return }
    setLoading(true)
    setResult(null)
    try {
      const fd = new FormData()
      fd.append('image', image)
      fd.append('prompt', prompt)
      fd.append('strength', strength)
      fd.append('num_inference_steps', steps)
      fd.append('guidance_scale', guidance)
      const res = await axios.post('http://localhost:8000/api/transfer', fd)
      setResult('http://localhost:8000' + res.data.result_url)
    } catch (err) {
      alert('生成失败: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)', color: '#fff', fontFamily: 'sans-serif', padding: '32px 16px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0, background: 'linear-gradient(90deg,#f472b6,#a78bfa,#67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI 图像风格迁移工作台
          </h1>
          <p style={{ color: '#94a3b8', marginTop: 8, fontSize: 15 }}>将您的照片转化为各种艺术风格</p>
          <div style={{ display: 'inline-block', marginTop: 16, padding: '10px 28px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.5)', borderRadius: 12 }}>
            <span style={{ color: '#67e8f9', fontWeight: 700 }}>学号：423830113</span>
            <span style={{ color: '#94a3b8', margin: '0 12px' }}>|</span>
            <span style={{ color: '#f472b6', fontWeight: 700 }}>姓名：浮标</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>

          <div style={{ background: 'rgba(30,27,75,0.6)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>上传图片</h2>
            <label style={{ display: 'block', cursor: 'pointer' }}>
              <div style={{ border: '2px dashed rgba(139,92,246,0.5)', borderRadius: 12, padding: '32px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>+</div>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: 14 }}>点击选择图片</p>
                <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 12 }}>支持 JPG / PNG / WebP</p>
              </div>
              <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
            </label>
            {preview && (
              <div style={{ marginTop: 16 }}>
                <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>原图预览</p>
                <img src={preview} alt="preview" style={{ width: '100%', borderRadius: 8, display: 'block' }} />
              </div>
            )}
          </div>

          <div style={{ background: 'rgba(30,27,75,0.6)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>AI 参数调节</h2>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>风格快捷选择</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {STYLES.map(s => (
                  <button key={s.value} onClick={() => setPrompt(s.value)} style={{
                    padding: '4px 12px', fontSize: 12, borderRadius: 20, border: '1px solid', cursor: 'pointer',
                    background: prompt === s.value ? '#7c3aed' : 'transparent',
                    borderColor: prompt === s.value ? '#7c3aed' : 'rgba(139,92,246,0.4)',
                    color: '#fff'
                  }}>{s.label}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>自定义风格描述</label>
              <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>
                <span>风格强度</span><span style={{ color: '#a78bfa' }}>{strength.toFixed(2)}</span>
              </label>
              <input type="range" min="0" max="1" step="0.05" value={strength} onChange={e => setStrength(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed' }} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>
                <span>推理步数</span><span style={{ color: '#a78bfa' }}>{steps}</span>
              </label>
              <input type="range" min="20" max="50" step="1" value={steps} onChange={e => setSteps(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed' }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>
                <span>引导系数</span><span style={{ color: '#a78bfa' }}>{guidance.toFixed(1)}</span>
              </label>
              <input type="range" min="1" max="20" step="0.5" value={guidance} onChange={e => setGuidance(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed' }} />
            </div>

            <button onClick={handleGenerate} disabled={loading} style={{ width: '100%', padding: '12px 0', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? '#4c1d95' : 'linear-gradient(90deg,#ec4899,#7c3aed)', color: '#fff', fontWeight: 700, fontSize: 15, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'AI 处理中...' : '生成风格图'}
            </button>
          </div>

          <div style={{ background: 'rgba(30,27,75,0.6)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>生成结果</h2>
            {result ? (
              <div>
                <img src={result} alt="result" style={{ width: '100%', borderRadius: 8, display: 'block' }} />
                <a href={result} download="ai-style-result.png" style={{ display: 'block', textAlign: 'center', padding: '10px 0', background: '#0891b2', borderRadius: 8, color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: 14, marginTop: 12 }}>
                  下载图片
                </a>
              </div>
            ) : (
              <div style={{ height: 240, background: 'rgba(15,23,42,0.5)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 14 }}>
                {loading ? '正在生成中...' : '上传图片并点击「生成风格图」'}
              </div>
            )}
          </div>

        </div>

        <div style={{ textAlign: 'center', marginTop: 40, color: '#475569', fontSize: 13 }}>
          AI 图像风格迁移工作台 | 学号：423830113 | 姓名：浮标
        </div>
      </div>
    </div>
  )
}