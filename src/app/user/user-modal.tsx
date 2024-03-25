import React, { useState } from 'react';

interface Address {
    street: string;
    number: string;
    city: string;
    postalCode: string;
    country: string;
}

interface PhoneNumber {
    phoneNumber: string;
}

export interface UserData {
    name: string;
    birthdate: string;
    birthPlace: string;
    mothersName: string;
    socialSecurityNumber: string;
    taxIdentificationNumber: string;
    emailAddress: string;
    addresses: Address[];
    phoneNumbers: PhoneNumber[];
}

export default function UserModal({isOpen, onClose, onSave}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (userData: UserData) => void;
}) {
    const [userData, setUserData] = useState<UserData>({
        name: '',
        birthdate: '',
        birthPlace: '',
        mothersName: '',
        socialSecurityNumber: '',
        taxIdentificationNumber: '',
        emailAddress: '',
        addresses: [{ street: '', number: '', city: '', postalCode: '', country: '' }],
        phoneNumbers: [{ phoneNumber: '' }]
    });

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        section: 'user' | 'addresses' | 'phoneNumbers',
        index?: number
    ) => {
        const { name, value } = event.target;

        if (section === 'user') {
            setUserData({ ...userData, [name]: value });
        } else if (section === 'addresses') {
            const updatedAddresses = [...userData.addresses];
            updatedAddresses[index!] = { ...updatedAddresses[index!], [name]: value };
            setUserData({ ...userData, addresses: updatedAddresses });
        } else if (section === 'phoneNumbers') {
            const updatedPhoneNumbers = [...userData.phoneNumbers];
            updatedPhoneNumbers[index!] = { ...updatedPhoneNumbers[index!], [name]: value };
            setUserData({ ...userData, phoneNumbers: updatedPhoneNumbers });
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSave(userData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="fixed top-0 p-5 border w-3/4 shadow-lg rounded-md bg-white overflow-y-auto max-h-screen">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg text-gray-900">Add New User</h3>

                    {/* User Fields */}
                    <div className="flex flex-col space-y-2">
                        <input className="text-black p-2 border rounded" type="text" name="name" minLength={4} placeholder="Name" value={userData.name} onChange={(e) => handleInputChange(e, 'user')} />
                        <input className="text-black p-2 border rounded" type="date" name="birthdate" placeholder="Birthdate" value={userData.birthdate} onChange={(e) => handleInputChange(e, 'user')} />
                        <input className="text-black p-2 border rounded" type="text" name="birthPlace" minLength={4} placeholder="Birth Place" value={userData.birthPlace} onChange={(e) => handleInputChange(e, 'user')} />
                        <input className="text-black p-2 border rounded" type="text" name="mothersName" minLength={4} placeholder="Mother's name" value={userData.mothersName} onChange={(e) => handleInputChange(e, 'user')} />
                        <input className="text-black p-2 border rounded" type="text" name="socialSecurityNumber" minLength={9} maxLength={9} placeholder="SSN number" value={userData.socialSecurityNumber} onChange={(e) => handleInputChange(e, 'user')} />
                        <input className="text-black p-2 border rounded" type="text" name="taxIdentificationNumber" minLength={10} maxLength={10} placeholder="TIN number" value={userData.taxIdentificationNumber} onChange={(e) => handleInputChange(e, 'user')} />
                        <input className="text-black p-2 border rounded" type="email" name="emailAddress" placeholder="Email address" value={userData.emailAddress} onChange={(e) => handleInputChange(e, 'user')} />
                    </div>
                    <hr/>
                    {/* Address Fields */}
                    {userData.addresses.map((address, index) => (
                        <div key={`address-${index}`} className="flex flex-col space-y-2">
                            <input className="text-black p-2 border rounded" type="text" name="country" placeholder="Country" value={address.country} onChange={(e) => handleInputChange(e, 'addresses', index)} />
                            <input className="text-black p-2 border rounded" type="text" name="city" placeholder="City" value={address.city} onChange={(e) => handleInputChange(e, 'addresses', index)} />
                            <input className="text-black p-2 border rounded" type="text" name="postalCode" placeholder="Postal Code" value={address.postalCode} onChange={(e) => handleInputChange(e, 'addresses', index)} />
                            <input className="text-black p-2 border rounded" type="text" name="street" placeholder="Street" value={address.street} onChange={(e) => handleInputChange(e, 'addresses', index)} />
                            <input className="text-black p-2 border rounded" type="text" name="number" placeholder="Street number" value={address.number} onChange={(e) => handleInputChange(e, 'addresses', index)} />
                        </div>
                    ))}
                    <hr/>
                    {/* Phone Number Fields */}
                    {userData.phoneNumbers.map((phone, index) => (
                        <div key={`phone-${index}`} className="flex flex-col space-y-2">
                            <input className="text-black p-2 border rounded" type="tel" name="phoneNumber" placeholder="Phone Number" value={phone.phoneNumber} onChange={(e) => handleInputChange(e, 'phoneNumbers', index)} />
                        </div>
                    ))}

                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
                    </div>
                    {/* Buttons for Adding More Addresses and Phone Numbers */}
                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={() => setUserData({
                                ...userData,
                                addresses: [...userData.addresses, { street: '', number: '', city: '', postalCode: '', country: '' }]
                            })}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Add More Addresses
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserData({
                                ...userData,
                                phoneNumbers: [...userData.phoneNumbers, { phoneNumber: '' }]
                            })}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Add More Phone Numbers
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}