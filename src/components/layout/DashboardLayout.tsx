'use client';
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import styles from "./DashboardLayout.module.css";
import CircularButton from "../ui/CircularButton";
import apiClient from "@/lib/apiClient";
import { em } from "framer-motion/client";
import { useSearch } from "@/context/searchContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  userName?: string;
  userAvatarUrl?: string;
  headerAction?: React.ReactNode;
  showBackButton?: boolean;
}

// Icon mapping for menu items
const MENU_ICONS: Record<string, { active: string; inactive: string }> = {
  '/dashboard': { active: 'Dashboardgreen.svg', inactive: 'Dashboard.svg' },
  '/setup': { active: 'Setupgreen.svg', inactive: 'Setup.png' },
  '/user': { active: 'Residentialgreen.svg', inactive: 'Residential.png' },
  '/user-family': { active: 'Userfamilygreen.svg', inactive: 'Userfamily.svg' },
  '/vehicle': { active: 'Vehiclegreen.svg', inactive: 'Vehicle.png' },
  '/visitors': { active: 'Visitorgreen.svg', inactive: 'Visitor.png' },
  '/workers': { active: 'Workergreen.png', inactive: 'Worker.png' },
  '/luggage': { active: 'Luggagegreen.png', inactive: 'Luggage.png' },
  '/properties': {active: 'properties-icon-color.svg', inactive: 'properties-icon.svg' },
};

// Helper function to get icon based on active state
const getMenuIcon = (path: string, isActive: boolean): string => {
  const icons = MENU_ICONS[path];
  return icons ? `/icons/${icons[isActive ? 'active' : 'inactive']}` : '';
};

