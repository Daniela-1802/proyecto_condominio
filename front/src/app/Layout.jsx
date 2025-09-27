// Layout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Layout() {
  return (
    <div id="wrapper" className="d-flex">
      <Sidebar />

      <div id="content-wrapper" className="d-flex flex-column w-100">
        <Topbar />
        <div className="container-fluid">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
