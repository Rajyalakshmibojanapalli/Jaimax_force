
import React, { useState, useEffect } from 'react';

export const Toast = ({ type, title, message, onClose }) => {
    const [isRemoving, setIsRemoving] = useState(false);

    const toastConfig = {
        info: {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                </svg>
            ),
            bgColor: 'bg-blue-500',
            progressColor: 'bg-blue-500'
        },
        error: {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m15 9-6 6" />
                    <path d="m9 9 6 6" />
                </svg>
            ),
            bgColor: 'bg-red-500',
            progressColor: 'bg-red-500'
        },
        success: {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-icon lucide-circle-check"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
            ),
            bgColor: 'bg-green-500',
            progressColor: 'bg-green-500'
        },
        warning: {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                </svg>
            ),
            bgColor: 'bg-orange-500',
            progressColor: 'bg-orange-500'
        }
    };

    const config = toastConfig[type];

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsRemoving(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    return (
        <div
            className={`bg-white rounded-lg shadow-lg p-3 sm:p-4 flex items-start gap-3 relative overflow-hidden transition-all duration-300 ${isRemoving ? 'animate-slideOut' : 'animate-slideIn'
                }`}
        >
            <div className={`${config.bgColor} w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white`}>
                {config.icon}
            </div>

            <div className="flex-1 min-w-0 pr-6">
                {title && (
                    <div className="text-sm sm:text-base font-semibold text-gray-800 mb-1">
                        {title}
                    </div>
                )}
                <div className={`text-xs sm:text-sm text-gray-600 leading-relaxed ${!title ? 'font-medium' : ''}`}>
                    {message}
                </div>
            </div>

            <button
                onClick={handleClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none p-1"
            >
                ✕
            </button>

            <div className={`absolute bottom-0 left-0 h-1 w-full ${config.progressColor} origin-left animate-progress`} />
        </div>
    );
};

// Toast manager
let toastId = 0;
let toastListeners = [];

export const toast = {
    success: (titleOrMessage, message) => {
        const id = ++toastId;
        const hasMessage = message !== undefined;
        toastListeners.forEach(listener =>
            listener({
                id,
                type: 'success',
                title: hasMessage ? titleOrMessage : "Success!",
                message: hasMessage ? message : titleOrMessage
            })
        );
    },
    error: (titleOrMessage, message) => {
        const id = ++toastId;
        const hasMessage = message !== undefined;
        toastListeners.forEach(listener =>
            listener({
                id,
                type: 'error',
                title: hasMessage ? titleOrMessage : "Error!",
                message: hasMessage ? message : titleOrMessage
            })
        );
    },
    info: (titleOrMessage, message) => {
        const id = ++toastId;
        const hasMessage = message !== undefined;
        toastListeners.forEach(listener =>
            listener({
                id,
                type: 'info',
                title: hasMessage ? titleOrMessage : "Info!",
                message: hasMessage ? message : titleOrMessage
            })
        );
    },
    warning: (titleOrMessage, message) => {
        const id = ++toastId;
        const hasMessage = message !== undefined;
        toastListeners.forEach(listener =>
            listener({
                id,
                type: 'warning',
                title: hasMessage ? titleOrMessage :"Warning!" ,
                message: hasMessage ? message : titleOrMessage
            })
        );
    }
};

export const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const listener = (toast) => {
            setToasts(prev => [...prev, toast]);
        };
        toastListeners.push(listener);

        return () => {
            toastListeners = toastListeners.filter(l => l !== listener);
        };
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <>
            <style>
                {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes slideOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }

          @keyframes progress {
            from {
              transform: scaleX(1);
            }
            to {
              transform: scaleX(0);
            }
          }

          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }

          .animate-slideOut {
            animation: slideOut 0.3s ease-out forwards;
          }

          .animate-progress {
            animation: progress 3s linear forwards;
          }
        `}
            </style>
            <div className="fixed top-3 right-3 sm:top-5 sm:right-5 z-50 flex flex-col gap-2 sm:gap-4 max-w-[calc(100vw-1.5rem)] sm:max-w-md w-full pointer-events-none">
                <div className="pointer-events-auto">
                    {toasts.map(t => (
                        <div key={t.id} className="mb-2 sm:mb-0">
                            <Toast
                                type={t.type}
                                title={t.title}
                                message={t.message}
                                onClose={() => removeToast(t.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

// Demo component
export function ToastNotifications() {
    const handleSuccess = () => {
        toast.success('Operation Successful!', 'Your changes have been saved successfully.');
    };

    const handleError = () => {
        toast.error('Operation Failed!', 'Something went wrong. Please try again.');
    };

    const handleWarning = () => {
        toast.warning('Warning!', 'This action requires your attention.');
    };

    const handleInfo = () => {
        toast.info('Information', 'Please review the information before proceeding.');
    };

    const handleSimpleSuccess = () => {
        toast.success("Text copied to clipboard!");
    };

    const handleSimpleError = () => {
        toast.error("Failed to copy text!");
    };

    const handleFormSubmit = () => {
        setTimeout(() => {
            if (Math.random() > 0.5) {
                toast.success('Form Submitted!', 'Your form has been submitted successfully.');
            } else {
                toast.error('Submission Failed!', 'Unable to submit form. Please check your connection.');
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 flex flex-col items-center justify-center p-3 sm:p-5">
            <ToastContainer />

            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-10 max-w-2xl w-full shadow-2xl">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">
                    Toast Notification System
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 text-center">
                    Click any button to trigger a toast notification
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <button
                        onClick={handleSuccess}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
                    >
                        Success Toast
                    </button>
                    <button
                        onClick={handleError}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
                    >
                        Error Toast
                    </button>
                    <button
                        onClick={handleWarning}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
                    >
                        Warning Toast
                    </button>
                    <button
                        onClick={handleInfo}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
                    >
                        Info Toast
                    </button>
                </div>

                <div className="pt-6 sm:pt-8 border-t border-gray-200 mb-6 sm:mb-8">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                        Simple Usage (No Title)
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            onClick={handleSimpleSuccess}
                            className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-medium py-2 sm:py-2.5 px-4 sm:px-5 rounded-lg transition-all duration-200 text-sm sm:text-base"
                        >
                            Copy Success
                        </button>
                        <button
                            onClick={handleSimpleError}
                            className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium py-2 sm:py-2.5 px-4 sm:px-5 rounded-lg transition-all duration-200 text-sm sm:text-base"
                        >
                            Copy Failed
                        </button>
                    </div>
                </div>

                <div className="pt-6 sm:pt-8 border-t border-gray-200">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                        Real-world Examples
                    </h2>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleFormSubmit}
                            className="border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white font-medium py-2 sm:py-2.5 px-4 sm:px-5 rounded-lg transition-all duration-200 text-sm sm:text-base"
                        >
                            Simulate Form Submit
                        </button>
                    </div>
                </div>

                <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2 font-semibold">Usage:</p>
                    <code className="text-xs text-gray-700 block bg-white p-2 sm:p-3 rounded border border-gray-200 overflow-x-auto">
                        {`// With title and message
toast.success('Title', 'Message');

// Without title (just message)
toast.success('Text copied to clipboard!');`}
                    </code>
                </div>
            </div>
        </div>
    );
}