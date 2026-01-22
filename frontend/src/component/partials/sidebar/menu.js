
import { MdDashboard, MdOutlineProductionQuantityLimits, MdFormatListBulletedAdd, MdCategory, MdContactMail } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { GiSellCard, GiExpense } from "react-icons/gi";
import { TbReport } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";

const menu = [
  {
    title: "Dashboard",
    icon: <MdDashboard />,
    path: "/dashboard",
  },
  {
    title: "Category",
    icon: <MdCategory />,
    path: "/Category",
  },
  {
    title: "Products",
    icon: <MdOutlineProductionQuantityLimits />,
    path: "/Products",
  },
  {
    title: "Sales",
    icon: <GiSellCard />,
    path: "/Sales",
  },
  {
    title: "Orders",
    icon: <MdFormatListBulletedAdd />,
    path: "/Orders",
  },
  {
    title: "Expenses",
    icon: <GiExpense />,
    path: "/Expenses",
  },
  {
    title: "Reports",
    icon: <TbReport />,
    path: "/Reports",
  },
  {
    title: "Users",
    icon: <FaUsers />,
    path: "/Users",
  },
  {
    title: "Contact Us",
    icon: <MdContactMail />,
    path: "/ContactUs",
  },
  {
    title: "Profile",
    icon: <ImProfile />,
    path: "/Profile",
  },
];

export default menu;
