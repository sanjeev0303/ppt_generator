import { redirect } from 'next/navigation'
import React from 'react'

const Presentation = () => {

    redirect("/dashboard")

  return (
    <div>Presentation</div>
  )
}

export default Presentation
