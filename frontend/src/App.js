import HomeAdmin from './pages/Admin/HomeAdmin';
import HomeUser from './pages/User/HomeUser';
import NavBar from './components/NavBar';
import Home from './pages/Home/Home';
import Login from './pages/Home/Login';
import RegisterUser from './pages/Home/RegisterUser';
import RegisterRepair from './pages/Admin/RegisterRepair';
import HomeRepaird from './pages/RepairerDiagnostic/HomeRepaird';
import UserDiagnosticRequest from './pages/User/UserDiagnosticRequest';
import RepairDiagnosticAppointments from './pages/RepairerDiagnostic/RepairDiagnosticAppointments';
import HomeRepairt from './pages/RepairerTroubleshooting/HomeRepairt';
import RepairTroubleshootingRequest from './pages/RepairerTroubleshooting/RepairTroubleshootingRequest';
import DiagnosticRequestsDone from './pages/User/DiagnosticRequestsDone';
import DiagnosticRequestsWait from './pages/User/DiagnosticRequestsWait';
import TroubleshootingRequestsDone from './pages/User/TroubleshootingRequestsDone';
import TroubleshootingRequestsWait from './pages/User/TroubleshootingRequestsWait';
import ChangePassword from './pages/Home/ChangePassword';
import CreateCategory from './pages/Admin/CreateCategory';
import CreateDevice from './pages/Admin/CreateDevice';
import ShowProfile from './pages/Admin/ShowProfile';
import RepairerProfiles from './pages/User/RepairerProfiles';
import TravelWarrant from './pages/Admin/TravelWarrant';
import CreateOrder from './pages/Admin/CreateOrder';
import UnnaprovedTravelWarrantDiagnostic from './pages/User/UnnaprovedTravelWarrant';
import UnapprovedTravelWarrantTroubleshooting from './pages/User/UnapprovedTravelWarrantTroubleshooting';
import TravelWarrantTroubleshooting from './pages/Admin/TravelWarrantTroubleshooting';
import Pricing from './pages/Admin/Pricing';
import {BrowserRouter, Routes, Route} from 'react-router-dom'


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <NavBar/>
        <Routes>
          <Route path = '/' element = {<Home/>}/>
          <Route path = '/login' element = {<Login/>}/>
          <Route path = '/user/home' element = {<HomeUser/>}/>
          <Route path = '/admin/home' element = {<HomeAdmin/>}/>
          <Route path = '/repairerd/home' element = {<HomeRepaird/>}/>
          <Route path = '/admin/register' element = {<RegisterRepair/>}/>
          <Route path = '/user/register' element = {<RegisterUser/>}/>
          <Route path = '/user/diagnostic_request' element = {<UserDiagnosticRequest/>}/>
          <Route path = '/repairerd/diagnostic_schedule_appointments' element = {<RepairDiagnosticAppointments/>}/>
          <Route path = '/repairert/home' element = {<HomeRepairt/>}/>
          <Route path = '/repairert/troubleshooting_request' element = {<RepairTroubleshootingRequest/>}/>
          <Route path = '/user/diagnostic_requests/done' element = {<DiagnosticRequestsDone/>}/>
          <Route path = '/user/diagnostic_requests/wait' element = {<DiagnosticRequestsWait/>}/>
          <Route path = '/user/troubleshooting_requests/done' element = {<TroubleshootingRequestsDone/>}/>
          <Route path = '/user/troubleshooting_requests/wait' element = {<TroubleshootingRequestsWait/>}/>
          <Route path = '/repairer/password' element = {<ChangePassword/>}/>
          <Route path= '/admin/create/category' element={<CreateCategory/>}/>
          <Route path= '/admin/create/device' element={<CreateDevice/>}/>
          <Route path= '/admin/users/profiles' element={<ShowProfile/>}/>
          <Route path= '/user/repairer/profiles' element={<RepairerProfiles/>}/>
          <Route path= '/admin/travel_warrant/diagnostic' element={<TravelWarrant/>}/>
          <Route path= '/admin/travel_warrant/troubleshooting' element={<TravelWarrantTroubleshooting/>}/>
          <Route path= '/admin/create/order' element={<CreateOrder/>}/>
          <Route path= '/user/travel_warrant/diagnostic/unnaproved' element={<UnnaprovedTravelWarrantDiagnostic/>}/>
          <Route path= '/user/travel_warrant/troubleshooting/unnaproved' element={<UnapprovedTravelWarrantTroubleshooting/>}/>
          <Route path= '/admin/pricing' element={<Pricing/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
