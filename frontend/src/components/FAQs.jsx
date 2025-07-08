import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { scrollToTop } from './ScrollToTop';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-800">{question}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-blue-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="mt-3 text-gray-600 leading-relaxed">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQs = () => {
  const [selectedCategory, setSelectedCategory] = useState('General');
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    scrollToTop();
  };
  
  const faqData = [
    {
      id: 1,
      question: "What is BrainSeg?",
      answer: "BrainSeg is an advanced AI-powered platform designed to help medical professionals segment and analyze brain tumors from MRI scans. It uses deep learning algorithms to identify and classify different tumor regions, making diagnosis more accurate and efficient.",
      category: "General"
    },
    {
      id: 2,
      question: "How accurate is the brain tumor segmentation?",
      answer: "Our algorithms have been trained on extensive datasets and validated against expert radiologists' annotations. The system achieves over 95% accuracy in identifying tumor regions when compared to manual segmentation by specialists. However, BrainSeg is intended as a diagnostic aid and should be used alongside clinical judgment.",
      category: "Technical"
    },
    {
      id: 3,
      question: "What file formats are supported for uploading?",
      answer: "BrainSeg currently supports DICOM, NIfTI (.nii, .nii.gz), and ANALYZE formats for brain MRI scans. We recommend using multi-modal MRI data (T1, T1ce, T2, and FLAIR) for optimal results, though the system can work with fewer modalities if needed.",
      category: "Technical"
    },
    {
      id: 4,
      question: "Is my data secure and private?",
      answer: "Yes, we take data security and patient privacy very seriously. All data is encrypted both in transit and at rest. We comply with HIPAA regulations and other relevant healthcare privacy standards. Your uploaded scans are only used for the analysis you request and are not used to train our models without explicit consent.",
      category: "Privacy"
    },
    {
      id: 5,
      question: "How long does the analysis typically take?",
      answer: "Most analyses are completed within 30-60 seconds, depending on the size of the dataset and current system load. You'll receive a notification when your results are ready, and they'll be available in your dashboard for future reference.",
      category: "Technical"
    },
    {
      id: 6,
      question: "Can I download or export the segmentation results?",
      answer: "Yes, you can download the segmentation results in various formats, including PNG images, animated GIFs for visualization, and comprehensive PDF reports. For research or clinical purposes, you can also export the raw segmentation masks in NIfTI format.",
      category: "Technical"
    },
    {
      id: 7,
      question: "Is BrainSeg FDA approved?",
      answer: "BrainSeg is currently for research use only and is not FDA approved as a medical device. The results should be used as a supplementary tool to aid in diagnosis and not as the sole basis for clinical decisions.",
      category: "Clinical"
    },
    {
      id: 8,
      question: "What different tumor regions does BrainSeg identify?",
      answer: "BrainSeg identifies and segments three key tumor regions: the necrotic core (non-enhancing tumor), peritumoral edema (swelling around the tumor), and enhancing tumor (active tumor regions). These regions are color-coded in the visualization for easy identification.",
      category: "Clinical"
    },
    {
      id: 9,
      question: "How can I get technical support?",
      answer: "For technical support, you can contact us through the Contact page on our website or email support@brainseg.ai. Our team is available Monday to Friday, 9 AM to 5 PM EST. We aim to respond to all inquiries within 24 business hours.",
      category: "General"
    },
    {
      id: 10,
      question: "Can I use BrainSeg for research purposes?",
      answer: "Yes, BrainSeg is available for research purposes. We offer special licensing for academic and research institutions. Please contact us for more information about research partnerships and collaborations.",
      category: "General"
    },
  ];

  const categories = [
    { name: "General", color: "bg-blue-100 text-blue-800" },
    { name: "Technical", color: "bg-green-100 text-green-800" },
    { name: "Clinical", color: "bg-purple-100 text-purple-800" },
    { name: "Privacy", color: "bg-red-100 text-red-800" },
  ];

  const filteredFaqs = faqData.filter(faq => 
    selectedCategory === 'All' || faq.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about BrainSeg, our technology, and how it can help in brain tumor analysis
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          <button 
            onClick={() => handleCategoryChange('All')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
              ${selectedCategory === 'All' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            All
          </button>
          {categories.map((category, index) => (
            <button 
              key={index}
              onClick={() => handleCategoryChange(category.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
                ${selectedCategory === category.name ? category.color + ' ring-2 ring-offset-2 ring-blue-500' : 'bg-white text-gray-700'}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No FAQs found in this category.</p>
          )}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Can't find the answer you're looking for?</p>
          <a 
            href="/contact" 
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors inline-block"
            onClick={() => scrollToTop()}
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQs; 