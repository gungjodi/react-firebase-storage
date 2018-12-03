import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Button, TextField, Grid, InputLabel, Select, MenuItem, FormControl} from '@material-ui/core';
import {FirestoreDB} from '../../FirebaseApp';
import styles from './style';

const tpsCollection = FirestoreDB.collection('tps');
const dapilCollection = FirestoreDB.collection('dapil');
const wilayahBaliCollection = FirestoreDB.collection('wilayahBali');
const kelurahanDocs = wilayahBaliCollection.where("type",">=","kelurahan");
const desaDoc = wilayahBaliCollection.where("type","<=","desa");


class AddTpsScreen extends Component{
    constructor(){
        super();
        this.state={
            nomor:'',
            dapil:{},
            loading:false,
            dir:"",
            kelurahan:'',
            dataKelurahan:[],
            dataDapil:[]
        }
    }

    componentDidMount() {
        this.setState({dir:"/"+this.props.match.url.split('/')[1]});
        this.getDataDapil();
        if(this.props.match.params.type==="edit") {
            this.setState({loading:true});
            this.getData(this.props.match.params.id);
        }
    }

    getDataDapil(){
        let data=[];
        dapilCollection.orderBy("dapil").get().then(snapshot=>{
            snapshot.forEach(doc=>{
                data.push({
                    id:doc.id,
                    ...doc.data()
                });
            });
            this.setState({dataDapil:data});
        }).catch(err=>{
           console.log(err);
        });
    }

    getDataKelurahan = (kec) =>{
        let data=[];
        const getKelurahan = kelurahanDocs.get();
        const getDesa = desaDoc.get();
        Promise.all([getKelurahan,getDesa])
            .then(kelDesa=>{
                kelDesa.forEach(snapshot=>{
                    snapshot.forEach(doc =>{
                        let kodeArr = doc.id.split('.');
                        const kode = `${kodeArr[0]}.${kodeArr[1]}`;
                        if(kec===kode){
                            data.push({
                                id:doc.id,
                                ...doc.data()
                            })
                        }
                    });
                });
                this.setState({dataKelurahan:data});
            })
            .catch(err=>{
                console.log(err);
            });
    };

    getData = (id)=>{
        tpsCollection.doc(id).get().then(doc=>{
            this.setState({
                ...doc.data(),
                loading:false
            });
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

    onSelectChange = event => {
        this.setState({ [event.target.name]: event.target.value});
        if(event.target.name==="dapil")
        {
            const kec = JSON.parse(event.target.value).lokasi.kecamatan.code;
            this.getDataKelurahan(kec);
        }
    };

    onSubmit = (e) => {
        e.preventDefault();
        if(this.state.lokasi==="" || this.state.nomor==="" || this.state.kabupaten==="" || this.state.kecamatan==="" || this.state.kelurahan==="") {
            alert("Mohon lengkapi semua data");
            return false;
        }

        let lokasi = JSON.parse(this.state.dapil);
        lokasi.lokasi.kelurahan = JSON.parse(this.state.kelurahan);
        const data = {
            nomor:parseInt(this.state.nomor,10),
            dapil:lokasi
        };

        if(this.props.match.params.type === "add"){
            tpsCollection.add(data).then(()=>{
                this.props.history.push(this.state.dir,{back:true});
            })
            .catch(err=>{
                alert("Gagal menyimpan data");
            });
        }
        if(this.props.match.params.type==="edit"){
            tpsCollection.doc(this.props.match.params.id).update(data).then(()=>{
                this.props.history.push(this.state.dir,{back:true});
            }).catch(err=>alert("Gagal menyimpan data"));
        }
    };

    render(){
        const {classes,match} = this.props;
        return(
            <div className="App">
                <h2>{match.params.type==="add"?"Tambah ":"Edit "} Data TPS</h2>
                {!this.state.loading && (
                    <form onSubmit={this.onSubmit} className={classes.formContainer}>
                        <TextField
                            required
                            type="number"
                            min="1"
                            id="nomor"
                            label="Nomor TPS"
                            placeholder="Nomor TPS"
                            value={this.state.nomor}
                            margin="normal"
                            onChange={this.onTextInputChange}
                        />
                        <FormControl className={classes.dense} required>
                            <InputLabel htmlFor="dapil-required">Dapil</InputLabel>
                            <Select
                                value={JSON.stringify(this.state.dapil)}
                                onChange={this.onSelectChange}
                                name="dapil"
                                inputProps={{
                                    id: 'dapil-required',
                                }}
                                className={classes.selectEmpty}
                            >
                                {
                                    this.state.dataDapil.map((data,key)=>
                                        <MenuItem key={key} value={JSON.stringify(data)}>{`DAPIL ${data.dapil} - ${data.lokasi.kabupaten.name} - ${data.lokasi.kecamatan.name}`}</MenuItem>
                                    )
                                }
                            </Select>
                        </FormControl>
                        <FormControl className={classes.dense} required>
                            <InputLabel htmlFor="kelurahan-required">Desa/Kelurahan</InputLabel>
                            <Select
                                value={this.state.kelurahan}
                                onChange={this.onSelectChange}
                                name="kelurahan"
                                inputProps={{
                                    id: 'kelurahan-required',
                                }}
                                className={classes.selectEmpty}
                            >
                                {
                                    this.state.dataKelurahan.map((data,key)=>
                                        <MenuItem key={key} value={JSON.stringify(data)}>{data.name}</MenuItem>
                                    )
                                }
                            </Select>
                        </FormControl>
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

AddTpsScreen.propTypes = {
    classes : PropTypes.object.isRequired
};

export default withStyles(styles,{ withTheme: true })(AddTpsScreen);