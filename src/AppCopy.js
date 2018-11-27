import React,{Component} from 'react';
import logo from './logo.svg';
import {Navbar,NavItem,Icon} from 'react-materialize';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Home from './Home';
import CalegScreen from './CalegScreen';

const Header = () => (
  <Navbar brand='QC' right>
    <NavItem href="/dataCaleg">Data Caleg</NavItem>
    <NavItem href="/dataTps">Data TPS</NavItem>
  </Navbar>
);

class App extends Component{
  render(){
    return(
      <Router>
        <div>
          <Header />
          <Route exact path="/" component={Home} />
          <Route path="/dataCaleg" component={CalegScreen} />
        </div>
      </Router>
    );
  }
}



export default App;