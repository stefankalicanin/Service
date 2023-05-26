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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
