"use client"

import { Button } from '@/components/ui/button'
import { useSlideStore } from '@/store/useSlideStore'
import { Home, Play, Share } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner'

type Props = {
    presentationId: string
}

const Navbar = ({presentationId}: Props) => {
    const { currentTheme,  } = useSlideStore()
    const [isPresentationMode, setIsPresentationMode] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(`${window.location.origin}/share/${presentationId}`)
        toast.success("Link Copied", {
            description: "The link to the presentation has been copied to your clipboard."
        })
    }

  return (
    <nav className='fixed top-0 left-0 ring-0 z-50 w-full h-20 flex items-center justify-between py-4 px-7 border-b'
    style={{
        backgroundColor: currentTheme?.navbarColor || currentTheme?.backgroundColor,
        color: currentTheme.accentColor,
    }}
    >
        <Link href={'/dashboard'} passHref>
        <Button
        variant={"outline"}
        className={`flex items-center gap-2`}
        style={{
            backgroundColor: currentTheme.backgroundColor,
        }}
        >
            <Home className='w-4 h-4' />
            <span className='hidden sm:inline'>Return Home</span>
        </Button>
        </Link>

        <Link href='/presentation/template-market'
        className='text-lg font-semibold hidden sm:block'
        >Presentation Editor</Link>

        <div className='flex items-center gap-4'>
            <Button
            style={{
                backgroundColor: currentTheme.backgroundColor
            }}
            variant={"outline"}
            onClick={handleCopy}
            >
                <Share className='w-4 h-4' />
                <span className='hidden sm:inline'>Share</span>
            </Button>

            {/* WIP: add lemon sq sell templates */}
            {/* <SellTemplate /> */}

            <Button
            variant={"default"}
            className='flex items-center gap-2'
            onClick={() => setIsPresentationMode(!isPresentationMode)}
            >
               <Play className='w-4 h-4' />
               <span className='hidden sm:inline'>{isPresentationMode ? "Exit Presentation Mode" : "Start Presentation"}</span>
            </Button>
        </div>
        {/* WIP: add presentation mode */}
        {/* {isPresentationMode && <PresentationMode />} */}
    </nav>
  )
}

export default Navbar
