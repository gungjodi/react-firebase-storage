import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import {FirestoreDB} from '../../FirebaseApp';
const calegCollection = FirestoreDB.collection('caleg');

class CalegScreen extends Component{
    state = {
        dataCaleg : []
    }

    componentDidMount(){
        this.mounted=true;
        this.getDataCaleg();
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    getDataCaleg = () => {
        let data = [];
        calegCollection.orderBy('noUrut').get().then((caleg)=>{
            caleg.forEach((doc)=>{
                data.push({
                    id:doc.id,
                    ...doc.data()
                });
            });
            if(this.mounted){
                this.setState({ dataCaleg:data});
            }
        })
        .catch(err=>{
            console.log(err)
        });

    }

    render(){
        console.log(this.props.match);
        const mappedDataCaleg = this.state.dataCaleg.map((data,key)=>
            <tr key={key}>
                <td>{data.noUrut}</td><td>{data.nama}</td>
            </tr>
        );
        
        const renderDataCaleg = ({match})=>(
            <div>
                <h2>Data Caleg</h2>
                <table border="1" style={{width:'75%'}}>
                  <thead>
                    <tr>
                      <th style={{width:'20%'}}>No Urut</th><th>Nama</th>
                    </tr>
                  </thead>
                  <tbody>
                      {mappedDataCaleg}
                  </tbody>
                </table>
            </div>
        );

        const renderAddData = ({match})=>(
            <div>
                <h2>{match.params.type}</h2>
            </div>
        );

        return(
            <Switch> 
                <Route exact path={this.props.match.path} render={renderDataCaleg}/>
                <Route path={this.props.match.path + "/:type"} render={renderAddData}/>
            </Switch>
        );
    }
}

export {AddCalegScreen} from './add';
export default CalegScreen;