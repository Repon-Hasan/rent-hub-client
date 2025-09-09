import React from 'react';

const loading = () => {
    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100 bg-opacity-90 text-base-content">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mb-6"></div>
                <span className="text-xl font-semibold text-base-content tracking-wide">Loading Rent Post...</span>
            </div>
        </div>
    );
};

export default loading;