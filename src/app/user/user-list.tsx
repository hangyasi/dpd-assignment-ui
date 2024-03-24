import React, { useState, useEffect } from 'react';
import UserModal, {UserData} from "@/app/user/user-modal";

export interface User {
    id: number;
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

export interface Address {
    postalCode: string;
    country: string;
    city: string;
    street: string;
    number: string;
}

export interface PhoneNumber {
    phoneNumber: string;
}

export default function UsersList() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleSaveUser = async (userData: UserData) => {
        try {
            const response = await fetch('http://127.0.0.1:8080/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

        } catch (error) {
            console.error('Error saving user:', error);
        }
        handleCloseModal();
    };
    const [users, setUsers] = useState<User[]>([]);
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    useEffect(() => {
        fetch('http://127.0.0.1:8080/user')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleRowClick = (userId: number) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(userId)) {
            newExpandedRows.delete(userId);
        } else {
            newExpandedRows.add(userId);
        }
        setExpandedRows(newExpandedRows);
    };

    return (
        <div className="bg-black text-white p-4">
            <button onClick={handleOpenModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Add New User
            </button>
            {isModalOpen && <UserModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveUser} />}
            <h2 className="text-xl font-bold text-center mb-4">Users List</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-center text-gray-500">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                    <tr>
                        <th className="py-3 px-6">ID</th>
                        <th className="py-3 px-6">Name</th>
                        <th className="py-3 px-6">Birthdate</th>
                        <th className="py-3 px-6">Birth Place</th>
                        <th className="py-3 px-6">Mother's Name</th>
                        <th className="py-3 px-6">SSN</th>
                        <th className="py-3 px-6">TIN</th>
                        <th className="py-3 px-6">Email</th>
                        <th className="py-3 px-6">Details</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.flatMap((user, userIndex) => [
                        <tr key={`user-${user.id}`} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600 cursor-pointer" onClick={() => handleRowClick(user.id)}>
                            <td className="py-4 px-6">{user.id}</td>
                            <td className="py-4 px-6">{user.name}</td>
                            <td className="py-4 px-6">{user.birthdate}</td>
                            <td className="py-4 px-6">{user.birthPlace}</td>
                            <td className="py-4 px-6">{user.mothersName}</td>
                            <td className="py-4 px-6">{user.socialSecurityNumber}</td>
                            <td className="py-4 px-6">{user.taxIdentificationNumber}</td>
                            <td className="py-4 px-6">{user.emailAddress}</td>
                            <td className="py-4 px-6 text-blue-500 hover:text-blue-400">Toggle Details</td>
                        </tr>,
                        expandedRows.has(user.id) ? (
                            <tr key={`details-${user.id}`} className="bg-gray-700 border-b border-gray-600">
                                <td colSpan={9} className="space-y-4 py-4 px-6">
                                    <div className="text-left">
                                        <h3 className="text-lg font-semibold text-gray-400">Addresses</h3>
                                        {user.addresses.map((address, index) => (
                                            <p key={`address-${user.id}-${index}`} className="text-sm">{`${address.street} ${address.number}, ${address.city}, ${address.postalCode}, ${address.country}`}</p>
                                        ))}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-semibold text-gray-400">Phone Numbers</h3>
                                        {user.phoneNumbers.map((phone, index) => (
                                            <p key={`phone-${user.id}-${index}`} className="text-sm">{phone.phoneNumber}</p>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ) : null
                    ])}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
