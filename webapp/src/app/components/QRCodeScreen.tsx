import React, { useEffect, useState } from 'react';
import { Search, Filter, Edit, Trash2, Plus, ChevronUp, ChevronDown, QrCode as QrCodeIcon, Eye } from 'lucide-react';
import { QRCode, QRCodeStatus } from "../types/index";
import { getQRCodes } from '../utils/api';
import QRCodeRegisterModal from './QRCodeGeneration';

const mockQRCodes: QRCode[] = [
    { id: '10196718-a8b9-4975-8d20-36a54bdf869c', code: 'QR_001_ABC123', status: QRCodeStatus.INACTIVE },
    { id: '2', code: 'QR_002_DEF456', status: QRCodeStatus.ACTIVE, userId: 'john.doe@example.com' },
    { id: '3', code: 'QR_003_GHI789', status: QRCodeStatus.COMPLETED, userId: 'jane.smith@example.com' },
    { id: '4', code: 'QR_004_JKL012', status: QRCodeStatus.INACTIVE },
    { id: '5', code: 'QR_005_MNO345', status: QRCodeStatus.ACTIVE, userId: 'bob.johnson@example.com' },
    { id: '6', code: 'QR_006_PQR678', status: QRCodeStatus.COMPLETED, userId: 'alice.brown@example.com' },
    { id: '7', code: 'QR_007_STU901', status: QRCodeStatus.INACTIVE },
    { id: '8', code: 'QR_008_VWX234', status: QRCodeStatus.ACTIVE, userId: 'charlie.wilson@example.com' },
    { id: '9', code: 'QR_009_YZA567', status: QRCodeStatus.COMPLETED, userId: 'diana.martinez@example.com' },
    { id: '10', code: 'QR_010_BCD890', status: QRCodeStatus.INACTIVE },
];

type SortField = keyof QRCode;
type SortDirection = 'asc' | 'desc';

export default function QRCodesTableScreen() {
    const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortField, setSortField] = useState<SortField>('id');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const [registerQRCodes, setRegisterQRCodes] = useState<boolean>(false);
    useEffect(() => {
        const fetchQRCodes = async () => {
            const response = await getQRCodes();
            if ("qrcodes" in response) {
                setQRCodes(response.qrcodes);
            } else {
                console.log("Unhandled error");
            }
        }
        fetchQRCodes();
    }, [])
    const handleRegisterClick = () => {
        setRegisterQRCodes(true);
    };
    const filteredAndSortedQRCodes = qrCodes
        .filter(qrCode => {
            const matchesSearch =
                qrCode.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                qrCode.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (qrCode.userId && qrCode.userId.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesStatus = statusFilter === 'all' || qrCode.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const aValue = String(a[sortField] || '');
            const bValue = String(b[sortField] || '');

            if (sortDirection === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getStatusBadgeColor = (status: QRCodeStatus) => {
        switch (status) {
            case QRCodeStatus.INACTIVE: return 'bg-gray-100 text-gray-800';
            case QRCodeStatus.ACTIVE: return 'bg-blue-100 text-blue-800';
            case QRCodeStatus.COMPLETED: return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusCount = (status: QRCodeStatus) => {
        return qrCodes.filter(qr => qr.status === status).length;
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ChevronUp className="w-4 h-4 opacity-30" />;
        return sortDirection === 'asc' ?
            <ChevronUp className="w-4 h-4 text-blue-600" /> :
            <ChevronDown className="w-4 h-4 text-blue-600" />;
    };

    return (
        <>

            {registerQRCodes && (
                <>
                    <div
                        style={{
                            position: "fixed",
                            top: "70px", // Assuming topBar height
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 998
                        }}
                    />
                    <QRCodeRegisterModal isModalOpen={registerQRCodes} setIsModalOpen={setRegisterQRCodes} />

                </>

            )}
            <div className="flex-1 p-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Codes</h1>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <QrCodeIcon className="h-8 w-8 text-gray-500" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total QR Codes</p>
                                    <p className="text-2xl font-bold text-gray-900">{qrCodes.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Inactive</p>
                                    <p className="text-2xl font-bold text-gray-900">{getStatusCount(QRCodeStatus.INACTIVE)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <div className="h-4 w-4 bg-blue-400 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Active</p>
                                    <p className="text-2xl font-bold text-blue-900">{getStatusCount(QRCodeStatus.ACTIVE)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <div className="h-4 w-4 bg-green-400 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Completed</p>
                                    <p className="text-2xl font-bold text-green-900">{getStatusCount(QRCodeStatus.COMPLETED)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search QR codes..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Status Filter */}
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Generate QR Code Button */}
                            <button className="flex items-center gap-2 bg-[#840027] text-white px-4 py-2 rounded-md hover:bg-[#6c0020] transition-colors cursor-pointer" 
                                onClick={handleRegisterClick}>
                                <Plus className="w-4 h-4" />
                                Generate QR Code
                            </button>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            Showing {filteredAndSortedQRCodes.length} of {qrCodes.length} QR codes
                        </p>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('id')}
                                        >
                                            <div className="flex items-center gap-1">
                                                ID
                                                <SortIcon field="id" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('code')}
                                        >
                                            <div className="flex items-center gap-1">
                                                QR Code
                                                <SortIcon field="code" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('status')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Status
                                                <SortIcon field="status" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('userId')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Assigned User
                                                <SortIcon field="userId" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAndSortedQRCodes.map((qrCode, index) => (
                                        <tr key={qrCode.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {qrCode.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <QrCodeIcon className="w-5 h-5 text-gray-400" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{qrCode.code}</div>
                                                        {selectedCode === qrCode.code && (
                                                            <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono break-all">
                                                                {qrCode.code}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(qrCode.status)}`}>
                                                    {qrCode.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {qrCode.userId || (
                                                    <span className="text-gray-400 italic">Not assigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Empty State */}
                    {filteredAndSortedQRCodes.length === 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <QrCodeIcon className="w-12 h-12 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}