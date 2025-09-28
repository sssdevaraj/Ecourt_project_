import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axiosClient from "@/api/axios";
import { formatDate } from "../../../utils/dateFormatter";

const AdminTransaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axiosClient.get("/transactions/admin/transactions?page=1&limit=10");
                setTransactions(response.data.data);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch transactions");
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="w-full h-screen bg-gray-50 p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900"> Admin Transaction Management</h2>
            </div>

            {loading ? (
                <p className="text-center text-gray-600">Loading transactions...</p>
            ) : error ? (
                <p className="text-center text-red-600">{error}</p>
            ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <Table className="w-full">
                        <TableHeader className="bg-gray-100">
                            <TableRow>
                                <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">First Name </TableHead>
                                <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Last Name</TableHead>
                                <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Email</TableHead>
                                <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Transaction ID</TableHead>
                                <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Amount ($)</TableHead>
                                <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Status</TableHead>
                                <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <TableRow key={transaction.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <TableCell className="px-6 py-4 text-left text-gray-600">{transaction.first_name}</TableCell>

                                        <TableCell className="px-6 py-4 text-left text-gray-600">{transaction.last_name}</TableCell>

                                        <TableCell className="px-6 py-4 text-left text-gray-600">{transaction.email}</TableCell>

                                        <TableCell className="px-6 py-4 text-left text-gray-600">{transaction.id}</TableCell>
                                        <TableCell className="px-6 py-4 text-left text-gray-600">${transaction.amount}</TableCell>
                                        <TableCell className="px-6 py-4 text-left text-gray-600">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${transaction.status === "SUCCESS" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                }`}>
                                                {transaction.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-left text-gray-600">
                                            {formatDate(transaction.created_at)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell className="px-6 py-4 text-center text-gray-500" colSpan={4}>
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default AdminTransaction;
