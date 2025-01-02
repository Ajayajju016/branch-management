import React, { useState } from 'react';
import { Header } from './components/Header';
import { BranchTable } from './components/BranchTable';
import { BranchForm } from './components/BranchForm';
import { Modal } from './components/Modal';
import { Branch } from './types/branch';
import { Plus, Download, Upload, Grid, List, Maximize } from 'lucide-react';
import * as XLSX from 'xlsx';

function App() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleCreateBranch = (data: Partial<Branch>) => {
    const newBranch: Branch = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Branch;

    setBranches([...branches, newBranch]);
    setIsModalOpen(false);
  };

  const handleUpdateBranch = (data: Partial<Branch>) => {
    if (!selectedBranch) return;

    const updatedBranches = branches.map((branch) =>
      branch.id === selectedBranch.id
        ? { ...branch, ...data, updatedAt: new Date().toISOString() }
        : branch
    );

    setBranches(updatedBranches);
    setIsModalOpen(false);
    setSelectedBranch(undefined);
  };

  const handleDeleteBranch = (branch: Branch) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      setBranches(branches.filter((b) => b.id !== branch.id));
    }
  };

  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(branches);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Branches');
    XLSX.writeFile(wb, 'branches.xlsx');
  };

  const handleImportFromExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setBranches([...branches, ...json as Branch[]]);
    };
    reader.readAsBinaryString(file);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Branch
              </button>
              <button
                onClick={handleExportToExcel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Import
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImportFromExcel}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={toggleFullScreen}
                className="p-2 rounded-md text-gray-500 hover:text-gray-900"
              >
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </div>

          <BranchTable
            data={branches}
            onEdit={handleEditBranch}
            onDelete={handleDeleteBranch}
          />
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBranch(undefined);
        }}
        title={selectedBranch ? 'Edit Branch' : 'Add New Branch'}
      >
        <BranchForm
          branch={selectedBranch}
          onSubmit={selectedBranch ? handleUpdateBranch : handleCreateBranch}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedBranch(undefined);
          }}
        />
      </Modal>
    </div>
  );
}

export default App;