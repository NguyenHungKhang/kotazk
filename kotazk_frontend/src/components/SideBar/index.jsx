import { useState } from "react";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Button, Stack, useTheme } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { IconLayoutDashboardFilled } from "@tabler/icons-react";
import { IconSettingsFilled } from "@tabler/icons-react";
import { IconLetterK } from "@tabler/icons-react";
import { IconVectorBezier2 } from "@tabler/icons-react";
import { IconTablePlus } from "@tabler/icons-react";
import { IconUsers } from "@tabler/icons-react";

const SideBar = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const Menus = [
        { title: "Dashboard", src: <IconLayoutDashboardFilled size={20} /> },
        { title: "Members", src: <IconUsers size={20} /> },
        { title: "Setting", src: <IconSettingsFilled size={20}  /> },
        { title: "Project Name", src: <IconVectorBezier2 size={20}  />, gap: true },
        // { title: "Schedule ", src: "Calendar" },
        // { title: "Search", src: "Search" },
        // { title: "Analytics", src: "Chart" },
        // { title: "Files ", src: "Folder", gap: true },
        // { title: "Setting", src: "Setting" },
    ];

    return (
        <Stack
            direction='column'
            alignItems='center'
            sx={{
                backgroundColor: theme.palette.grey[900],
            }}
        >
            <div
                className={` ${open ? "w-72" : "w-20"
                    } p-5  pt-8 relative duration-300`}
                style={{
                    flexGrow: 1
                }}
            >
                <ArrowBackIosNewIcon
                    sx={{
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        border: "2px solid",
                        height: 25,
                        width: 25
                    }}
                    className={`absolute cursor-pointer -right-3 top-9 w-7
          border-2 rounded-full  ${!open && "rotate-180"}`}
                    onClick={() => setOpen(!open)} />
                <div className="flex gap-x-4 items-center"

                >
                    <img
                        src="https://i.pinimg.com/474x/55/26/85/5526851366d0b5c204c2b63cf1305578.jpg"
                        width="35"
                        height="35"
                        className={`cursor-pointer duration-500 rounded-full ${open && "rotate-[360deg]"
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
                            className={`flex  rounded-md p-1 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-1"} ${index === 0 && "bg-light-white"
                                } `}
                        >
                            {Menu.src}
                            <span className={`${!open && "hidden"} origin-left duration-200`}>
                                {Menu.title}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            {/* <Box
                width='100%'
                p={2}
            >
                <Button
                    sx={{
                        color: "white",
                        border: '1px dashed white',
                        borderRadius: 2,
                        p: 3,
                        textTransform: "none",
                    }}
                    fullWidth
                    startIcon={<IconTablePlus />}
                >
                    {open ? 'Add Project' : null}
                </Button>
            </Box> */}


        </Stack>
    );
};
export default SideBar;