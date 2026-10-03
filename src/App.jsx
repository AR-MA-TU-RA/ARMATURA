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

import { ROOMMATES, APARTMENTS, TRANSLATIONS } from './data/mockData';

export default function App() {
  // ─── Theme ───────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState('light'); // 'light' | 'dark'
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // ─── Language ─────────────────────────────────────────────────────────────
  const [language, setLanguage] = useState('en'); // 'en' | 'ro' | 'ru'

  // ─── First-visit gate (registration screen) ───────────────────────────────
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  // ─── Auth & User ──────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ─── Navigation ──────────────────────────────────────────────────────────
  const [activePage, setActivePage] = useState('home');
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedRoommate, setSelectedRoommate] = useState(null);
  const [activeChatPersonId, setActiveChatPersonId] = useState(null);

  // ─── App Data ─────────────────────────────────────────────────────────────
  const [roommatesList, setRoommatesList] = useState(ROOMMATES);
  const [apartmentsList, setApartmentsList] = useState(APARTMENTS);
  const [favorites, setFavorites] = useState(['anna-moraru', 'apt-1']);

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

  const handleStartChat = (person) => {
    setActiveChatPersonId(person.id);
    setActivePage('messages');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setRoommatesList([newProfile, ...roommatesList]);
    setCurrentUser({
      name: newProfile.name,
      age: newProfile.age,
      district: newProfile.district,
      email: `${newProfile.name.toLowerCase().replace(' ', '.')}@utm.md`,
      avatar: newProfile.avatar
    });
    setIsLoggedIn(true);
    setIsOnboardingOpen(false);
    setActivePage('matches');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublishSuccess = (newApt) => {
    setApartmentsList([newApt, ...apartmentsList]);
    setSelectedApartment(newApt);
    setActivePage('apartments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (name = 'Anna') => {
    setIsLoggedIn(true);
    setHasSeenWelcome(true);
    if (name === 'Mihai') {
      setCurrentUser({
        name: 'Mihai Ceban',
        age: 22,
        district: 'Botanica',
        email: 'mihai.ceban@utm.md',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
      });
    } else {
      setCurrentUser({
        name: 'Anna Moraru',
        age: 21,
        district: 'Centru',
        email: 'anna.moraru@utm.md',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
      });
    }
  };

  const handleRegisterSuccess = (userData) => {
    setHasSeenWelcome(true);
    setIsLoggedIn(true);
    setCurrentUser({
      name: userData.name || 'Anna Moraru',
      age: 21,
      district: 'Centru',
      email: userData.email || 'anna.moraru@utm.md',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    });
    setIsOnboardingOpen(true); // launch profile wizard after registration
  };

  const handleExploreAsGuest = () => {
    setHasSeenWelcome(true);
    setIsLoggedIn(false);
    setCurrentUser(null);
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
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-200">

      {/* STICKY NAVBAR */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          if (page !== 'apartments') setSelectedApartment(null);
        }}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        currentUser={currentUser}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        unreadMessagesCount={1}
        unreadNotificationsCount={2}
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
            onStartChatWithPerson={(person) => {
              const r = roommatesList.find(x =>
                x.name.toLowerCase().includes(person.name.split(' ')[0].toLowerCase())
              ) || roommatesList[0];
              handleStartChat(r);
            }}
            onTeamUpForApartment={(apt) => {
              setTeamUpTarget(roommatesList[0]);
              setIsTeamUpOpen(true);
            }}
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
            onToggleFavorite={handleToggleFavorite}
            onSelectPerson={(person) => setSelectedRoommate(person)}
            onStartChat={handleStartChat}
            onSelectApartment={(apt) => {
              setSelectedApartment(apt);
              setActivePage('apartments');
            }}
            onGoToSearch={() => setActivePage('roommates')}
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
        onClose={() => setIsNotificationsOpen(false)}
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
