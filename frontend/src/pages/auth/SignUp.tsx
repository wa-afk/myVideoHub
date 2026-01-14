import React from 'react'
import Layout from '../../components/Layout'

const SignUp: React.FC = () => {
  return <Layout>
    <div className='flex items-center justify-center p-4 w-full'>
        <div className='w-full max-w-md bg-white rounded-lg shadow-lg p-6'>
            <h1 className='text-3xl font-bold text-center text-gray-800 mb-6'>Join Us Today</h1>
            <form className='space-y-7'>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>
                        Email
                    </label>
                    <input type='email' name='email' required placeholder='Enter your email' className='mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm' />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>
                        Password
                    </label>
                    <input type='password' name='password' required placeholder='Enter your password' className='mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm' />
                </div>
                <button type='submit' className={`w-full py-3 px-4 bg-green-500 text-white font-bold rounded-md shadow-md transition duration-300 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center`}>
                Sign Up
                </button>
            </form>
        </div>
    </div>
  </Layout>
}

export default SignUp