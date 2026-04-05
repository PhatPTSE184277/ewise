import {
    LayoutDashboard,
    Route,
    Warehouse,
    Package,
    GitBranch,
    QrCode,
    Truck
} from 'lucide-react';

export const collectorMenuItems = [
    {
        id: 'dashboard',
        label: 'Thống kê',
        path: '/collection-point/dashboard',
        icon: <LayoutDashboard size={20} />
    },
    {
        id: 'grouping',
        label: 'Danh sách sản phẩm',
        path: '/collection-point/grouping/list',
        icon: <GitBranch size={20} />
    },
    {
        id: 'collection-route',
        label: 'Tuyến thu gom',
        path: '/collection-point/collection-route',
        icon: <Route size={20} />
    },
    {
        id: 'incoming-warehouse',
        label: 'Nhận hàng về kho',
        path: '/collection-point/incoming-warehouse',
        icon: <Warehouse size={20} />
    },
    {
        id: 'package',
        label: 'Quản lý kiện hàng',
        path: '/collection-point/package',
        icon: <Package size={20} />
    },
    {
        id: 'vehicle',
        label: 'Phương tiện',
        path: '/collection-point/vehicle',
        icon: <Truck size={20} />
    },
    {
        id: 'qrcode',
        label: 'QR Code',
        path: '/collection-point/qrcode',
        icon: <QrCode size={20} />
    }
];