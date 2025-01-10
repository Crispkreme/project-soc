import { useState, useEffect } from 'react';
import { IoCameraOutline } from 'react-icons/io5';
import axios from 'axios';

const UpdateAvatar = ({ userDetail }) => {
    console.log('userDetail', userDetail);
    const [avatarPreview, setAvatarPreview] = useState(userDetail.profile ? `/storage/profiles/${userDetail.profile}` : '/path/to/default/avatar.jpg');
    const [profile, setProfile] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setAvatarPreview(userDetail.profile ? `/storage/${userDetail.profile}` : '/path/to/default/avatar.jpg');
    }, [userDetail.profile]);

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfile(file);
            const reader = new FileReader();

            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleAvatarUpload = async (event) => {
        event.preventDefault();
        setProcessing(true);
        setError(null);

        const formData = new FormData();
        formData.append('profile', profile);

        try {
            const response = await axios.post('/user/avatar/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setAvatarPreview(response.data.profile);
            console.log('Avatar updated successfully');
        } catch (err) {
            console.error('Error uploading avatar:', err);
            setError(err.response?.data?.errors?.profile || 'An unexpected error occurred');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleAvatarUpload} encType="multipart/form-data">
                <div className="w-full rounded-sm">
                    <div
                        className="mx-auto flex justify-center w-[141px] h-[141px] rounded-full"
                        style={{
                            backgroundImage: `url(${avatarPreview})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">
                            <input
                                type="file"
                                name="profile"
                                id="upload_profile"
                                hidden
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                            <label htmlFor="upload_profile">
                                <IoCameraOutline className="w-6 h-5 text-blue-700" />
                            </label>
                        </div>
                    </div>
                </div>
                <h2 className="text-center mt-1 font-semibold dark:text-gray-300">Upload Profile</h2>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        disabled={processing}
                    >
                        {processing ? 'Updating...' : 'Update Avatar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateAvatar;
