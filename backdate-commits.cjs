const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ====== CONFIG ======
const TARGET_DATE = "2026-10-03";  // <-- Fixed date
const START_HOUR  = 14; // 2:00 PM
const END_HOUR    = 23; // 11:00 PM
const END_MINUTE  = 59; // 11:59 PM
const MIN_GAP_MIN = 5;  // minimum minutes between commits
const MAX_GAP_MIN = 25; // maximum minutes between commits

// ====== COMMIT PLAN ======
const commits = [
  { message: "chore: scaffold Vite + React project",              files: ["package.json", ".gitignore"] },
  { message: "chore: add Vite config",                            files: ["vite.config.js"] },
  { message: "chore: add entry HTML shell",                       files: ["index.html"] },
  { message: "chore: bootstrap React root",                       files: ["src/main.jsx"] },
  { message: "style: add global styles and design tokens",        files: ["src/index.css"] },
  { message: "chore: lock dependencies",                          files: ["package-lock.json"] },
  { message: "feat(data): add mock property dataset",             files: ["src/data/mockData.js"] },
  { message: "feat(utils): add safety filter helper",             files: ["src/utils/safetyFilter.js"] },
  { message: "feat: set up app shell and route state",            files: ["src/App.jsx"] },
  { message: "feat: add branding assets",                         files: ["public/domi-logo.jpg", "src/assets/domi-logo.jpg"] },
  { message: "feat(navbar): add top navigation bar",              files: ["src/components/Navbar.jsx"] },
  { message: "feat(property): create PropertyCard component",     files: ["src/components/PropertyCard.jsx"] },
  { message: "feat(property): add PropertyGrid layout",           files: ["src/components/PropertyGrid.jsx"] },
  { message: "feat(home): build homepage hero and sections",      files: ["src/components/Homepage.jsx"] },
  { message: "feat(search): add SearchBar component",             files: ["src/components/SearchBar.jsx"] },
  { message: "feat(search): add desktop FilterSidebar",           files: ["src/components/FilterSidebar.jsx"] },
  { message: "feat(search): add mobile FilterDrawer",             files: ["src/components/FilterDrawer.jsx"] },
  { message: "feat(home): add personalized recommendation section", files: ["src/components/PersonalizedSection.jsx"] },
  { message: "feat(property): implement PropertyDetail view",     files: ["src/components/PropertyDetail.jsx"] },
  { message: "feat(apartments): add ApartmentsPage listing",      files: ["src/components/ApartmentsPage.jsx"] },
  { message: "feat(auth): add AuthModal with login/signup",       files: ["src/components/AuthModal.jsx"] },
  { message: "feat(auth): add WelcomeAuthScreen",                 files: ["src/components/WelcomeAuthScreen.jsx"] },
  { message: "feat(onboarding): add multi-step onboarding wizard", files: ["src/components/OnboardingWizard.jsx"] },
  { message: "feat(favorites): add FavoritesPage",                files: ["src/components/FavoritesPage.jsx"] },
  { message: "feat(profile): add user dashboard modal",           files: ["src/components/UserDashboardModal.jsx"] },
  { message: "feat(profile): add profile modals",                 files: ["src/components/MyProfileModal.jsx", "src/components/UserProfileModal.jsx"] },
  { message: "feat(messages): add MessagesPage",                  files: ["src/components/MessagesPage.jsx"] },
  { message: "feat(contact): add landlord/owner contact modals",  files: ["src/components/ContactLandlordModal.jsx", "src/components/ContactOwnerModal.jsx"] },
  { message: "feat(roommates): add RoommatesPage",                files: ["src/components/RoommatesPage.jsx"] },
  { message: "feat(matches): add MatchesPage and MatchesModal",   files: ["src/components/MatchesPage.jsx", "src/components/MatchesModal.jsx"] },
  { message: "feat(matches): add floating match panel",           files: ["src/components/FloatingMatchPanel.jsx"] },
  { message: "feat(sharing): add sharing groups modal",           files: ["src/components/SharingGroupsModal.jsx"] },
  { message: "feat(safety): add SafetyPage",                      files: ["src/components/SafetyPage.jsx"] },
  { message: "feat(notifications): add notifications drawer",     files: ["src/components/NotificationsDrawer.jsx"] },
  { message: "feat(listings): add publish listing modal",         files: ["src/components/PublishModal.jsx"] },
  { message: "feat(reports): add report modal",                   files: ["src/components/ReportModal.jsx"] },
  { message: "feat(admin): add admin panel modal",                files: ["src/components/AdminPanelModal.jsx"] },
];

// ====== TIME GENERATION ======
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildTimeline(count) {
  const start = new Date(`${TARGET_DATE}T${String(START_HOUR).padStart(2,"0")}:00:00`);
  const end   = new Date(`${TARGET_DATE}T${String(END_HOUR).padStart(2,"0")}:${String(END_MINUTE).padStart(2,"0")}:00`);
  const totalWindowMs = end - start;

  const offsets = [];
  for (let i = 0; i < count; i++) offsets.push(Math.random() * totalWindowMs);
  offsets.sort((a, b) => a - b);

  for (let i = 1; i < offsets.length; i++) {
    const gapMs = offsets[i] - offsets[i - 1];
    if (gapMs < MIN_GAP_MIN * 60 * 1000) {
      offsets[i] = offsets[i - 1] + randomInt(MIN_GAP_MIN, MAX_GAP_MIN) * 60 * 1000;
    }
  }

  return offsets.map(ms => new Date(start.getTime() + ms));
}

// ====== EXECUTE ======
if (commits.length === 0) {
  console.error("❌ No commits defined.");
  process.exit(1);
}

if (!fs.existsSync(path.join(process.cwd(), ".git"))) {
  console.log("📦 Initializing git repository...");
  execSync("git init", { stdio: "inherit" });
}

const timestamps = buildTimeline(commits.length);

console.log("\n📅 Planned commit timeline:");
timestamps.forEach((t, i) => {
  console.log(`  ${i + 1}. [${t.toLocaleTimeString()}] ${commits[i].message}`);
});
console.log("");

commits.forEach((commit, i) => {
  const existing = commit.files.filter(f => fs.existsSync(f));
  if (existing.length === 0) {
    console.log(`⚠️  Skipping "${commit.message}" — none of these files exist: ${commit.files.join(", ")}`);
    return;
  }

  existing.forEach(f => execSync(`git add "${f}"`));

  const iso = timestamps[i].toISOString();
  const cmd = `git commit -m "${commit.message.replace(/"/g, '\\"')}"`;

  execSync(cmd, {
    stdio: "inherit",
    env: {
      ...process.env,
      GIT_AUTHOR_DATE: iso,
      GIT_COMMITTER_DATE: iso,
    },
    shell: true,
  });

  console.log(`✅ Committed at ${timestamps[i].toLocaleTimeString()}\n`);
});

console.log("🎉 Done! Run `git log --pretty=format:\"%h %ad %s\" --date=local` to see the result.");