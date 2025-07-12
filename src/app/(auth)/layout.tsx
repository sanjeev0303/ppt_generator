import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-dvh w-screen flex justify-center items-center'>
        { children }
    </div>
  )
}

export default AuthLayout
