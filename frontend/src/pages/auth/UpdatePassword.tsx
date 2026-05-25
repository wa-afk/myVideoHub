import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import backendApi from '../../api/backendApi'
import { toast } from 'sonner'
import Layout from '../../components/Layout'

interface UpdatePswdResponse {
    success: boolean,
    message: string
}

const UpdatePassword: React.FC = () => {
    const { token } = useParams<{ token: string }>()
    const [password, setPassword] = useState<string>("")
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            setLoading(true)
            const { data } = await backendApi.patch<UpdatePswdResponse>(`/api/v1/auth/update-password/${token}`, { password })
            if (data.success) {
                toast.success(data.message)
                navigate("/sign-in")
            } else {
                toast.warning(data.message)
                navigate("/sign-up")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return <Layout>
        <div className="p-4">
           <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
                    Reset Your Password
                </h1>
                <form className='space-y-6' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='password' className='block text-sm font-semibold text-gray-700'>New Password</label>
                        <input name='password'
                            type='password' 
                            required
                            placeholder='Enter your new password'
                            className='mt-1 block w-full px-4 py-3  border border-gray-300 rounded-md focus:ring-indigo-500'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type='submit' className={ `w-full px-4 py-3 bg-green-500 text-white font-bold rounded-md shadow-md
                        transition duration-300 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center
                        ${loading}? "bg-opacity-90" : "hover:bg-opacity-90"` }
                        disabled={loading}
                    >
                    Update Password
                    </button>

                    <div className='text-center mt-4'>
                        <span className='text-sm text-gray-600'>Not a member yet?</span>
                        <Link to="/sign-up" className='text-sm font-medium text-indigo-600 hover:text-indigo-500'>Sign up for free</Link>
                    </div>
                </form>
            </div> 
        </div>
    </Layout>
}

export default UpdatePassword