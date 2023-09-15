import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import QueryTabs from "~/components/QueryTabs";
import { Fa6SolidFileLines, Fa6SolidLink } from "~/components/icons/icons";
import { userPrefs } from "~/cookies";
import { ApiCall, UploadFile } from "~/services/api";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const id = props.params.id;
    const cookieHeader = props.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);
    const data = await ApiCall({
        query: `
        query getGiftById($id:Int!){
            getGiftById(id:$id){
              id,
              name,
              address,
              mobile,
              email,
              user_uid,
              userId,
              scst,
              occupation,
              govt_employee,
              survey_no,
              village_id,
              sub_division,
              land_use,
              land_situate,
              electric,
              road_access,
              land_acq,
              gift_reason,
              addition_land,
              past_appln_reject,
              agri_evidence_url,
              govt_evidence_url,
              land_site_plan_url,
              nakel_url_1_14,
              remarks,
              iagree,
              signature_url,
              name_donee,
              address_donee,
              mobile_donee
            }
          }
      `,
        veriables: {
            id: parseInt(id!),
            form_type: "GIFT"
        },
    });


    const submit = await ApiCall({
        query: `
        query searchCommon($searchCommonInput:SearchCommonInput!){
            searchCommon(searchCommonInput:$searchCommonInput){
              id,
              village,
              name,
              form_type,
              user_id,
              auth_user_id,
              focal_user_id,
              intra_user_id,
              inter_user_id,
              number,
              form_status,
              query_status, 
            }
          }
      `,
        veriables: {
            "searchCommonInput": {
                "form_id": parseInt(id!),
                form_type: "GIFT"
            }
        },
    });

    const village = await ApiCall({
        query: `
        query getVillageById($id:Int!){
            getVillageById(id:$id){
              id,
              name
            }
          }
      `,
        veriables: {
            id: parseInt(data.data.getGiftById.village_id)
        },
    });

    const subdivision = await ApiCall({
        query: `
        query getSubDivision($searchSurveyInput:SearchSurveyInput!){
            getSubDivision(searchSurveyInput:$searchSurveyInput){
              sub_division,
              owner_name,
              area,
              zone
            }
          }
      `,
        veriables: {
            searchSurveyInput: {
                villageId: parseInt(data.data.getGiftById.village_id),
                survey_no: data.data.getGiftById.survey_no,
            }
        },
    });


    return json({
        user: cookie,
        from_data: data.data.getGiftById,
        submit: submit.status,
        village: village.data.getVillageById,
        subdivision: subdivision.data.getSubDivision,
        common: submit.data.searchCommon
    });
};


