import React, { useState } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { scrollToTop } from './ScrollToTop';

const PaperCard = ({ title, authors, journal, year, abstract, pdfLink, doi }) => {
  const [showAbstract, setShowAbstract] = useState(false);
  const filename = pdfLink.split('/').pop();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-blue-600 mb-2">{authors}</p>
          <p className="text-gray-600 text-sm mb-3">
            <span className="font-medium">{journal}</span> • {year}
          </p>
        </div>
        <div className="flex space-x-2">
          {pdfLink && (
            <a 
              href={pdfLink}
              download={filename}
              className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors"
              title="Download PDF"
            >
              <Download size={18} />
            </a>
          )}
          {doi && (
            <a 
              href={`https://doi.org/${doi}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
              title="View on DOI"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>
      
      <button 
        onClick={() => setShowAbstract(!showAbstract)}
        className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center mt-3"
      >
        {showAbstract ? 'Hide Abstract' : 'Show Abstract'}
      </button>
      
      {showAbstract && (
        <div className="mt-4 text-gray-700 bg-gray-50 p-4 rounded-md text-sm leading-relaxed">
          {abstract}
        </div>
      )}
    </div>
  );
};

const ResearchPapers = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = [
    'All',
    'Deep Learning',
    'Brain Tumor Segmentation',
    'Medical Imaging',
    'Clinical Applications'
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    scrollToTop();
  };

  const papers = [
    {
      id: 1,
      title: "Deep Learning for Automated Brain Tumor Segmentation: A Comparative Study",
      authors: "Johnson M, Chen L, Patel R, et al.",
      journal: "Journal of Medical Imaging",
      year: 2023,
      category: "Deep Learning",
      abstract: "This paper presents a comprehensive comparison of various deep learning architectures for automated brain tumor segmentation. We evaluated UNet3D, VNet, DeepMedic, and our novel BrainTumorSegModel on the BraTS dataset. Results demonstrate that our proposed architecture achieves state-of-the-art performance with a Dice score of 0.92 for whole tumor segmentation, while maintaining efficient computational requirements.",
      pdfLink: "/sample-pdfs/deep-learning-brain-tumor.pdf",
      doi: "10.1117/1.JMI.10.2.024003"
    },
    {
      id: 2,
      title: "Attention-Gated Networks for Improving Tumor Boundary Delineation",
      authors: "Smith A, Wang X, Kumar N, et al.",
      journal: "IEEE Transactions on Medical Imaging",
      year: 2022,
      category: "Brain Tumor Segmentation",
      abstract: "Precise delineation of tumor boundaries remains challenging in automated segmentation systems. This study introduces a novel attention-gated mechanism that significantly improves boundary detection in heterogeneous gliomas. Our approach selectively emphasizes relevant spatial regions while suppressing noise, resulting in more accurate segmentation of tumor sub-regions including edema, enhancing tumor, and necrotic core.",
      pdfLink: "/sample-pdfs/attention-gated-networks.pdf",
      doi: "10.1109/TMI.2019.2962959"
    },
    {
      id: 3,
      title: "Clinical Validation of AI-Assisted Brain Tumor Segmentation in Pre-Surgical Planning",
      authors: "Patel S, Gonzalez J, Thompson B, et al.",
      journal: "Neurosurgery",
      year: 2023,
      category: "Clinical Applications",
      abstract: "This prospective study evaluates the clinical utility of AI-assisted brain tumor segmentation in pre-surgical planning for glioma resection. Thirty-five patients underwent standard pre-surgical MRI followed by automated tumor segmentation using our BrainSeg platform. Neurosurgeons reported that AI segmentation significantly improved surgical planning in 89% of cases and modified the surgical approach in 32% of cases, particularly in regions adjacent to eloquent brain areas.",
      pdfLink: "/sample-pdfs/clinical-validation.pdf",
      doi: "10.1093/neuros/nyab274"
    },
    {
      id: 4,
      title: "Multi-Modal Brain MRI Fusion Techniques for Enhanced Tumor Visualization",
      authors: "Zhang H, Ali S, O'Connor E, et al.",
      journal: "Medical Image Analysis",
      year: 2022,
      category: "Medical Imaging",
      abstract: "Effective fusion of multi-modal MRI sequences is crucial for comprehensive tumor characterization. This paper presents novel techniques for integrating T1, T1ce, T2, and FLAIR sequences to enhance visualization of different tumor components. Our proposed weighted fusion approach demonstrates superior performance in highlighting tumor heterogeneity and infiltration patterns compared to conventional methods.",
      pdfLink: "/sample-pdfs/multi-modal-brain-mri.pdf",
      doi: "10.1016/j.media.2021.102248"
    },
    {
      id: 5,
      title: "BrainTumorSegModel: A Novel Variational Autoencoder Approach for Brain Tumor Analysis",
      authors: "Chen L, Johnson M, Kumar N, et al.",
      journal: "Nature Machine Intelligence",
      year: 2023,
      category: "Deep Learning",
      abstract: "We introduce BrainTumorSegModel, a novel deep learning architecture that combines encoder-decoder networks with variational inference for simultaneous tumor segmentation and abnormality detection. Our model not only segments tumor regions with high accuracy but also provides an uncertainty measure for each prediction, enabling clinicians to identify areas requiring closer inspection. Extensive validation on multi-center datasets demonstrates robust performance across diverse scanning protocols.",
      pdfLink: "/sample-pdfs/braintumorsegmodel-vae.pdf",
      doi: "10.1038/s42256-022-00536-x"
    },
    {
      id: 6,
      title: "Residual Learning for 3D Medical Image Segmentation: Benefits for Brain Tumor Analysis",
      authors: "Thompson K, Garcia R, Wu S, et al.",
      journal: "Computerized Medical Imaging and Graphics",
      year: 2022,
      category: "Brain Tumor Segmentation",
      abstract: "Residual learning has revolutionized deep learning architectures for image analysis. This study investigates the impact of various residual connection designs on 3D medical image segmentation tasks, specifically for brain tumors. We conduct a systematic evaluation of skip connection patterns, demonstrating that dense hierarchical residual pathways provide optimal gradient flow and feature reuse, resulting in improved segmentation performance especially for small and irregularly shaped tumor components.",
      pdfLink: "/sample-pdfs/residual-learning-3d-segmentation.pdf", 
      doi: "10.1016/j.compmedimag.2021.102052"
    }
  ];

  const filteredPapers = selectedCategory === 'All' 
    ? papers 
    : papers.filter(paper => paper.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Research Papers</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our published research on brain tumor segmentation, deep learning in medical imaging, and clinical applications
          </p>
        </div>

        <div className="flex justify-center mb-8 flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          {filteredPapers.map((paper) => (
            <PaperCard key={paper.id} {...paper} />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-2">Interested in collaborating on research?</p>
          <a 
            href="/contact" 
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors inline-block"
            onClick={() => scrollToTop()}
          >
            Contact Our Research Team
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResearchPapers; 