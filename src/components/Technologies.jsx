import React from 'react'
import {FaPython} from "react-icons/fa";
import {SiPostgresql} from "react-icons/si";
import {SiMysql} from "react-icons/si";
import {SiSnowflake} from "react-icons/si";
import {SiTableau} from "react-icons/si";
import {motion} from 'framer-motion'

const iconvariants=(duration)=>({
    initial:{y:-10},
    animate:{
        y:[10,-10],
        transition:{
            duration:duration,
            ease:"linear",
            repeat:Infinity,
            repeatType:"reverse",
        },
    },
})

export default function Technologies() {
  return (
    <div className='border-b border-neutral-800 pb-24'>
        <motion.h1 whileInView={{opacity:1,y:0}} initial={{opacity:0,y:-100}} transition={{duration:1}} className='my-20 text-center text-4xl'> Technologies  </motion.h1> 
            <motion.div whileInView={{opacity:1,x:0}} initial={{opacity:0 ,x:-100}} transition={{duration:1.5}} className='flex flex-wrap items-center justify-center gap-4'>
                <motion.div 
                variants={iconvariants(2.5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <FaPython className='text-7xl text-yellow-600'/>
                </motion.div>

                <motion.div 
                 variants={iconvariants(3)}
                 initial="initial"
                 animate="animate"
                 className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <SiPostgresql className='text-7xl text-blue-600'/>
                </motion.div>

                <motion.div   variants={iconvariants(5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <SiMysql className='text-7xl text-sky-700'/>
                    </motion.div>

                <motion.div   variants={iconvariants(2)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <SiSnowflake className='text-7xl text-cyan-300'/>
                    </motion.div>

                <motion.div   variants={iconvariants(4)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                <SiTableau className='text-7xl text-orange-600'/>
                </motion.div>

            </motion.div>     
        </div>
  )
}
