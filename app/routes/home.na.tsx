import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Fa6SolidFileLines, Fa6SolidLink } from "~/components/icons/icons";
import { userPrefs } from "~/cookies";
import { ApiCall, UploadFile } from "~/services/api";
import { z } from "zod";


export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const cookieHeader = props.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);
    return json({ user: cookie });
};

const Na: React.FC = (): JSX.Element => {
    const user = useLoaderData().user;
    const nameRef = useRef<HTMLInputElement>(null);
    const mobileRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLTextAreaElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const user_uidRef = useRef<HTMLInputElement>(null);
    const occupationRef = useRef<HTMLInputElement>(null);

    const scstRef: string[] = ["NONE", "GENERAL", "ST", "SC", "OTHER"];
    const [scst, setScst] = useState<string>("None");

    const govt_employeeRef = useRef<HTMLInputElement>(null);


    const villageRef = useRef<HTMLSelectElement>(null);
    const [village, setVillage] = useState<any[]>([]);

    const surveyRef = useRef<HTMLSelectElement>(null);
    const [survey, setSurvey] = useState<any[]>([]);

    const divisionRef = useRef<HTMLSelectElement>(null);
    const [subdivision, setSubdivision] = useState<any[]>([]);

    interface landDetailsType {
        land: string | null;
        area: string | null;
    }
    const [landDetails, setLandDetails] = useState<landDetailsType>({ area: null, land: null });

    const land_useRef = useRef<HTMLInputElement>(null);

    const land_situateRef = useRef<HTMLInputElement>(null);

    const electricRef = useRef<HTMLInputElement>(null);

    const road_accessRef = useRef<HTMLInputElement>(null);

    const road_adjoinRef = useRef<HTMLInputElement>(null);

    const na_reasonRef = useRef<HTMLInputElement>(null);
    
    const addition_landRef = useRef<HTMLInputElement>(null);
    
    const past_appln_rejectRef = useRef<HTMLInputElement>(null);

    const typeOfNARef: string[] = ["NONE", "RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "RESIDENTIALCUMCOMMERCIAL"];
    const [typeOfNA, setTypeOfNA] = useState<string>("None");
  
    const remarkRef = useRef<HTMLTextAreaElement>(null);
   
    const agri_evidence_urlRef = useRef<HTMLInputElement>(null);
    const [agrievidence, setAgrievidence] = useState<File>();
    const govt_evidence_urlRef = useRef<HTMLInputElement>(null);
    const [govtevidence, setGovtevidence] = useState<File>();
    const land_site_plan_urlRef = useRef<HTMLInputElement>(null);
    const [landplan, setLandplan] = useState<File>();
    const nakel_url_1_14Ref = useRef<HTMLInputElement>(null);
    const [nakal114, setNakal114] = useState<File>();
    const nakel_rr_14Ref = useRef<HTMLInputElement>(null);
    const [nakalrr, setNakalrr] = useState<File>();

    const [isChecked, setIsChecked] = useState(false);
    const sigimgRef = useRef<HTMLInputElement>(null);
    const [sigimg, setSigimg] = useState<File>();

    const navigator = useNavigate();

    const getSurveyNumber = async () => {
        if (villageRef!.current!.value == "0") {
            toast.error("Select Village first.", { theme: "light" });
        }
        const survey = await ApiCall({
            query: `
            query getSurveyNumber($searchSurveyInput:SearchSurveyInput!){
                getSurveyNumber(searchSurveyInput:$searchSurveyInput){
                  survey_no
                }
              }
          `,
            veriables: {
                searchSurveyInput: {
                    villageId: parseInt(villageRef!.current!.value)
                }
            },
        });
        if (survey.status) {
            setSurvey((val) => survey.data.getSurveyNumber);
        } else {
            toast.error("No Survey Number exist on this village.", { theme: "light" });
        }
    };

    const getSubDivision = async () => {
        if (surveyRef!.current!.value == "0") {
            toast.error("Select survey Number first.", { theme: "light" });
        }
        const subdivision = await ApiCall({
            query: `
            query getSubDivision($searchSurveyInput:SearchSurveyInput!){
                getSubDivision(searchSurveyInput:$searchSurveyInput){
                  sub_division,
                  owner_name,
                  area
                }
              }
          `,
            veriables: {
                searchSurveyInput: {
                    villageId: parseInt(villageRef!.current!.value),
                    survey_no: surveyRef!.current!.value,
                }
            },
        });

        if (subdivision.status) {
            setSubdivision((val) => subdivision.data.getSubDivision);
        } else {
            toast.error("No sub division exist on this Survey Number.", { theme: "light" });
        }
    };


    const getVillage = async () => {
        const village = await ApiCall({
            query: `
            query getAllVillage{
                getAllVillage{
                  id,
                  name
                }
              }
          `,
            veriables: {}
        });
        if (village.status) {
            setVillage((val) => village.data.getAllVillage);
        }
    }
    useEffect(() => {
        getVillage();
    }, []);

    const setlanddetails = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSubdivision = subdivision.find((val) => val.sub_division === e.target.value);
        if (selectedSubdivision) {
            setLandDetails(val => ({ land: selectedSubdivision.owner_name, area: selectedSubdivision.area }));
            nameRef!.current!.value = `${selectedSubdivision.owner_name.toString().split(",")[0]} ${selectedSubdivision.owner_name.toString().includes(",") ? " and others" : ""}`;
        }
    };


    const handleLogoChange = (value: React.ChangeEvent<HTMLInputElement>, setvalue: Function) => {
        let file_size = parseInt(
            (value!.target.files![0].size / 1024 / 1024).toString()
        );
        if (file_size < 4) {
            setvalue((val: any) => value!.target.files![0]);
        } else {
            toast.error("Image file size must be less then 4 mb", { theme: "light" });
        }
    }



    const submit = async () => {
        const NaScheme = z
            .object({
                name: z
                    .string()
                    .nonempty("Applicant Name is required."),
                address: z
                    .string()
                    .nonempty("Applicant address is required."),
                mobile: z
                    .string()
                    .nonempty("Applicant Contact Number is required."),
                email: z
                    .string()
                    .email("Enter a valid email.")
                    .optional(),
                user_uid: z
                    .string()
                    .optional(),
                occupation: z
                    .string()
                    .nonempty("Applicant Occupation is required."),

                scst:z  
                    .string()
                    .nonempty("Applicant Sc/St status is required."),
                govt_employee: z
                    .string()
                    .nonempty("Applicant Employee status is required."),
        
                village_id: z
                    .number({ invalid_type_error: "Select a valid village", required_error: "Select a village" })
                    .optional(),
                survey_no: z
                    .string()
                    .nonempty("Select survey numbers."),
                sub_division: z
                    .string()
                    .nonempty("Select sub division."),
                land_use: z
                    .string()
                    .optional(),
                land_situate: z
                    .string()
                    .optional(),
                electric: z
                    .string()
                    .optional(),
                road_access: z
                    .string()
                    .optional(),
                road_adjoin: z
                    .string()
                    .optional(),
                na_reason: z
                    .string()
                    .optional(),
                land_purpose:z  
                    .string()
                    .nonempty("Applicant Sc/St status is required."),
                addition_land: z
                    .string()
                    .optional(),
                past_appln_reject: z
                    .string()
                    .optional(),
                iagree: z
                    .string()
                    .nonempty("Check the  agree box"),
            })
            .strict();

        type NaScheme = z.infer<typeof NaScheme>;

        const naScheme: NaScheme = {
            name: nameRef!.current!.value,
            address: addressRef!.current!.value,
            mobile: mobileRef!.current!.value,
            email: emailRef!.current!.value,
            user_uid: user_uidRef!.current!.value,
            village_id: parseInt(villageRef!.current!.value),
            occupation: occupationRef!.current!.value,
            scst: scst,
            govt_employee: govt_employeeRef!.current!.value,
            survey_no: surveyRef!.current!.value,
            sub_division: divisionRef!.current!.value,
            land_use: land_useRef!.current!.value,
            land_situate: land_situateRef!.current!.value,
            electric: electricRef!.current!.value,
            road_access: road_accessRef!.current!.value,
            road_adjoin: road_adjoinRef!.current!.value,
            na_reason: na_reasonRef!.current!.value,
            land_purpose:typeOfNA,
            addition_land: addition_landRef!.current!.value,
            past_appln_reject: past_appln_rejectRef!.current!.value,
            iagree: isChecked ? "YES" : "NO",
        };

        const parsed = NaScheme.safeParse(naScheme);

        if (parsed.success) {
            if (agrievidence == null || agrievidence == undefined) { toast.error("Select Agriculture Evidence Document.", { theme: "light" }); }
            if (govtevidence == null || govtevidence == undefined) { toast.error("Select Government Evidence Document.", { theme: "light" }); }
            if (landplan == null || landplan == undefined) { toast.error("Select Land Plan Document.", { theme: "light" }); }
            if (nakal114 == null || nakal114 == undefined) { toast.error("Select Nakal 1-14 Document.", { theme: "light" }); }
            if (nakalrr == null || nakalrr == undefined) { toast.error("Select RR Nakal Document.", { theme: "light" }); }
            if (sigimg == null || sigimg == undefined) { toast.error("Select Signature Image.", { theme: "light" }); }

            
            const agri_evidence_url = await UploadFile(agrievidence!);
            const govt_evidence_url = await UploadFile(govtevidence!);
            const land_site_plan_url = await UploadFile(landplan!);
            const nakel_url_1_14 = await UploadFile(nakal114!);
            const nakel_rr_14 = await UploadFile(nakalrr!);
            const sign_url = await UploadFile(sigimg!);



            if (agri_evidence_url.status && sign_url.status && govt_evidence_url.status && land_site_plan_url.status && nakel_url_1_14.status && nakel_rr_14.status) {

                const data = await ApiCall({
                    query: `
                    mutation createNa($createNaInput:CreateNaInput!){
                        createNa(createNaInput:$createNaInput){
                          id
                        }
                      }
                    `,
                    veriables: {
                        createNaInput: {
                            userId: Number(user.id),
                            name: naScheme.name,
                            address: naScheme.address,
                            email: naScheme.email,
                            mobile: naScheme.mobile,
                            user_uid: naScheme.user_uid,
                            occupation: naScheme.occupation,
                            scst:naScheme.scst,
                            govt_employee: naScheme.govt_employee,
                            village_id: naScheme.village_id,
                            survey_no: naScheme.survey_no,
                            sub_division: naScheme.sub_division,
                            land_use: naScheme.land_use,
                            land_situate: naScheme.land_situate,
                            electric: naScheme.electric,
                            road_access: naScheme.road_access,
                            road_adjoin: naScheme.road_adjoin,
                            na_reason: naScheme.na_reason,
                            addition_land: naScheme.addition_land,
                            land_purpose:naScheme.typeOfNA,
                            past_appln_reject: naScheme.past_appln_reject,
                            agri_evidence_url: agri_evidence_url.data,
                            govt_evidence_url: govt_evidence_url.data,
                            land_site_plan_url: land_site_plan_url.data,
                            nakel_url_1_14: nakel_url_1_14.data,
                            nakel_rr_14: nakel_rr_14.data,

                            signature_url: sign_url.data,
                            iagree: naScheme.iagree,
                            status: "ACTIVE",
                        }
                    },
                });
                if (!data.status) {
                    toast.error(data.message, { theme: "light" });
                } else {
                    navigator(`/home/naview/${data.data.createNa.id}`);
                }


            }
            else {
                toast.error("Something want wrong unable to upload images.", { theme: "light" });
            }
        } else { toast.error(parsed.error.errors[0].message, { theme: "light" }); }

    }
    return (
        <>
            <div className="bg-white rounded-md shadow-lg p-4 my-4 w-full">
                <h1 className="text-gray-800 text-3xl font-semibold text-center">Application for Conversion of Agriculture Land to Non Agriculture Land.</h1>
                <div className="w-full flex gap-4 my-4">
                    <div className="grow bg-gray-700 h-[2px]"></div>
                    <div className="w-10 bg-gray-500 h-[3px]"></div>
                    <div className="grow bg-gray-700 h-[2px]"></div>
                </div>
                <p className="text-center font-semibold text-xl text-gray-800"> SUBJECT  :  Application for Conversion of Agriculture Land to Non Agriculture Land.</p>


                {/*--------------------- section 1 start here ------------------------- */}
                <div className="w-full bg-indigo-500 py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white">1. Land Details </p>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">1.1</span> Applicant village
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <select ref={villageRef} onChange={getSurveyNumber} defaultValue={"0"} className="w-full bg-transparent fill-none outline-none border-2 border-black text-black p-2">
                            <option value="0" className="bg-white text-blakc text-lg" disabled>Select village</option>
                            {village.map((val: any, index: number) =>
                                <option key={index} value={val.id} className="bg-white text-black text-lg" >{val.name}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">1.2</span> Survey No
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <select disabled={villageRef.current?.value == "0" ? true : false} ref={surveyRef} defaultValue={"0"} onChange={getSubDivision} className="w-full bg-transparent fill-none outline-none border-2 border-black text-black p-2">
                            <option value="0" className="bg-white text-blakc text-lg" disabled>Select Survey No</option>
                            {survey.map((val: any, index: number) =>
                                <option key={index} value={val.survey_no} className="bg-white text-black text-lg">{val.survey_no}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">1.3</span> Sub Division
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <select disabled={surveyRef.current?.value == "0"} ref={divisionRef} defaultValue={"0"} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setlanddetails(e)} className="w-full bg-transparent fill-none outline-none border-2 border-black text-black p-2">
                            <option value="0" className="bg-white text-blakc text-lg" disabled>Select Sub Division</option>
                            {subdivision.map((val: any, index: number) =>
                                <option key={index} value={val.sub_division} className="bg-white text-black text-lg">{val.sub_division}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">1.4</span> Land Owner
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {landDetails.land == null || landDetails.land == undefined || landDetails.land == "" ? "-" : landDetails.land}
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.5</span> Area
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {landDetails.area == null || landDetails.area == undefined || landDetails.area == "" ? "-" : landDetails.area}
                    </div>
                </div>

                {/*--------------------- section 1 end here ------------------------- */}

                {/*--------------------- section 2 start here ------------------------- */}
                <div className="w-full bg-indigo-500 py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white"> 2. Applicant Details(s) </p>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.1</span> Applicant Name
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            ref={nameRef}
                            placeholder="Applicant Name"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.2</span> Applicant address
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <textarea
                            ref={addressRef}
                            placeholder="Applicant address"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none"
                        ></textarea>
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.3</span> Applicant Contact Number
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            ref={mobileRef}
                            placeholder="Applicant Contact Number"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.4</span> Applicant E-mail
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            ref={emailRef}
                            placeholder="Applicant Email"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.5</span> Applicant UID
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            ref={user_uidRef}
                            placeholder="Applicant UID"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.6</span> Applicant Occupation
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            ref={occupationRef}
                            placeholder="Applicant Occupation"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.7</span> Whether the Applicant belongs to ST / SC Community
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-4">
                        {
                            scstRef.slice(1).map((val: string, index: number) => {
                                return (
                                    <div
                                        key={index}
                                        className="flex gap-2 items-center cursor-pointer"
                                        onClick={() => {
                                            setScst((value) => val);
                                        }}>
                                        <input type="checkbox" className="scale-110" checked={scst === val}
                                            onChange={() => { }}
                                        />
                                        <p className="text-left text-lg font-normal">{val}</p>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>

                    <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.8</span> Whether the Applicant is occupant Class I or Class II or a tenant or a Government lessee.
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            ref={govt_employeeRef}
                            placeholder="Fill Details"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div>
                    
                {/*--------------------- section 2 end here ------------------------- */}


                {/*--------------------- section 3 start here ------------------------- */}
                <div className="w-full bg-indigo-500 py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white"> 3. Land Details </p>
                </div>
               
                <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.1</span> Present use of the land and whether any building exists thereon and if so its use
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <textarea
                            ref={land_useRef}
                            placeholder="Fill Details"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none"
                        ></textarea>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.2</span> Whether the land is situated or
(a) is municipal area;
(b) in City Surveyed area
(c) in or near a cantonment area.
(d) Near a Air-Port or a Railway station or a Railway line or Jail or prison or local pulbic office or cermation or burial ground. If so , its approximate distance therefrom.
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <textarea
                            ref={land_situateRef}
                            placeholder="Fill Details"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none"
                        ></textarea>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.3</span> Whether electrical high transmission lines pass over the land and if so, what is the distance thereof from the proposed building or other works.
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <textarea
                            ref={electricRef}
                            placeholder="Fill Details"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none"
                        ></textarea>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.4</span> Is there any road from where the land is easily accessible ? State the name of the road, and whether it is Highway, Major district road or village road. What is the distance or the proposed building or other workds from the center of the road.
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <textarea
                            ref={road_accessRef}
                            placeholder="Fill Details"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none"
                        ></textarea>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.5</span> Is there is no road adjoining the land how is it proposed to provide for access to the site?
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <textarea
                            ref={road_adjoinRef}
                            placeholder="Fill Details"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none"
                        ></textarea>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.6</span> Reason for N.A. use of the proposed land, and its genuineness
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <textarea
                            ref={na_reasonRef}
                            placeholder="Fill Details"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none"
                        ></textarea>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.7</span> Whether the applicant has any other land besides the land proposed for N.A. use
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <textarea
                            ref={addition_landRef}
                            placeholder="Fill Details"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none"
                        ></textarea>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.8</span> Was a similar application made in the past for N.A. use of this land and was it rejected ? if yes, why ?
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <textarea
                            ref={past_appln_rejectRef}
                            placeholder="Fill Details"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none"
                        ></textarea>
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.9</span> Specify Non Agricultural purpose use of land
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-4">
                        {
                            typeOfNARef.slice(1).map((val: string, index: number) => {
                                return (
                                    <div
                                        key={index}
                                        className="flex gap-2 items-center cursor-pointer"
                                        onClick={() => {
                                            setTypeOfNA((value) => val);
                                        }}>
                                        <input type="checkbox" className="scale-110" checked={typeOfNA === val}
                                            onChange={() => { }}
                                        />
                                        <p className="text-left text-lg font-normal">{val}</p>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">3.10</span> Whether the proposed Applicant(s) is / are an agriculturist(s), if so, submit documentary evidences supporting the claim
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={agri_evidence_urlRef} accept="*/*" onChange={(e) => handleLogoChange(e, setAgrievidence)} />
                        </div>
                        <button
                            onClick={() => agri_evidence_urlRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {agrievidence == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            agrievidence != null ?
                                <a target="_blank" href={URL.createObjectURL(agrievidence)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">3.11</span> Whether the proposed Applicant is a Govt. Servant, NOC / Permission for acquiring the property from the Competent Authority, if so, submit documentary evidences supporting the claim
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={govt_evidence_urlRef} accept="*/*" onChange={(e) => handleLogoChange(e, setGovtevidence)} />
                        </div>
                        <button
                            onClick={() => govt_evidence_urlRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {govtevidence == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            govtevidence != null ?
                                <a target="_blank" href={URL.createObjectURL(govtevidence)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>

                {/*--------------------- section 3 end here ------------------------- */}

                {/*--------------------- section 4 start here ------------------------- */}
                <div className="w-full bg-indigo-500 py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white"> 4. Document Attachment </p>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.1</span> Form No. I & XIV
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={nakel_url_1_14Ref} accept="*/*" onChange={(e) => handleLogoChange(e, setNakal114)} />
                        </div>
                        <button
                            onClick={() => nakel_url_1_14Ref.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {nakal114 == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            nakal114 != null ?
                                <a target="_blank" href={URL.createObjectURL(nakal114)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.2</span> Land Site Plan
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={land_site_plan_urlRef} accept="*/*" onChange={(e) => handleLogoChange(e, setLandplan)} />
                        </div>
                        <button
                            onClick={() => land_site_plan_urlRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {landplan == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            landplan != null ?
                                <a target="_blank" href={URL.createObjectURL(landplan)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.3</span> RR Nakal
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={nakel_rr_14Ref} accept="*/*" onChange={(e) => handleLogoChange(e, setNakalrr)} />
                        </div>
                        <button
                            onClick={() => nakel_rr_14Ref.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {nakalrr == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            nakalrr != null ?
                                <a target="_blank" href={URL.createObjectURL(nakalrr)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>
                {/*--------------------- section 4 end here ------------------------- */}


                {/*--------------------- section 5 start here ------------------------- */}
                <div className="w-full bg-indigo-500 py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white">
                        5. Applicant / Occupant Declaration and Signature </p>
                </div>

                <div className="flex gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="text-xl font-normal text-left text-gray-700 ">
                        5.1
                    </div>
                    <div className="flex items-start">
                        <input type="checkbox" className="mr-2 my-2" checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)} />
                        <label htmlFor="checkbox" className="text-xl font-normal text-left text-gray-700 ">
                            I solemnly affirm & hereby give undertaking that the above information furnished by me are correct and true to the best of my knowledge and belief
                        </label>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">5.2</span> Applicant Signature Image
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={sigimgRef} accept="*/*" onChange={(e) => handleLogoChange(e, setSigimg)} />
                        </div>
                        <button
                            onClick={() => sigimgRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {sigimg == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            sigimg != null ?
                                <a target="_blank" href={URL.createObjectURL(sigimg)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>
                {/*--------------------- section 5 end here ------------------------- */}
                <div className="flex flex-wrap gap-6 mt-4">
                    <Link to={"/home/"}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium"
                    >
                        Discard & Close
                    </Link>
                    <button
                        onClick={submit}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                    >
                        Preview & Proceed
                    </button>
                </div>
            </div>
        </>
    );
}

export default Na;