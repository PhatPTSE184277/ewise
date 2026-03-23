import {
    Package,
    Tag
} from 'lucide-react';

export const recyclerMenuItems = [
    {
        id: 'package',
        label: 'Quản lý kiện hàng',
        path: '/recycle/package',
        icon: <Package size={20} />
    },
    {
        id: 'category-registration',
        label: 'Đăng ký danh mục',
        path: '/recycle/category-registration',
        icon: <Tag size={20} />
    }
];
