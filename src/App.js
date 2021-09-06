import './App.css';
import { Switch, Route} from "react-router-dom";
import { ItemDetail } from './Components/ItemDetail'
import { Home } from './Components/Home';
import { NavBar } from './Components/NavBar';
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

function App() {

  return (
    <div>
      <NavBar/>
      <div className="container mt-3">
        <Switch>          
          <Route exact path={["/", "/home"]} component={Home} />
          <Route path ='/:id' component={ItemDetail} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
