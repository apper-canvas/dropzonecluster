import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-surface/20 to-background">
      <div className="text-center">
        <ApperIcon name="FileQuestion" size={72} className="mx-auto mb-6 text-primary" />
        <h1 className="text-4xl font-bold gradient-text mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all"
        >
          <ApperIcon name="Home" size={16} />
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;