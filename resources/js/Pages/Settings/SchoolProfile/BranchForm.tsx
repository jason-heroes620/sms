import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import States from '@/utils/states.json';
import { useForm } from '@inertiajs/react';
import {
    GoogleMap,
    Libraries,
    Marker,
    useLoadScript,
} from '@react-google-maps/api';
import axios from 'axios';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const containerStyle = {
    width: '100%',
    height: '500px',
};

const libraries: Libraries = ['places', 'geometry'];

type Coords = {
    lat: number;
    lng: number;
};

const states = States.sort((a, b) => (a > b ? 1 : -1)).map((s) => {
    return { label: s, value: s };
});

const BranchForm = ({
    id,
    editable,
}: {
    id?: string | undefined;
    editable?: string[];
}) => {
    const { data, setData, post, put, errors, processing, reset } = useForm({
        branch_name: '',
        branch_address: {
            address1: '',
            address2: '',
            address3: '',
            city: '',
            postcode: '',
            state: '',
            country: '',
        },
        branch_email: '',
        branch_contact_no: '',
        branch_location: {
            lat: 3.139003,
            lng: 101.686855,
        },
    });

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
        libraries: libraries,
    });

    const [clickedLocation, setClickedLocation] = useState<Coords | null>(null);

    const handleMapClick = useCallback((ev: google.maps.MapMouseEvent) => {
        if (ev.latLng) {
            const lat = ev.latLng.lat();
            const lng = ev.latLng.lng();

            // Update state with the new coordinates
            setClickedLocation({ lat, lng });
            setData('branch_location', { lat, lng });
        }
    }, []);

    const defaultCenter: Coords = data.branch_location;

    const [center, setCenter] = useState<Coords>(defaultCenter);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const geocodeAddress = useCallback(
        async (addr: string) => {
            if (!window.google) return;

            try {
                const geocoder = new window.google.maps.Geocoder();
                const response = await geocoder.geocode({ address: addr });

                if (response.results.length > 0) {
                    // Extract the LatLng object
                    const location = response.results[0].geometry.location;
                    const newCenter: Coords = {
                        lat: location.lat(),
                        lng: location.lng(),
                    };

                    // 1. Update state to set the map center and marker position
                    setCenter(newCenter);

                    // 2. If the map instance is ready, programmatically pan/zoom it
                    if (map) {
                        map.panTo(newCenter);
                        map.setZoom(15); // Zoom to a specific address level
                    }
                } else {
                    console.error(
                        'Geocoding failed: No results found for address:',
                        addr,
                    );
                }
            } catch (error) {
                console.error('Geocoding error:', error);
            }
        },
        [map],
    );

    useEffect(() => {
        if (
            isLoaded &&
            data.branch_address.address1 &&
            data.branch_address.postcode &&
            data.branch_address.state
        ) {
            const address = Object.values(data.branch_address)
                .filter((value) => value)
                .join(', ');
            geocodeAddress(address);
        }
    }, [isLoaded, data.branch_address, geocodeAddress]);

    useEffect(() => {
        if (id) {
            axios.get(route('branch.edit', id)).then((resp) => {
                if (resp.status === 200) {
                    const location = JSON.parse(
                        resp.data.branch.branch_location,
                    );
                    setData(resp.data.branch);
                    if (location) {
                        setCenter({
                            lat: parseFloat(location.lat),
                            lng: parseFloat(location.lng),
                        });
                        setClickedLocation({
                            lat: parseFloat(location.lat),
                            lng: parseFloat(location.lng),
                        });
                    }
                }
            });
        }
    }, [id]);

    const onLoad = useCallback((mapInstance: google.maps.Map) => {
        setMap(mapInstance);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (id) {
            put(route('branch.update', id), {
                onSuccess: () => {
                    reset;
                    toast.success('Branch updated successfully');
                },
                onError: (error) => {
                    toast.error('Failed to update branch', {
                        description: 'Please check the form for errors.',
                    });
                },
            });
        } else {
            post(route('branch.store'), {
                onSuccess: () => {
                    reset;
                    toast.success('Branch added successfully');
                },
                onError: (error) => {
                    toast.error('Failed to add branch', {
                        description: 'Please check the form for errors.',
                    });
                },
            });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="py-4">
                <div className="mb-4">
                    <label
                        htmlFor="branch_name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Name <span className="text-red-800">*</span>
                    </label>
                    <Input
                        type="text"
                        id="branch_name"
                        name="branch_name"
                        value={data.branch_name}
                        maxLength={150}
                        onChange={(e) => setData('branch_name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        required
                        autoFocus={false}
                    />
                    {errors.branch_name && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.branch_name}
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="branch_email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Email
                    </label>
                    <Input
                        type="email"
                        id="branch_email"
                        name="branch_email"
                        maxLength={100}
                        value={data.branch_email}
                        onChange={(e) =>
                            setData('branch_email', e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="branch_email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Contact No.
                    </label>
                    <Input
                        type="tel"
                        id="branch_contact_no"
                        name="branch_contact_no"
                        maxLength={100}
                        value={data.branch_contact_no}
                        onChange={(e) =>
                            setData('branch_contact_no', e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    />
                </div>
                <div className="mb-2">
                    <label
                        htmlFor="branch_address"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Address <span className="text-red-800">*</span>
                    </label>
                    <Input
                        type="text"
                        id="branch_address"
                        name="branch_address"
                        maxLength={100}
                        value={data.branch_address.address1}
                        onChange={(e) =>
                            setData('branch_address', {
                                ...data.branch_address,
                                address1: e.target.value,
                            })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        required
                    />
                    {errors.branch_address && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.branch_address}
                        </p>
                    )}
                </div>
                <div className="mb-2">
                    <Input
                        type="text"
                        id="branch_address.address2"
                        name="branch_address.address2"
                        maxLength={100}
                        value={data.branch_address.address2 || ''}
                        onChange={(e) =>
                            setData('branch_address', {
                                ...data.branch_address,
                                address2: e.target.value,
                            })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    />
                </div>
                <div className="mb-4">
                    <Input
                        type="text"
                        id="branch_address.address3"
                        name="branch_address.address3"
                        maxLength={100}
                        value={data.branch_address.address3 || ''}
                        onChange={(e) =>
                            setData('branch_address', {
                                ...data.branch_address,
                                address3: e.target.value,
                            })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    />
                </div>
                <div className="mb-4 flex flex-col md:grid md:grid-cols-2 md:gap-4">
                    <div>
                        <label
                            htmlFor="branch_address_postcode"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Postcode <span className="text-red-800">*</span>
                        </label>
                        <Input
                            type="text"
                            id="branch_address.postcode"
                            name="branch_address.postcode"
                            value={data.branch_address.postcode}
                            maxLength={10}
                            required
                            onChange={(e) =>
                                setData('branch_address', {
                                    ...data.branch_address,
                                    postcode: e.target.value,
                                })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="school_state"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            State <span className="text-red-800">*</span>
                        </Label>
                        <Select
                            value={data.branch_address.state}
                            onValueChange={(value) =>
                                setData('branch_address', {
                                    ...data.branch_address,
                                    state: value,
                                })
                            }
                            required
                        >
                            <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {states.map((state) => (
                                        <SelectItem
                                            key={state.value}
                                            value={state.value}
                                        >
                                            {state.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="py flex justify-between">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={'outline'} size={'sm'}>
                                Set Location
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <DialogDescription>
                                <span>
                                    Click on the map to pin point your
                                    location{' '}
                                </span>
                                <span className="text-red-500">*</span>
                            </DialogDescription>
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={center}
                                zoom={14}
                                onLoad={onLoad} // Capture the map instance
                                onUnmount={onUnmount}
                                onClick={handleMapClick}
                            >
                                {clickedLocation && (
                                    <Marker position={clickedLocation} />
                                )}
                            </GoogleMap>
                        </DialogContent>
                    </Dialog>

                    <Button
                        type="submit"
                        variant={'primary'}
                        size={'sm'}
                        disabled={processing}
                    >
                        {processing
                            ? 'Saving ...'
                            : id === undefined
                              ? 'Add'
                              : 'Update'}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default BranchForm;
