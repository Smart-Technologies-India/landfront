const Feature = () => {
    return (
        <>
            <section className="text-gray-600 body-font bg-gray-100">
                <div className="container px-5 py-8 mx-auto">

                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900 text-center py-6">Provided Features</h1>

                    <div className="grid grid-items-center grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                        <div className="px-8 py-6  bg-white m-4 hover:shadow-lg rounded-lg hover:rounded-none transition-all">
                            <div className=" h-40 grid place-items-center w-full">
                                <img src="/images/marriage_permission.png" className="mb-4 w-40" alt="error" />
                            </div>
                            <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2 text-center">Marriage Permission</h2>
                            <p className="leading-relaxed text-base mb-4 text-center">Get marriage permission online, Fill form,Submit Relevant Documents and get permission through Whatsapp.</p>

                        </div>
                        <div className="px-8 py-6 bg-white m-4 hover:shadow-lg rounded-lg hover:rounded-none transition-all">
                            <div className=" h-40 grid place-items-center w-full">
                                <img src="/images/religion_permission.png" className="mb-4 w-40" alt="error" />
                            </div>
                            <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2  text-center">Religious Permission</h2>
                            <p className="leading-relaxed text-base mb-4 text-center">Get religious permission online, Fill form,Submit Relevant Documents and get permission through Whatsapp.</p>

                        </div>
                        <div className="px-8 py-6 bg-white m-4 hover:shadow-lg rounded-lg hover:rounded-none transition-all">
                            <div className=" h-40 grid place-items-center w-full">

                                <img src="/images/roadshow.png" className="mb-4 w-40" alt="error" />
                            </div>
                            <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2 text-center">Road Show/Rally Permission</h2>
                            <p className="leading-relaxed text-base mb-4 text-center">Get rally permission online, Fill form,Submit Relevant Documents and get permission through Whatsapp.</p>

                        </div>
                        <div className="px-8 py-6 bg-white m-4 hover:shadow-lg rounded-lg hover:rounded-none transition-all">
                            <div className=" h-40 grid place-items-center w-full">
                                <img src="/images/cinema.png" className="mb-4 w-40" alt="error" />
                            </div>
                            <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2 text-center">Cinema Hall</h2>
                            <p className="leading-relaxed text-base mb-4 text-center">Get cinema hall permission online, Fill form,Submit Relevant Documents and get permission through Whatsapp.</p>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Feature;