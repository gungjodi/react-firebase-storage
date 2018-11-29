import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Button,TextField,Grid} from '@material-ui/core';
import {FirestoreDB} from '../../FirebaseApp';
import styles from './style';

const calegCollection = FirestoreDB.collection('caleg');

class AddCalegScreen extends Component{
    constructor(){
        super();
        this.state={
            nama:"",
            noUrut:"",
        }
    }

    handleBack = (e)=>{
        e.preventDefault();
        this.props.history.push(this.props.index,{reRender:true});
    }

    onTextInputChange = (e)=>{
        const value = e.target.value;
        const id = e.target.id;
        this.setState({
            [id]:value
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        if(this.state.nama==="" || this.state.noUrut===""){
            alert("Mohon lengkapi semua data");
            return false;
        }
        const noUrutegistered = {};

        calegCollection.get().then(caleg=>{
            caleg.forEach(doc=>{
                if(parseInt(doc.data().noUrut)===parseInt(this.state.noUrut)) throw noUrutegistered;
            });
            const dataCaleg = {
                nama : this.state.nama,
                noUrut : parseInt(this.state.noUrut)
            } 
            calegCollection.add(dataCaleg)
            .then(()=>{
                this.props.history.push(this.props.index,{reRender:true});
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
        const {classes} = this.props;
        return(
            <div className="App">
                <h2>Tambah Data Caleg</h2>
                <form onSubmit={this.onSubmit} className={classes.formContainer} noValidate autoComplete="off">
                    <TextField 
                        required
                        id="nama" 
                        label="Nama Caleg"
                        value={this.state.nama} 
                        margin="normal"
                        onChange={this.onTextInputChange}
                    />
                    <TextField 
                        required
                        type="number"
                        min="1" 
                        id="noUrut" 
                        label = "No Urut" 
                        value={this.state.noUrut} 
                        margin="normal"
                        onChange={this.onTextInputChange}
                    />
                    <Grid 
                        container
                        spacing={16}
                        justify="space-evenly"
                        alignItems="center"
                        className={classes.dense}
                    >
                        <Button type="submit" variant="contained" color="primary">Simpan</Button>
                        <Button variant="contained" onClick={this.handleBack}>Batal</Button>
                    </Grid>
                </form>
                
            </div>
        );
    }
}

AddCalegScreen.propTypes = {
    classes : PropTypes.object.isRequired
}

export default withStyles(styles,{ withTheme: true })(AddCalegScreen);