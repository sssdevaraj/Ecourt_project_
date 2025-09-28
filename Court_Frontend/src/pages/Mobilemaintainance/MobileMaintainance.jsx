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
import MobileNoModal from "./MobileModal";
import axiosClient from "@/api/axios";
import { Tab } from "@headlessui/react";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

const MobileMaintenance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const getSubscriptions = async () => {
    try {
      const response = await axiosClient.get(`/transactions/memebership/${user.userId}`);
      
      const data = response.data.data;
      
      setSubscription(data);
      setPhoneNumbers(data.phone_numbers || []);
      setCurrentPackage(data.package);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setLoading(false);
    }
  };

  const handleDelete = async(number)=>{
    setLoading(true)
    try {
      const response = await axiosClient.post(`/mobile-maintainance/number` ,{subscription_id: subscription.id, mobile_number: number} );
      console.log("movile mainatainec" ,response)
      if(response.data.status){
        toast.success(response.data.message)
      }
     
      await getSubscriptions();
    } catch (error) {
      console.error("Error deleting phone:", error);
      toast.error("Failed to delete phone.");

  }
  finally{
    setLoading(false)
  }
 }

  useEffect(() => {
    getSubscriptions();
  }, []);

  return (
    <div className="w-full h-screen bg-gray-50 p-8 ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mobile Maintenance</h1>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-2 mb-6 border-b border-gray-200">
          {['Phone Numbers', 'Package Details'].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `px-4 py-2 text-sm font-medium focus:outline-none ${
                  selected
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {/* Phone Numbers Tab */}
          <Tab.Panel>
            <div className="mb-4 flex justify-end">
            
            <Button
             
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all"
                onClick={() => setIsModalOpen(true)}
              >
                + Add Mobile Number
              </Button>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <Table className="w-full">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Sr</TableHead>
                    <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Mobile No.</TableHead>

                    <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Party Name.</TableHead>
                    <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="px-6 py-4 text-center text-gray-500">
                        Loading phone numbers...
                      </TableCell>
                    </TableRow>
                  ) : phoneNumbers.length > 0 ? (
                    phoneNumbers.map((phone, index) => (
                      <TableRow key={phone.id} className="hover:bg-gray-50">
                        <TableCell className="px-6 py-4 text-gray-600">{index + 1}</TableCell>
                        <TableCell className="px-6 py-4 text-gray-600">{phone.number}</TableCell>
                        <TableCell className="px-6 py-4 text-gray-600">{phone?.party_name}</TableCell>
                        <TableCell className="px-6 py-4">
                          <Button  onClick={() => handleDelete(phone.number)``} variant="ghost" className="text-red-600 hover:bg-red-50">
                            <Trash variant="destructive"/>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="px-6 py-4 text-center text-gray-500">
                        No phone numbers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Tab.Panel>

        {/* panel tab */}
          <Tab.Panel>
            <div className="bg-white rounded-xl shadow-lg p-6">
              {loading ? (
                <div className="text-center text-gray-500">Loading package details...</div>
              ) : currentPackage ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <h3 className="text-xl font-semibold">{currentPackage.name}</h3>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Active
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Phone Number Limit" value={currentPackage.phone_number_limit} />
                    <DetailItem label="Message Limit" value={currentPackage.message_limit} />
                    <DetailItem label="Price" value={`${currentPackage.amount}`} />
                    <DetailItem label="Numbers Used" value={`${subscription.numbers_used}`} />
                    <DetailItem label="Messages Sent" value={`${currentPackage.messages_sent}`} />

                    <DetailItem label="description" value={`${currentPackage.description} days`} />
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-gray-600">{currentPackage.description}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">No active package found.</div>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <MobileNoModal 
        subscription={subscription} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        getSubscriptions={getSubscriptions} 
      />
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-lg font-medium text-gray-900">{value || 'N/A'}</span>
  </div>
);

export default MobileMaintenance;