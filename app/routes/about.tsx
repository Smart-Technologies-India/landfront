import { Link } from "@remix-run/react";
import { SVGProps } from "react";

const About: React.FC = (): JSX.Element => {
    return (
        <>
            <main className="bg-[#eeeeee] min-h-screen w-full pt-20">
                <div className="bg-[#03125e] w-full py-4 flex px-6 items-center fixed top-0 left-0">
                    <h1 className="grow text-center text-white text-3xl font-semibold ">
                        About Page
                    </h1>
                    <Link to="/" className="border-2 border-white  px-4 py-1 flex gap-4 font-semibold text-lg rounded-md text-white items-center">
                        <MaterialSymbolsOtherHousesRounded></MaterialSymbolsOtherHousesRounded> HOME
                    </Link>
                </div>
                <div className="p-4 mx-4 bg-white rounded-md my-6 border-l-4 border-[#03125e] hover:shadow-lg">
                    <p className="text-black text-xl p-2 text-justify font-light">
                        The Establishment Section Daman (EST Daman) is a statutory body constituted under Section
                        20
                        Daman & Diu Town and Country Planning (Amendment) Regulation, 1999 (Principal Act- Goa, Daman and Diu
                        Town and
                        Country Planning Act, 1974) in the year 2012.
                    </p>
                    <p className="text-black text-xl p-2 text-justify font-light">
                        The Establishment Section Daman (EST Daman) is a statutory body constituted
                        in the year 2012.
                    </p>
                </div>

                <div className="p-4 mx-4 bg-white rounded-md my-4 border-l-4 border-[#03125e] hover:shadow-lg">
                    <h3 className="text-black text-3xl p-1 text-justify font-medium">
                        The Members of the Establishment Section, Daman
                    </h3>
                    <div className="overflow-x-auto sm:mx-0.5 my-2">
                        <table className="min-w-full rounded-md">
                            <tbody>
                                <tr className="bg-white border-b border-t transition duration-300 ease-in-out hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1</td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        Chairman, PDA / The Hon’ble Collector, Daman
                                    </td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        Shri Saurabh Mishra, IAS
                                    </td>

                                </tr>
                                <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2</td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        The Member Secretary/ Deputy Collector (GEN)/SDM, Daman
                                    </td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        Shri. Priyanshu Singh, Danics
                                    </td>

                                </tr>
                                <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">3</td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        Superitendant PDA.
                                    </td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        Shri S.H.Parmar
                                    </td>
                                </tr>
                                <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">4</td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        LDC ,PDA
                                    </td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        Shri.Ritesh Patel
                                    </td>

                                </tr>
                                <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">5</td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        Expert Member
                                    </td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        Shri.Sudanshu Patel
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>

                </div>
                <div className="p-4 mx-4 bg-white rounded-md my-4 border-l-4 border-[#03125e] hover:shadow-lg">
                    <h3 className="text-black text-3xl p-1 text-justify font-medium">
                        Functions of Establishment Section
                    </h3>
                    <p className="font-normal text-xl">
                        <span className="text-[#03125e] pr-2">&#x2756;</span>
                        To give permission for Marriage;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#03125e] pr-2">&#x2756;</span>
                        To give permission for Roadshow;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#03125e] pr-2">&#x2756;</span>
                        To give permission for Rally;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#03125e] pr-2">&#x2756;</span>
                        To give permission for Movie Theater;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#03125e] pr-2">&#x2756;</span>
                        To give permission for Movie Shooting;
                    </p>

                </div>



                <div className="p-4 mx-4 bg-white rounded-md my-4 border-l-4 border-[#03125e] hover:shadow-lg">
                    <h3 className="text-black text-3xl p-1 text-justify font-medium">
                        Addition functions of the Authority
                    </h3>
                    <p className="font-normal text-xl">
                        <span className="text-[#03125e] pr-2">&#x2756;</span>
                        To give permission for Marriage;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#03125e] pr-2">&#x2756;</span>
                        To give permission for Roadshow;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#03125e] pr-2">&#x2756;</span>
                        To give permission for Rally;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#03125e] pr-2">&#x2756;</span>
                        To give permission for Movie Theater;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#03125e] pr-2">&#x2756;</span>
                        To give permission for Movie Shooting;
                    </p>
                </div>
                <div className="p-4 mx-4 bg-white rounded-md my-4 border-l-4 border-[#03125e] hover:shadow-lg">
                    <h3 className="text-black text-3xl p-1 text-justify font-medium">
                        Development Projects undertaken by the Authority
                    </h3>
                    <p className="font-normal text-xl">
                        <span className="text-[#03125e] pr-2">&#x2756;</span>
                        To give permission for Marriage;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#03125e] pr-2">&#x2756;</span>
                        To give permission for Roadshow;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#03125e] pr-2">&#x2756;</span>
                        To give permission for Rally;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#03125e] pr-2">&#x2756;</span>
                        To give permission for Movie Theater;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#03125e] pr-2">&#x2756;</span>
                        To give permission for Movie Shooting;
                    </p>
                </div>
            </main>
        </>
    );
}
export default About;


function MaterialSymbolsOtherHousesRounded(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M5 21q-.425 0-.713-.288T4 20v-8.375L3 12.4q-.35.275-.75.213T1.6 12.2q-.25-.35-.188-.75t.388-.65l9.6-7.325q.125-.1.275-.162T12 3.25q.175 0 .325.063t.275.162l9.625 7.325q.325.25.375.65t-.2.75q-.25.325-.65.375t-.725-.2L20 11.625V20q0 .425-.287.713T19 21H5Zm3-6q.425 0 .713-.288T9 14q0-.425-.288-.713T8 13q-.425 0-.713.288T7 14q0 .425.288.713T8 15Zm4 0q.425 0 .713-.288T13 14q0-.425-.288-.713T12 13q-.425 0-.713.288T11 14q0 .425.288.713T12 15Zm4 0q.425 0 .713-.288T17 14q0-.425-.288-.713T16 13q-.425 0-.713.288T15 14q0 .425.288.713T16 15Z"></path></svg>
    )
}