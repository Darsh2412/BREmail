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
  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
  
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
    setError(fileSizeError ? 'One or more files exceed the maximum allowed size (25MB)' : '');
    
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
  
  // Function to get file icon based on file type
  const getFileIcon = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'pdf':
        return 'ri-file-pdf-line';
      case 'doc':
      case 'docx':
        return 'ri-file-word-line';
      case 'xls':
      case 'xlsx':
        return 'ri-file-excel-line';
      case 'ppt':
      case 'pptx':
        return 'ri-file-ppt-line';
      case 'zip':
      case 'rar':
      case '7z':
        return 'ri-file-zip-line';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
        return 'ri-image-line';
      default:
        return 'ri-file-text-line';
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-gray-700 font-medium">Attachments</h3>
          <p className="text-xs text-gray-500 mt-1">
            Supports all file types including ZIP files (Max 25MB per file)
          </p>
        </div>
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
          <div className="flex flex-col items-center justify-center h-[100px] text-gray-400">
            <i className="ri-upload-cloud-line text-2xl mb-2"></i>
            <span>Drag and drop files here, or click "Add Files"</span>
          </div>
        ) : (
          attachments.map((file, index) => (
            <div key={index} className="file-list-item flex items-center justify-between bg-white p-2 rounded shadow-sm mb-2">
              <div className="flex items-center">
                <i className={`${getFileIcon(file.name)} text-primary mr-2 text-lg`}></i>
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
