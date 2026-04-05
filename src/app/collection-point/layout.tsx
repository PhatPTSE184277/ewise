'use client';

import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Toast from '@/components/ui/Toast';
import { collectorMenuItems } from '@/constants/collection-point/MenuItems';
import { CategoryProvider } from '@/contexts/collection-point/CategoryContext';
import { CollectionRouteProvider } from '@/contexts/collection-point/CollectionRouteContext';
import { GroupingProvider } from '@/contexts/collection-point/GroupingContext';
import { IWProductProvider } from '@/contexts/collection-point/IWProductContext';
import { PackageProvider } from '@/contexts/collection-point/PackageContext';
import { SmallCollectorQRProvider } from '@/contexts/collection-point/QRContext';
import { UserProvider } from '@/contexts/UserContext';
import { DashboardProvider } from '@/contexts/collection-point/DashboardContext';
import { NotificationProvider, useNotifications } from '@/contexts/NotificationContext';
import { VehicleProvider } from '@/contexts/collection-point/VehicleContext';
import { useAuth } from '@/hooks/useAuth';

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { toast, hideToast } = useNotifications();
    const { user } = useAuth();
    
    const headerTitle = user?.smallCollectionName || 'Bảng điều khiển thu gom';

    return (
        <>
            <div className='h-screen flex flex-col bg-gray-50'>
                <Header
                    title={headerTitle}
                    href='/collection-point/dashboard'
                    profileHref='/collection-point/profile'
                />
                <div className='flex flex-1 overflow-hidden'>
                    <Sidebar
                        menuItems={collectorMenuItems}
                    />
                    <main className='flex-1 overflow-y-auto'>
                        {children}
                    </main>
                </div>
            </div>
            <Toast 
                open={!!toast} 
                type={toast?.type} 
                message={toast?.message || ''} 
                onClose={hideToast}
            />
        </>
    );
}

export default function SmallCollectorLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <GroupingProvider>
                <CollectionRouteProvider>
                    <IWProductProvider>
                        <PackageProvider>
                            <SmallCollectorQRProvider>
                                <UserProvider>
                                    <CategoryProvider>
                                        <DashboardProvider>
                                                <VehicleProvider>
                                                    <LayoutContent>{children}</LayoutContent>
                                                </VehicleProvider>
                                        </DashboardProvider>
                                    </CategoryProvider>
                                </UserProvider>
                            </SmallCollectorQRProvider>
                        </PackageProvider>
                    </IWProductProvider>
                </CollectionRouteProvider>
            </GroupingProvider>
        </NotificationProvider>
    );
}
