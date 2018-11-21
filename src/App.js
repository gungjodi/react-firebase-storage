import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {FirestoreDB,FirestoreTimestamp} from './FirebaseApp';

const userCollection = FirestoreDB.collection('users');
const tpsCollection = FirestoreDB.collection('tps');

class App extends Component {
  constructor()
  {
    super();
    this.state = {
      userArr:[],
      dataTps:[],
      loading:false
    }
  }

  componentDidMount()
  {
    this.setState({loading:true});
    this.loadData();
    this.dataTpsListener();
  }

  dataTpsListener(){
    let data = [];
    tpsCollection.onSnapshot(snapshot=>{
      snapshot.docChanges.forEach(change=>{
        if(change.type==="added"){
          data.push({
            id:change.doc.id,
            ...change.doc.data()
          });
        }
        if(change.type==="removed"){
          let docData = {
            id:change.doc.id,
            ...change.doc.data()
          };
          let index = this.state.dataTps.indexOf(docData);
          data = this.state.dataTps.splice(index,1);
        }
      });
      this.setState({dataTps:data});
    });
  }

  loadData()
  {
    userCollection.orderBy("created_at", "asc").get()
      .then((querySnapshot)=>{
        let users = [];
        querySnapshot.forEach((doc)=>{
          users.push({
            key : doc.id,
            ...doc.data()
          });
        });
        this.setState({userArr:users,loading:false});
      })
      .catch((error)=>{
        console.log(error);
        this.setState({userArr:[],loading:false});
      });
  }

  showDetail(key)
  {
    userCollection.doc(key).get()
      .then((doc)=>{
        console.log(doc.data());
      })
      .catch((error)=>{
        console.log(error);
      });
  }

  addTps(caleg=null,jumlahSuara=null,nama=null){
    caleg = Math.floor((Math.random() * 20) + 1);
    jumlahSuara = Math.floor((Math.random() * 1000) + 1);
    nama = "TPS "+Math.floor((Math.random() * 20) + 1);
    this.setState({loading:true});
    tpsCollection.add({
      caleg:caleg,
      jumlahSuara:jumlahSuara,
      nama:nama,
      created_at:FirestoreTimestamp  
    })
    .then(()=>{
      this.setState({loading:false});
    })
    .catch(err=>{
      console.log(err);
    });
  }

  addUser()
  {
    this.setState({loading:true});
    userCollection.add({
      name:Math.random().toString(36).substring(7),
      address:Math.random().toString(36).substring(7),
      created_at:FirestoreTimestamp  
    })
    .then(()=>{
      this.loadData();
    })
    .catch((err)=>{
      console.log(err);
    });
  }

  render() {
    const mapped_users = this.state.dataTps.map(data =>
        <li key={data.id} className="App-li">
            <a href={data.nama} onClick={(e)=>{e.preventDefault();this.showDetail(data.id)}}>
                {data.nama}
            </a>
        </li>
    );    
    console.log(this.state.dataTps);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {
            this.state.loading?
                <p>Loading</p>
                :
                <ul>
                    {mapped_users}
                </ul>
        }
        {/* <button onClick={()=>this.addUser()}>
          Add User
        </button> */}
        <button onClick={()=>this.addTps()}>
          Add Random TPS Data
        </button>
      </div>
    );
  }
}

export default App;
