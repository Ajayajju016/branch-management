import React from 'react';
import { Building2 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center">
          <Building2 className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-semibold text-gray-900">Branch Management</h1>
        </div>
      </div>
    </header>
  );
};