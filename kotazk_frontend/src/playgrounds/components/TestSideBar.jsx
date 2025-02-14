import { useState } from "react";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import TestKanban from "./TestKanban";
import { Box } from "@mui/material";
const App = () => {
  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "Dashboard", src: "Chart_fill" },
    { title: "Inbox", src: "Chat" },
    { title: "Accounts", src: "User", gap: true },
    { title: "Schedule ", src: "Calendar" },
    { title: "Search", src: "Search" },
    { title: "Analytics", src: "Chart" },
    { title: "Files ", src: "Folder", gap: true },
    { title: "Setting", src: "Setting" },
  ];

  return (
    <div className="flex">
      <div
        className={` ${open ? "w-72" : "w-20 "
          } h-screen p-5  pt-8 relative duration-300`}
        style={{
          backgroundColor: '#1A1927'
        }}
      >
        <img

        />
        <ArrowBackIosNewIcon
          sx={{
            background: "white",
            border: "2px solid",
            height: 30,
            width: 30
          }}
          className={`absolute cursor-pointer -right-3 top-9 w-7
          border-2 rounded-full  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)} />
        <div className="flex gap-x-4 items-center">
          <img
            src="./src/assets/logo.png"
            className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"
              }`}
          />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${!open && "scale-0"
              }`}
          >
            Kotazk
          </h1>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-light-white"
                } `}
            >
              <img src={`./src/assets/${Menu.src}.png`} />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                {Menu.title}
              </span>
            </li>
          ))}
        </ul>
        <Box
          border='1px dashed white'
        >
          123
        </Box>
      </div>
      <div className="h-screen flex-1 p-7">
        <TestKanban />
      </div>
    </div>
  );
};
export default App;