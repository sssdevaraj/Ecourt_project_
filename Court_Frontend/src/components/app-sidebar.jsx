import * as React from "react";
import { Bot } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { useEffect , useState} from "react";
import axiosClient from "@/api/axios";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import  CasesIcon from "../assets/court.svg";
import mobile from "../assets/phone.svg";
import transation from "../assets/transaction.svg";
import complian from "../assets/complan.svg";
import feedback from "../assets/feedback.svg";
import packages from "../assets/package.svg";
// import 

const sidebarData = {
  

  
 
  userMenu: [
   
    // cases 
    {
      title: "Cases",
      url: "#",
      icon: CasesIcon,
      items: [
        { title: "Cases", url: "/user/cases" },
        { title: "CaseStatus", url: "/user/case-status" },
        { title: "Case History", url: "/user/case-history" },
      ],
    },
    {
      title: "Mobile Maintenance",
      url: "#",
      icon: mobile, 
      items: [
        { title: "Mobile Maintenance", url: "/user/mobile-maintenance" },
      ],
    },
    {
      title: "Transactions",
      url: "#",
      icon: transation, 
      items: [
        { title: "Transactions", url: "/user/transactions" },
      ],
    },
    {
      title: "Complaints",
      url: "#",
      icon: complian, 
      items: [
        { title: "Complaints", url: "/user/complaints" },
      ],
    },
    {
      title: "Feedback",
      url: "#",
      icon: feedback, 
      items: [
        { title: "Feedback", url: "/user/feedback" },
      ],
    },
    {
      title: "Packages",
      url: "#",
      icon: packages, 
      items: [
        { title: "Packages", url: "/user/Packages" },
      ],
    },
  ],

  //admin menu 

  adminMenu: [

     // cases 
     {
      title: "Cases",
      url: "#",
      icon: CasesIcon,
      items: [
        { title: "Cases", url: "/admin/cases" },
       
      ],
    },
    {
      title: "Transactions",
      url: "#",
      icon: transation, 
      items: [
        { title: "Transactions", url: "/admin/transactions" },
      ],
    },
    {
      title: "Complaints",
      url: "#",
      icon: complian, 
      items: [
        { title: "Complaints", url: "/admin/complaints" },
      ],
    },

    {
      title: "Feedback",
      url: "#",
      icon: feedback, 
      items: [
        { title: "Feedback", url: "/admin/feedback" },
      ],
    },

    
   
  ],
  
  
};

export function AppSidebar({ ...props }) {

  const  data = JSON.parse(localStorage.getItem("user"));


  const [userData, setUserData] = React.useState(null);

  const fetchUserData = async () => {
    try {
      const response = await axiosClient.get(`/auth/user/${data.userId}`);
      
     
      if (response.status === 200) {
        setUserData(response.data.data[0]); 
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data.");
    }
  };

 

  useEffect(() => {
    fetchUserData();
  }, []);


  const profile = userData
  ? {
      userId: userData.id,
      email: userData.email,
      name: `${userData.first_name} ${userData.last_name}`,
      state: userData.state,
      district: userData.district,
      address: userData.address,
      pincode: userData.pincode,
      mobile: userData.mobile_number,
      category: userData.category,
      profession: userData.profession,
    }
  : {
      userId: data.userId,
      email: data.email,
      name: data.name,
    };
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
       {/* header of nav */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.role === 'ADMIN' ? sidebarData.adminMenu : sidebarData.userMenu} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={profile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