const GiftView: React.FC = (): JSX.Element => {
    const loader = useLoaderData();
    const user = loader.user;
    const villagedata = loader.village;
    const from_data = loader.from_data;
    const division = loader.subdivision;
    const isSubmited = loader.submit;

    const isUser = user.role == "USER";

    const common = isSubmited ? loader.common[0] : null;

    interface landDetailsType {
        land: string | null;
        area: string | null;
        zone: string | null;
    }

    const [landDetails, setLandDetails] = useState<landDetailsType>({ area: null, land: null, zone: null });
    const navigator = useNavigate();

    const setlanddetails = (value: string) => {
        const selectedSubdivision = division.find((val: any) => val.sub_division === value);
        if (selectedSubdivision) {
            setLandDetails(val => ({ land: selectedSubdivision.owner_name, area: selectedSubdivision.area, zone: selectedSubdivision.zone }))
        }
    };



    useEffect(() => {
        setlanddetails(from_data.sub_division);
    }, []);





    const submit = async () => {



        const data = await ApiCall({
            query: `
            mutation createCommon($createCommonInput:CreateCommonInput!){
                createCommon(createCommonInput:$createCommonInput){
                  id,
                }
              }
            `,
            veriables: {
                createCommonInput: {
                    "form_id": Number(from_data.id),
                    "user_id": Number(user.id),
                    "auth_user_id": "5",
                    "focal_user_id": "5",
                    "intra_user_id": "5,6",
                    "inter_user_id": "0",
                    "village": villagedata.name,
                    "name": from_data.name,
                    "number": from_data.mobile.toString(),
                    "form_status": 1,
                    "form_type": "GIFT",
                    "query_status": "SUBMIT"
                }
            },
        });
        if (!data.status) {
            toast.error(data.message, { theme: "light" });
        } else {
            navigator("/home/");
        }
    }


    const [querybox, setQueryBox] = useState<boolean>(false);
    const queryRef = useRef<HTMLTextAreaElement>(null);
    const attachmentRef = useRef<HTMLInputElement>(null);
    const [attachment, setAttachment] = useState<File>();

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


    const submitQuery = async () => {
        if (queryRef.current?.value == null || queryRef.current?.value == "") return toast.error("Remark is required", { theme: "light" });
        const req: { [key: string]: any } = {
            "stage": "GIFT",
            "form_id": from_data.id,
            "from_user_id": Number(user.id),
            "to_user_id": from_data.userId,
            "form_status": common.form_status,
            "query_type": "PUBLIC",
            "remark": queryRef.current?.value,
            "query_status": "SENT"
        }

        if (attachment != null) {
            const attach = await UploadFile(attachment);
            if (attach.status) {
                req.doc_url = attach.data
            } else {
                return toast.error("Unable to upload attachment", { theme: "light" });
            }
        }

        const data = await ApiCall({
            query: `
            mutation createQuery($createQueryInput:CreateQueryInput!){
                createQuery(createQueryInput:$createQueryInput){
                  id,
                }
              }
            `,
            veriables: {
                createQueryInput: req
            },
        });

        if (data.status) {
            setQueryBox(val => false);
            return toast.success("Query sent successfully.", { theme: "light" });
        } else {
            return toast.error(data.message, { theme: "light" });
        }
    }

    const [forwardbox, setForwardBox] = useState<boolean>(false);
    const forwardRef = useRef<HTMLTextAreaElement>(null);


    interface forwardqueryType {
        title: string;
        formstatus: number;
        querytype: string;
        authuserid: string;
        foacaluserid: string;
        intrauserid: string;
        interuserid: string;
        touserid: number;
        querystatus: string;
    }

    const [nextdata, setNextData] = useState<forwardqueryType>({
        title: "Send to Headclerk",
        authuserid: "0",
        foacaluserid: "0",
        intrauserid: "0",
        interuserid: "0",
        formstatus: 0,
        querytype: "NONE",
        touserid: 0,
        querystatus: "NONE"
    });

    const forwardQuery = async (args: forwardqueryType) => {
        if (forwardRef.current?.value == null || forwardRef.current?.value == "") return toast.error("Remark is required", { theme: "light" });
        const req: { [key: string]: any } = {
            "stage": "GIFT",
            "form_id": from_data.id,
            "from_user_id": Number(user.id),
            "to_user_id": args.touserid,
            "form_status": args.formstatus,
            "query_type": args.querytype,
            "remark": forwardRef.current?.value,
            "query_status": "SENT"
        }

        if (attachment != null) {
            const attach = await UploadFile(attachment);
            if (attach.status) {
                req.doc_url = attach.data
            } else {
                return toast.error("Unable to upload attachment", { theme: "light" });
            }
        }

        const data = await ApiCall({
            query: `
            mutation createQuery($createQueryInput:CreateQueryInput!){
                createQuery(createQueryInput:$createQueryInput){
                  id,
                }
              }
            `,
            veriables: {
                createQueryInput: req
            },
        });

        if (data.status) {
            const data = await ApiCall({
                query: `
                mutation updateCommonById($updateCommonInput:UpdateCommonInput!){
                    updateCommonById(updateCommonInput:$updateCommonInput){
                      id,
                    }
                  }
              `,
                veriables: {
                    updateCommonInput: {
                        id: common.id,
                        auth_user_id: args.authuserid,
                        focal_user_id: args.foacaluserid,
                        intra_user_id: args.intrauserid,
                        inter_user_id: args.interuserid,
                        form_status: args.formstatus,
                        query_status: args.querystatus
                    }
                },
            });

            if (!data.status) {
                toast.error(data.message, { theme: "light" });
            } else {
                setForwardBox(val => false);
                toast.success("Form sent successfully.", { theme: "light" });
                setTimeout(() => {
                    window.location.reload();
                }, 1500)

            }
        } else {
            return toast.error(data.message, { theme: "light" });
        }
    }



    const [notings, setNotings] = useState<any[]>([]);

    const getNotings = async () => {
        const data = await ApiCall({
            query: `
                query searchQuery($searchQueryInput:SearchQueryInput!){
                    searchQuery(searchQueryInput:$searchQueryInput){
                        id,
                      from_user_id,
                      to_user_id
                      remark
                      doc_url,
                      createdAt,
                      query_type,
                        from_user{
                        name,
                        role
                      },
                      to_user{
                        name,
                        role
                      }
                    }
                  }
                `,
            veriables: {
                searchQueryInput: {
                    form_id: from_data.id,
                    stage: "GIFT",
                    query_type: isUser ? "PUBLIC" : "INTRA"
                }
            },
        });

        if (data.status) {
            setNotings(val => data.data.searchQuery);
        }

    }
    useEffect(() => { getNotings() }, []);


    const [rejectbox, setRejectBox] = useState<boolean>(false)
    const [rejectid, setRejectid] = useState<number>(0)

    const reject = async (id: number) => {
        if (rejectid == 0) return toast.error("Select the form for rejection.", { theme: "light" });
        const data = await ApiCall({
            query: `
            mutation updateCommonById($updateCommonInput:UpdateCommonInput!){
                updateCommonById(updateCommonInput:$updateCommonInput){
                  id,
                }
              }
          `,
            veriables: {
                updateCommonInput: {
                    id: id,
                    query_status: "REJECTED"
                }
            },
        });

        if (!data.status) {
            setRejectBox(false);
            toast.error(data.message, { theme: "light" });
        } else {
            window.location.reload();
        }
    }



    return (
        <>
            {/* reject box start here */}
            <div className={`fixed top-0 left-0 bg-black bg-opacity-20 min-h-screen w-full  z-50 ${rejectbox ? "grid place-items-center" : "hidden"}`}>
                <div className="bg-white p-4 rounded-md w-80">
                    <h3 className="text-2xl text-center font-semibold">Are you sure you want to reject?</h3>
                    <div className="w-full h-[2px] bg-gray-800 my-4"></div>
                    <div className="flex flex-wrap gap-6 mt-4">
                        <button
                            onClick={() => reject(rejectid)}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
                        >
                            Rejact
                        </button>
                        <button
                            onClick={() => setRejectBox(val => false)}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
            {/* reject box end here */}
            {/* query box start here */}
            <div className={`fixed top-0 left-0 bg-black bg-opacity-20 min-h-screen w-full  z-50 ${querybox ? "grid place-items-center" : "hidden"}`}>
                <div className="bg-white p-4 rounded-md w-80">
                    <h3 className="text-2xl text-center font-semibold">Raise query</h3>

                    <textarea
                        ref={queryRef}
                        placeholder="Information Needed"
                        className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none my-4"
                    ></textarea>

                    <div className="flex-none flex flex-col gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={attachmentRef} accept="*/*" onChange={(e) => handleLogoChange(e, setAttachment)} />
                        </div>
                        <button
                            onClick={() => attachmentRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-indigo-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {attachment == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            attachment != null ?
                                <a target="_blank" href={URL.createObjectURL(attachment)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-yellow-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                    <div className="w-full h-[2px] bg-gray-800 my-4"></div>
                    <div className="flex flex-wrap gap-6 mt-4">
                        <button
                            onClick={submitQuery}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
                        >
                            Proceed
                        </button>
                        <button
                            onClick={() => setQueryBox(val => false)}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
                        >
                            Close
                        </button>
                    </div>

                </div>
            </div>
            {/* query box end here */}
            {/* forward box start here */}
            <div className={`fixed top-0 left-0 bg-black bg-opacity-20 min-h-screen w-full  z-50 ${forwardbox ? "grid place-items-center" : "hidden"}`}>
                <div className="bg-white p-4 rounded-md w-80">
                    <h3 className="text-2xl text-center font-semibold">Forward to Headclerk</h3>
                    <textarea
                        ref={forwardRef}
                        placeholder="Information Needed"
                        className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none my-4"
                    ></textarea>
                    <div className="flex-none flex flex-col gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={attachmentRef} accept="*/*" onChange={(e) => handleLogoChange(e, setAttachment)} />
                        </div>
                        <button
                            onClick={() => attachmentRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-indigo-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {attachment == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            attachment != null ?
                                <a target="_blank" href={URL.createObjectURL(attachment)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-yellow-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                    <div className="w-full h-[2px] bg-gray-800 my-4"></div>
                    <div className="flex flex-wrap gap-6 mt-4">
                        <button
                            onClick={() => forwardQuery(nextdata)}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
                        >
                            Proceed
                        </button>
                        <button
                            onClick={() => setForwardBox(val => false)}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
                        >
                            Close
                        </button>
                    </div>

                </div>
            </div>
            {/* forward box end here */}
            <div className="bg-white rounded-md shadow-lg p-4 my-4 w-full">
                <h1 className="text-gray-800 text-3xl font-semibold text-center">Application for Gift of Land.</h1>
                <div className="w-full flex gap-4 my-4">
                    <div className="grow bg-gray-700 h-[2px]"></div>
                    <div className="w-10 bg-gray-500 h-[3px]"></div>
                    <div className="grow bg-gray-700 h-[2px]"></div>
                </div>
                <p className="text-center font-semibold text-xl text-gray-800"> SUBJECT  :  Application for Gift of Land.</p>


                {/*--------------------- section 1 start here ------------------------- */}
                <div className="w-full bg-indigo-500 py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white">1. Land Details </p>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">1.1</span> Applicant village
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {villagedata.name}
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">1.2</span> Survey No
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.survey_no}
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">1.3</span> Sub Division
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.sub_division}
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
                        <span className="mr-2">1.5</span> Area
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {landDetails.area == null || landDetails.area == undefined || landDetails.area == "" ? "-" : landDetails.area}
                    </div>
                </div>

                {/*--------------------- section 1 end here ------------------------- */}

                {/*--------------------- section 2 start here ------------------------- */}
                <div className="w-full bg-indigo-500 py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white"> 2. Donor Details(s) </p>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.1</span> Donor Name
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.name}
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.2</span> Donor address
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.address}
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.3</span> Donor Contact Number
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.mobile}
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.4</span> Donor E-mail
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.email}
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.5</span> Donor UID
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.user_uid}
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.6</span> Donor Occupation
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.occupation}
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.7</span> Whether the Donor belongs to ST / SC Community
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.scst}
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.8</span> Whether the Donor is occupant Class I or Class II or a tenant or a Government lessee.
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.govt_employee}
                    </div>
                </div>

                {/*--------------------- section 2 end here ------------------------- */}


                {/*--------------------- section 3 start here ------------------------- */}
                <div className="w-full bg-indigo-500 py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white"> 3. Permission Details </p>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">3.1</span> Present use of the land and whether any building exists thereon and if so its use
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.land_use}
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.2</span> Whether the land is situated by/or adjoining to road, nalla, creek, bank of river, etc. If so, also mention its approximate distance(s)
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.land_situate}
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">3.3</span> Whether electrical high transmission lines pass over the land and if so, what is the distance thereof from the proposed building or other works.
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.electric}
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">3.4</span> Is there any road from where the land is easily accessible ? If there is no road adjoining the land how is it proposed to provide for access to the site?
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.road_access}
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">3.5</span> Is the land under acquisition if so, state details
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.land_acq}
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">3.6</span> Reason for Sell of the proposed land, and its genuineness
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.gift_reason}
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">3.7</span>  Whether the seller has any other land besides the land proposed for sell
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.addition_land}
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">3.8</span> Was a similar application made in the past for N.A. use of this land and was it rejected ? if yes, why ?
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.past_appln_reject}
                    </div>
                </div>



                {/*--------------------- section 3 end here ------------------------- */}

                {/*--------------------- section 4 start here ------------------------- */}
                <div className="w-full bg-indigo-500 py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white"> 4. Donee Details(s) </p>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">4.1</span> Donee Name
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.name_donee}
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">4.2</span> Donee address
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.address_donee}
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">4.3</span> Donee Contact Number
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {from_data.mobile_donee}
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.4</span> Whether the proposed Applicant(s) is / are an agriculturist(s), if so, submit documentary evidences supporting the claim
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <a target="_blank"
                            href={from_data.agri_evidence_url}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> View Doc.
                            </div>
                        </a>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.5</span> Whether the proposed Applicant is a Govt. Servant, NOC / Permission for acquiring the property from the Competent Authority, if so, submit documentary evidences supporting the claim
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <a target="_blank"
                            href={from_data.govt_evidence_url}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> View Doc.
                            </div>
                        </a>
                    </div>
                </div>
                {/*--------------------- section 4 end here ------------------------- */}


                {/*--------------------- section 5 start here ------------------------- */}
                <div className="w-full bg-indigo-500 py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white"> 5. Document Attachment </p>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">5.1</span> Form No. I & XIV
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <a target="_blank"
                            href={from_data.nakel_url_1_14}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> View Doc.
                            </div>
                        </a>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">5.2</span> Land Site Plan
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <a target="_blank"
                            href={from_data.land_site_plan_url}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> View Doc.
                            </div>
                        </a>
                    </div>
                </div>
                {/*--------------------- section 5 end here ------------------------- */}


                {/*--------------------- section 6 start here ------------------------- */}
                <div className="w-full bg-indigo-500 py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white">
                        6. Applicant / Occupant Declaration and Signature </p>
                </div>

                <div className="flex gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="text-xl font-normal text-left text-gray-700 ">
                        6.1
                    </div>
                    <div className="flex items-start">
                        <p className="text-xl font-normal text-left text-gray-700 pr-2">{from_data.iagree}</p>
                        <label htmlFor="checkbox" className="text-xl font-normal text-left text-gray-700 ">
                            I solemnly affirm & hereby give undertaking that the above information furnished by me are correct and true to the best of my knowledge and belief
                        </label>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">6.2</span> Applicant Signature Image
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <a target="_blank"
                            href={from_data.signature_url}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> View Doc.
                            </div>
                        </a>
                    </div>
                </div>
                {/*--------------------- section 6 end here ------------------------- */}
                {isSubmited ?
                    user.id == from_data.userId ? null :
                        <>
                            <div className="flex flex-wrap gap-6 mt-4">
                                <Link to={"/home/"}
                                    className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium"
                                >
                                    Close
                                </Link>
                                <button
                                    onClick={() => setQueryBox(val => true)}
                                    className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                                >
                                    Query
                                </button>
                                {common.form_status == 1 ?
                                    <button
                                        onClick={() => { setRejectid(val => common.id); setRejectBox(true); }}
                                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium"
                                    >
                                        Reject
                                    </button>
                                    :
                                    null
                                }
                                {/* atp button */}
                                {common.form_status == 1 && user.id == common.auth_user_id ?
                                    <button
                                        onClick={() => {
                                            setForwardBox(val => true);
                                            setNextData(val => ({
                                                title: "Forward to Headclerk",
                                                formstatus: 25,
                                                querytype: "INTRA",
                                                authuserid: "6",
                                                foacaluserid: "5",
                                                intrauserid: "5,6",
                                                interuserid: "0",
                                                touserid: 6,
                                                querystatus: "INPROCESS"
                                            }));
                                        }}
                                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                                    >
                                        Forward to Headclerk
                                    </button>
                                    :
                                    null
                                }
                                {/* jtp button */}
                                {common.form_status == 25 && user.id == 6 ?
                                    <button
                                        onClick={() => {
                                            setForwardBox(val => true);
                                            setNextData(val => ({
                                                title: "Forward to Suptd",
                                                formstatus: 50,
                                                querytype: "INTRA",
                                                authuserid: "5",
                                                foacaluserid: "5",
                                                intrauserid: "5,6",
                                                interuserid: "0",
                                                touserid: 5,
                                                querystatus: "INPROCESS"
                                            }));
                                        }}
                                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                                    >
                                        Forward to Suptd
                                    </button>
                                    :
                                    null
                                }
                                {common.form_status == 50 && user.id == 5 ?

                                    <button
                                        onClick={() => {
                                            setForwardBox(val => true);
                                            setNextData(val => ({
                                                title: "Convey to Applicant",
                                                formstatus: 75,
                                                querytype: "PUBLIC",
                                                authuserid: "0",
                                                foacaluserid: "5",
                                                intrauserid: "0",
                                                interuserid: "0",
                                                touserid: from_data.userId,
                                                querystatus: "APPROVED"
                                            }));
                                        }}
                                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                                    >
                                        Convey to Applicant
                                    </button>
                                    :
                                    null
                                }
                            </div>
                        </>
                    :
                    user.id == from_data.userId ?
                        <>
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
                                    Proceed
                                </button>
                            </div>
                        </>
                        :
                        null
                }
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg my-8">
                <h1 className="text-gray-800 text-3xl font-semibold text-center">Notings</h1>
                <div className="w-full flex gap-4 my-4">
                    <div className="grow bg-gray-700 h-[2px]"></div>
                    <div className="w-10 bg-gray-500 h-[3px]"></div>
                    <div className="grow bg-gray-700 h-[2px]"></div>
                </div>
                {notings.length == 0 ?
                    <h3 className="text-2xl font-semibold text-center bg-rose-500 bg-opacity-25 rounded-md border-l-4 border-rose-500 py-2  text-rose-500">You have not submitted any query.</h3> :
                    <>
                        {notings.map((val: any, index: number) => {
                            return (
                                <div key={index}>
                                    <QueryTabs isUser={val.from_user_id == user.id} message={val.remark} date={val.createdAt} doc={val.doc_url} from_user={val.from_user.role == "USER" ? "User" : val.from_user.name} to_user={val.to_user.role == "USER" ? "User" : val.to_user.name} />
                                </div>
                            )
                        })}
                    </>
                }
            </div>
        </>
    );
}

export default GiftView;