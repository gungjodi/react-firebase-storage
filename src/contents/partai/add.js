import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Button,TextField,Grid} from '@material-ui/core';
import {FirestoreDB} from '../../FirebaseApp';
import styles from './style';

const partaiCollection = FirestoreDB.collection('partai');
const calegCollection = FirestoreDB.collection('caleg');

class AddPartaiScreen extends Component{
    constructor(){
        super();
        this.state={
            nama:"",
            id:"",
            loading:false,
            dir:""
        }
    }

    componentDidMount() {
        this.setState({dir:"/"+this.props.match.url.split('/')[1]});
        if(this.props.match.params.type==="edit") {
            this.setState({loading:true});
            this.getData(this.props.match.params.id);
        }

    }

    getData = (id)=>{
        partaiCollection.doc(id).get().then(doc=>{
            this.setState({nama:doc.data().nama,loading:false});
        }).catch(err=>{
            console.log(err);
        });
    };

    handleBack = (e)=>{
        e.preventDefault();
        this.props.history.push(this.state.dir,{back:true});
    };

    onTextInputChange = (e)=>{
        const value = e.target.value;
        const id = e.target.id;
        this.setState({
            [id]:value
        });
    };

    onSubmit = (e) => {
        e.preventDefault();
        if(this.state.nama==="") {
            alert("Mohon lengkapi semua data");
            return false;
        }
        if(this.props.match.params.type === "add"){
            partaiCollection.add({nama:this.state.nama}).then(()=>{
                this.props.history.push(this.state.dir,{back:true});
            })
            .catch(err=>{
                alert("Gagal menyimpan data");
            });
        }
        if(this.props.match.params.type==="edit"){
            partaiCollection.doc(this.props.match.params.id).set({nama:this.state.nama}).then(()=>{
                calegCollection.where('partai.id','==',this.props.match.params.id).get().then(caleg=>{
                    caleg.forEach(doc=>{
                        calegCollection.doc(doc.id).update({partai:{id:this.props.match.params.id,nama:this.state.nama}})
                    })
                }).catch(err=>console.log(err));
                this.props.history.push(this.state.dir,{back:true});
            }).catch(err=>alert("Gagal menyimpan data"));
        }

    };

    render(){
        const {classes,match} = this.props;
        return(
            <div className="App">
                <h2>{match.params.type==="add"?"Tambah ":"Edit "} Data Partai</h2>
                {!this.state.loading && (
                    <form onSubmit={this.onSubmit} className={classes.formContainer}>
                        <TextField
                            required
                            id="nama"
                            label="Nama Partai"
                            value={this.state.nama}
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
                )}
            </div>
        );
    }
}

AddPartaiScreen.propTypes = {
    classes : PropTypes.object.isRequired
};

export default withStyles(styles,{ withTheme: true })(AddPartaiScreen);