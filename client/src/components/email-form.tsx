import { useState, ChangeEvent, FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import FileAttachment from "@/components/file-attachment";
import EmailNotification from "@/components/email-notification";
import { validateEmailList } from "@/lib/utils";

interface FormState {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  message: string;
}

interface FormErrors {
  to: string;
  subject: string;
  message: string;
  attachments: string;
}

export default function EmailForm() {
  const [formState, setFormState] = useState<FormState>({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({
    to: '',
    subject: '',
    message: '',
    attachments: ''
  });
  
  const [attachments, setAttachments] = useState<File[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | ''; message: string }>({
    type: '',
    message: ''
  });

  const sendEmailMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('POST', '/api/send-email', undefined, { 
        customConfig: {
          body: data,
          headers: {} // No Content-Type, browser will set it with boundary for multipart/form-data
        }
      });
      return response.json();
    },
    onSuccess: () => {
      setNotification({
        type: 'success',
        message: 'Email sent successfully!'
      });
      handleClearForm();
    },
    onError: (error) => {
      setNotification({
        type: 'error',
        message: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (Object.keys(formErrors).includes(name)) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      to: '',
      subject: '',
      message: '',
      attachments: ''
    };
    
    // Validate recipients
    if (!validateEmailList(formState.to)) {
      newErrors.to = 'Please enter at least one valid email address';
    }
    
    // Validate subject
    if (!formState.subject.trim()) {
      newErrors.subject = 'Please enter a subject';
    }
    
    // Validate message
    if (!formState.message.trim()) {
      newErrors.message = 'Please enter a message';
    }
    
    setFormErrors(newErrors);
    
    // Form is valid if there are no error messages
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Create FormData for multipart form submission (for file uploads)
    const formData = new FormData();
    formData.append('to', formState.to);
    formData.append('cc', formState.cc);
    formData.append('bcc', formState.bcc);
    formData.append('subject', formState.subject);
    formData.append('message', formState.message);
    
    // Append each file
    attachments.forEach(file => {
      formData.append('attachments', file);
    });
    
    sendEmailMutation.mutate(formData);
  };

  const handleClearForm = () => {
    setFormState({
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      message: ''
    });
    setFormErrors({
      to: '',
      subject: '',
      message: '',
      attachments: ''
    });
    setAttachments([]);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Compose Email</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Recipients Field Group */}
          <div className="mb-4">
            <div className="flex flex-col md:flex-row md:items-center mb-2">
              <Label htmlFor="to" className="block text-gray-700 font-medium w-20 mb-1 md:mb-0">To:</Label>
              <div className="flex-1">
                <Input 
                  type="text" 
                  id="to" 
                  name="to"
                  value={formState.to}
                  onChange={handleInputChange}
                  className={formErrors.to ? "border-red-500" : ""}
                  placeholder="recipient@example.com, another@example.com" 
                />
              </div>
            </div>
            <div className="ml-0 md:ml-20">
              {formErrors.to && <p className="text-red-500 text-sm">{formErrors.to}</p>}
            </div>
          </div>

          {/* CC Field */}
          <div className="mb-4">
            <div className="flex flex-col md:flex-row md:items-center">
              <Label htmlFor="cc" className="block text-gray-700 font-medium w-20 mb-1 md:mb-0">Cc:</Label>
              <div className="flex-1">
                <Input 
                  type="text" 
                  id="cc" 
                  name="cc"
                  value={formState.cc}
                  onChange={handleInputChange}
                  placeholder="cc@example.com" 
                />
              </div>
            </div>
          </div>

          {/* BCC Field */}
          <div className="mb-4">
            <div className="flex flex-col md:flex-row md:items-center">
              <Label htmlFor="bcc" className="block text-gray-700 font-medium w-20 mb-1 md:mb-0">Bcc:</Label>
              <div className="flex-1">
                <Input 
                  type="text" 
                  id="bcc" 
                  name="bcc"
                  value={formState.bcc}
                  onChange={handleInputChange}
                  placeholder="bcc@example.com" 
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <Separator className="my-6" />

          {/* Subject Field */}
          <div className="mb-4">
            <div className="flex flex-col md:flex-row md:items-center">
              <Label htmlFor="subject" className="block text-gray-700 font-medium w-20 mb-1 md:mb-0">Subject:</Label>
              <div className="flex-1">
                <Input 
                  type="text" 
                  id="subject" 
                  name="subject"
                  value={formState.subject}
                  onChange={handleInputChange}
                  className={formErrors.subject ? "border-red-500" : ""}
                  placeholder="Enter subject" 
                />
              </div>
            </div>
            <div className="ml-0 md:ml-20">
              {formErrors.subject && <p className="text-red-500 text-sm">{formErrors.subject}</p>}
            </div>
          </div>

          {/* Message Field */}
          <div className="mb-6">
            <div className="mb-2">
              <Label htmlFor="message" className="block text-gray-700 font-medium mb-1">Message:</Label>
              <div className="border border-gray-300 rounded">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center border-b border-gray-200 p-2 bg-gray-100">
                  <button type="button" className="p-1 rounded hover:bg-gray-200 mr-1" title="Bold">
                    <i className="ri-bold text-gray-500"></i>
                  </button>
                  <button type="button" className="p-1 rounded hover:bg-gray-200 mr-1" title="Italic">
                    <i className="ri-italic text-gray-500"></i>
                  </button>
                  <button type="button" className="p-1 rounded hover:bg-gray-200 mr-1" title="Underline">
                    <i className="ri-underline text-gray-500"></i>
                  </button>
                  <span className="border-r border-gray-300 h-6 mx-2"></span>
                  <button type="button" className="p-1 rounded hover:bg-gray-200 mr-1" title="Bullet List">
                    <i className="ri-list-unordered text-gray-500"></i>
                  </button>
                  <button type="button" className="p-1 rounded hover:bg-gray-200 mr-1" title="Numbered List">
                    <i className="ri-list-ordered text-gray-500"></i>
                  </button>
                  <span className="border-r border-gray-300 h-6 mx-2"></span>
                  <button type="button" className="p-1 rounded hover:bg-gray-200 mr-1" title="Link">
                    <i className="ri-link text-gray-500"></i>
                  </button>
                </div>
                
                {/* Editor Area */}
                <Textarea
                  id="message"
                  name="message"
                  rows={8}
                  value={formState.message}
                  onChange={handleInputChange}
                  className={`border-0 rounded-t-none resize-none ${formErrors.message ? "border-red-500" : ""}`}
                  placeholder="Compose your email message here..."
                />
              </div>
            </div>
            {formErrors.message && <p className="text-red-500 text-sm">{formErrors.message}</p>}
          </div>

          {/* File Attachment Section */}
          <FileAttachment
            attachments={attachments}
            setAttachments={setAttachments}
            error={formErrors.attachments}
            setError={(error) => 
              setFormErrors(prev => ({ ...prev, attachments: error }))
            }
          />

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClearForm}
            >
              <i className="ri-delete-bin-line mr-1"></i> Clear Form
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-accent text-white"
              disabled={sendEmailMutation.isPending}
            >
              <i className="ri-send-plane-line mr-1"></i> Send Email
              {sendEmailMutation.isPending && (
                <span className="ml-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>

      <EmailNotification 
        type={notification.type} 
        message={notification.message}
        onClose={() => setNotification({ type: '', message: '' })}
      />
    </div>
  );
}
