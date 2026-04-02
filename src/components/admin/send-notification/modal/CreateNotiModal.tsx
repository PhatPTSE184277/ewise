import React, { useState } from 'react';
import { useSendNotiContext } from '@/contexts/admin/SendNotiContext';
import { X } from 'lucide-react';
import { getAllUsers } from '@/services/admin/SendNotiService';
import CustomTextarea from '@/components/ui/CustomTextarea';

interface CreateNotiModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateNotiModal: React.FC<CreateNotiModalProps> = ({
    open,
    onClose,
    onSuccess
}) => {
    const { sendNotification } = useSendNotiContext();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleClose = () => {
        setTitle('');
        setMessage('');
        onClose();
    };

    const handleSubmit = async () => {
        if (!title.trim() || !message.trim()) return;

        setSending(true);
        try {
            const allActiveUsersRes = await getAllUsers({
                page: 1,
                limit: 10000,
                status: 'Đang hoạt động'
            });
            const activeUserIds: string[] = Array.isArray(allActiveUsersRes?.data)
                ? allActiveUsersRes.data
                    .map((u: { userId?: string }) => u.userId)
                    .filter((id: string | undefined): id is string => Boolean(id))
                : [];

            if (activeUserIds.length === 0) return;

            await sendNotification({
                userIds: activeUserIds,
                title: title.trim(),
                message: message.trim()
            });
            handleClose();
            onSuccess();
        } catch (err) {
            console.error('Send notification error', err);
        } finally {
            setSending(false);
        }
    };

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>

            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[98vh] min-h-[90vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100'>
                    <div className='flex items-center gap-3'>
                        <h2 className='text-2xl font-bold text-gray-800'>
                            Tạo thông báo mới
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Body */}
                <div className='flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50'>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700'>
                                Tiêu đề <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='text'
                                className='w-full border border-gray-200 rounded-xl p-3 text-gray-800 placeholder-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all duration-200 bg-white'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder='Nhập tiêu đề thông báo...'
                                maxLength={100}
                            />
                            <p className='text-xs text-gray-500'>{title.length}/100 ký tự</p>
                        </div>

                        <div className='space-y-2'>
                            <CustomTextarea
                                value={message}
                                onChange={setMessage}
                                label={<>Nội dung <span className='text-red-500'>*</span></>}
                                placeholder='Nhập nội dung thông báo...'
                                rows={8}
                                maxLength={500}
                                showCounter
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                    <div className='flex items-center gap-3'>
                        <div className='flex gap-3'>
                            <button
                                onClick={handleSubmit}
                                disabled={!title.trim() || !message.trim() || sending}
                                className={`px-6 py-2.5 rounded-xl transition font-medium cursor-pointer ${
                                    !title.trim() || !message.trim() || sending
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary-600 text-white hover:bg-primary-700'
                                }`}
                            >
                                {sending ? 'Đang gửi...' : 'Gửi thông báo'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNotiModal;
