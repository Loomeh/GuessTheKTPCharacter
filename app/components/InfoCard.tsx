import localFont from 'next/font/local';

const scFont = localFont({ src: '../../public/font/FOT-ChiaroStd-B.otf' })

interface InfoCardProps {
    onClose: () => void;
  }
  
  export default function InfoCard({ onClose }: InfoCardProps) {
    return (
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
        onClick={onClose}
      >
        <div 
          className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full mx-4 relative border-2 border-gray-100 animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
  
          {/* Content */}
          <div className="space-y-4">
            <h2 className={`${scFont.className} text-2xl font-bold text-gray-800 mb-2`}>
              How to Play
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed">
                This is a game where you have to guess the character from the <span className="font-semibold text-red-600">Kill The Past</span> game series based on limited information.
            </p>
  
            <ul className="space-y-3 text-gray-600 text-left">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2 mt-1">•</span>
                <span>You will have <strong>6 attempts</strong> to guess the character.</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2 mt-1">•</span>
                <span>Each failed attempt reveals a new piece of information about the character to you.</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2 mt-1">•</span>
                <span>A new character to guess is picked each day.</span>
              </li>
            </ul>
  
            <p className="text-sm text-gray-400 mt-6 italic">
              (Click outside to exit...)
            </p>
          </div>
        </div>
      </div>
    );
  }