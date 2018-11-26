import React, { Component } from 'react';
import './App.css';
import {FirestoreDB,FirestoreTimestamp} from './FirebaseApp';

const tpsCollection = FirestoreDB.collection('tps');
const calegCollection = FirestoreDB.collection('caleg');

class Home extends Component {
  constructor()
  {
    super();
    this.state = {
      dataTps:[],
      loading:true,
      dataCaleg:[]
    }
  }

  componentDidMount()
  {
    this.getCaleg();
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
          let removeIndex = this.state.dataTps.map(function(item) { return item.id; }).indexOf(change.doc.id);
          this.state.dataTps.splice(removeIndex, 1);
        }
        if(change.type==="modified"){
          let modifiedIndex = this.state.dataTps.map(function(item) { return item.id; }).indexOf(change.doc.id);
          const newData = change.doc.data().dataSuara;
          let newState = Object.assign({}, this.state);
          newState.dataTps[modifiedIndex].dataSuara = newData;
          this.setState(newState);
        }
      });
      data.sort(function(a, b) {
          return a.tps - b.tps;
      });
      this.setState({dataTps:data,loading:false});
    });
  }

  showDetail(key)
  {
    tpsCollection.doc(key).get()
      .then((doc)=>{
        console.log(doc.data());
      })
      .catch((error)=>{
        console.log(error);
      });
  }

  getCaleg(){
    let data = [];
    calegCollection.orderBy('noUrut').get().then((querySnapshot)=>{
      querySnapshot.forEach(snapshot=>{
        data.push({
          id:snapshot.id,
          ...snapshot.data()
        })
      });
      this.setState({dataCaleg:data});
    })
    .catch(err=>{
      console.log(err);
    });
  }

  addTps(caleg=null,jumlahSuara=null,tps=null){
    tps = Math.floor((Math.random() * 20) + 1);
    let dataSuara = [];
    for(let i=0;i<this.state.dataCaleg.length;i++){
      const data = {
        caleg : this.state.dataCaleg[i].nama,
        jumlahSuara : Math.floor((Math.random() * 1000) + 1),
      };
      dataSuara.push(data);
    }    
    tpsCollection.add({
      tps:tps,
      dataSuara:dataSuara,
      created_at:FirestoreTimestamp  
    })
    .then(()=>{
      this.setState({loading:false});
    })
    .catch(err=>{
      console.log(err);
    });
  }

  deleteTps(id){
    tpsCollection.doc(id).delete().then((doc)=>{
      console.log(doc," DELETED");
    })
    .catch(err=>{
      console.log(err);
    });
  }

  tpsSuara(id,tps,caleg,jumlahSuara){
    console.log(id,tps,caleg,jumlahSuara);
  }

  render() {
  
    const mappedDataCaleg = this.state.dataCaleg.map((data)=>
      <th key={data.noUrut}>
        {data.nama}
      </th>
    );

    const mappedDataTps = this.state.dataTps.map(data=>
      <tr key={data.id}>
        <th>
          TPS {data.tps}
        </th>
        {
          data.dataSuara.map(suara=>
            <td key={suara.caleg +"-"+ data.tps} title={"Caleg "+suara.caleg +" di TPS "+ data.tps +" memperoleh total "+ suara.jumlahSuara +" suara"} onClick={()=>this.tpsSuara(data.id,data.tps,suara.caleg,suara.jumlahSuara)}>
              {suara.jumlahSuara}
            </td>
          )
        }
        <td><a title="Delete data" href={data.id} onClick={(e)=>{e.preventDefault();this.deleteTps(data.id)}}>x</a></td>
      </tr>
    );
    
    return (
      <div className="App">
        <div style={{margin:'50px'}}>
        {
            this.state.loading?
                <p>Loading</p>
                :
                <table border="1">
                  <thead>
                    <tr>
                      <th></th>
                      {mappedDataCaleg}
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                      {mappedDataTps}
                  </tbody>
                </table>
        }
        </div>
        
        <button onClick={()=>this.addTps()}>
          Add Random TPS Data
        </button>
      </div>
    );
  }
}

export default Home;
