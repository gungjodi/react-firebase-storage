import React, { Component } from 'react';
import {Button} from '@material-ui/core';
import {FirestoreDB} from '../../FirebaseApp';

const calegCollection = FirestoreDB.collection('caleg');

class AddCalegScreen extends Component{
    constructor(){
        super();
        this.state={
            nama:"",
            noUrut:"",
        }
    }

    onTextInputChange(e){
        const value = e.target.value;
        const id = e.target.id;
        this.setState({
            [id]:value
        });
    }

    onSubmit(){
        if(this.state.nama==="" || this.state.noUrut===""){
            alert("Mohon lengkapi semua data")
        }
        const noUrutegistered = {};

        calegCollection.get().then(caleg=>{
            caleg.forEach(doc=>{
                if(doc.data().noUrut===this.state.noUrut) throw noUrutegistered;
            });
            const dataCaleg = {
                nama : this.state.nama,
                noUrut : this.state.noUrut
            } 
            calegCollection.add(dataCaleg)
            .then(()=>{
                alert("Berhasil disimpan");
            })
            .catch(err=>{
                alert("Gagal menyimpan data");
            });
        })
        .catch(err=>{
            if(err===noUrutegistered){
                alert("Nomor urut sudah terdaftar");
            }
        });
    }

    render(){
        return(
            <div className="App">
                <h2>Data Caleg</h2>
                <input type="text" id="nama" placeholder="Nama Caleg" value={this.state.nama} onChange={(e)=>this.onTextInputChange(e)}/>
                <br/>
                <input type="number" min="1" id="noUrut" placeholder="No Urut" value={this.state.noUrut} onChange={(e)=>this.onTextInputChange(e)}/>
                <br/>
                <Button onClick={()=>this.onSubmit()}>Simpan</Button>

            </div>
        );
    }
}

export default AddCalegScreen;