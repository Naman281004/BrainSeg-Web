import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { scrollToTop } from './ScrollToTop';

const BlogPost = ({ title, date, excerpt, image, url }) => {
  const handleReadMore = (e) => {
    scrollToTop();
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row mb-8">
      <div className="md:w-1/3">
        <img className="w-full h-64 object-cover" src={image} alt={title} />
      </div>
      <div className="p-6 md:w-2/3">
        <div className="text-sm text-blue-600 mb-2">{date}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors inline-block"
          onClick={handleReadMore}
        >
          Read More
        </a>
      </div>
    </div>
  );
};

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Advances in Brain Tumor Segmentation Using Deep Learning",
      date: "April 15, 2024",
      excerpt: "Recent advances in deep learning have revolutionized the field of medical image analysis, particularly in brain tumor segmentation. This post explores how neural networks are improving diagnostic accuracy and treatment planning.",
      image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      url: "https://www.sciencedirect.com/science/article/pii/S1361841520301584"
    },
    {
      id: 2,
      title: "The Importance of Early Detection in Brain Tumors",
      date: "March 22, 2024",
      excerpt: "Early detection of brain tumors can significantly improve patient outcomes. Learn how advanced imaging techniques and AI-powered analysis are making earlier diagnosis possible.",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      url: "https://www.cancer.gov/types/brain/research/artificial-intelligence-brain-tumors"
    },
    {
      id: 3,
      title: "Understanding Different Types of Brain Tumors and Their Imaging Characteristics",
      date: "February 10, 2024",
      excerpt: "Brain tumors come in many varieties, each with distinct characteristics on MRI. This article helps physicians and patients understand the different appearances and what they might mean.",
      image: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      url: "https://www.ajnr.org/content/early/2020/10/15/ajnr.A6977"
    },
    {
      id: 4,
      title: "The Role of AI in Modern Radiological Practice",
      date: "January 5, 2024",
      excerpt: "Artificial intelligence is increasingly becoming an indispensable tool in radiology departments worldwide. Discover how AI is augmenting radiologists' capabilities rather than replacing them.",
      image: "https://images.unsplash.com/photo-1626307416562-ee839676f5fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      url: "https://pubs.rsna.org/doi/10.1148/radiol.2019191365"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">BrainSeg Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Latest insights, research, and news about brain tumor imaging and AI in healthcare
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {blogPosts.map((post) => (
            <BlogPost key={post.id} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog; 