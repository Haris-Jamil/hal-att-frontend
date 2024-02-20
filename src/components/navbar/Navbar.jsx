import "./Navbar.scss";
import { useLocation, useNavigate } from "react-router-dom";
import {
  RiDashboard3Line,
  RiToolsLine,
  RiFileChart2Line,
  RiCalendar2Line,
  RiLogoutBoxLine,
} from "react-icons/ri";
import newRequest from "../../utils/newRequest";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      text: "Dashboard",
      link: "/",
      icon: RiDashboard3Line,
    },
    {
      text: "Month View",
      link: "/month",
      icon: RiCalendar2Line,
    },
    {
      text: "Attendance Report",
      link: "/report",
      icon: RiFileChart2Line,
    },
    {
      text: "Settings",
      link: "/settings",
      icon: RiToolsLine,
    },
    {
      text: "Logout",
      link: "logout",
      icon: RiLogoutBoxLine,
    },
  ];

  const redirect = (link) => {
    if (link === "logout") {
      const performLogout = async () => {
        const resp = await newRequest.get("/auth/logout");
        if (resp.data.success) {
          localStorage.removeItem("tii-att-user");
          navigate("/login");
        }
      };
      performLogout();
    } else {
      navigate(link);
    }
  };

  return (
    <div className='navbar'>
      <div className='container'>
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            className={
              "menuItemContainer " +
              (item.link === location.pathname ? "active" : "")
            }
            onClick={() => redirect(item.link)}
          >
            <span>
              <item.icon size={25} />
            </span>
            <span className='menuItem'>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Navbar;
