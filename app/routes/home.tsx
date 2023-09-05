import { LoaderArgs, LoaderFunction, json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef } from "react";
import { CarbonEdit, CilCameraControl, Fa6RegularStarHalfStroke, Fa6SolidArrowsUpDownLeftRight, Fa6SolidBars, Fa6SolidBook, Fa6SolidBookTanakh, Fa6SolidBuilding, Fa6SolidCalendarDays, Fa6SolidChartArea, Fa6SolidCircleQuestion, Fa6SolidCodeBranch, Fa6SolidFile, Fa6SolidHouse, Fa6SolidMagnifyingGlass, Fa6SolidMapLocationDot, Fa6SolidObjectUngroup, Fa6SolidPaintbrush, Fa6SolidPersonMilitaryPointing, Fa6SolidStar, Fa6SolidUser, Fa6SolidXmark, MaterialSymbolsActivityZone, MaterialSymbolsAlignHorizontalRight, MaterialSymbolsFluidBalance, MaterialSymbolsLogoutRounded, MaterialSymbolsOralDisease } from "~/components/icons/icons";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";
import sideBarStore, { SideBarTabs } from "~/state/sidebar";


export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const cookieHeader = props.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);
    if (
        cookie == null ||
        cookie == undefined ||
        Object.keys(cookie).length == 0
    ) {
        return redirect("/mobilelogin");
    }



    const userdata = await ApiCall({
        query: `
        query getUserById($id:Int!){
            getUserById(id:$id){
                id,
                role,
                name
            }   
        }
        `,
        veriables: {
            id: parseInt(cookie.id!)
        },
    });

    return json({
        user: userdata.data.getUserById,
        isAdmin: cookie.role == "ADMIN" ? true : false,
    });
};


const Home: React.FC = (): JSX.Element => {
    const user = useLoaderData().user;
    const isMobile = sideBarStore((state) => state.isOpen);
    const changeMobile = sideBarStore((state) => state.change);
    const asideindex = sideBarStore((state) => state.currentIndex);
    const achangeindex = sideBarStore((state) => state.changeTab);

    const isUser = user.role == "USER";
    const username = user.name;

    const navigator = useNavigate();

    const logoutHandle = () => {
        navigator("/logout");
    };

    const submitRef = useRef<HTMLButtonElement>(null);
    const accesskeyRef = useRef<HTMLInputElement>(null);
    const designpointRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <section className="h-screen w-full relative">
                <div className="flex min-h-screen relative flex-nowrap w-full">
                    <div
                        className={`z-40 w-full md:w-60 shrink-0 bg-white p-2 md:flex flex-col md:relative fixed top-0 left-0 min-h-screen md:min-h-full md:h-auto shadow-xl ${isMobile ? "grid place-items-center" : "hidden"
                            }`}
                    >
                        <div className="md:flex flex-col md:h-full">
                            <div className="text-white text-center mb-4">
                                <img
                                    src="/images/logo.png"
                                    alt="logo"
                                    className="w-80 md:w-40 inline-block"
                                />
                            </div>
                            <div className="flex flex-col grow">
                                {/* <Link
                                    to={"/home/"}
                                    onClick={() => {
                                        achangeindex(SideBarTabs.Dashborad);
                                        changeMobile(false);
                                    }}
                                >
                                    <SidebarTab
                                        icon={Fa6SolidObjectUngroup}
                                        title="Dashboard"
                                        active={asideindex === SideBarTabs.Dashborad}
                                    ></SidebarTab>
                                </Link> */}
                                {isUser ? (
                                    <>
                                        <Link
                                            to={"/home/files"}
                                            onClick={() => {
                                                achangeindex(SideBarTabs.Dashborad);
                                                changeMobile(false);
                                            }}
                                        >
                                            <SidebarTab
                                                icon={Fa6SolidObjectUngroup}
                                                title="Dashboard"
                                                active={asideindex === SideBarTabs.Dashborad}
                                            ></SidebarTab>
                                        </Link>
                                        <Link
                                            to={"/home/services"}
                                            onClick={() => {
                                                achangeindex(SideBarTabs.Services);
                                                changeMobile(false);
                                            }}
                                        >
                                            <SidebarTab
                                                icon={Fa6SolidCodeBranch}
                                                title="Services"
                                                active={asideindex === SideBarTabs.Services}
                                            ></SidebarTab>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to={"/home/"}
                                            onClick={() => {
                                                achangeindex(SideBarTabs.Dashborad);
                                                changeMobile(false);
                                            }}
                                        >
                                            <SidebarTab
                                                icon={Fa6SolidObjectUngroup}
                                                title="Dashboard"
                                                active={asideindex === SideBarTabs.Dashborad}
                                            ></SidebarTab>
                                        </Link>
                                        <Link
                                            to={"/home/files"}
                                            onClick={() => {
                                                achangeindex(SideBarTabs.Files);
                                                changeMobile(false);
                                            }}
                                        >
                                            <SidebarTab
                                                icon={Fa6SolidFile}
                                                title="All Files"
                                                active={asideindex === SideBarTabs.Files}
                                            ></SidebarTab>
                                        </Link>
                                        <div className="w-full h-[2px] bg-gray-800 my-3"></div>
                                        <p className="text-left px-2 font-serif text-sm my-2 text-gray-600 w-full">Citizen Files</p>
                                        {user.role == "SHO" ? null :
                                            <Link
                                                to={"/home/vmarriage"}
                                                onClick={() => {
                                                    achangeindex(SideBarTabs.Marriage);
                                                    changeMobile(false);
                                                }}
                                            >
                                                <SidebarTab
                                                    icon={MaterialSymbolsActivityZone}
                                                    title="Marriage"
                                                    active={asideindex === SideBarTabs.Marriage}
                                                ></SidebarTab>
                                            </Link>
                                        }
                                        <Link
                                            to={"/home/vroadshow"}
                                            onClick={() => {
                                                achangeindex(SideBarTabs.Roadshow);
                                                changeMobile(false);
                                            }}
                                        >
                                            <SidebarTab
                                                icon={MaterialSymbolsAlignHorizontalRight}
                                                title="Roadshow"
                                                active={asideindex === SideBarTabs.Roadshow}
                                            ></SidebarTab>
                                        </Link>
                                        <Link
                                            to={"/home/vreligious"}
                                            onClick={() => {
                                                achangeindex(SideBarTabs.Religious);
                                                changeMobile(false);
                                            }}
                                        >
                                            <SidebarTab
                                                icon={MaterialSymbolsOralDisease}
                                                title="Religious"
                                                active={asideindex === SideBarTabs.Religious}
                                            ></SidebarTab>
                                        </Link>
                                        <div className="w-full h-[2px] bg-gray-800 my-3"></div>
                                    </>
                                )}
                                {user.role == "USER" ?
                                    <Link
                                        to={"/home/editprofile"}
                                        onClick={() => {
                                            achangeindex(SideBarTabs.EditProfile);
                                            changeMobile(false);
                                        }}
                                    >
                                        <SidebarTab
                                            icon={CarbonEdit}
                                            title="Edit Profile"
                                            active={asideindex === SideBarTabs.EditProfile}
                                        ></SidebarTab>
                                    </Link>

                                    : null}
                                {user.role == "SUPERITENDANT" || user.role == "DYCOLLECTOR" ?
                                    <>
                                        <Link
                                            to={"/home/search"}
                                            onClick={() => {
                                                achangeindex(SideBarTabs.Search);
                                                changeMobile(false);
                                            }}
                                        >
                                            <SidebarTab
                                                icon={Fa6SolidMagnifyingGlass}
                                                title="Search"
                                                active={asideindex === SideBarTabs.Search}
                                            ></SidebarTab>
                                        </Link>
                                    </>
                                    : null
                                }
                                <button onClick={logoutHandle}>
                                    <SidebarTab
                                        icon={MaterialSymbolsLogoutRounded}
                                        title="LOGOUT"
                                        active={false}
                                    ></SidebarTab>
                                </button>
                                <div
                                    onClick={() => changeMobile(false)}
                                    className={`md:hidden flex gap-2 items-center my-1 b  py-1 px-2 rounded-md hover:bg-rose-500 hover:bg-opacity-10 hover:text-rose-500 text-gray-900 cursor-pointer`}
                                >
                                    <Fa6SolidXmark></Fa6SolidXmark>
                                    <p className="text-xl">CLOSE</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col min-h-screen relative bg-[#eeeeee] flex-grow overflow-y-auto">
                        <div className="pb-14 px-4 mt-4 h-full">
                            <TopNavBar
                                name={username}
                            ></TopNavBar>
                            <Outlet></Outlet>
                        </div>
                        <Footer></Footer>
                    </div>
                </div>
            </section>
            <div className="hidden">
                <form method="POST" action="http://77.75.120.70:8073/Home/AuthenticateFromLandRecord">
                    <input type="text" name="UserId" ref={designpointRef} />
                    <input type="text" name="AccessKey" ref={accesskeyRef} />
                    <button type="submit" ref={submitRef}>submit</button>
                </form>
            </div>
        </>
    );
}
export default Home;

