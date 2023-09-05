import { Link, useLoaderData } from "@remix-run/react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScaleOptions, LinearScale, registerables } from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { LoaderArgs, LoaderFunction, json, redirect } from "@remix-run/node";
import { ApiCall } from "~/services/api";
import { userPrefs } from "~/cookies";
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, ...registerables, ChartDataLabels);

export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const cookieHeader = props.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);
    if (cookie.role == "USER") {
        return redirect("/home/files/");
    }
    const filecount = await ApiCall({
        query: `
        query getFileCount{
            getFileCount{
              MARRIAGE,
              RELIGIOUS,
              ROADSHOW,
              GENERIC,
            }
          }
      `,
        veriables: {},
    });
    const villagecount = await ApiCall({
        query: `
        query villageFileCount{
            villageFileCount{
              count,
              village
            }
          }
      `,
        veriables: {},
    });
    const officercount = await ApiCall({
        query: `
        query officerFileCount{
            officerFileCount{
                count,
                auth_user_id
            }
          }
      `,
        veriables: {},
    });

    const processcount = await ApiCall({
        query: `
        query officerFileProgress{
            officerFileProgress{
            MARRIAGE{
              pending,
              completed,
              rejected
            },
            RELIGIOUS{
              pending,
              completed,
              rejected
            },
            ROADSHOW{
              pending,
              completed,
              rejected
            },
            GENERIC{
              pending,
              completed,
              rejected
            },
        }
        }
      `,
        veriables: {},
    });


    const villageprocess = await ApiCall({
        query: `
        query villageFileProgress{
            villageFileProgress{
              village,
              fileCounts{
                      formType,
                count
              }
            }
          }
      `,
        veriables: {},
    });

    return json({
        filecount: filecount.data.getFileCount,
        villagecount: villagecount.data.villageFileCount,
        officercount: officercount.data.officerFileCount,
        processcount: processcount.data.officerFileProgress,
        villageprocess: villageprocess.data.villageFileProgress
    });
}
const DashBoard = (): JSX.Element => {

    const loader = useLoaderData();
    const filecount = loader.filecount;
    const villagecount = loader.villagecount;
    const officercount = loader.officercount;
    const processcount = loader.processcount;
    const villageprocess = loader.villageprocess;



    villagecount.sort((a: any, b: any) => b.count - a.count);

    const topItems = villagecount.slice(0, 10);
    const otherCount = villagecount.slice(10).reduce((sum: any, item: any) => sum + item.count, 0);

    const otherDataset = otherCount !== 0 ? {
        label: 'Other',
        data: [otherCount],
        backgroundColor: 'rgba(192, 192, 192, 0.75)',
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1,
    } : null;

    const dynamicColors = (numColors: any) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            const color = `rgba(${r}, ${g}, ${b}, 0.75)`;
            colors.push(color);
        }
        return colors;
    };

    const topItemColors = dynamicColors(topItems.length);
    const villageData = {
        labels: [...topItems.map((item: any) => item.village), ...(otherDataset ? ['Other'] : [])],
        datasets: [
            {
                label: '# of Votes',
                data: [...topItems.map((item: any) => item.count), ...(otherDataset ? [otherCount] : [])],
                backgroundColor: [...topItemColors, ...(otherDataset ? ['rgba(192, 192, 192, 0.75)'] : [])],
                borderColor: [...topItemColors.map((color) => color.replace('0.2', '1')), ...(otherDataset ? ['rgba(255, 255, 255, 1)'] : [])],
                borderWidth: 1,
            },
        ],
    };



    const villageOptions: any = {
        responsive: true,
        plugins: {
            datalabels: {
                anchor: 'center',
                align: 'center',
                color: '#1e293b',
                font: {
                    size: 30
                },
                formatter: function (value: any) {
                    return value;
                }
            },
            legend: {
                labels: {
                    font: {
                        size: 25
                    }
                }
            }
        },
    };


    const officerDataColors = dynamicColors(officercount.length);

    const officerData = {
        labels: officercount.map((val: any) => val.auth_user_id),
        datasets: [
            {
                data: officercount.map((val: any) => val.count),
                backgroundColor: officerDataColors,
                borderColor: officerDataColors,
                borderWidth: 1,
            },
        ],
    };

    const officerOptions: any = {
        responsive: true,
        plugins: {
            datalabels: {
                anchor: 'center',
                align: 'center',
                color: '#1e293b',
                font: {
                    size: 30
                },
                formatter: function (value: any) {
                    return value;
                }
            },
            legend: {
                labels: {
                    font: {
                        size: 25
                    }
                }
            }
        },
    };




    const options: any = {
        scales: {
            x: {
                barThickness: 10,
                categoryPercentage: 0.8,
                barPercentage: 0.9,
                ticks: {
                    font: {
                        size: 24,
                    },
                    precision: 0,
                },
            },
            y: {
                ticks: {
                    font: {
                        size: 24,
                    },
                },
            },

        },
        indexAxis: "y",
        elements: {
            bar: {
                borderWidth: 2,
                categorySpacing: 10
            },
        },
        responsive: true,
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'end',
                color: '#1e293b',
                font: {
                    size: 18
                },
                formatter: function (value: any) {
                    return value;
                }
            },

            labels: {
                color: "white",
            },
            title: {
                display: false,
            },
            legend: {
                labels: {
                    font: {
                        size: 25
                    }
                }
            }
        },
    };


    const labels = ["MARRIAGE", 'RELIGIOUS', 'ROADSHOW', 'GENERIC'];


    const pendingData: number[] = [];
    const completedData: number[] = [];
    const rejectedData: number[] = [];

    const processlabels: string[] = Object.keys(processcount);


    processlabels.forEach((label: string) => {
        pendingData.push(processcount[label].pending);
        completedData.push(processcount[label].completed);
        rejectedData.push(processcount[label].rejected);
    });

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'In Process',
                data: pendingData,
                backgroundColor: "#3b82f6",
            },
            {
                label: 'Approved',
                data: completedData,
                backgroundColor: "#10b981",
            },
            {
                label: 'Rejected',
                data: rejectedData,
                backgroundColor: "#f43f5e",
            },
        ],
    };


    const villageNames = villageprocess.map((data: any) => data.village);
    const fileTypes = villageprocess[0].fileCounts.map((fileCount: any) => fileCount.formType);

    const datasets: any = [];

    fileTypes.forEach((fileType: any) => {
        const fileData = villageprocess.map((data: any) => {
            const countObj = data.fileCounts.find((fileCount: any) => fileCount.formType === fileType);
            return countObj ? countObj.count : 0;
        });

        const dataset = {
            label: fileType,
            data: fileData,
            borderWidth: 1,
        };

        datasets.push(dataset);
    });

    const villageprocessdata = {
        labels: villageNames,
        datasets: datasets,
    };



    const villageprocessoptions = {
        tooltips: {
            enabled: true,
        },
        responsive: true,
        datalabels: {
            display: false,
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 14,
                    },
                    precision: 0,
                },
                stacked: true,
            },
            y: {
                ticks: {
                    font: {
                        size: 14,
                    },
                    precision: 0,
                },
                stacked: true,
            },
        },
    }
    return (
        <>
            <div className="bg-white rounded-md shadow-lg px-8 py-4 my-4 mb-10">
                <h1 className="text-gray-800 text-3xl font-semibold text-center">Dashboard</h1>
                <div className="w-full flex gap-4 my-4">
                    <div className="grow bg-gray-700 h-[2px]"></div>
                    <div className="w-10 bg-gray-500 h-[3px]"></div>
                    <div className="grow bg-gray-700 h-[2px]"></div>
                </div>
                <div className="bg-white grow flex flex-col">
                    <div className="my-8 bg-white flex gap-6 flex-wrap justify-between items-center">
                        <DashboradCard title="Marriage" color="bg-gradient-to-r from-rose-400 to-rose-600" textcolor="text-rose-500" link="/" value={filecount.MARRIAGE} />
                        <DashboradCard title="Religious" color="bg-gradient-to-r from-cyan-400 to-cyan-600" textcolor="text-cyan-500" link="/" value={filecount.RELIGIOUS} />
                        <DashboradCard title="Roadshow" color="bg-gradient-to-r from-blue-400 to-blue-600" textcolor="text-blue-500" link="/" value={filecount.ROADSHOW} />
                        <DashboradCard title="Generic" color="bg-gradient-to-r from-green-400 to-green-600" textcolor="text-green-500" link="/" value={filecount.GENERIC} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-md shadow-lg px-8 py-4 my-4 mb-10">
                <div className="flex flex-col lg:flex-row rounded-3xl mb-3 gap-8">
                    {/* <div className="flex-1">
                            <h1 className="text-gray-800 text-3xl font-semibold text-center">Village Wise Files</h1>
                            <div className="w-full flex gap-4 my-4">
                                <div className="grow bg-gray-700 h-[2px]"></div>
                                <div className="w-10 bg-gray-500 h-[3px]"></div>
                                <div className="grow bg-gray-700 h-[2px]"></div>
                            </div>
                            <div className="w-[30rem] h-[30rem] mx-auto">
                                <Doughnut data={villageData} options={villageOptions} />
                            </div>
                        </div> */}
                    <div className="flex-1">
                        <h1 className="text-gray-800 text-3xl font-semibold text-center">Officer Wise Files</h1>
                        <div className="w-full flex gap-4 my-4">
                            <div className="grow bg-gray-700 h-[2px]"></div>
                            <div className="w-10 bg-gray-500 h-[3px]"></div>
                            <div className="grow bg-gray-700 h-[2px]"></div>
                        </div>
                        <div className="w-[30rem] h-[30rem] mx-auto">
                            <Doughnut data={officerData} options={officerOptions} />
                        </div>
                    </div>
                </div>
            </div>


            <div className="bg-white rounded-md shadow-lg px-8 py-4 my-4 mb-10">
                <h1 className="text-gray-800 text-3xl font-semibold text-center">File status</h1>
                <div className="w-full flex gap-4 my-4">
                    <div className="grow bg-gray-700 h-[2px]"></div>
                    <div className="w-10 bg-gray-500 h-[3px]"></div>
                    <div className="grow bg-gray-700 h-[2px]"></div>
                </div>
                <Bar options={options} data={data} />
            </div>

            <div className="bg-white rounded-md shadow-lg px-8 py-4 my-4 mb-10">
                <h1 className="text-gray-800 text-3xl font-semibold text-center">Village vs FileType</h1>
                <div className="w-full flex gap-4 my-4">
                    <div className="grow bg-gray-700 h-[2px]"></div>
                    <div className="w-10 bg-gray-500 h-[3px]"></div>
                    <div className="grow bg-gray-700 h-[2px]"></div>
                </div>
                <Bar options={villageprocessoptions} data={villageprocessdata} />
            </div>

        </>
    );
}
export default DashBoard;

interface DashboradCardProps {
    title: string;
    link: string;
    value: number;
    color: string;
    textcolor: string;
}

const DashboradCard: React.FC<DashboradCardProps> = (props: DashboradCardProps): JSX.Element => {
    return (
        <div className="h-32 w-52 rounded-md bg-white shadow-lg border-2 flex flex-col">
            <p className={`grow text-2xl ${props.textcolor} font-semibold text-center`}>{props.title}</p>
            <p className={`grow text-5xl ${props.textcolor} font-semibold text-center`}>{props.value}</p>
            <Link to={props.link} className={`rounded-b-lg w-full py-2 ${props.color} text-white font-semibold text-xl inline-block text-center`}>VIEW</Link>
        </div>
    );
}