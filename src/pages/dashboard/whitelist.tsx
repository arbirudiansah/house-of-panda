/* eslint-disable @next/next/no-img-element */
import FormAddress from '@/components/forms/FormAddress';
import { PlusIcon, RemoveIcon, SearchIcon } from '@/components/icons';
import EditIcon from '@/components/icons/EditIcon';
import Filter1 from '@/components/icons/Filter1';
import Button from '@/components/widgets/Button';
import FormInput from '@/components/widgets/FormInput';
import { MessageError } from '@/components/widgets/MessageError';
import OutlinedButton from '@/components/widgets/OutlinedButton';
import { Pagination } from '@/components/widgets/Pagination';
import SwitchButton from '@/components/widgets/SwitchButton';
import { Table } from '@/components/widgets/Table';
import TimePicker from '@/components/widgets/TimePicker';
import { ProjectTypes, ProjectTerms, ProjectStatus } from '@/lib/consts';
import { notify } from '@/lib/store/slices/message';
import { modal } from '@/lib/store/slices/modal';
import { toTitleCase, fundsPeriode } from '@/lib/utils';
import { trpc } from '@/lib/utils/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), { ssr: false })

const perPage = 10

const WhitelistPage = () => {
    const router = useRouter()
    const [page, setPage] = useState(1)
    const utils = trpc.useContext();

    const setWhitelist = trpc.project.setWhitelist.useMutation();
    const isAllWhitelisted = trpc.project.isAllWhitelisted.useQuery(undefined, {
        staleTime: 3000,
    });
    const { data, error, isInitialLoading } = trpc.project.list.useQuery({
        limit: perPage,
        offset: (page - 1) * perPage,
        keyword: router.query.keyword?.toString(),
        sort: router.query.sort?.toString(),
        startDate: router.query.startDate?.toString(),
        endDate: router.query.endDate?.toString(),
        activeProjectOnly: true,
        whitelisted: router.query.whitelisted?.toString(),
    }, {
        staleTime: 3000,
    });

    trpc.project.onProjectsWhitelisted.useSubscription(undefined, {
        onData: () => {
            utils.project.list.invalidate()
            utils.project.isAllWhitelisted.invalidate()
        },
    });

    const onFilter = (e: any) => {
        const query = {
            ...router.query,
            page: 1,
            perPage,
            whitelisted: e.target.value,
        }

        updateQuery(query)
    }

    const onPageChanged = (page: number) => {
        setPage(page)
        const query = {
            ...router.query,
            page,
            perPage,
        }

        updateQuery(query)
    }

    const onSearch = (e: React.FormEvent<any>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const keyword = formData.get("keyword");
        if (!keyword) return;

        let query = {
            ...router.query,
            page: 1,
            perPage,
            keyword,
        };

        updateQuery(query);
    };

    const updateQuery = (query: any) => {
        router.push({
            pathname: router.pathname,
            query,
        });
    }

    return (
        <>
            <Head>
                <title>Whitelist | House of Panda</title>
            </Head>

            <DashboardLayout breadcrumbs={[{ title: 'Whitelist' }]}>
                <div className="flex justify-between mb-12">
                    <div>
                        <h1 className="text-2xl font-semibold leading-loose text-gray-800">Whitelist Setting</h1>
                    </div>
                </div>
                <div className="mb-6">
                    <div className="flex items-center justify-between px-4 py-3 bg-white border rounded-lg border-gray-200 w-full mb-4">
                        <form onSubmit={onSearch} onReset={() => updateQuery({})} className="rounded-lg text-[#637381] focus-within:text-primary focus-within:border-primary border border-gray-300 relative overflow-hidden group w-[300px]">
                            <input type="text" name="keyword" className="border-none ring-1 focus:pl-4 bg-transparent px-4 py-3 pl-12 w-full transition-all ease-in-out" placeholder="Search here..." defaultValue={router.query.keyword} />
                            <div className="absolute left-0 top-0 h-full flex items-center px-4 group-focus-within:left-[-100%] transition-all duration-1s ease-in-out">
                                <SearchIcon />
                            </div>
                            <div className="h-full px-3 hidden group-focus-within:inline-flex transition-all ease-in-out absolute right-0 top-0 space-x-2 items-center">
                                <div>
                                    <kbd className="py-1 px-2 bg-gray-100 rounded text-xs">&#x23CE;</kbd>
                                </div>
                                {router.query.keyword && (
                                    <button type='reset'>
                                        <kbd className="py-1 px-2 bg-gray-100 rounded text-xs hover:bg-opacity-90 cursor-pointer">&#x2715;</kbd>
                                    </button>
                                )}
                            </div>
                        </form>
                        <div className="inline-flex items-center space-x-4">
                            <div className="border border-gray-300 rounded-lg w-[180px] flex items-center py-3 px-4 space-x-2 text-[#637381]">
                                <Filter1 />
                                <select onChange={onFilter} defaultValue={router.query.whitelisted} placeholder="Filter" className="border-none focus:ring-0 focus:outline-none hover:cursor-pointer appearance-none p-0" style={{
                                    appearance: 'none',
                                    MozAppearance: 'none',
                                    WebkitAppearance: 'none',
                                    textOverflow: '',
                                    textIndent: '0.01px',
                                    backgroundImage: 'none',
                                }}>
                                    <option disabled value="" selected hidden>Filter</option>
                                    <option value="">All</option>
                                    <option value="1">Whitelisted</option>
                                    <option value="0">Not Whitelisted</option>
                                </select>
                            </div>
                            <div className="border border-gray-300 py-3 rounded-lg px-4 inline-flex space-x-2 items-center justify-center">
                                <div className="text-base text-[#637381]">{isAllWhitelisted.data ? 'Deactivate All' : 'Activate All'}</div>
                                <SwitchButton
                                    defaultChecked={isAllWhitelisted.data}
                                    onChange={async (checked) => {
                                        await setWhitelist.mutateAsync({
                                            ids: [],
                                            whitelisted: checked,
                                        }).then(() => {
                                            notify.success("Whitelist status updated");
                                        }).catch((e) => {
                                            notify.error(e.message);
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <Table
                        data={data?.entries ?? []}
                        isLoading={isInitialLoading}
                        actionTitle="Whitelist Status"
                        headers={[
                            {
                                title: 'Property Name', accessor: 'projectName', contentRender: (row) => (
                                    <div className="flex items-center gap-4">
                                        <div className="min-w-[80px] max-w-[80px] min-h-[50px] max-h-[50px] bg-red-300">
                                            <img className="object-cover" src={row.image_urls[0]} alt={row.name} style={{
                                                width: 80,
                                                height: 50,
                                            }} />
                                        </div>
                                        <div>
                                            <Link href={`/dashboard/properties/${row.id}`}>
                                                <a className="text-base hover:text-primary font-medium leading-normal text-gray-700">{row.name}</a>
                                            </Link>
                                            <p className="text-sm leading-tight text-gray-500">{toTitleCase(row.meta.location)}</p>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Property Type', accessor: 'a', contentRender: (row) => (
                                    <p className="text-base leading-normal text-gray-500">{ProjectTypes[row.onchainData.typeId]}</p>
                                ),
                            },
                            {
                                title: 'Project Duration', accessor: 'c', contentRender: (row) => (
                                    <div>
                                        <p className="text-base leading-normal text-gray-700">{ProjectTerms[row.onchainData.term]}</p>
                                        <p className="text-sm leading-tight text-gray-500">{fundsPeriode(row.timeline.funding_start, row.timeline.funding_end)}</p>
                                    </div>
                                ),
                            },
                            {
                                title: 'Status', accessor: 'st', contentRender: ({ onchainData, status }) => {
                                    if (onchainData.status !== 'success') {
                                        return (<span>-</span>)
                                    }

                                    return <div>{ProjectStatus[status]}</div>
                                },
                            },
                        ]}
                        renderAction={(item) => {
                            return (
                                <div className="flex justify-center">
                                    <SwitchButton
                                        defaultChecked={item.whitelisted}
                                        onChange={async (checked) => {
                                            await setWhitelist.mutateAsync({
                                                ids: [item.id],
                                                whitelisted: checked,
                                            }).then(() => {
                                                notify.success("Whitelist status updated");
                                            }).catch((e) => {
                                                notify.error(e.message);
                                            })
                                        }}
                                    />
                                </div>
                            )
                        }}
                    />
                    <Pagination
                        page={page}
                        perPage={perPage}
                        dataCount={data?.count ?? 0}
                        onPageChanged={onPageChanged}
                    />
                </div>
                <WhitelistAddress />
            </DashboardLayout>
        </>
    );
}

const schema = z.object({
    start: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: 'Invalid date',
        }),
        time: z.string().nonempty(),
    }).refine(({ date, time }) => moment(`${date} ${time}`).isValid(), {
        message: 'Invalid date',
        path: ['start', 'date'],
    }),
    end: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: 'Invalid date',
        }),
        time: z.string().nonempty(),
    }).refine(({ date, time }) => moment(`${date} ${time}`).isValid(), {
        message: 'Invalid date',
        path: ['end', 'date'],
    }),
})

