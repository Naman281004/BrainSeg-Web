import logo from "../assets/image.jpg";
import { Instagram, Linkedin, Github } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();

    const shouldShowGetStarted = !currentUser && location.pathname !== '/signin';

    return (
        <>
            <div className="bg-custom-gray h-14">
            </div>
            <footer className="border-t pb-20 bg-custom-gray pt-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-16 text-custom-gray-light -mb-10">
                        <div className="lg:col-span-2 flex flex-col items-center scale-110 -mt-4 mr-10">
                            <div className="flex items-center space-x-2 rounded scale-75">
                               <a href=""><img src={logo} alt="Brain Icon" className="" /></a> 
                            </div>

                            <p className="text-gray-400 text-center text-l mb-4 scale-110">
                                Revolutionizing Brain <br />
                                Tumor Diagnosis with AI
                            </p>

                            {shouldShowGetStarted && (
                                <button 
                                    onClick={() => navigate('/signin')} 
                                    className="bg-custom-blue hover:bg-indigo-600 text-white font-bold py-4 px-5 rounded-full transition-colors duration-300 scale-90"
                                >
                                    Get Started
                                </button>
                            )}
                        </div>


                        <div className="ml-5">
                            <h3 className="text-l font-semibold mb-4 text-white">Features</h3>
                            <ul className="space-y-2 text-xs leading-6">
                                <li>Tumor Segmentation</li>
                                <li>Visualization Tools</li>
                                <li>Secure Data Processing</li>
                                <li>Report Generation</li>
                            </ul>
                        </div>

                        <div className="ml-5">
                            <h3 className="text-l font-semibold mb-4 text-white">Solutions</h3>
                            <ul className="space-y-2 text-xs leading-6">
                                <li>Healthcare Planning</li>
                                <li>Diagnosis Assistance</li>
                                <li>Medical Imaging Analysis</li>
                            </ul>
                        </div>

                        <div className="ml-5">
                            <h3 className="text-l font-semibold mb-4 text-white">Resources</h3>
                            <ul className="space-y-2 text-xs leading-6">
                                <li className="hover:text-custom-blue cursor-pointer">Blog</li>
                                <li className="hover:text-custom-blue cursor-pointer">FAQs</li>
                                <li className="hover:text-custom-blue cursor-pointer">Research Papers</li>
                            </ul>
                        </div>

                        <div className="ml-5">
                            <h3 className="text-l font-semibold mb-4 text-white">Socials</h3>
                            <ul className="space-y-2 text-xs leading-6">
                                <li className="hover:text-custom-blue cursor-pointer flex items-center gap-2">
                                    <Instagram size={14} /> Instagram →
                                </li>
                                <li className="hover:text-custom-blue cursor-pointer flex items-center gap-2">
                                    <Linkedin size={14} /> LinkedIn →
                                </li>
                                <li className="hover:text-custom-blue cursor-pointer flex items-center gap-2">
                                    <Github size={14} /> Github →
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </footer>
            <div className="bg-gray-300 py-3 flex justify-between items-center px-6">
                <p className="text-xs text-gray-600">©2024 Vario All Rights Reserved.</p>
                <div className="flex space-x-6 text-xs text-gray-600">
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                    <span>Cookies Settings</span>
                </div>
            </div>
        </>
    );
};

export default Footer;



