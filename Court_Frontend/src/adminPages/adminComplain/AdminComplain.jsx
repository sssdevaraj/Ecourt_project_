import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axiosClient from "@/api/axios";
import { toast } from "sonner";

const AdminComplain = () => {
    const [loading, setLoading] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaints, setSelectedComplaints] = useState([]);

    const getAllComplaints = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/complaint/admin/complaints`);
            setComplaints(response.data.complainst);
        } catch (error) {
            console.error("Error fetching complaints:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateComplaintStatus = async (complain_id, status) => {
        try {
            const response = await axiosClient.post("/complaint/admin/verify-complain", {
                complain_id,
                status,
            });

            if (response.data.status) {
                setComplaints((prevComplaints) =>
                    prevComplaints.map((complaint) =>
                        complaint.id === complain_id
                            ? { ...complaint, status }
                            : complaint
                    )
                );
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error("Error updating complaint status:", error);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedComplaints(complaints.map((c) => c.id));
        } else {
            setSelectedComplaints([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedComplaints((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const isAllSelected = complaints.length > 0 && selectedComplaints.length === complaints.length;

    useEffect(() => {
        getAllComplaints();
    }, []);

    return (
        <div className="w-full h-screen bg-gray-50 p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                    Admin Complaint Management
                </h2>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <Table className="w-full">
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            <TableHead className="px-6 py-4 text-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead className="px-6 py-4">No</TableHead>
                            <TableHead className="px-6 py-4">First Name</TableHead>
                            <TableHead className="px-6 py-4">Last Name</TableHead>
                            <TableHead className="px-6 py-4">Email</TableHead>
                            <TableHead className="px-6 py-4">Complaint Topic</TableHead>
                            <TableHead className="px-6 py-4">Message</TableHead>
                            <TableHead className="px-6 py-4">Status</TableHead>
                            <TableHead className="px-6 py-4">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-4">
                                    <div className="flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                                        <span className="ml-2 text-gray-900">Loading...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            complaints.map((complaint, index) => (
                                <TableRow key={complaint.id}>
                                    <TableCell className="px-6 py-4 text-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4"
                                            checked={selectedComplaints.includes(complaint.id)}
                                            onChange={() => handleSelectOne(complaint.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="px-6 py-4">{index + 1}</TableCell>
                                    <TableCell className="px-6 py-4">{complaint.first_name}</TableCell>
                                    <TableCell className="px-6 py-4">{complaint.last_name}</TableCell>
                                    <TableCell className="px-6 py-4">{complaint.email}</TableCell>
                                    <TableCell className="px-6 py-4">{complaint.topic}</TableCell>
                                    <TableCell className="px-6 py-4">{complaint.message}</TableCell>
                                    <TableCell className="px-6 py-4">{complaint.status}</TableCell>
                                    <TableCell className="px-6 py-4">
                                        <select
                                            value={complaint.status}
                                            onChange={(e) =>
                                                updateComplaintStatus(complaint.id, e.target.value)
                                            }
                                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="RECEIVED">RECEIVED</option>
                                            <option value="RESOLVED">RESOLVED</option>
                                            <option value="CLOSED">CLOSED</option>
                                        </select>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Footer Pagination */}
            <div className="mt-6 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                    {`Showing ${complaints.length > 0 ? 1 : 0} to ${complaints.length} of ${complaints.length} entries`}
                </span>
                <div className="flex gap-2">
                    <Button variant="outline">&lt;&lt;</Button>
                    <Button variant="outline">&lt;</Button>
                    <Button variant="outline">&gt;</Button>
                    <Button variant="outline">&gt;&gt;</Button>
                    <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default AdminComplain;
