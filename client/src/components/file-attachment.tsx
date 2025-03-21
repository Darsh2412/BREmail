import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";

interface FileAttachmentProps {
  attachments: File[];
  setAttachments: (files: File[]) => void;
  error: string;
  setError: (error: string) => void;
}

export default function FileAttachment({ 
  attachments, 
  setAttachments, 
  error, 
  setError 
}: FileAttachmentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    let fileSizeError = false;
    const newAttachments = [...attachments];
    
    Array.from(files).forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        fileSizeError = true;
      } else {
        newAttachments.push(file);
      }
    });
    
    setAttachments(newAttachments);
    setError(fileSizeError ? 'One or more files exceed the maximum allowed size (10MB)' : '');
    
    // Clear the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleRemoveAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
    
    // Clear error if no more files
    if (newAttachments.length === 0) {
      setError('');
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-700 font-medium">Attachments</h3>
        <div className="relative">
          <input 
            type="file" 
            id="fileInput"
            ref={fileInputRef}
            multiple 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            onChange={handleFileUpload}
          />
          <Button variant="outline">
            <i className="ri-attachment-2 mr-1"></i> Add Files
          </Button>
        </div>
      </div>
      
      <div className="border border-dashed border-gray-300 rounded bg-gray-100 p-3 min-h-[100px]">
        {attachments.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span>No files attached</span>
          </div>
        ) : (
          attachments.map((file, index) => (
            <div key={index} className="file-list-item flex items-center justify-between bg-white p-2 rounded shadow-sm mb-2">
              <div className="flex items-center">
                <i className="ri-file-text-line text-primary mr-2"></i>
                <div>
                  <div className="text-sm font-medium text-gray-700">{file.name}</div>
                  <div className="text-xs text-gray-400">{formatFileSize(file.size)}</div>
                </div>
              </div>
              <button 
                type="button" 
                className="text-gray-400 hover:text-red-500" 
                onClick={() => handleRemoveAttachment(index)}
                title="Remove attachment"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          ))
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
