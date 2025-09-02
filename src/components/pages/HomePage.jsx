import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import FileUploadManager from "@/components/organisms/FileUploadManager";
import DropZone from "@/components/molecules/DropZone";
import Button from "@/components/atoms/Button";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  
  return (
    <div className="flex items-center gap-3">
      {user && (
        <span className="text-sm text-gray-400">
          Welcome, {user.firstName || user.emailAddress}
        </span>
      )}
      <Button 
        variant="ghost" 
        size="sm"
        onClick={logout}
        className="flex items-center gap-2"
      >
        <ApperIcon name="LogOut" size={16} />
        Logout
      </Button>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      {/* Header */}
      <motion.header
        className="border-b border-white/10 bg-background/80 backdrop-blur-lg sticky top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center">
                <ApperIcon name="Upload" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text font-display">
                  DropZone
                </h1>
                <p className="text-sm text-gray-400">File Upload Made Simple</p>
              </div>
            </motion.div>
            
            <motion.div
              className="flex items-center gap-4 text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="Shield" size={16} className="text-green-400" />
                <span>Secure Upload</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Zap" size={16} className="text-yellow-400" />
                <span>Fast Processing</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6 font-display">
            Upload Files with Confidence
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Drag, drop, and upload your files with real-time progress tracking. 
            Supports images, documents, and videos up to 10MB each.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative">
            <div className="absolute top-4 right-4 z-10">
              <LogoutButton />
            </div>
            <FileUploadManager />
          </div>
        </motion.div>
      </main>
      
      {/* Footer */}
      <motion.footer
        className="border-t border-white/10 mt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                Built with React + Vite for fast, reliable file uploads
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <ApperIcon name="Lock" size={14} />
                <span>Privacy Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Server" size={14} />
                <span>Cloud Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Smartphone" size={14} />
                <span>Mobile Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default HomePage;