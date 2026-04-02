/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Mail, Phone, Image as ImageIcon, Loader2, Upload, Trash2, Camera } from 'lucide-react';
import Section from '@/components/ui/Section';
import Toast from '@/components/ui/Toast';
import { uploadToCloudinary } from '@/utils/Cloudinary';
import { ProfileProvider, useProfile } from '@/contexts/ProfileContext';
import { useAppDispatch } from '@/redux/hooks';
import { loadUserFromToken } from '@/redux/reducers/authReducer';

function ProfilePageInner() {
    const dispatch = useAppDispatch();
    const { profile, loading, updating, error, updateProfile, clearError } = useProfile();

    const initial = useMemo(() => {
        const email = profile?.email ?? '';
        const avatarUrl = profile?.avatarUrl ?? profile?.avatar ?? '';
        const phoneNumber = profile?.phoneNumber ?? profile?.phone ?? '';
        return { email, avatarUrl, phoneNumber };
    }, [profile?.email, profile?.avatarUrl, profile?.avatar, profile?.phoneNumber, profile?.phone]);

    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('');

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        setEmail(initial.email);
        setPhoneNumber(initial.phoneNumber);
        setAvatarPreview(initial.avatarUrl);
        setAvatarFile(null);
    }, [initial.email, initial.phoneNumber, initial.avatarUrl]);

    const isChanged =
        email.trim() !== (initial.email || '').trim() ||
        phoneNumber.trim() !== (initial.phoneNumber || '').trim() ||
        avatarPreview.trim() !== (initial.avatarUrl || '').trim() ||
        !!avatarFile;

    const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        if (file.size > 10 * 1024 * 1024) {
            setToast({ type: 'error', message: 'Kích thước ảnh tối đa là 10MB' });
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const preview = (reader.result as string) || '';
            setAvatarPreview(preview);
            setAvatarFile(file);
        };
        reader.readAsDataURL(file);

        e.target.value = '';
    };

    const handleRemoveAvatar = () => {
        setAvatarPreview(initial.avatarUrl);
        setAvatarFile(null);
        if (avatarInputRef.current) avatarInputRef.current.value = '';
    };

    const handleSubmit = async () => {
        if (!profile?.userId) return;

        const emailValue = email.trim();
        const phoneValue = phoneNumber.trim();

        if (!emailValue) {
            setToast({ type: 'error', message: 'Vui lòng nhập email' });
            return;
        }
        if (!phoneValue) {
            setToast({ type: 'error', message: 'Vui lòng nhập số điện thoại' });
            return;
        }

        let finalAvatarUrl = (initial.avatarUrl || '').trim();

        // If user picked a local file, upload first
        if (avatarFile) {
            setUploadingAvatar(true);
            try {
                finalAvatarUrl = await uploadToCloudinary(avatarFile);
            } catch {
                setToast({ type: 'error', message: 'Tải ảnh lên thất bại' });
                setUploadingAvatar(false);
                return;
            } finally {
                setUploadingAvatar(false);
            }
        }

        const ok = await updateProfile({
            email: emailValue,
            avatarUrl: finalAvatarUrl,
            phoneNumber: phoneValue
        });

        if (ok) {
            // Refresh auth header info
            void dispatch(loadUserFromToken());
            setAvatarFile(null);
            setToast({ type: 'success', message: 'Cập nhật thông tin thành công' });
        } else {
            setToast({ type: 'error', message: error || 'Cập nhật thất bại' });
        }
    };

    if (loading) {
        return (
            <div className='p-6 flex items-center justify-center'>
                <div className='flex items-center gap-2 text-gray-600'>
                    <Loader2 className='animate-spin' size={18} />
                    <span>Đang tải thông tin...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='max-w-3xl mx-auto p-4 sm:p-6'>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6'>
                    <div className='flex items-center justify-between gap-4 flex-wrap'>
                        <div>
                            <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>Trang cá nhân</h1>
                            <p className='text-sm text-gray-500 mt-1'>Chỉnh sửa email, ảnh đại diện và số điện thoại</p>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={!isChanged || updating || uploadingAvatar}
                            className='px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2'
                        >
                            {(updating || uploadingAvatar) && <Loader2 className='animate-spin' size={16} />}
                            Lưu thay đổi
                        </button>
                    </div>

                    {/* Avatar */}
                    <Section
                        title='Ảnh đại diện'
                        icon={<ImageIcon className='text-primary-500' size={18} />}
                    >
                        <div className='flex items-start gap-4 flex-wrap'>
                            <div className='relative'>
                                <div className='w-24 h-24 rounded-full border border-primary-200 bg-white overflow-hidden shadow-sm flex items-center justify-center'>
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt='Avatar' className='w-full h-full object-cover' />
                                    ) : (
                                        <div className='w-full h-full flex items-center justify-center text-gray-400'>
                                            <ImageIcon size={28} />
                                        </div>
                                    )}
                                </div>

                                {/* Overlay camera button like social media */}
                                <label
                                    className='absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-md cursor-pointer'
                                    title='Thay ảnh đại diện'
                                >
                                    <div className='bg-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-white'>
                                        <Camera size={16} />
                                    </div>
                                    <input
                                        ref={avatarInputRef}
                                        type='file'
                                        accept='image/*'
                                        onChange={handleAvatarPick}
                                        className='hidden'
                                        disabled={uploadingAvatar || updating}
                                    />
                                </label>
                            </div>

                            <div className='flex-1 min-w-60 flex flex-col justify-center'>
                                <div className='flex items-center gap-3'>
                                    {avatarFile && (
                                        <button
                                            type='button'
                                            onClick={handleRemoveAvatar}
                                            aria-label='Xóa ảnh'
                                            className='w-9 h-9 bg-red-50 text-red-600 rounded-full flex items-center justify-center hover:bg-red-100 transition'
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                                {avatarFile && (
                                    <div className='text-sm text-gray-500 mt-2'>
                                        Ảnh sẽ được upload lên khi bấm “Lưu thay đổi”.
                                    </div>
                                )}
                            </div>
                        </div>
                    </Section>

                    {/* Contact */}
                    <Section
                        title='Thông tin liên hệ'
                        icon={<Mail className='text-primary-500' size={18} />}
                    >
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                                <div className='relative'>
                                    <Mail className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={16} />
                                    <input
                                        type='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='email@domain.com'
                                        className='w-full pl-9 pr-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Số điện thoại</label>
                                <div className='relative'>
                                    <Phone className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={16} />
                                    <input
                                        type='tel'
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder='0xxxxxxxxx'
                                        className='w-full pl-9 pr-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white'
                                    />
                                </div>
                            </div>
                        </div>
                    </Section>

                    {error && (
                        <div className='mt-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm flex items-start justify-between gap-3'>
                            <span>{error}</span>
                            <button
                                onClick={clearError}
                                className='text-red-700 font-semibold hover:underline'
                            >
                                Đóng
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Toast
                open={!!toast}
                type={toast?.type}
                message={toast?.message || ''}
                onClose={() => setToast(null)}
            />
        </>
    );
}

export default function ProfilePage() {
    return (
        <ProfileProvider>
            <ProfilePageInner />
        </ProfileProvider>
    );
}
