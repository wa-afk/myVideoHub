import  React, { useState } from 'react'
import Layout from '../../components/Layout'
import { Link, useNavigate } from 'react-router-dom'
import type { AuthFormData } from '../../types'
import type { AppDispatch } from '../../reducers/store'
import { useDispatch, useSelector } from 'react-redux'
import { selectLoading, signInUser } from '../../reducers/auth/authReducer'

const SignIn: React.FC = () => {
  const loading= useSelector(selectLoading)

  const [formData, setFormData]= useState<AuthFormData> ({
        email: "",
        password: "",
  })
  const handleChange= (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value}= e.target
    setFormData((prev) => ({
        ...prev, 
        [name]: value,
    }))
  }

  const dispatch= useDispatch<AppDispatch>()
  const navigate= useNavigate()
  const handleSubmit= async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()                              /*Prevent page refresh on submit*/
    const {email, password}= formData;
    dispatch(signInUser({email, password, navigate}))
  }
  return <Layout>
    <div className='flex items-center justify-center p-4 w-full'>
        <div className='w-full max-w-md bg-white rounded-lg shadow-lg p-6'>
            <h1 className='text-3xl font-bold text-center text-gray-800 mb-6'>Welcome Back</h1>
            <form className='space-y-7' onSubmit={ handleSubmit }>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>
                        Email
                    </label>
                    <input type='email' name='email' required placeholder='Enter your email' className='mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
                    onChange={ handleChange }
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>
                        Password
                    </label>
                    <input type='password' name='password' required placeholder='Enter your password' className='mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
                    onChange={ handleChange }
                    />
                </div>

                <div className='flex justify-between items-center'>
                    <Link to='/reset-password' className='text-sm font-medium text-indigo-600 hover:text-indigo-500'>
                    Forgot your password?
                    </Link>
                </div>

                <button type='submit' disabled={ loading } className={`w-full py-3 px-4 bg-green-500 text-white font-bold rounded-md shadow-md transition duration-300 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center`}>
                {loading? "Verifying ...": "Sign In"}
                </button>

                <div className='flex items-center justify-center gap-2'>
                    <p className='text-sm font-medium text-gray-500'>Don't have an account?</p>
                    <Link to={'/sign-up'} className='text-sm font-medium text-indigo-600 hover:text-indigo-500 transtion-all duration-300'>
                    Sign up for free
                    </Link>
                </div>
            </form>
        </div>
    </div>
  </Layout>
}

export default SignIn