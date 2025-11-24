import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiUploadCloud, FiCheck, FiMic } from 'react-icons/fi'

const AudioUploadPage: React.FC = () => {
  const navigate = useNavigate()
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string>()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('audio/')) {
      setFileName(file.name)
      simulateUpload()
    } else {
      alert('Please select an audio file')
    }
  }

  const simulateUpload = async () => {
    setIsUploading(true)
    setUploadProgress(0)
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setUploadProgress(i)
    }
    
    setIsUploading(false)
    setUploadProgress(100)
    
    setTimeout(() => {
      navigate('/chat')
    }, 1000)
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-200/50 px-6 py-5 bg-gradient-to-r from-white via-white to-slate-50/50 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/chat')}
            className="p-2.5 hover:bg-slate-100 rounded-lg transition-all duration-200 text-slate-700 hover:text-slate-900 hover:scale-110 active:scale-95 font-medium"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiMic size={28} className="text-blue-600" />
            Upload Audio
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="max-w-2xl w-full">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-300 ${
              isDragging
                ? 'border-blue-500 bg-blue-50 shadow-2xl scale-105 -translate-y-2'
                : 'border-slate-300 bg-white hover:border-blue-400 hover:shadow-lg hover:scale-105 hover:-translate-y-1'
            }`}
          >
            {uploadProgress === 100 ? (
              <div className="space-y-6 animate-fade-in">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 animate-pulse-soft">
                  <FiCheck size={40} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <FiCheck size={24} className="text-green-600" />
                    Upload Complete!
                  </h3>
                  <p className="text-slate-600 text-base font-medium">{fileName}</p>
                </div>
              </div>
            ) : isUploading ? (
              <div className="space-y-6 animate-fade-in">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
                  <div className="animate-spin">
                    <FiUploadCloud size={40} className="text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FiUploadCloud size={24} className="text-blue-600 animate-bounce" />
                    Uploading...
                  </h3>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-sm">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-700 h-3 rounded-full transition-all duration-300 shadow-sm"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-base text-slate-600 font-bold mt-4">{uploadProgress}%</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 animate-pulse-soft">
                  <FiUploadCloud size={40} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Upload Audio File</h3>
                  <p className="text-slate-600 text-base mb-6">Drag and drop your audio file here, or click to select</p>
                </div>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="audio-input"
                  aria-label="Select audio file"
                />
                <label
                  htmlFor="audio-input"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 cursor-pointer font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  Select File
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { AudioUploadPage }

