import React from 'react'
import { EXPERIENCES } from '../constants'
import {motion} from 'framer-motion'

export default function Experience() {
  return (
    <div className='border-b border-neutral-900 pb-4'>
        <motion.h1 
        whileInView={{opacity:1,y:0}}
        initial={{opacity:0,y:-100}}
        transition={{duration:0.5}}
        className='my-20 text-center text-4xl;'>Experience</motion.h1>
        <div>
            {EXPERIENCES.map((experience,index)=>(
            <div key={index} className='mb-12 flex flex-wrap lg:flex-nowrap gap-8 items-start'>
                <motion.div 
                whileInView={{opacity:1,x:0}}
                initial={{opacity:0,x:-100}}
                transition={{duration:1}}
                className='flex flex-col items-center gap-3 min-w-max'>
                    {experience.logo && (
                        <img 
                            src={experience.logo} 
                            alt={`${experience.company} logo`}
                            className='w-20 h-20 rounded-lg object-contain bg-white p-2'
                        />
                    )}
                    <p className='text-xs text-neutral-400 text-center whitespace-nowrap'>{experience.year}</p>
                </motion.div>
                <motion.div
                whileInView={{opacity:1,x:0}}
                initial={{opacity:0,x:100}}
                transition={{duration:1}}
                className='flex-1'>
                    <h6 className='mb-1 font-semibold text-lg'>
                        {experience.role}
                    </h6>
                    <p className='text-sm text-purple-100 mb-4'>
                        {experience.company}
                    </p>
                    <p className='mb-4 text-neutral-400 text-sm leading-relaxed'>{experience.description}</p>
                    <div className='flex flex-wrap gap-2'>
                    {experience.technologies.map((tech,index)=>(
                        <span key={index} className='rounded bg-neutral-900 px-2 py-1 text-xs font-medium text-purple-300'>{tech}</span>
                    ))}
                    </div>
                </motion.div>
             </div>
        ))}
        </div>      
    </div>
  )
}
