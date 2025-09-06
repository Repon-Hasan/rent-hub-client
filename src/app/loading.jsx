import React from 'react';

const loading = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mb-6"></div>
                <span className="text-xl font-semibold text-blue-700 tracking-wide">Loading...</span>
            </div>
        </div>
    );
};

export default loading;