export default function DashboardLayout({ children, pageTitle = "Dashboard", userName = "Ahmed Faraz", userAvatarUrl, headerAction, showBackButton }: DashboardLayoutProps) {
  const [memberTypeOpen, setMemberTypeOpen] = useState(true);
  const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('/dashboard');
  const { searchValue, setSearchValue } = useSearch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    userRole: "",
    profileImage: "",
  });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
  setActiveMenuItem(pathname ?? "");
  setSearchValue("");
}, [pathname, setSearchValue]);
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await apiClient.get("/api/smartdha/user/getprofiledetail");
      const data = res.data;
      setProfile({
        name: data.name,
        profileImage: data.profileImage?.trim() || "",
        email: data.email,
        userRole: data.userRole || "",
      });
      
    } catch (err) {
      console.log("Profile fetch error:", err);
    }
  };

  fetchProfile();
}, []);
  const handleLogout = () => {
    router.push('/auth/sign-in');
  };


  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} style={{ display: sidebarOpen ? 'block' : 'none' }} />
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoSection}>
            <img src="/images/PDOHA.png" alt="Logo" className={styles.logo} />
            <div className={styles.logoSeparator} />
          </div>
          <button className={styles.closeSidebarBtn} onClick={() => setSidebarOpen(false)}>
            <X size={24} color="#27ae60" />
          </button>
        </div>
        <nav className={styles.menu}>
          <Link 
            href="/dashboard" 
            className={`${activeMenuItem === '/dashboard' ? styles.menuItemActive : ''} ${styles.menuItemGap} ${styles.menuItem}`}
          >
            <span>Dashboard</span>
            <img src={getMenuIcon('/dashboard', activeMenuItem === '/dashboard')} alt="" className={styles.menuIconImg} />
          </Link>
          <Link 
            href="/pickuplocation" 
            className={`${activeMenuItem.includes('/pickuplocation') ? styles.menuItemActive : ''} ${styles.menuItemGap} ${styles.menuItem}`}
          >
            <span>Add Pickup Location</span>
            <img src={getMenuIcon('/setup', activeMenuItem.includes('/setup'))} alt="" className={styles.menuIconImg} />
          </Link>
          <div 
            className={styles.menuSectionTitle} 
            onClick={() => setMemberTypeOpen(!memberTypeOpen)}
            style={{ cursor: 'pointer' }}
          >
            <span>Member Services</span>
            <img 
              src="/icons/Arrow.png" 
              alt="" 
              className={`${styles.menuDropdownIconImg} ${memberTypeOpen ? styles.menuDropdownIconOpen : ''}`}
            />
          </div>
          {memberTypeOpen && (
            <>
              <div>
  {/* MAIN BUTTON */}
  <div
    className={`${styles.menuItem} ${
      (activeMenuItem === '/user' || activeMenuItem === '/non-member') ||
      activeMenuItem.startsWith('/user/')
        ? styles.menuItemActive
        : ''
    }`}
    onClick={() => setMemberDropdownOpen(!memberDropdownOpen)}
    style={{ cursor: 'pointer' }}
  >
    <span>Member Type</span>
    <img
      src="/icons/Arrow.png"
      alt=""
      className={styles.menuDropdownIconImg}
    />
  </div>

  {/* DROPDOWN */}
  {memberDropdownOpen && (
    <div style={{ paddingLeft: '15px' }}>
      <Link
        href="/user"
        className={`${activeMenuItem === '/user' ? styles.menuItemActive : ''} ${styles.menuItem}`}
      >
        <span>Non Member</span>
      </Link>

      <Link
        href="/member"
        className={`${activeMenuItem === '/member' ? styles.menuItemActive : ''} ${styles.menuItem}`}
      >
        <span>Member</span>
      </Link>
    </div>
  )}
</div>
              <Link 
                href="/user-family" 
                className={`${(activeMenuItem === '/user-family' || activeMenuItem.startsWith('/user-family/')) ? styles.menuItemActive : ''} ${styles.menuItem}`}
              >
                <span>User Family</span>
                <img src={getMenuIcon('/user-family', (activeMenuItem === '/user-family' || activeMenuItem.startsWith('/user-family/')))} alt="" className={styles.menuIconImg} />
              </Link>
              <Link 
                href="/vehicle" 
                className={`${(activeMenuItem === '/vehicle' || activeMenuItem.startsWith('/vehicle/')) ? styles.menuItemActive : ''} ${styles.menuItem}`}
              >
                <span>Vehicles</span>
                <img src={getMenuIcon('/vehicle', (activeMenuItem === '/vehicle' || activeMenuItem.startsWith('/vehicle/')))} alt="" className={styles.menuIconImg} />
              </Link>
              <Link 
                href="/visitors" 
                className={`${(activeMenuItem === '/visitors' || activeMenuItem.startsWith('/visitors/')) ? styles.menuItemActive : ''} ${styles.menuItem}`}
              >
                <span>Visitor</span>
                <img src={getMenuIcon('/visitors', (activeMenuItem === '/visitors' || activeMenuItem.startsWith('/visitors/')))} alt="" className={styles.menuIconImg} />
              </Link>
              <Link 
                href="/workers" 
                className={`${(activeMenuItem === '/workers' || activeMenuItem.startsWith('/workers/')) ? styles.menuItemActive : ''} ${styles.menuItem}`}
              >
                <span>Workers</span>
                <img src={getMenuIcon('/workers', (activeMenuItem === '/workers' || activeMenuItem.startsWith('/workers/')))} alt="" className={styles.menuIconImg} />
              </Link>
              <Link 
                href="/luggage" 
                className={`${(activeMenuItem === '/luggage' || activeMenuItem.startsWith('/luggage/')) ? styles.menuItemActive : ''} ${styles.menuItem}`}
              >
                <span>Luggage Pass</span>
                <img src={getMenuIcon('/luggage', (activeMenuItem === '/luggage' || activeMenuItem.startsWith('/luggage/')))} alt="" className={styles.menuIconImg} />
              </Link>
              <Link 
                href="/properties" 
                className={`${(activeMenuItem === '/properties' || activeMenuItem.startsWith('/properties/')) ? styles.menuItemActive : ''} ${styles.menuItem}`}
              >
                <span>Properties</span>
                <img src={getMenuIcon('/properties', (activeMenuItem === '/properties' || activeMenuItem.startsWith('/properties/')))} alt="" className={styles.menuIconImg} />
              </Link>
            </>
          )}
          <div className={styles.menuSeparator} />
        </nav>
        <div className={styles.logoutSection}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <span>Logout</span>
            <img src="/icons/Log Out.png" alt="" className={styles.logoutIconImg} />
          </button>
        </div>
      </aside>
      <main className={`${styles.mainContent} ${sidebarOpen ? styles.mainContentShifted : ''}`}>
        <header className={styles.header}>
          <div className={styles.headerTitleWrapper}>
            <button className={styles.toggleSidebarBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={24} color="#27ae60" />
            </button>
            {(showBackButton !== false && (activeMenuItem.match(/\//g)?.length ?? 0) >= 2) || showBackButton === true ? (
              <img 
              src="/icons/arrow-back.png" 
              alt="Back" 
              className={styles.backArrowImg} 
              onClick={() => router.back()}
            />) : null}
            <div className={styles.headerTitle}>{pageTitle}</div>
          </div>
          <div className={styles.headerRight}>
  {/* HIDE SEARCH ON DASHBOARD + UPDATE PROFILE */}
  {pathname !== "/dashboard" &&
    pathname !== "/profile/edit" && (
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <CircularButton
          imagePath="/icons/Search Icon.svg"
          imageAlt="Search"
          width={32}
          height={32}
          pos="abs"
        />
      </div>
  )}
            {/* <Link href="/notification" className={styles.notificationWrapper}>
              <img src="/icons/basil_notification-on-solid.png" alt="" className={styles.notificationIconImg} />
            </Link> */}
            <div className={styles.userInfoWrapper}>
              <div 
                className={styles.userInfo} 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <img  src={profile.profileImage || userAvatarUrl || "/icons/profile_dummy.png"}  alt="User"  className={styles.userAvatar} />
                <div className={styles.userTextWrapper}>
                  <span className={styles.userName}> {profile.name || userName}</span>
                  <span className={styles.welcomeText}>{profile.email}</span>
                  <span className={styles.welcomeText}>{profile.userRole}</span>
                </div>
                <img src="/icons/gridicons_dropdown.png" alt="" className={styles.userDropdownImg} />
              </div>
              {profileDropdownOpen && (
                <div className={styles.profileDropdown}>
                  <Link href="/profile" className={styles.profileDropdownItem}>
                    <span>Profile</span>
                  </Link>
                  <div className={styles.profileDropdownDivider} />
                  {/* <div className={styles.profileDropdownItem}>
                    <span>Notifications</span>
                    <label className={styles.toggleSwitch}>
                      <input 
                        type="checkbox" 
                        checked={notificationsEnabled} 
                        onChange={() => setNotificationsEnabled(!notificationsEnabled)} 
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div> */}
                  <div className={styles.profileDropdownDivider} />
                  <button className={styles.profileDropdownItem} onClick={handleLogout}>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
            {headerAction && <div className={styles.headerAction}>{headerAction}</div>}
          </div>
        </header>
        <section className={styles.contentSection}>{children}</section>
      </main>

      {/* <aside >
        <RightSidebar />
      </aside> */}

    </div>
  );
}
