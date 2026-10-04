import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import RoommatesPage from './components/RoommatesPage';
import ApartmentsPage from './components/ApartmentsPage';
import MatchesPage from './components/MatchesPage';
import MessagesPage from './components/MessagesPage';
import SafetyPage from './components/SafetyPage';
import FavoritesPage from './components/FavoritesPage';
import PropertyDetail from './components/PropertyDetail';
import UserProfileModal from './components/UserProfileModal';
import OnboardingWizard from './components/OnboardingWizard';
import PublishModal from './components/PublishModal';
import UserDashboardModal from './components/UserDashboardModal';
import AdminPanelModal from './components/AdminPanelModal';
import ReportModal from './components/ReportModal';
import SharingGroupsModal from './components/SharingGroupsModal';
import NotificationsDrawer from './components/NotificationsDrawer';
import WelcomeAuthScreen from './components/WelcomeAuthScreen';

import { ROOMMATES, APARTMENTS, TRANSLATIONS, NOTIFICATIONS_LIST } from './data/mockData';

// ─── LocalStorage Helpers ──────────────────────────────────────────────────
const loadStorage = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
};

const saveStorage = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    // safely ignore storage quota/privacy errors
  }
};

export default function App() {
  // ─── Theme ───────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState('light'); // 'light' | 'dark'
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // ─── Language ─────────────────────────────────────────────────────────────
  const [language, setLanguage] = useState(() => {
    return loadStorage('domi_language', 'ro');
  });

  useEffect(() => {
    saveStorage('domi_language', language);
  }, [language]);

  // ─── First-visit gate (registration screen) ───────────────────────────────
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => {
    return !!loadStorage('domi_is_logged_in', false);
  });

  // ─── Auth & User (Persisted) ──────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return loadStorage('domi_is_logged_in', false);
  });
  const [currentUser, setCurrentUser] = useState(() => {
    return loadStorage('domi_current_user', null);
  });

  // ─── Navigation ──────────────────────────────────────────────────────────
  const [activePage, setActivePage] = useState('home');
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedRoommate, setSelectedRoommate] = useState(null);
  const [activeChatPersonId, setActiveChatPersonId] = useState(null);
  const [activeChatApartmentContext, setActiveChatApartmentContext] = useState(null);

  // ─── App Data ─────────────────────────────────────────────────────────────
  const [roommatesList, setRoommatesList] = useState(() => {
    const custom = loadStorage('domi_custom_roommates', []);
    const existingIds = new Set(custom.map(c => c.id));
    return [...custom, ...ROOMMATES.filter(r => !existingIds.has(r.id))];
  });
  const [apartmentsList, setApartmentsList] = useState(() => {
    const custom = loadStorage('domi_custom_apartments', []);
    const existingIds = new Set(custom.map(c => c.id));
    return [...custom, ...APARTMENTS.filter(a => !existingIds.has(a.id))];
  });
  const [favorites, setFavorites] = useState(() => {
    return loadStorage('domi_favorites', ['anna-moraru', 'apt-1']);
  });
  const [notifications, setNotifications] = useState(NOTIFICATIONS_LIST);
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const [appliedApartments, setAppliedApartments] = useState(() => {
    return loadStorage('domi_applied_apartments', []);
  });

  // ─── LocalStorage Persistence Sync ────────────────────────────────────────
  useEffect(() => {
    saveStorage('domi_is_logged_in', isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    saveStorage('domi_current_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveStorage('domi_favorites', favorites);
  }, [favorites]);

  useEffect(() => {
    saveStorage('domi_applied_apartments', appliedApartments);
  }, [appliedApartments]);

  // Check for stored backend auth token on mount
  useEffect(() => {
    const token = localStorage.getItem('domi_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.user) {
            setCurrentUser(data.user);
            setIsLoggedIn(true);
          }
        })
        .catch(() => {
          // Backend offline or unreachable, rely on localStorage state
        });
    }
  }, []);

  // ─── Modals ───────────────────────────────────────────────────────────────
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isTeamUpOpen, setIsTeamUpOpen] = useState(false);
  const [teamUpTarget, setTeamUpTarget] = useState(null);

  // Hero search transfer state
  const [roommatesFilterInitial, setRoommatesFilterInitial] = useState({});

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleToggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleMarkNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleCloseNotifications = () => {
    handleMarkNotificationsAsRead();
    setIsNotificationsOpen(false);
  };

  const handleStartChat = (target, context = null) => {
    const personId = typeof target === 'string' ? target : (target?.id || target);
    if (personId) {
      setActiveChatPersonId(personId);
    }
    const apt = context?.apartment || context;
    if (apt && (apt.district || apt.address || apt.title)) {
      setActiveChatApartmentContext(apt);
    } else {
      setActiveChatApartmentContext(null);
    }
    setActivePage('messages');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyApartment = (aptId) => {
    setAppliedApartments(prev => {
      const updated = prev.includes(aptId) ? prev : [...prev, aptId];
      saveStorage('domi_applied_apartments', updated);
      return updated;
    });

    // Also persist applicant into domi_apartment_applications in localStorage so user B can see user A
    const storedApps = loadStorage('domi_apartment_applications', {});
    const existingApplicants = storedApps[aptId] || [];
    const applicantProfile = currentUser
      ? {
          id: currentUser.id || (currentUser.name?.toLowerCase().includes('mihai') ? 'mihai-ceban' : 'anna-moraru'),
          name: currentUser.name,
          age: currentUser.age || 21,
          avatar: currentUser.avatar,
          district: currentUser.district || 'Centru',
          budgetFormatted: currentUser.budgetFormatted || '€250–300 / month',
          budgetMin: currentUser.budgetMin || 220,
          budgetMax: currentUser.budgetMax || 320,
          occupation: currentUser.occupation || 'Student',
          compatibility: currentUser.compatibility || 94
        }
      : {
          id: 'anna-moraru',
          name: 'Anna Moraru',
          age: 21,
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
          district: 'Centru',
          budgetFormatted: '€250–300 / month',
          budgetMin: 250,
          budgetMax: 300,
          occupation: 'Design Student & UI Freelancer',
          compatibility: 92
        };

    const alreadyIn = existingApplicants.some(a => (typeof a === 'string' ? a : a.id) === applicantProfile.id);
    if (!alreadyIn) {
      storedApps[aptId] = [...existingApplicants, applicantProfile];
      saveStorage('domi_apartment_applications', storedApps);
    }

    // Also sync application to backend server if reachable
    const token = localStorage.getItem('domi_token');
    fetch(`/api/apartments/${aptId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ userId: applicantProfile.id })
    }).catch(() => {
      // Graceful offline fallback
    });
  };

  const handleTeamUp = (person) => {
    setTeamUpTarget(person);
    setIsTeamUpOpen(true);
  };

  const handleHeroSearch = (filters) => {
    setRoommatesFilterInitial(filters);
    setActivePage('roommates');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOnboardingComplete = (newProfile) => {
    const updatedUser = {
      id: newProfile.id,
      name: newProfile.name,
      age: newProfile.age,
      district: newProfile.district,
      email: `${newProfile.name.toLowerCase().replace(' ', '.')}@utm.md`,
      avatar: newProfile.avatar,
      occupation: newProfile.occupation,
      budgetFormatted: newProfile.budgetFormatted,
      budgetMin: newProfile.budgetMin,
      budgetMax: newProfile.budgetMax,
      compatibility: newProfile.compatibility
    };

    setRoommatesList(prev => [newProfile, ...prev.filter(r => r.id !== newProfile.id)]);

    // Persist new custom profile to localStorage so other sessions can see it
    const savedCustom = loadStorage('domi_custom_roommates', []);
    saveStorage('domi_custom_roommates', [newProfile, ...savedCustom.filter(r => r.id !== newProfile.id)]);

    setCurrentUser(updatedUser);
    setIsLoggedIn(true);
    saveStorage('domi_is_logged_in', true);
    saveStorage('domi_current_user', updatedUser);
    setIsOnboardingOpen(false);
    setActivePage('matches');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublishSuccess = (newApt) => {
    setApartmentsList(prev => {
      const updated = [newApt, ...prev];
      try {
        const custom = loadStorage('domi_custom_apartments', []);
        saveStorage('domi_custom_apartments', [newApt, ...custom]);
      } catch (e) {
        console.error('Error saving custom apartment to storage:', e);
      }
      return updated;
    });
    setSelectedApartment(newApt);
    setActivePage('apartments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (userData = 'Anna', token = null) => {
    setIsLoggedIn(true);
    setHasSeenWelcome(true);

    if (token) {
      localStorage.setItem('domi_token', token);
    }

    let userToSet;
    if (typeof userData === 'object' && userData !== null) {
      userToSet = {
        id: userData.id || 'anna-moraru',
        name: userData.name || 'Anna Moraru',
        age: userData.age || 21,
        district: userData.district || 'Centru',
        email: userData.email || 'anna.moraru@utm.md',
        avatar: userData.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        occupation: userData.occupation || 'Student',
        budgetFormatted: userData.budgetFormatted || `€${userData.budgetMin || 220}–${userData.budgetMax || 320} / month`,
        budgetMin: userData.budgetMin || 220,
        budgetMax: userData.budgetMax || 320,
        compatibility: userData.compatibility || 92
      };
    } else {
      const name = typeof userData === 'string' ? userData : 'Anna';
      userToSet = name.toLowerCase().includes('mihai')
        ? {
            id: 'mihai-ceban',
            name: 'Mihai Ceban',
            age: 22,
            district: 'Botanica',
            email: 'mihai.ceban@utm.md',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
            occupation: 'Student & Junior Developer',
            budgetFormatted: '€220–320 / month',
            budgetMin: 220,
            budgetMax: 320,
            compatibility: 94
          }
        : {
            id: 'anna-moraru',
            name: 'Anna Moraru',
            age: 21,
            district: 'Centru',
            email: 'anna.moraru@utm.md',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
            occupation: 'Design Student & UI Freelancer',
            budgetFormatted: '€250–300 / month',
            budgetMin: 250,
            budgetMax: 300,
            compatibility: 92
          };
    }
    setCurrentUser(userToSet);
    saveStorage('domi_is_logged_in', true);
    saveStorage('domi_current_user', userToSet);
  };

  const handleRegisterSuccess = (userData, token = null) => {
    if (token) {
      localStorage.setItem('domi_token', token);
    }
    const registeredUser = {
      id: userData?.id || `user-${Date.now()}`,
      name: userData?.name || 'Anna Moraru',
      age: userData?.age || 21,
      district: userData?.district || 'Centru',
      email: userData?.email || 'anna.moraru@utm.md',
      avatar: userData?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      occupation: userData?.occupation || 'Student',
      budgetFormatted: userData?.budgetFormatted || '€200–300 / month',
      budgetMin: userData?.budgetMin || 200,
      budgetMax: userData?.budgetMax || 300,
      compatibility: userData?.compatibility || 90
    };
    setHasSeenWelcome(true);
    setIsLoggedIn(true);
    setCurrentUser(registeredUser);
    saveStorage('domi_is_logged_in', true);
    saveStorage('domi_current_user', registeredUser);
    setIsOnboardingOpen(true); // launch profile wizard after registration
  };

  const handleExploreAsGuest = () => {
    setHasSeenWelcome(true);
    setIsLoggedIn(false);
    setCurrentUser(null);
    saveStorage('domi_is_logged_in', false);
    saveStorage('domi_current_user', null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('domi_token');
    saveStorage('domi_is_logged_in', false);
    saveStorage('domi_current_user', null);
  };

  const handleUpdateAvatar = async (newAvatar) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, avatar: newAvatar };
    setCurrentUser(updatedUser);
    saveStorage('domi_current_user', updatedUser);

    setRoommatesList(prev => prev.map(r => r.id === updatedUser.id ? { ...r, avatar: newAvatar } : r));

    try {
      const token = localStorage.getItem('domi_token');
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ userId: updatedUser.id, avatar: newAvatar })
      });
    } catch (err) {
      console.warn('Backend sync failed, avatar saved locally:', err.message);
    }
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // ─── First-visit gate ─────────────────────────────────────────────────────
  if (!hasSeenWelcome) {
    return (
      <WelcomeAuthScreen
        onRegisterSuccess={handleRegisterSuccess}
        onLoginSuccess={handleLoginSuccess}
        onExploreAsGuest={handleExploreAsGuest}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
      />
    );
  }

  // ─── Main App ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-200 overflow-x-hidden w-full max-w-full pb-16 md:pb-0">

      {/* STICKY NAVBAR */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          if (page !== 'apartments') setSelectedApartment(null);
        }}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={handleLogout}
        currentUser={currentUser}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        unreadMessagesCount={1}
        unreadNotificationsCount={unreadNotificationsCount}
        favoritesCount={favorites.length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAuth={() => setHasSeenWelcome(false)}
        onOpenCreateProfile={() => setIsOnboardingOpen(true)}
        onOpenPublishApartment={() => setIsPublishOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* MAIN PAGE ROUTING */}
      <main className="flex-1">

        {activePage === 'home' && (
          <Homepage
            onSearchSubmit={handleHeroSearch}
            onSelectDistrict={(district) => handleHeroSearch({ district })}
            onStartCreateProfile={() => setIsOnboardingOpen(true)}
            language={language}
          />
        )}

        {activePage === 'roommates' && (
          <RoommatesPage
            roommatesList={roommatesList}
            onSelectRoommate={(roommate) => setSelectedRoommate(roommate)}
            onStartChat={handleStartChat}
            onTeamUp={handleTeamUp}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            language={language}
            initialFilters={roommatesFilterInitial}
          />
        )}

        {activePage === 'apartments' && !selectedApartment && (
          <ApartmentsPage
            apartmentsList={apartmentsList}
            onSelectApartment={(apt) => {
              setSelectedApartment(apt);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPublishModal={() => setIsPublishOpen(true)}
            language={language}
          />
        )}

        {activePage === 'apartments' && selectedApartment && (
          <PropertyDetail
            apartment={selectedApartment}
            onBack={() => setSelectedApartment(null)}
            currentUser={currentUser}
            roommatesList={roommatesList}
            onStartChat={handleStartChat}
            onStartChatWithPerson={handleStartChat}
            appliedApartments={appliedApartments}
            onApplyApartment={handleApplyApartment}
            isFavorite={favorites.includes(selectedApartment.id)}
            onToggleFavorite={handleToggleFavorite}
            language={language}
          />
        )}

        {activePage === 'matches' && (
          <MatchesPage
            onSelectPerson={(person) => setSelectedRoommate(person)}
            onStartChat={handleStartChat}
            onTeamUp={handleTeamUp}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            language={language}
          />
        )}

        {activePage === 'messages' && (
          <MessagesPage
            onSelectPerson={(person) => setSelectedRoommate(person)}
            activeChatPersonId={activeChatPersonId}
            chatApartmentContext={activeChatApartmentContext}
            onSelectApartment={(apt) => {
              setSelectedApartment(apt);
              setActivePage('apartments');
            }}
            onOpenReport={() => setIsReportOpen(true)}
            language={language}
          />
        )}

        {activePage === 'safety' && (
          <SafetyPage
            onStartSearch={() => setActivePage('roommates')}
            onOpenReportModal={() => setIsReportOpen(true)}
            language={language}
          />
        )}

        {activePage === 'favorites' && (
          <FavoritesPage
            favorites={favorites}
            appliedApartments={appliedApartments}
            apartmentsList={apartmentsList}
            onToggleFavorite={handleToggleFavorite}
            onSelectPerson={(person) => setSelectedRoommate(person)}
            onStartChat={handleStartChat}
            onSelectApartment={(apt) => {
              setSelectedApartment(apt);
              setActivePage('apartments');
            }}
            onGoToSearch={() => setActivePage('apartments')}
            language={language}
          />
        )}

      </main>

      {/* MODALS LAYER */}

      {selectedRoommate && (
        <UserProfileModal
          person={selectedRoommate}
          onClose={() => setSelectedRoommate(null)}
          onStartChat={handleStartChat}
          onTeamUp={handleTeamUp}
          onReport={() => setIsReportOpen(true)}
          isFavorite={favorites.includes(selectedRoommate.id)}
          onToggleFavorite={handleToggleFavorite}
          language={language}
        />
      )}

      <OnboardingWizard
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
        language={language}
      />

      <PublishModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        onPublishSuccess={handlePublishSuccess}
        currentUser={currentUser}
        language={language}
      />

      <UserDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        currentUser={currentUser}
        language={language}
        onNavigate={(page) => {
          setActivePage(page);
          setSelectedApartment(null);
        }}
        onOpenCreateProfile={() => setIsOnboardingOpen(true)}
        onOpenPublishApartment={() => setIsPublishOpen(true)}
        onUpdateAvatar={handleUpdateAvatar}
      />

      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        language={language}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        language={language}
      />

      <SharingGroupsModal
        isOpen={isTeamUpOpen}
        onClose={() => setIsTeamUpOpen(false)}
        onNavigateToApartments={() => {
          setSelectedApartment(null);
          setActivePage('apartments');
        }}
        onStartChat={handleStartChat}
        targetRoommate={teamUpTarget}
        language={language}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={handleCloseNotifications}
        notifications={notifications}
        onMarkAllAsRead={handleMarkNotificationsAsRead}
        onSelectPerson={(person) => setSelectedRoommate(person)}
        onSelectApartment={(apt) => {
          setSelectedApartment(apt);
          setActivePage('apartments');
        }}
        language={language}
      />

      {/* FOOTER */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 py-8 text-xs text-slate-500 dark:text-slate-400 mt-16 mb-16 md:mb-0 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/domi-logo.jpg" alt="domi" className="h-5 dark:invert" />
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span>Chișinău, Republic of Moldova — Find a roommate. Pay less.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 font-medium">
            <button onClick={() => setActivePage('safety')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
              {t.safety || 'Safety & Trust'}
            </button>
            <span>•</span>
            <button onClick={() => setIsAdminOpen(true)} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
              Admin
            </button>
            <span>•</span>
            <span>{t.allPricesInEUR || 'All prices in EUR (€)'}</span>
            <span>•</span>
            <span>© 2026 domi Technologies</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
