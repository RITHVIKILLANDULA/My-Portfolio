import React from 'react'
import { CONTACT } from '../constants'
import {motion} from 'framer-motion'

export default function  Contact() {
  return (
    <div className='border-b border-neutral-900 pb-20'>
        <motion.h1 
        whileInView={{opacity:1,y:0}}
        initial={{opacity:0,y:-100}}
        transition={{duration:0.5}}
        className='my-10 text-center text-4xl'>Get in Touch</motion.h1>
        <div className='text-center tracking-tighter'>
        <motion.p 
          whileInView={{opacity:1,x:0}}
          initial={{opacity:0,x:-100}}
          transition={{duration:1}}
        className='my-4'>{CONTACT.address}</motion.p>
        <motion.p 
         whileInView={{opacity:1,x:0}}
         initial={{opacity:0,x:100}}
         transition={{duration:1}}
        className='my-4'><a href={`tel:${CONTACT.phoneNo}`} className='border-b'>{CONTACT.phoneNo}</a></motion.p>
        <motion.p 
         whileInView={{opacity:1,x:0}}
         initial={{opacity:0,x:100}}
         transition={{duration:1}}
        className='my-4'><a href={`mailto:${CONTACT.email}`} className='border-b'>{CONTACT.email}</a></motion.p>
        <div className='my-8 flex justify-center gap-8'>
          <motion.a 
           whileInView={{opacity:1,y:0}}
           initial={{opacity:0,y:100}}
           transition={{duration:0.8}}
          href={CONTACT.linkedin} target='_blank' rel='noopener noreferrer' className='border-b'>LinkedIn</motion.a>
          <motion.a 
           whileInView={{opacity:1,y:0}}
           initial={{opacity:0,y:100}}
           transition={{duration:0.8, delay:0.2}}
          href={CONTACT.github} target='_blank' rel='noopener noreferrer' className='border-b'>GitHub</motion.a>
        </div>
       </div>
       </div>
  )
}
