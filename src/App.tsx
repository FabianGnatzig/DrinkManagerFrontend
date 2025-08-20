import AddBeer from "./components/beer/AddBeer";
import AddBrewery from "./components/brewery/AddBrewery";
import BeerGroup from "./components/beer/BeerGroup";
import BreweryGroup from "./components/brewery/BreweryGroup";
import logo from "./assets/Logo_oB_quadrat_weiss.png";
import TeamGroup from "./components/team/TeamGroup";
import AddTeam from "./components/team/AddTeam";
import SeasonGroup from "./components/season/SeasonGroup";
import AddSeason from "./components/season/AddSeason";
import EventGroup from "./components/event/EventGroup";
import AddEvent from "./components/event/AddEvent";
import AddUserBeer from "./components/beer/AddUserBeer";
import UserBeerGroup from "./components/beer/UserBeerGroup";
import BringBeerGroup from "./components/beer/BringBeerGroup";
import AddBringBeer from "./components/beer/AddBringBeer";
import OpenBeerService from "./components/service/OpenBeerService";
import UserBeerAmountService from "./components/service/UserAmountService";
import UserGroup from "./components/user/UserGroup";
import AddUser from "./components/user/AddUser";

function App() {
  return (
    <div>
      <div className="header">
        <img src={logo} alt="LOGO"></img>
        {/* <h6 className="menu-point">ss</h6> */}
      </div>
      <div>
        <OpenBeerService />
        <br />
        <UserBeerAmountService />
        <br />
        <UserGroup />
        <br />
        <AddUser />
        <br />
        <BeerGroup />
        <br />
        <AddBeer />
        <br />
        <BreweryGroup />
        <br />
        <AddBrewery />
        <br />
        <TeamGroup />
        <br />
        <AddTeam />
        <br />
        <SeasonGroup />
        <br />
        <AddSeason />
        <br />
        <EventGroup />
        <br />
        <AddEvent />
        <br />
        <UserBeerGroup />
        <br />
        <AddUserBeer />
        <br />
        <BringBeerGroup />
        <br />
        <AddBringBeer />
        <br />
      </div>
    </div>
  );
}

export default App;