type SideBarTabProps = {
    title: string;
    icon: React.FC;
    active: boolean;
};
const SidebarTab = (props: SideBarTabProps) => {
    return (
        <div
            className={`w-60 md:w-auto font-medium flex gap-2 items-center my-1 b  py-1 px-2 rounded-md text-left text-lg cursor-pointer ${props.active
                ? "bg-indigo-500 text-white"
                : "text-gray-800 hover:text-white hover:bg-indigo-500"
                }`}
        >
            <props.icon></props.icon>
            <p className="text-left">{props.title}</p>
        </div>
    );
};

type TopNavBarProps = {
    name: string;
};

const TopNavBar = (props: TopNavBarProps) => {
    const isMobile = sideBarStore((state) => state.isOpen);
    const changeMobile = sideBarStore((state) => state.change);
    return (
        <div className="bg-white rounded-md  text-xl w-full text-center text-white py-2 font-medium flex px-4 gap-4 items-center">
            <div className="px md:hidden text-gray-900 text-2xl cursor-pointer" onClick={() => changeMobile(!isMobile)}>
                <Fa6SolidBars></Fa6SolidBars>
            </div>
            <Link to={"/home"} className="px hidden md:block text-gray-900 text-2xl cursor-pointer">
                <Fa6SolidHouse></Fa6SolidHouse>
            </Link>
            <div className="text-center text-gray-900 text-2xl hidden md:block">Home</div>
            <div className="grow"></div>
            <div className="text-gray-800 flex gap-2 items-center">
                <Fa6SolidCalendarDays></Fa6SolidCalendarDays>
                <p>
                    {new Date().toDateString()}
                </p>
            </div>
            <div className="w-[2px] bg-gray-800 h-10"></div>
            <div className="flex gap-2 relative group items-center">
                <div className="shrink-0 rounded-full w-10 h-10 bg-indigo-500 grid place-items-center">
                    {props.name.toString().slice(0, 1).toUpperCase()}
                </div>
                <div className="text-gray-900 font-medium text-2xl text-center cursor-pointer">
                    {props.name}
                </div>
            </div>
        </div>
    );
};

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <div className="absolute bottom-0 w-full h-14 bg-white font-semibold text-center grid place-items-center text-gray-800 text-xl shadow-xl">
            &copy; {year} ESTABLISHMENT SECTION - All rights reserved.
        </div>
    );
};
