import React from 'react';
import bgImage from "../assets/bg.png";
import bgImage2 from "../assets/bg2.png";
import Quote from "../assets/Quote.png";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const HeroSection = () => {
  const heroSections = [
    {
      id: 1,
      title1: "AI-Driven",
      title2: "Brain-Segmentation Analysis",
      description: "Get accurate and efficient CT scan analysis at your fingertips.",
      bgImage: bgImage,
    },
    {
      id: 2,
      title: "Accurate and Efficient CT Scan Analysis at Your Fingertips",
      description: "Recieve Brain segmentation results and HIPAA compliant medical reports in seconds",
      bgImage: bgImage2,
    }
  ];

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const shouldShowGetStarted = !currentUser && location.pathname !== '/signin';


  return (
    <div className="w-full">
      {/* First Section */}
      <div className="relative h-screen w-full flex">
        <div className="w-1/12">
          <div
            className="absolute top-0 right-0 left-44 bottom-24 mr-1 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${heroSections[0].bgImage})`,
              transform: 'scale(0.90)'
            }}
          >
          </div>
        </div>
        <div className="w-1/2 flex flex-col items-start justify-center text-white px-16 mb-6">
          <h2 className="text-7xl  w-[1000px] font-bold mb-1">
            {heroSections[0].title1}
          </h2>
          <h2 className="text-7xl w-[1000px] font-bold mb-6">
            {heroSections[0].title2}
          </h2>
          <p className="text-2xl max-w-xl mb-10">
            {heroSections[0].description}
          </p>
          {shouldShowGetStarted && (
            <button
              onClick={() => navigate('/signin')}
              className="bg-custom-blue hover:bg-indigo-600 text-white font-bold py-4 px-5 rounded-full transition-colors duration-300 z-10"
            >
              Get Started
            </button>

          )}
        </div>
      </div>

      {/* Second Section */}
      <div className="relative h-screen w-full">
        <div className="relative h-screen w-full">
          <div
            className="absolute right-0 w-[50%] h-full bg-contain bg-center bg-no-repeat mr-20"
            style={{
              backgroundImage: `url(${heroSections[1].bgImage})`,
              transform: 'scale(0.95)'
            }}
          >
          </div>
        </div>

        <div className="absolute z-10 top-1 left-44 w-1/2 mt-16 ">
          <h1 className="text-white 
          top-1/2 text-6xl font-bold leading-tight mb-20 mt-0 ">
            {heroSections[1].title}
          </h1>
          <p className="text-white text-2xl w-[500px] mt-0 leading-8 ">
            {heroSections[1].description}
          </p>
        </div>
      </div>

      {/* Third Section */}
      <div className="py-32 ">
        <h1 className="text-white text-6xl font-bold text-center mb-24">Features</h1>

        <div className="container mx-auto px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 ">

            <div className="bg-custom-gray-light-2 p-12 rounded-3xl relative min-h-[320px] flex items-center py-20 shadow-[8px_8px_0_0_#5C5C5C]">
              <div className="absolute top-8 left-8 py-10">
                <img src={Quote} alt="Quote" className="w-12 h-12" />
              </div>
              <p className="text-white text-xl text-center px-4 font-bold py-10">
                Seamless drag-and-drop file uploads, secure cloud processing, and easy access to detailed reports while adhering to data privacy standards
              </p>
              <div className="absolute bottom-8 right-8 scale-x-[-1] py-12">
                <img src={Quote} alt="Quote" className="w-12 h-12" />
              </div>
            </div>

            <div className="bg-custom-gray-light-2 p-12 rounded-3xl relative min-h-[320px] flex items-center py-20 shadow-[8px_8px_0_0_#5C5C5C]">
              <div className="absolute top-14 left-12 py-10">
                <img src={Quote} alt="Quote" className="w-12 h-12" />
              </div>
              <p className="text-white text-xl text-center px-4 font-bold py-10">
                Interactive 3D models and GIFs of segmented brain regions for enhanced understanding and easy analysis of brain tumors
              </p>
              <div className="absolute bottom-12 right-12 scale-x-[-1] py-12 mr-2 mb-2">
                <img src={Quote} alt="Quote" className="w-12 h-12" />
              </div>
            </div>

            <div className="bg-custom-gray-light-2 p-12 rounded-3xl relative min-h-[320px] flex items-center py-20 shadow-[8px_8px_0_0_#5C5C5C]">
              <div className="absolute top-14 left-8 py-12">
                <img src={Quote} alt="Quote" className="w-12 h-12" />
              </div>
              <p className="text-white text-xl text-center px-4 font-bold py-10">
                Secure handling of sensitive medical data with adherence to industry standards such as HIPAA for data protection
              </p>
              <div className="absolute bottom-14 right-10 scale-x-[-1] py-12 mr-2 mb-2">
                <img src={Quote} alt="Quote" className="w-12 h-12" />
              </div>
            </div>

          </div>
        </div>
      </div>


    </div>
  );

};

export default HeroSection;
