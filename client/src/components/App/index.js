import React from 'react';
import Messenger from '../Messenger';
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

import io from "socket.io-client";
const socket = io.connect('/');
export default function App() {
    return (
     


<>
<Sidebar />
<div className="relative md:ml-64 bg-blueGray-100">
  <AdminNavbar />
  {/* Header */}
  <HeaderStats />
  <div className="px-4 md:px-10 mx-auto w-full -m-24">

            

            <div className="flex flex-wrap mt-4">
        {/* <div className="w-full mb-12 px-4">
          <CardTable />
        </div> */}
        <div className="w-full mb-12 px-4">
        
        <Messenger socket={socket}/>
            
        </div>
      </div>


    <FooterAdmin />
  </div>
</div>
</>
      
      
    );
}