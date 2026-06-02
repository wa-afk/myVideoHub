import React, { useRef, useState } from 'react'
import SideBar from '../../components/SideBar'
import 'react-quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'
import { toast } from 'sonner'
import backendApi from '../../api/backendApi'
import { useConfig } from '../../customHooks/useConfigHook'

const Upload: React.FC = () => {
  const fileRef = useRef<HTMLInputElement>(null)
  const thumbnailRef = useRef<HTMLInputElement>(null)
  const [videoSrc, setVideoSrc] = useState<string | null>("")
  const [thumbnailSrc, setThumbnailSrc] = useState<string | null>("")
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [isPrivate, setIsPrivate] = useState<string>("true")
  const [loading, setLoading] = useState<boolean>(false)
  const { configWithJWT } = useConfig()

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
          if (file.type.startsWith("video")) {
              const videoUrl = URL.createObjectURL(file)
              setVideoSrc(videoUrl)
          }
      } else {
        toast.warning("select the video")
        return
      }
  }
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
          if (file.type.startsWith("image")) {
              const ThumbnailUrl = URL.createObjectURL(file)
              setThumbnailSrc(ThumbnailUrl)
          }
      }
  }
  const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsPrivate(e.target.value)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    const thumbnail = thumbnailRef.current?.files?.[0]
    if (!file) {
        toast.warning("Please select a file")
        return
    }
    setLoading(true)
    try {
        const formData = new FormData()
        formData.append("title", title || "")
        formData.append("description", description || "")
        formData.append("video", file)
        formData.append("isPrivate", isPrivate)
        if (thumbnail) {
            formData.append("thumbnail", thumbnail)
        }
        const { data } = await backendApi.post(
            "/api/v1/azure/upload-file", 
            formData, 
            { ...configWithJWT, headers: {
                ...configWithJWT.headers,
                "Content-Type": "multipart/form-data",
            }}
        )
        if (data) {
            toast.success(data.message)
            setTitle("")
            setDescription("")
            setIsPrivate("true")
            setVideoSrc(null)
            setThumbnailSrc(null)

        } else {
            toast.warning(data.message)
        }
    } catch (error) {
        toast.error("Something went wrong")
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="flex w-full">
        <SideBar />
        <main className="flex-1 p-4 mt-7 lg:ml-64">
            <section className="flex flex-col items-center">
                <form onSubmit={handleSubmit} className="container flex flex-col gap-4 p-6 bg-white shadow-lg rounded-lg">
                    <label htmlFor="video" className="text-textOne font-semibold">
                        Video
                    </label>
                    <input 
                        type="file" 
                        ref={fileRef} 
                        onChange={handleVideoChange}
                        accept="video/*"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {videoSrc && (
                    <div className="mt-4 flex flex-col items-center">
                        <video src={videoSrc}
                            controls 
                            className="w-32 h-32 object-cover rounded-md shadow-md"
                        ></video>    
                    </div>
                    )}

                    <label htmlFor="thumbnail" className="text-textOne font-semibold">
                        Thumbnail (optional)
                    </label>
                    <input
                        type="file"
                        ref={thumbnailRef}
                        onChange={handleThumbnailChange}
                        accept="image/*" 
                        className="w-full p-3 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {thumbnailSrc && (
                    <div className="mt-4 flex flex-col items-center">
                        <img src={thumbnailSrc}
                            className="w-32 h-32 object-cover rounded-md shadow-md"
                        ></img>    
                    </div>
                    )}

                    <label htmlFor="title" className="text-textOne font-semibold">
                        Title
                    </label>
                    <input
                        type="text" 
                        name="title" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title of your video"
                        className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />

                    <label htmlFor="description">Description</label>
                    <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={setDescription}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none 
                        focus:ring-2 focus:ring-blue-600"
                    />

                    <label htmlFor="privacy">Privacy (optional)</label>
                    <select
                        name="privacy" 
                        value={isPrivate} 
                        onChange={handlePrivacyChange}
                        className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        <option value={"false"}>Public</option>
                        <option value={"true"}>Private</option>
                    </select>

                    <div className="flex items-center justify-center">
                        <button type="submit" className="bg-bgFour rounded-md p-2 text-white text-lg
                            mt-5 hover:bg-opacity-70 duration-300 capitalize w-full md:w-fit flex items-center
                            disabled:cursor-not-allowed"
                        >
                            {loading ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    className="animate-spin mr-2 h-5 w-5 text-white"
                                >
                                    <circle
                                        cx="12" cy="12" r="10"
                                        stroke="currentColor" strokeWidth="4"
                                        className="opacity-25"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                                        className="opacity-75"
                                    />
                                </svg>
                                Uploading...
                            </>
                        ) : (
                            "Upload Video"
                        )}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    </div>
  )
}

export default Upload