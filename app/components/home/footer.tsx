import { Link } from "@remix-run/react";

const Footer = () => {
    return (
        <>

            <div className="bg-[#03125E] w-full gap-8 py-8 flex items-center justify-center px-2 md:px-8">
                <div className="grid place-items-center">
                    <div>
                        <p className="text-left text-3xl font-normal text-white my-2">Map</p>
                        <img src="/banner/3.jpg" alt="error" className=" mx-auto w-96 h-96 object-cover object-center" />
                    </div>
                </div>
                <div className="grid place-items-center">
                    <div>
                        <p className="text-left text-3xl font-normal text-white my-2">Helpline Number</p>
                        <div className="grid gap-4 grid-cols-2 grid-rows-2 w-96 h-96">
                            <div className="w-full h-full bg-[#bd3334] grid place-items-center">
                                <div>
                                    <p className="text-center text-2xl font-normal text-white">Police</p>
                                    <p className="text-center text-lg font-medium text-white my-1">100</p>
                                </div>
                            </div>
                            <div className="w-full h-full bg-[#bd3334]  grid place-items-center">
                                <div>
                                    <p className="text-center text-2xl font-normal text-white">Fire Station</p>
                                    <p className="text-center text-lg font-medium text-white my-1">101</p>
                                </div>
                            </div>
                            <div className="w-full h-full bg-[#bd3334]  grid place-items-center">
                                <div>
                                    <p className="text-center text-2xl font-normal text-white">AMBULANCE</p>
                                    <p className="text-center text-lg font-medium text-white my-1">108</p>
                                </div>
                            </div>
                            <div className="w-full h-full bg-[#bd3334] grid place-items-center">
                                <div>
                                    <p className="text-center text-2xl font-normal text-white">EMERGENCY</p>
                                    <p className="text-center text-lg font-medium text-white my-1">112</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="flex items-center justify-center mx-2 px-4 py-4">
                <img src="/banner/one.png" alt="footerimage" className="w-44 h-16 object-cover object-center border-x-2" />
                <img src="/banner/two.png" alt="footerimage" className="w-44 h-16 object-cover object-center border-x-2" />
                <img src="/banner/three.png" alt="footerimage" className="w-44 h-16 object-cover object-center border-x-2" />
                <img src="/banner/four.png" alt="footerimage" className="w-44 h-16 object-cover object-center border-x-2" />
                <img src="/banner/five.png" alt="footerimage" className="w-44 h-16 object-cover object-center border-x-2" />
                <img src="/banner/six.png" alt="footerimage" className="w-44 h-16 object-cover object-center border-x-2" />
            </div>
            <section className="bg-[#0c0c0c]">
                <div className=" w-full bg-[#2a2a2a]">
                    <div className="flex items-center justify-center py-1 gap-2 mx-2 md:mx-auto md:w-9/12 px-4">
                        <Link className="text-lg font-normal text-white px-1" to="/" >FAQ /</Link>
                        <Link className="text-lg font-normal text-white px-1" to="/" >Website Policies /</Link>
                        <Link className="text-lg font-normal text-white px-1" to="/" >Contact Us /</Link>
                        <Link className="text-lg font-normal text-white px-1" to="/" >Help /</Link>
                        <Link className="text-lg font-normal text-white px-1" to="/" >Web Information Mnager</Link>
                    </div>
                </div>
                <div className="w-full bg-[#0c0c0c]">
                    <div className="py-1 gap-2 mx-2 md:mx-auto md:w-9/12 px-4 y-6">
                        <p className="text-center text-xs font-normal text-white my-6">Content Owned by U.T. Administration of Dadra and Nagar Haveli and Daman and Diu. Government of India.
                            <br />
                            Developed and hosted by National Informatics Centre,
                            <br />
                            Ministry of Electronics & Information Technology, Government of India</p>
                        <p className="text-center text-sm font-normal text-white y-4">Last Updated <span className="font-semibold">Aug 14, 2023</span></p>
                    </div>
                    <div className="flex items-center justify-center gap-6 mx-2 md:mx-auto md:w-9/12 px-4 py-10">
                        <img src="/images/S3WaaS.png" alt="footerimage" className="w-44 h-16 object-cover object-center" />
                        <img src="/images/nicLogo.png" alt="footerimage" className="w-44 h-16 object-cover object-center" />
                        <img src="/images/digital-india.png" alt="footerimage" className="w-44 h-16 object-cover object-center" />

                    </div>
                </div>
            </section>
        </>
    );
}

export default Footer;