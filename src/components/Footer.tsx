import { FaGithub, FaLinkedin, FaKaggle } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className=" bg-gray-800">
      <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                NB
              </div>
              <span className="text-2xl font-bold dark:text-white">Naresh B A</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center md:text-left">
              Full Stack Developer & Data Enthusiast
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold dark:text-white mb-4">Connect with me</h3>
            <div className="flex justify-center space-x-6">
              <a
                href="https://github.com/Phoenixarjun"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="GitHub"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/naresh-b-a-1b5331243"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://www.kaggle.com/nareshba007"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Kaggle"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Kaggle"
              >
                <FaKaggle size={24} />
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center md:items-end">
            <div className="flex items-center space-x-2">
              <div className="relative w-30 h-10">
                <Image
                  src="/logoTransparentBg.png" 
                  alt="Fitsync Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Your Fitness Companion
            </p>
          </div>
        </div>

        <hr className="my-8 " />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Naresh B A. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}