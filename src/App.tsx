import { useState } from "react";
import "./App.css";
import logo from "./assets/Logo_oB_quadrat_weiss.png";
import LoginPage from "./components/auth/LoginPage";
import { getToken, clearToken, isAdminOrManager } from "./lib/api";
import { useT, useLang } from "./lib/i18n";

import OpenBeerService from "./components/service/OpenBeerService";
import UserBeerAmountService from "./components/service/UserAmountService";
import UserGroup from "./components/user/UserGroup";
import AddUser from "./components/user/AddUser";
import BeerGroup from "./components/beer/BeerGroup";
import AddBeer from "./components/beer/AddBeer";
import BreweryGroup from "./components/brewery/BreweryGroup";
import AddBrewery from "./components/brewery/AddBrewery";
import TeamGroup from "./components/team/TeamGroup";
import AddTeam from "./components/team/AddTeam";
import SeasonGroup from "./components/season/SeasonGroup";
import AddSeason from "./components/season/AddSeason";
import EventGroup from "./components/event/EventGroup";
import AddEvent from "./components/event/AddEvent";
import UserBeerGroup from "./components/beer/UserBeerGroup";
import AddUserBeer from "./components/beer/AddUserBeer";
import BringBeerGroup from "./components/beer/BringBeerGroup";
import AddBringBeer from "./components/beer/AddBringBeer";

type Section =
  | "dashboard"
  | "beers"
  | "breweries"
  | "users"
  | "teams"
  | "seasons"
  | "events"
  | "finebeers"
  | "bringbeer";

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(() => !!getToken());
  const [active, setActive] = useState<Section>("dashboard");
  const t = useT();
  const { lang, setLang } = useLang();

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  const handleLogout = () => {
    clearToken();
    setLoggedIn(false);
  };

  const NAV = [
    {
      group: null,
      items: [{ id: "dashboard" as Section, label: t("navDashboard"), icon: "◈" }],
    },
    {
      group: t("groupCatalog"),
      items: [
        { id: "beers" as Section, label: t("navBeers"), icon: "🍺" },
        { id: "breweries" as Section, label: t("navBreweries"), icon: "🏭" },
      ],
    },
    {
      group: t("groupOrganization"),
      items: [
        { id: "users" as Section, label: t("navUsers"), icon: "👤" },
        { id: "teams" as Section, label: t("navTeams"), icon: "👥" },
        { id: "seasons" as Section, label: t("navSeasons"), icon: "🔄" },
        { id: "events" as Section, label: t("navEvents"), icon: "📅" },
      ],
    },
    {
      group: t("groupBeerTracking"),
      items: [
        { id: "finebeers" as Section, label: t("navFineBeers"), icon: "⚠️" },
        { id: "bringbeer" as Section, label: t("navBringBeer"), icon: "📦" },
      ],
    },
  ];

  const SECTION_META: Record<Section, { title: string; subtitle: string }> = {
    dashboard: { title: t("dashboardTitle"), subtitle: t("dashboardSub") },
    beers: { title: t("beersTitle"), subtitle: t("beersSub") },
    breweries: { title: t("breweriesTitle"), subtitle: t("breweriesSub") },
    users: { title: t("usersTitle"), subtitle: t("usersSub") },
    teams: { title: t("teamsTitle"), subtitle: t("teamsSub") },
    seasons: { title: t("seasonsTitle"), subtitle: t("seasonsSub") },
    events: { title: t("eventsTitle"), subtitle: t("eventsSub") },
    finebeers: { title: t("finebeersTitle"), subtitle: t("finebeersSub") },
    bringbeer: { title: t("bringbeerTitle"), subtitle: t("bringbeerSub") },
  };

  const meta = SECTION_META[active];

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" />
          <span className="sidebar-logo-text">Drink Mgr</span>
        </div>

        {NAV.map((group) => (
          <div className="sidebar-section" key={group.group ?? "top"}>
            {group.group && (
              <div className="sidebar-section-label">{group.group}</div>
            )}
            {group.items.map((item) => (
              <button
                key={item.id}
                className={`nav-item${active === item.id ? " active" : ""}`}
                onClick={() => setActive(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        ))}

        <div className="sidebar-footer">
          <div className="lang-toggle">
            <button
              className={`lang-btn${lang === "en" ? " active" : ""}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              className={`lang-btn${lang === "de" ? " active" : ""}`}
              onClick={() => setLang("de")}
            >
              DE
            </button>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <span className="nav-icon">⏏</span>
            {t("signOut")}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="section-header">
          <h1 className="section-title">{meta.title}</h1>
          <p className="section-subtitle">{meta.subtitle}</p>
        </div>

        {active === "dashboard" && (
          <div className="dashboard-grid">
            <OpenBeerService />
            <UserBeerAmountService />
          </div>
        )}

        {active === "beers" && (
          <div className="section-grid">
            <BeerGroup />
            <AddBeer />
          </div>
        )}

        {active === "breweries" && (
          <div className="section-grid">
            <BreweryGroup />
            <AddBrewery />
          </div>
        )}

        {active === "users" && (
          <div className="section-grid">
            <UserGroup />
            {isAdminOrManager() && <AddUser />}
          </div>
        )}

        {active === "teams" && (
          <div className="section-grid">
            <TeamGroup />
            <AddTeam />
          </div>
        )}

        {active === "seasons" && (
          <div className="section-grid">
            <SeasonGroup />
            <AddSeason />
          </div>
        )}

        {active === "events" && (
          <div className="section-grid">
            <EventGroup />
            <AddEvent />
          </div>
        )}

        {active === "finebeers" && (
          <div className="section-grid">
            <UserBeerGroup />
            <AddUserBeer />
          </div>
        )}

        {active === "bringbeer" && (
          <div className="section-grid">
            <BringBeerGroup />
            <AddBringBeer />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
