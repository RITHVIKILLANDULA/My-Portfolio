import React from 'react'
import { RiReactjsLine } from 'react-icons/ri'
import { TbBrandNextjs } from 'react-icons/tb'
import { SiMongodb} from 'react-icons/si'
import { DiRedis } from 'react-icons/di'
import { FaNodeJs } from 'react-icons/fa'
import { BiLogoPostgresql } from 'react-icons/bi'
import {animate, motion} from 'framer-motion'
import { FaPython } from "react-icons/fa";
import { SiMysql } from "react-icons/si";
import { DiDjango } from "react-icons/di";
import { FaGolang } from "react-icons/fa6";
import { FaAws } from "react-icons/fa";
import { FaJenkins } from "react-icons/fa";
import { SiFlask } from "react-icons/si";
import { TbBrandCpp } from "react-icons/tb";
import { SiNodered } from "react-icons/si";
import { SiAnsible } from "react-icons/si";
import { SiGeopandas } from "react-icons/si";
import { SiNumpy } from "react-icons/si";
import { SiScikitlearn } from "react-icons/si";
import { SiPytorch } from "react-icons/si";
import { SiTensorflow } from "react-icons/si";
import { GrHadoop } from "react-icons/gr";
import { SiApachespark } from "react-icons/si";
import { DiJavascript } from "react-icons/di";

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
                    <RiReactjsLine className='text-7xl text-cyan-400'/>
                </motion.div>

                <motion.div 
                 variants={iconvariants(3)}
                 initial="initial"
                 animate="animate"
                 className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <FaPython className='text-7xl text-yellow-600'/>
                </motion.div>

                <motion.div   variants={iconvariants(5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <SiMongodb className='text-7xl text-green-500'/>
                    </motion.div>

                <motion.div   variants={iconvariants(2)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <DiDjango className='text-7xl text-sky-700'/>
                    </motion.div>

                <motion.div   variants={iconvariants(6)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <FaNodeJs className='text-7xl text-green-500'/>
                    </motion.div>

                <motion.div   variants={iconvariants(2.5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                <SiMysql className='text-7xl text-sky-700'/>
                </motion.div>

                <motion.div   variants={iconvariants(2.5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                <FaGolang className='text-7xl text-orange-700'/>
                </motion.div>


                <motion.div   variants={iconvariants(2.5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                <FaAws className='text-7xl text-sky-700'/>
                </motion.div>

                <motion.div   variants={iconvariants(2.5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                <FaJenkins className='text-7xl text-red-700'/>
                </motion.div>

                <motion.div   variants={iconvariants(2.5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                <SiFlask className='text-7xl text-gray-700'/>
                </motion.div>

                <motion.div   variants={iconvariants(2.5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                <TbBrandCpp className='text-7xl text-sky-700'/>
                </motion.div>

                <motion.div   variants={iconvariants(2.5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                <SiNodered className='text-7xl text-red-700'/>
                </motion.div>

                <motion.div   variants={iconvariants(2.5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                <SiAnsible  className='text-7xl text-sky-700'/>
                </motion.div>

                <motion.div   variants={iconvariants(2.5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                <SiGeopandas className='text-7xl text-violet-700'/>
                </motion.div>

                <motion.div   variants={iconvariants(2.5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                <SiNumpy className='text-7xl text-cyan-700'/>
                </motion.div>

                <motion.div   variants={iconvariants(2.5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                <SiScikitlearn className='text-7xl text-cyan-700'/>
                </motion.div>

                <motion.div   variants={iconvariants(2.5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                <SiPytorch className='text-7xl text-red-700'/>
                </motion.div>

                <motion.div   variants={iconvariants(2.5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                <SiTensorflow className='text-7xl text-orange-700'/>
                </motion.div>

                <motion.div   variants={iconvariants(2.5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                <GrHadoop className='text-7xl text-yellow-200'/>
                </motion.div>

                <motion.div   variants={iconvariants(2.5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                <SiApachespark className='text-7xl text-orange-700'/>
                </motion.div>

                <motion.div   variants={iconvariants(2.5)}
                initial="initial"
                animate="animate"
                className='rounded-2xl border-4 border-neutral-800 p-4'>
                <DiJavascript className='text-7xl text-white-700'/>
                </motion.div>

            </motion.div>     
        </div>
  )
}
