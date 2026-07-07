import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout';
import backendApi from '../../api/backendApi';
import { toast } from 'sonner';

interface ResetResponse {
    success: boolean; 
    message: string;
};

const ResetPasswordEmail: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            setLoading(true);
            const {data} = await backendApi.post<ResetResponse>("/api/v1/auth/reset-password", {email});
            if (data.success) {
                toast.success(data.message);
                navigate("/sign-in");
            } else {
                toast.warning(data.message);
                navigate("/sign-in");
            }
        } catch (error) {     
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }; 

    return <Layout>
        <div className="p-4">
           <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
                    Reset Your Password
                </h1>
                <form className='space-y-6' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='email' className='block text-sm font-semibold text-gray-700'>Email</label>
                        <input name='email'
                            type='email' 
                            required
                            placeholder='Enter your email'
                            className='mt-1 block w-full px-4 py-3  border border-gray-300 rounded-md focus:ring-indigo-500'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button type='submit' className={ `w-full px-4 py-3 bg-green-500 text-white font-bold rounded-md shadow-md
                        transition duration-300 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center
                        ${loading}? "bg-opacity-90" : "hover:bg-opacity-90"` }
                        disabled={loading}
                    >
                    Reset Password
                    </button>

                    <div className='text-center mt-4'>
                        <span className='text-sm text-gray-600'>Not a member yet?</span>
                        <Link to="/sign-up" className='text-sm font-medium text-indigo-600 hover:text-indigo-500'>Sign up for free</Link>
                    </div>
                </form>
            </div> 
        </div>
    </Layout>
};

export default ResetPasswordEmail;