import React, { useState, useEffect } from 'react';
import UserModal, {UserData} from "@/app/user/user-modal";
import EditableCell from "@/app/utility/editable-cell";

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
        saveUser(userData)
        handleCloseModal();
    };
    const [users, setUsers] = useState<User[]>([]);
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const [editingRowId, setEditingRowId] = useState<number | null>(null);

    const handleRowEdit = (userId: number) => {
        setEditingRowId(userId);
    };

    const handleValueChange = (index: number, fieldName: string, newValue: string) => {
        const updatedUsers = users.map((user, idx) => {
            if (idx === index) {
                return { ...user, [fieldName]: newValue };
            }
            return user;
        });
        setUsers(updatedUsers);
    };

    async function saveUser(userToUpdate: UserData) {
        try {
            const response = await fetch(`http://127.0.0.1:8080/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userToUpdate),
            });

            if (!response.ok) {
                throw new Error('Failed to update user data.');
            }

            setEditingRowId(null);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    const handleSave = async (index: number) => {
        const userToUpdate = users[index];
        await saveUser(userToUpdate);
    };

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
                <table className="w-full table-fixed text-sm text-center text-gray-500">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                    <tr>
                        <th className="py-3 px-6">Name</th>
                        <th className="py-3 px-6">Birthdate</th>
                        <th className="py-3 px-6">Birth Place</th>
                        <th className="py-3 px-6">Mother's Name</th>
                        <th className="py-3 px-6">SSN</th>
                        <th className="py-3 px-6">TIN</th>
                        <th className="py-3 px-6">Email</th>
                        <th className="py-3 px-6">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.flatMap((user, userIndex) => [
                        <tr key={`user-${user.id}`} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600 cursor-pointer" onDoubleClick={() => handleRowEdit(user.id)}>
                            <td className="py-4 px-6">
                                <EditableCell isEditing={editingRowId === user.id} value={user.name}
                                onChange={(newValue) => handleValueChange(userIndex, 'name', newValue)}/></td>
                            <td className="py-4 px-6">
                                <EditableCell isEditing={editingRowId === user.id} value={user.birthdate}
                                              onChange={(newValue) => handleValueChange(userIndex, 'birthdate', newValue)}/></td>
                            <td className="py-4 px-6">
                                <EditableCell isEditing={editingRowId === user.id} value={user.birthPlace}
                                              onChange={(newValue) => handleValueChange(userIndex, 'birthPlace', newValue)}/></td>
                            <td className="py-4 px-6">
                                <EditableCell isEditing={editingRowId === user.id} value={user.mothersName}
                                              onChange={(newValue) => handleValueChange(userIndex, 'mothersName', newValue)}/></td>
                            <td className="py-4 px-6">
                                <EditableCell isEditing={editingRowId === user.id} value={user.socialSecurityNumber}
                                              onChange={(newValue) => handleValueChange(userIndex, 'socialSecurityNumber', newValue)}/></td>
                            <td className="py-4 px-6">
                                <EditableCell isEditing={editingRowId === user.id} value={user.taxIdentificationNumber}
                                                                    onChange={(newValue) => handleValueChange(userIndex, 'taxIdentificationNumber', newValue)}/></td>
                            <td className="py-4 px-6">
                                <EditableCell isEditing={editingRowId === user.id} value={user.emailAddress}
                                              onChange={(newValue) => handleValueChange(userIndex, 'emailAddress', newValue)}/></td>
                            <td className="py-4 px-6 text-blue-500 hover:text-blue-400">
                                <button onClick={() => handleRowClick(user.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Details
                                </button>
                                {editingRowId === user.id && (
                                    <button onClick={() => handleSave(userIndex)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-1 rounded">Save</button>
                                )}
                            </td>
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
