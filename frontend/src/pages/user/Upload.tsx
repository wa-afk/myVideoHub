import React from 'react'
import SideBar from '../../components/SideBar'
import 'react-quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'

const Upload: React.FC = () => {
  return (
    <div className="flex w-full">
        <SideBar />
        <main className="flex-1 p-4 mt-7 lg:ml-64">
            <section className="flex flex-col items-center">
                <form className="container flex flex-col gap-4 p-6 bg-white shadow-lg rounded-lg">
                    <label htmlFor="video" className="text-textOne font-semibold">
                        Video
                    </label>
                    <input type="file" accept="video/*" className="w-full p-3 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {<div className="mt-4 flex flex-col items-center">
                        <video src={""}
                            controls 
                            className="w-32 h-32 object-cover rounded-md shadow-md"
                        ></video>    
                    </div>}

                    <label htmlFor="thumbnail" className="text-textOne font-semibold">
                        Thumbnail (optional)
                    </label>
                    <input type="file" accept="image/*" className="w-full p-3 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {<div className="mt-4 flex flex-col items-center">
                        <img src={""}
                            className="w-32 h-32 object-cover rounded-md shadow-md"
                        ></img>    
                    </div>}

                    <label htmlFor="title" className="text-textOne font-semibold">
                        Title
                    </label>
                    <input type="text" name="title" placeholder="Enter title of your video"
                        className="w-full p-3 border border-gray-300 focus:outline-none 
                        focus:ring-2 focus:ring-blue-600"
                    />

                    <label htmlFor="description">Description</label>
                    <ReactQuill
                        theme="snow"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none 
                        focus:ring-2 focus:ring-blue-600"
                    />

                    <label htmlFor="privacy">Privacy (optional)</label>
                    <select name="privacy" className="w-full p-3 border border-gray-300 focus:outline-none
                        focus:ring-2 focus:ring-blue-600"
                    >
                        <option value={"false"}>Public</option>
                        <option value={"true"}>Private</option>
                    </select>

                    <button type="submit" className="bg-bgFour rounded-md p-2 text-white text-lg
                        mt-5 hover:bg-opacity-70 duration-300 capitalize w-full md:w-fit flex items-center
                        disabled:cursor-not-allowed"
                    >
                        Upload Video
                    </button>
                </form>
            </section>
        </main>
    </div>
  )
}

export default Upload