type WhitelistSetting = z.infer<typeof schema>

function WhitelistAddress() {
    const [selectedAddr, setSelectedAddr] = useState<string[]>([])
    const router = useRouter()

    const utils = trpc.useContext();
    const { data, isLoading } = trpc.whitelist.getAddresses.useQuery({}, {
        staleTime: 3000,
    });
    const { data: setting } = trpc.whitelist.getSetting.useQuery({}, {
        staleTime: 3000,
    });
    const removeAddr = trpc.whitelist.removeAddresses.useMutation({
        onSuccess: () => {
            utils.whitelist.getAddresses.invalidate()
        }
    });
    const setSetting = trpc.whitelist.setSetting.useMutation({
        onSuccess: () => {
            utils.whitelist.getSetting.invalidate()
        }
    });

    const forms = useForm<WhitelistSetting>({
        resolver: zodResolver(schema),
    })

    const start = forms.watch('start')

    const onSearch = async (e: React.FormEvent<any>) => {
        try {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const address = formData.get("address");
            if (!address) return;
        } catch (error) {
            console.log("🚀 ~ file: whitelist.tsx:261 ~ onSearch ~ error:", error)
        }
    }

    const selectedCount = useMemo(() => selectedAddr.length, [selectedAddr])
    const isAllSelected = useMemo(() => {
        if (data?.length === 0) return false

        return selectedAddr.length === data?.length
    }, [selectedAddr, data])

    const selectAll = (e: any) => {
        const checked = e.target.checked
        const cAddrs = document.querySelectorAll<HTMLInputElement>('.cAddrs')
        let addrs: string[] = []
        cAddrs.forEach((addr) => {
            addr.checked = checked
            if (checked) {
                addrs.push(addr.value)
            } else {
                addrs = []
            }
        })

        setSelectedAddr(addrs)
    }

    const deleteSelectedAddr = async () => {
        // notify.info("Deleting addresses...");
        await removeAddr.mutateAsync({
            addresses: selectedAddr,
        }).then(() => {
            notify.success("Addresses deleted");
            setSelectedAddr([])
        }).catch((e) => {
            notify.error(e.message);
        })
    }

    const clearAddresses = async () => {
        // notify.info("Clearing addresses...");
        await removeAddr.mutateAsync({
            addresses: [],
            erase: true,
        }).then(() => {
            notify.success("Addresses cleared");
            setSelectedAddr([])
        }).catch((e) => {
            notify.error(e.message);
        })
    }

    const onSubmit = async (data: WhitelistSetting) => {
        await setSetting.mutateAsync({
            start: moment(`${data.start.date} ${data.start.time}`).unix(),
            end: moment(`${data.end.date} ${data.end.time}`).unix(),
        }).then(() => {
            notify.success("Whitelist settings updated");
        }).catch((e) => {
            notify.error(e.message);
        })
    }

    trpc.whitelist.onSettingsChanged.useSubscription(undefined, {
        onData: async () => {
            utils.whitelist.getAddresses.invalidate()
            console.log('refresh')
        },
    });

    useEffect(() => {
        if (setting?.start && setting?.end) {
            forms.setValue('start', {
                date: moment.unix(setting.start).format('YYYY-MM-DD'),
                time: moment.unix(setting.start).format('HH:mm'),
            });
            forms.setValue('end', {
                date: moment.unix(setting.end).format('YYYY-MM-DD'),
                time: moment.unix(setting.end).format('HH:mm'),
            });
        }
    }, [forms, setting])


    return (
        <>
            <div className="bg-white border rounded-lg border-gray-200 w-full mb-4">
                <div className="px-5 py-3 border-b w-full inline-flex items-center justify-between">
                    <div className="text-gray-800 text-xl font-semibold leading-normal">Whitelist Schedule</div>
                </div>
                <FormProvider {...forms}>
                    <form className="grid grid-cols-2 divide-x items-center">
                        <div className="px-5 py-6">
                            <div className="inline-flex items-start space-x-2 w-full">
                                <FormInput
                                    type="date"
                                    label="Whitelist Start"
                                    name="start.date"
                                    className="w-full"
                                    minDate={moment().toDate()}
                                    required
                                />
                                <TimePicker name="start.time" label="" className="w-[200px] mt-[18px]" required />
                            </div>
                        </div>
                        <div className="px-5 py-6">
                            <div className="inline-flex items-start space-x-2 w-full">
                                <FormInput
                                    type="date"
                                    label="Whitelist End"
                                    name="end.date"
                                    className="w-full"
                                    minDate={start ? moment(start.date).add(1, 'days').toDate() : undefined}
                                    required
                                />
                                <TimePicker name="end.time" label="" className="w-[200px] mt-[18px]" required />
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </div>
            <div className="bg-white border rounded-lg border-gray-200 w-full mb-4">
                <div className="px-5 py-3 border-b w-full inline-flex items-center justify-between">
                    <div className="inline-flex space-x-4 items-center">
                        <input type="checkbox" className="focus:outline-none focus:ring-0 rounded-[4px] hover:cursor-pointer checked:text-primary" onChange={selectAll} checked={isAllSelected} />
                        <div className="text-gray-800 text-xl font-semibold leading-normal">Address Whitelist</div>
                    </div>
                    <div className="inline-flex items-center space-x-2">
                        <form onSubmit={onSearch} onReset={() => { }} className="rounded-lg text-[#637381] focus-within:text-primary focus-within:border-primary border border-gray-300 relative overflow-hidden group w-[300px]">
                            <input type="text" name="address" className="border-none ring-1 focus:pl-4 bg-transparent px-4 py-3 pl-12 w-full transition-all ease-in-out" placeholder="Search here..." defaultValue={router.query.address} />
                            <div className="absolute left-0 top-0 h-full flex items-center px-4 group-focus-within:left-[-100%] transition-all duration-1s ease-in-out">
                                <SearchIcon />
                            </div>
                            <div className="h-full px-3 hidden group-focus-within:inline-flex transition-all ease-in-out absolute right-0 top-0 space-x-2 items-center">
                                <div>
                                    <kbd className="py-1 px-2 bg-gray-100 rounded text-xs">&#x23CE;</kbd>
                                </div>
                                {router.query.address && (
                                    <button type='reset'>
                                        <kbd className="py-1 px-2 bg-gray-100 rounded text-xs hover:bg-opacity-90 cursor-pointer">&#x2715;</kbd>
                                    </button>
                                )}
                            </div>
                        </form>
                        <Button
                            title="Add Addresses"
                            prefix={<PlusIcon />}
                            className="px-4"
                            onClick={(e) => modal.showModal(<FormAddress />)}
                        />
                    </div>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                    <table className="w-full overflow-visible rounded-t-lgw-full rounded-lg">
                        <tbody>
                            {!isLoading && data?.map((address, idx) => {
                                return (
                                    <RenderRow
                                        key={idx}
                                        address={address}
                                        onChecked={(checked) => {
                                            if (checked) {
                                                setSelectedAddr([...selectedAddr, address])
                                            } else {
                                                setSelectedAddr(selectedAddr.filter((addr) => addr !== address))
                                            }
                                        }}
                                    />
                                )
                            })}
                            {(!isLoading && data?.length == 0) && (
                                <tr>
                                    <td colSpan={3}>
                                        <div className={`h-[475px] w-full flex justify-center items-center`}>
                                            <div className={`text-center mt-4 py-16`}>
                                                <div className="inline-flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 opacity-20" fill="none" viewBox="0 0 24 24" stroke="grey" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                    </svg>
                                                </div>
                                                <h1 className="text-base font-medium mt-3">No data...</h1>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {isLoading && (
                                <tr>
                                    <td colSpan={3}>
                                        <div className={`h-[475px] w-full flex justify-center items-center`}>
                                            <div className={`text-center mt-4 py-16}`}>
                                                <div className="inline-flex items-center">
                                                    <svg className="w-20 h-20 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24">
                                                        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="grey" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="#FF3392"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                        </path>
                                                    </svg>
                                                </div>
                                                <h1 className="text-base font-medium mt-3">Loading data...</h1>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="inline-flex space-x-4 mb-4 items-center justify-end w-full">
                {selectedCount >= 1 && !isAllSelected ? (
                    <OutlinedButton
                        isLoading={removeAddr.isLoading}
                        title="Clear Selected"
                        className="border-secondary text-secondary hover:bg-secondary hover:text-white hover:border-secondary"
                        onClick={deleteSelectedAddr}
                    />
                ) : (
                    <OutlinedButton
                        isLoading={removeAddr.isLoading}
                        title="Clear All Addresses"
                        className="border-secondary text-secondary hover:bg-secondary hover:text-white hover:border-secondary"
                        onClick={clearAddresses}
                    />
                )}
                <Button
                    isLoading={setSetting.isLoading}
                    title="Save"
                    className="px-20"
                    onClick={forms.handleSubmit(onSubmit)}
                />
            </div>
        </>
    )
}

function RenderRow(props: { address: string, onChecked?: (checked: boolean) => void }) {
    const trRef = useRef<HTMLTableRowElement>(null)
    const { register, trigger, watch, setFocus, formState } = useForm({
        resolver: zodResolver(z.object({
            address: z.string()
                .min(42, 'Invalid address')
                .max(42, 'Invalid address'),
        }))
    })
    const editedAddress = watch('address', props.address)
    const [editMode, setEditMode] = useState(false)

    const utils = trpc.useContext();
    const updateAddress = trpc.whitelist.updateAddress.useMutation({
        onSuccess: () => {
            utils.whitelist.getAddresses.invalidate()
        }
    });
    const deleteAddress = trpc.whitelist.removeAddresses.useMutation({
        onSuccess: () => {
            utils.whitelist.getAddresses.invalidate()
        }
    });

    const onClickEdit = async (e: any) => {
        if (editMode) {
            await onUpdate()
        }

        setEditMode(!editMode)
        setTimeout(() => {
            setFocus('address', { shouldSelect: true })
        }, 10);
    }

    const onUpdate = async () => {
        if (!formState.isValid) return
        else if (props.address === editedAddress) {
            setEditMode(!editMode)
            return
        }

        await updateAddress.mutateAsync({
            newAddress: editedAddress,
            oldAddress: props.address,
        }).then(() => {
            notify.success("Address updated");
        }).catch((e) => {
            notify.error(e.message);
        })
    }

    const onDelete = async () => {
        deleteAddress.mutateAsync({
            addresses: [props.address],
        }).then(() => {
            notify.success("Address deleted");
        }).catch((e) => {
            notify.error(e.message);
        })
    }

    const onClickOutside = useCallback((event: MouseEvent) => {
        if (trRef.current && !trRef.current.contains(event.target as Node)) {
            setEditMode(false);
        }
    }, [trRef, setEditMode]);

    useEffect(() => {
        document.addEventListener('mousedown', onClickOutside)
        return () => {
            document.removeEventListener('mousedown', onClickOutside)
        }
    }, [onClickOutside, setFocus])

    const renderLoading = () => (
        <svg aria-hidden="true" className="w-4 h-4 animate-spin fill-slate-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentFill" strokeWidth={6} />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" strokeWidth={6} />
        </svg>
    )

    return (
        <tr ref={trRef} className={`rounded-b-lg border-b last:border-none hover:bg-opacity-10 hover:bg-[#E7F8F3]`}>
            <td className="w-[58px] py-3 text-center">
                <input
                    type="checkbox"
                    className="focus:outline-none focus:ring-0 rounded-[4px] hover:cursor-pointer checked:text-primary cAddrs"
                    defaultValue={props.address}
                    onChange={(e) => props.onChecked?.(e.target.checked)}
                />
            </td>
            <td className="py-3 align-middle">
                <input
                    disabled={!editMode}
                    type="text"
                    defaultValue={props.address}
                    className="w-[75%] text-slate-500 text-base font-medium leading-normal p-0 mt-1 border-0 border-b-2 border-transparent focus:ring-0 focus:border-primary focus:border-0 focus:border-b-2"
                    {...register('address', {
                        onChange: () => trigger('address'),
                    })}
                />
                <MessageError message={formState.errors.address?.message} />
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center justify-end space-x-2">
                    <button
                        className={classNames("w-9 h-9 rounded border flex items-center justify-center hover:text-white", {
                            ["text-slate-700 border-slate-700 hover:bg-slate-700"]: !editMode,
                            ["text-blue-700 border-blue-700 hover:bg-blue-700"]: editMode,
                        })}
                        onClick={onClickEdit}
                        disabled={updateAddress.isLoading}
                    >
                        {updateAddress.isLoading ? renderLoading() : (
                            <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0_1505_914)">
                                    <path
                                        d="M12.4374 0.62013L4.30945 8.74813C3.99901 9.05689 3.7529 9.42417 3.58537 9.82869C3.41784 10.2332 3.33221 10.667 3.33345 11.1048V12.0001C3.33345 12.1769 3.40369 12.3465 3.52871 12.4715C3.65373 12.5966 3.8233 12.6668 4.00011 12.6668H4.89545C5.33329 12.668 5.76703 12.5824 6.17155 12.4149C6.57608 12.2473 6.94335 12.0012 7.25212 11.6908L15.3801 3.5628C15.7697 3.17224 15.9885 2.64311 15.9885 2.09146C15.9885 1.53981 15.7697 1.01068 15.3801 0.62013C14.9839 0.241392 14.4569 0.0300293 13.9088 0.0300293C13.3607 0.0300293 12.8337 0.241392 12.4374 0.62013V0.62013ZM14.4374 2.62013L6.30945 10.7481C5.93353 11.1218 5.42545 11.3321 4.89545 11.3335H4.66678V11.1048C4.66817 10.5748 4.87849 10.0667 5.25211 9.6908L13.3801 1.5628C13.5225 1.42677 13.7119 1.35086 13.9088 1.35086C14.1057 1.35086 14.2951 1.42677 14.4374 1.5628C14.5774 1.70314 14.656 1.89326 14.656 2.09146C14.656 2.28967 14.5774 2.47979 14.4374 2.62013V2.62013Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M15.3333 5.986C15.1565 5.986 14.987 6.05624 14.8619 6.18126C14.7369 6.30629 14.6667 6.47586 14.6667 6.65267V10H12C11.4696 10 10.9609 10.2107 10.5858 10.5858C10.2107 10.9609 10 11.4696 10 12V14.6667H3.33333C2.8029 14.6667 2.29419 14.456 1.91912 14.0809C1.54405 13.7058 1.33333 13.1971 1.33333 12.6667V3.33333C1.33333 2.8029 1.54405 2.29419 1.91912 1.91912C2.29419 1.54405 2.8029 1.33333 3.33333 1.33333H9.36133C9.53815 1.33333 9.70771 1.2631 9.83274 1.13807C9.95776 1.01305 10.028 0.843478 10.028 0.666667C10.028 0.489856 9.95776 0.320286 9.83274 0.195262C9.70771 0.0702379 9.53815 0 9.36133 0L3.33333 0C2.4496 0.00105857 1.60237 0.352588 0.97748 0.97748C0.352588 1.60237 0.00105857 2.4496 0 3.33333L0 12.6667C0.00105857 13.5504 0.352588 14.3976 0.97748 15.0225C1.60237 15.6474 2.4496 15.9989 3.33333 16H10.8953C11.3333 16.0013 11.7671 15.9156 12.1718 15.7481C12.5764 15.5806 12.9438 15.3345 13.2527 15.024L15.0233 13.252C15.3338 12.9432 15.58 12.576 15.7477 12.1715C15.9153 11.767 16.0011 11.3332 16 10.8953V6.65267C16 6.47586 15.9298 6.30629 15.8047 6.18126C15.6797 6.05624 15.5101 5.986 15.3333 5.986ZM12.31 14.0813C12.042 14.3487 11.7031 14.5337 11.3333 14.6147V12C11.3333 11.8232 11.4036 11.6536 11.5286 11.5286C11.6536 11.4036 11.8232 11.3333 12 11.3333H14.6167C14.5342 11.7023 14.3493 12.0406 14.0833 12.3093L12.31 14.0813Z"
                                        fill="currentColor"
                                    />
                                </g>
                                <defs>
                                    <clipPath>
                                        <rect width={16} height={16} fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        )}
                    </button>
                    <button
                        className="w-9 h-9 rounded border border-pink-500 flex items-center justify-center text-primary hover:bg-primary hover:text-white"
                        onClick={onDelete}
                        disabled={deleteAddress.isLoading}
                    >
                        {deleteAddress.isLoading ? renderLoading() : (
                            <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0_1505_900)">
                                    <path
                                        d="M13.9999 2.66667H11.9333C11.7785 1.91428 11.3691 1.23823 10.7741 0.752479C10.179 0.266727 9.43472 0.000969683 8.66658 0L7.33325 0C6.56511 0.000969683 5.8208 0.266727 5.22575 0.752479C4.63071 1.23823 4.22132 1.91428 4.06659 2.66667H1.99992C1.82311 2.66667 1.65354 2.7369 1.52851 2.86193C1.40349 2.98695 1.33325 3.15652 1.33325 3.33333C1.33325 3.51014 1.40349 3.67971 1.52851 3.80474C1.65354 3.92976 1.82311 4 1.99992 4H2.66659V12.6667C2.66764 13.5504 3.01917 14.3976 3.64407 15.0225C4.26896 15.6474 5.11619 15.9989 5.99992 16H9.99992C10.8836 15.9989 11.7309 15.6474 12.3558 15.0225C12.9807 14.3976 13.3322 13.5504 13.3333 12.6667V4H13.9999C14.1767 4 14.3463 3.92976 14.4713 3.80474C14.5963 3.67971 14.6666 3.51014 14.6666 3.33333C14.6666 3.15652 14.5963 2.98695 14.4713 2.86193C14.3463 2.7369 14.1767 2.66667 13.9999 2.66667V2.66667ZM7.33325 1.33333H8.66658C9.0801 1.33384 9.48334 1.46225 9.82099 1.70096C10.1587 1.93967 10.4142 2.27699 10.5526 2.66667H5.44725C5.58564 2.27699 5.84119 1.93967 6.17884 1.70096C6.5165 1.46225 6.91974 1.33384 7.33325 1.33333V1.33333ZM11.9999 12.6667C11.9999 13.1971 11.7892 13.7058 11.4141 14.0809C11.0391 14.456 10.5304 14.6667 9.99992 14.6667H5.99992C5.46949 14.6667 4.96078 14.456 4.5857 14.0809C4.21063 13.7058 3.99992 13.1971 3.99992 12.6667V4H11.9999V12.6667Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M6.66667 11.9996C6.84348 11.9996 7.01304 11.9293 7.13807 11.8043C7.26309 11.6793 7.33333 11.5097 7.33333 11.3329V7.33293C7.33333 7.15611 7.26309 6.98655 7.13807 6.86152C7.01304 6.7365 6.84348 6.66626 6.66667 6.66626C6.48985 6.66626 6.32029 6.7365 6.19526 6.86152C6.07024 6.98655 6 7.15611 6 7.33293V11.3329C6 11.5097 6.07024 11.6793 6.19526 11.8043C6.32029 11.9293 6.48985 11.9996 6.66667 11.9996Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M9.33324 11.9996C9.51005 11.9996 9.67962 11.9293 9.80464 11.8043C9.92967 11.6793 9.99991 11.5097 9.99991 11.3329V7.33293C9.99991 7.15611 9.92967 6.98655 9.80464 6.86152C9.67962 6.7365 9.51005 6.66626 9.33324 6.66626C9.15642 6.66626 8.98685 6.7365 8.86183 6.86152C8.7368 6.98655 8.66656 7.15611 8.66656 7.33293V11.3329C8.66656 11.5097 8.7368 11.6793 8.86183 11.8043C8.98685 11.9293 9.15642 11.9996 9.33324 11.9996Z"
                                        fill="currentColor"
                                    />
                                </g>
                                <defs>
                                    <clipPath>
                                        <rect width={16} height={16} fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        )}
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default trpc.withTRPC(WhitelistPage);