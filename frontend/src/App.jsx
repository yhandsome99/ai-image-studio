import { useState } from 'react'
import axios from 'axios'

export default function App() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [strength, setStrength] = useState(0.75)
  const [steps, setSteps] = useState(30)
  const [guidance, setGuidance] = useState(7.5)
  const [prompt, setPrompt] = useState('oil painting, masterpiece')

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!image) {
      alert('璇峰厛涓婁紶鍥剧墖')
      return
    }
    
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('prompt', prompt)
      formData.append('strength', strength)
      formData.append('num_inference_steps', steps)
      formData.append('guidance_scale', guidance)

      const response = await axios.post('http://localhost:8000/api/transfer', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setResult(response.data.result_url)
    } catch (error) {
      alert('澶勭悊澶辫触: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            馃帹 AI Image Style Transfer
          </h1>
          <p className="text-gray-300 text-lg">灏嗕綘鐨勭収鐗囪浆鎹负鑹烘湳椋庢牸</p>
          
          {/* Student Info */}
          <div className="mt-6 inline-block bg-purple-900/50 border border-purple-500 rounded-lg px-6 py-3">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-cyan-400">瀛﹀彿:</span> 423830113 | 
              <span className="font-semibold text-pink-400 ml-2">濮撳悕:</span> 娴爣
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur">
              <h2 className="text-xl font-bold mb-4">馃摛 涓婁紶鍥剧墖</h2>
              
              <label className="block mb-4">
                <div className="border-2 border-dashed border-purple-500/50 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <p className="text-gray-300">鐐瑰嚮閫夋嫨鍥剧墖</p>
                  <p className="text-sm text-gray-400">鎴栨嫋鎷戒笂浼?/p>
                </div>
              </label>

              {preview && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">鍘熷鍥剧墖棰勮</p>
                  <img src={preview} alt="preview" className="w-full rounded-lg" />
                </div>
              )}
            </div>
          </div>

          {/* Controls Section */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur">
              <h2 className="text-xl font-bold mb-4">馃帥锔?AI 鍙傛暟</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    椋庢牸鎻愮ず璇?                  </label>
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-slate-700 border border-purple-500/30 rounded px-3 py-2 text-white text-sm"
                    placeholder="e.g., oil painting, watercolor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    椋庢牸寮哄害: {strength.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0" max="1" step="0.05"
                    value={strength}
                    onChange={(e) => setStrength(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    鎺ㄧ悊姝ユ暟: {steps}
                  </label>
                  <input
                    type="range"
                    min="20" max="50" step="1"
                    value={steps}
                    onChange={(e) => setSteps(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    寮曞绯绘暟: {guidance.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="1" max="20" step="0.5"
                    value={guidance}
                    onChange={(e) => setGuidance(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 font-bold py-3 rounded-lg transition mt-6"
                >
                  {loading ? '鈴?澶勭悊涓?..' : '鉁?鐢熸垚椋庢牸鍥?}
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur">
              <h2 className="text-xl font-bold mb-4">馃帹 鐢熸垚缁撴灉</h2>
              
              {result ? (
                <div>
                  <img src={result} alt="result" className="w-full rounded-lg mb-4" />
                  <a
                    href={result}
                    download
                    className="w-full block text-center bg-cyan-600 hover:bg-cyan-700 font-bold py-2 rounded-lg transition"
                  >
                    馃摜 涓嬭浇鍥剧墖
                  </a>
                </div>
              ) : (
                <div className="h-64 bg-slate-700/50 rounded-lg flex items-center justify-center text-gray-400">
                  <p>鐢熸垚缁撴灉灏嗘樉绀哄湪杩欓噷</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>馃殌 鍩轰簬 Stable Diffusion 鐨?AI 鍥惧儚椋庢牸杩佺Щ | 瀛﹀彿: 423830113 | 濮撳悕: 娴爣</p>
        </div>
      </div>
    </div>
  )
}