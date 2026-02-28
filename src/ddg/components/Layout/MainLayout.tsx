import React, { useEffect, useState } from 'react';
import { Sidebar as Drawer } from 'primereact/sidebar';
import { Header } from '../Header/Header';
import AppSidebar from '../Sidebar/Sidebar';
import { Footer } from '../Footer/Footer';
import { useScreenService } from '../../../system/shared/services/screen.service';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);
    const { sizes } = useScreenService();

    const isMobile = sizes['screen-x-small'] || sizes['screen-small'];

    useEffect(() => {
        if (!isMobile) {
            setMobileSidebarVisible(false);
        }
    }, [isMobile]);

    const handleToggleSidebar = () => {
        if (isMobile) {
            setMobileSidebarVisible((previous) => !previous);
            return;
        }

        setCollapsed((previous) => !previous);
    };

    return (
        <div className="flex flex-column h-screen overflow-hidden">
            <Header onToggleSidebar={handleToggleSidebar} isMobile={isMobile} />

            <div className="flex flex-1 overflow-hidden">
                {!isMobile && (
                    <aside
                        className={`h-full transition-all transition-duration-300 overflow-hidden ${collapsed ? 'w-4rem' : 'w-18rem'} border-right-1 surface-border`}
                    >
                        <AppSidebar collapsed={collapsed} />
                    </aside>
                )}

                {isMobile && (
                    <Drawer
                        visible={mobileSidebarVisible}
                        onHide={() => setMobileSidebarVisible(false)}
                        showCloseIcon
                        dismissable
                        modal
                        position="left"
                        className="w-18rem"
                    >
                        <AppSidebar
                            collapsed={false}
                            onNavigate={() => setMobileSidebarVisible(false)}
                        />
                    </Drawer>
                )}

                <div className="flex flex-column flex-1 overflow-hidden">
                    <main className="flex-1 overflow-y-auto p-3 md:p-4 surface-ground">
                        {children}
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
};
