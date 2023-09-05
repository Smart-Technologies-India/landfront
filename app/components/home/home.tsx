const HomeSection = () => {
    return (
        <>
            <section>
                <div className="w-full my-6">
                    <div className="flex items-start justify-center py-1 gap-2 mx-2 md:mx-auto md:w-9/12 px-4">
                        <div className="w-64 shrink-0">
                            <h1 className="font-semibold text-xl text-black mb-4 mt-4">At a Glance</h1>
                            <ol className="list-disc">
                                <li>
                                    <p className="font-semibold text-sm text-black my-2">Daman Area : <span className="font-normal">71.00 sq. km</span></p>
                                </li>
                                <li>
                                    <p className="font-semibold text-sm text-black my-2">Daman Populaction : <span className="font-normal">1,91,173</span> </p>
                                </li>
                                <li>
                                    <p className="font-semibold text-sm text-black my-2">Daman Village : <span className="font-normal">72</span></p>
                                </li>
                                <li>
                                    <p className="font-semibold text-sm text-black my-2">Daman Literacy Rate : <span className="font-normal">88.06%</span></p>
                                </li>
                                <li>
                                    <p className="font-semibold text-sm text-black my-2">Pin code : <span className="font-normal">Moti Daman-396220, Nani Daman-396210</span></p>
                                </li>
                            </ol>
                        </div>
                        <div className="grow bg-[#eeeeee] pl-16 px-4 py-4">
                            <h1 className="font-semibold text-xl text-black mb-4">Latest News</h1>
                            <ol className="list-disc">
                                <li>Home Department: ORDER – regarding re-designated as CPIO and First Appellate Authority under the RTI Act, 2005 in respect of the Department of Law & Justice.</li>
                                <li>Home Department: Order regarding officers/officials has been re-designated</li>
                                <li>राजभाषा विभाग: हिन्दी पखवाड़ा- 2023 के दौरान आयोजित प्रतियोगिताओं में कर्मचारियों को नामित करने के संबंध में</li>
                                <li>Department of Labour & Employment, Daman: Minimum rates of wages payable to the different categories of employees</li>
                            </ol>
                        </div>
                        <div className="w-64 shrink-0">
                            <div className="border flex gap-2 p-4 items-center">
                                <img src="/images/profile1.jpg" alt="error" className="w-14 h-14 object-cover object-center" />
                                <div>
                                    <h1 className="font-medium text-sm text-black">Hon'ble Administrator</h1>
                                    <p className="font-normal text-xs text-black">Shri. Praful Patel</p>
                                </div>
                            </div>
                            <div className="border flex gap-2 p-4 my-4 items-center">
                                <img src="/images/profile2.png" alt="error" className="w-14 h-14 object-cover object-center" />
                                <div>
                                    <h1 className="font-medium text-sm text-black">Advisor to the Hon’ble Administrator</h1>
                                    <p className="font-normal text-xs text-black">Shri Amit Singla , IAS</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default HomeSection;