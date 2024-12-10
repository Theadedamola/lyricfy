import { PenToolIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/Button'
import image1 from '../assets/hero-img.png'
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <div className="flex h-screen min-h-[600px] py-32 justify-center px-6">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center justify-center gap-4 w-full max-w-[700px]">
          <motion.h1
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.1 }}
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-center font-semibold"
          >
            Show your favorite{' '}
            <span className="font-cehua text-red-600">quotes</span> and{' '}
            <span className="font-cehua text-purple-600">sayings</span> the{' '}
            <span className="font-cehua text-teal-700">lyrics</span> style
          </motion.h1>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.1 }}
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-gray-500 text-center max-w-[500px]"
          >
            Use the music players lyrics viewing style to display your favorite
            lyric, sayings, quotes etc
          </motion.p>
          <Link to="/dashboard" className="">
            <Button className="gap-2">
              <PenToolIcon className="w-4 h-4" />
              <span className="text-sm">Start Creating</span>
            </Button>
          </Link>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.1 }}
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
          }}
          className="flex items-center justify-center mt-10"
        >
          <img src={image1} alt="" className="z-20" />
        </motion.div>
      </div>
    </div>
  )
}
export default Hero
