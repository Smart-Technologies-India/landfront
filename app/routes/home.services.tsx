import { Link } from "@remix-run/react";

const Services: React.FC = (): JSX.Element => {
    return (
        <>
            <div className=" p-4 my-4 w-full">
                <h1 className="text-gray-800 text-3xl font-semibold text-center">Services</h1>
                <div className="w-full flex gap-4 my-4">
                    <div className="grow bg-gray-700 h-[2px]"></div>
                    <div className="w-10 bg-gray-500 h-[3px]"></div>
                    <div className="grow bg-gray-700 h-[2px]"></div>
                </div>

                {/* <div className="flex gap-6 flex-wrap justify-center">
                    <ServiceCard title="Petroleum NOC" description="This service is to apply for petroleum storage noc from the govenrment. check process or obtaning noc for petroleum storage from disctrict magistrate." apply="/home/petroleum/" view="/home" />
                </div> */}
                <div className="flex gap-6 flex-wrap justify-center mt-6">
                    <ServiceCard title="Right To Information Applicaton" description="File your RTI application online fro the departments. Users have to fill this online applicaton form for availing this service" apply="/home/rti/" view="/home" />
                    <ServiceCard title="Zone Information" description="Land maps are used by planning authorities to advice the zone and usage pattern. You may apply here for getting online zone information." apply="/home/zoneinfo/" view="/home" />
                    <ServiceCard title="Old Copy Of CP / Maps / OC" description="Obtain online a copy of any document with the Planning and Development Authority of the daman goverment through this platform." apply="/home/oldcopy" view="/home" />
                </div>
            </div>
        </>
    );
}

export default Services;

interface ServiceCardProps {
    apply: string;
    view: string;
    title: string;
    description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = (props: ServiceCardProps): JSX.Element => {
    return (
        <>
            <div className="p-4 bg-white w-96 shadow-lg hover:shadow-2xl rounded-md flex flex-col">
                <h1 className="text-2xl font-semibold ">{props.title}</h1>
                <p>{props.description}</p>
                <div className="grow"></div>
                <div className="w-full h-[2px] mt-2 bg-gray-700 shrink-0"></div>
                <p className="text-lg text-center font-normal ">Action</p>
                <div className="flex w-full gap-4 mt-2">
                    <Link to={props.view}
                        className="py-1 text-white text-lg grow bg-indigo-500 text-center rounded-md font-medium"
                    >
                        View
                    </Link>
                    <Link to={props.apply}
                        className="py-1 text-white text-lg grow bg-indigo-500 text-center rounded-md font-medium"
                    >
                        Apply
                    </Link>
                </div>
            </div>
        </>
    );
} 