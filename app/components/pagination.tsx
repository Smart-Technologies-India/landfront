import { KeyboardEventHandler, useState, KeyboardEvent } from "react";
import { CarbonChevronDown, CharmChevronLeft, CharmChevronRight, MaterialSymbolsKeyboardDoubleArrowLeft, MaterialSymbolsKeyboardDoubleArrowRight } from "./icons/icons";
interface PaginationProps {
    items: unknown[];
}
const Pagination: React.FC<PaginationProps> = (props: PaginationProps): JSX.Element => {
    const [activePage, setActivePage] = useState<number>(1);

    const [itemPerPage, setItemPerPage] = useState<number>(10);
    const [isSelectPage, setSelectPage] = useState<boolean>(false);

    const getMaxLength = (): number => {
        return Math.ceil(props.items.length / itemPerPage)
    }

    const handelPageChange = () => {
        setSelectPage((val) => !val);
    }
    const handelItemPerPage = (itemscount: number) => {
        setItemPerPage((val) => itemscount);
        handelPageChange();
        setActivePage((val) => 1);
    }

    const firstPage = () => { setActivePage((val) => 1); }
    const prevpage = () => { if (activePage > 1) setActivePage((val) => --val); }
    const nextpage = () => { if (getMaxLength() > activePage) setActivePage((val) => ++val); }
    const lastpage = () => { setActivePage((val) => getMaxLength()); }
    const gotoPage = (value: number) => { if ((activePage > 1) && (getMaxLength() > activePage)) setActivePage((val) => value) }


    const handelGoTo = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const page: number = parseInt((event.target as HTMLInputElement).value.replace(/\D/g, ''));
            if (page <= getMaxLength()) {
                setActivePage((val) => page);
            }
        }
    }









    const renderPageButtons = () => {
        const buttons = [];
        const maxButtonsToShow = 2;

        for (let i = Math.max(1, activePage - maxButtonsToShow); i <= Math.min(getMaxLength(), activePage + maxButtonsToShow); i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => setActivePage(i)}
                    className={`rounded-md border-2 border-gray-500 hover:border-blue-500 hover:text-blue-500 text-lg text-center w-8 h-8 grid place-items-center ${activePage === i ? 'bg-blue-500 bg-opacity-25 text-blue-500 border-blue-500' : ''
                        }`}
                >
                    {i}
                </button>
            );
        }

        if (activePage - maxButtonsToShow > 1) {
            buttons.unshift(
                <button
                    key="left-ellipsis"
                    disabled
                    className="rounded-md text-lg text-center w-8 h-8 grid place-items-center cursor-not-allowed"
                >
                    ...
                </button>
            );
        }

        if (activePage + maxButtonsToShow < getMaxLength()) {
            buttons.push(
                <button
                    key="right-ellipsis"
                    disabled
                    className="rounded-md text-lg text-center w-8 h-8 grid place-items-center cursor-not-allowed"
                >
                    ...
                </button>
            );
        }

        return buttons;
    };



    return (
        <>
            <div className="flex items-center gap-2 w-full mt-4">
                <p className="text-sm text-black font-normal text-left">Page {activePage}/{getMaxLength()}</p>
                <div className="h-5 w-[1px] bg-gray-500"></div>
                <p className="text-sm text-black font-normal text-left">Total {props.items.length} item</p>
                <div className="grow"></div>

                <div className="flex gap-1 items-center">
                    <button onClick={firstPage} className="rounded-md border-2 border-gray-500 hover:border-blue-500 hover:text-blue-500 text-lg text-center w-8 h-8 grid place-items-center">
                        <MaterialSymbolsKeyboardDoubleArrowLeft></MaterialSymbolsKeyboardDoubleArrowLeft>
                    </button>
                    <button onClick={prevpage} className="rounded-md border-2 border-gray-500 hover:border-blue-500 hover:text-blue-500 text-lg text-center w-8 h-8 grid place-items-center">
                        <CharmChevronLeft></CharmChevronLeft>
                    </button>
                    {renderPageButtons()}
                    <button onClick={nextpage} className="rounded-md border-2 border-gray-500 hover:border-blue-500 hover:text-blue-500 text-lg text-center w-8 h-8 grid place-items-center">
                        <CharmChevronRight></CharmChevronRight>
                    </button>
                    <button onClick={lastpage} className="rounded-md border-2 border-gray-500 hover:border-blue-500 hover:text-blue-500 text-lg text-center w-8 h-8 grid place-items-center">
                        <MaterialSymbolsKeyboardDoubleArrowRight></MaterialSymbolsKeyboardDoubleArrowRight>
                    </button>
                </div>
                <div className="grow"></div>
                <div className="relative">
                    <div
                        onClick={handelPageChange}
                        className="py-1 px-2 text-sm text-black font-normal text-center rounded-md border-2 border-gray-500 hover hover:border-blue-500 flex gap-1 items-center w-32 cursor-pointer">
                        <p>{itemPerPage} / Page</p>
                        <div className="grow"></div>
                        <CarbonChevronDown></CarbonChevronDown>
                    </div>
                    <div
                        className={`absolute top-0 translate-y-8 bg-white  left-0 rounded-md shadow-sm w-32 overflow-y-hidden transition-all duration-500 ${isSelectPage ? "block" : "hidden"}`}>
                        {[5, 10, 25, 50, 100, 250].map((val: number, index: number) => (
                            <>
                                <p onClick={() => { handelItemPerPage(val); }} className="rounded-md hover:bg-blue-500 hover:bg-opacity-25 cursor-pointer px-2 mx-2 my-1">{val} / Page</p>
                            </>
                        ))}
                    </div>
                </div>
                <div className="h-5 w-[1px] bg-gray-500"></div>
                <div className="flex gap-2 items-center">
                    <p className="text-sm text-black font-normal text-left">go to</p>
                    <input
                        onKeyDown={handelGoTo}
                        type="text"
                        pattern="[0-9]*"
                        onChange={event => {
                            event.target.value = event.target.value.replace(/\D/g, '');
                        }}
                        className="text-black border-2 border-gray-400 focus:border-blue-500 px-2 py-1 rounded-md w-14 outline-none" />
                    <p className="text-sm text-black font-normal text-left">page</p>
                </div>
            </div>
        </>
    )
}
export default Pagination;