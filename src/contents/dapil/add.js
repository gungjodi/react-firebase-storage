import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Button, TextField, Grid, InputLabel, Select, MenuItem, FormControl} from '@material-ui/core';
import {FirestoreDB} from '../../FirebaseApp';
import styles from './style';

const dapilCollection = FirestoreDB.collection('dapil');
const wilayahBaliCollection = FirestoreDB.collection('wilayahBali');
const kecamatanDocs = wilayahBaliCollection.where("type","==","kecamatan");


class AddDapilScreen extends Component{
    constructor(){
        super();
        this.state={
            dapil:'',
            lokasi:{
                kabupaten : {
                    code:'03',
                    id:'03',
                    name:'BADUNG',
                    type:'kabupaten'
                },
                kecamatan :{
                    code:'',
                    id:'',
                    name:'',
                    type:''
                }
            },
            loading:false,
            dir:"",
            dataKabupaten:[{
                code:'03',
                id:'03',
                name:'BADUNG',
                type:'kabupaten'
            }],
            dataKecamatan:[],
        }
    }

    componentDidMount() {
        this.getDataKecamatan(this.state.lokasi.kabupaten.code);
        this.setState({dir:"/"+this.props.match.url.split('/')[1]});
        if(this.props.match.params.type==="edit") {
            this.setState({loading:true});
            this.getData(this.props.match.params.id);
        }
    }


    getDataKecamatan = (kab) =>{
        let data=[];
        kecamatanDocs.get()
            .then((snapshot)=>{
                snapshot.forEach(doc=>{
                    let kodeArr = doc.id.split('.');
                    if(kodeArr[0]===kab){
                        data.push({
                            code:doc.data().code,
                            id:doc.id,
                            name:doc.data().name,
                            type:doc.data().type
                        })
                    }
                });
                this.setState({dataKecamatan:data});
            })
            .catch(err=>{
                console.log(err);
            });
    };

    getData = (id)=>{
        dapilCollection.doc(id).get().then(doc=>{
            this.setState({
                dapil:doc.data().dapil,
                lokasi:doc.data().lokasi,
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
        this.setState({
            lokasi:{
                kabupaten:this.state.lokasi.kabupaten,
                [event.target.name]:JSON.parse(event.target.value)
            }
        })
    };

    onSubmit = (e) => {
        e.preventDefault();
        if(this.state.lokasi==="" || this.state.nomor==="" || this.state.kabupaten==="" || this.state.kecamatan==="" || this.state.kelurahan==="") {
            alert("Mohon lengkapi semua data");
            return false;
        }

        const data = {
            dapil:parseInt(this.state.dapil,10),
            lokasi:this.state.lokasi
        };

        if(this.props.match.params.type === "add"){
            dapilCollection.add(data).then(()=>{
                this.props.history.push(this.state.dir,{back:true});
            })
            .catch(err=>{
                alert("Gagal menyimpan data");
            });
        }
        if(this.props.match.params.type==="edit"){
            dapilCollection.doc(this.props.match.params.id).update(data).then(()=>{
                this.props.history.push(this.state.dir,{back:true});
            }).catch(err=>alert("Gagal menyimpan data"));
        }
    };

    render(){
        const {classes,match} = this.props;
        return(
            <div className="App">
                <h2>{match.params.type==="add"?"Tambah ":"Edit "} Data Dapil</h2>
                {!this.state.loading && (
                    <form onSubmit={this.onSubmit} className={classes.formContainer}>
                        <TextField
                            required
                            type="number"
                            min="1"
                            id="dapil"
                            label="Daerah Pilihan"
                            placeholder="Daerah Pilihan"
                            value={this.state.dapil}
                            margin="normal"
                            onChange={this.onTextInputChange}
                        />
                        <FormControl className={classes.dense} required>
                            <InputLabel htmlFor="kabupaten-required">Kabupaten</InputLabel>
                            <Select
                                value={JSON.stringify(this.state.lokasi.kabupaten)}
                                onChange={this.onSelectChange}
                                name="kabupaten"
                                readOnly
                                inputProps={{
                                    id: 'kabupaten-required',
                                }}
                                className={classes.selectEmpty}
                            >
                                {
                                    this.state.dataKabupaten.map((data,key)=>
                                        <MenuItem key={key} value={JSON.stringify(data)}>{data.name}</MenuItem>
                                    )
                                }
                            </Select>
                        </FormControl>
                        <FormControl className={classes.dense} required>
                            <InputLabel htmlFor="kecamatan-required">Kecamatan</InputLabel>
                            <Select
                                value={JSON.stringify(this.state.lokasi.kecamatan)}
                                onChange={this.onSelectChange}
                                name="kecamatan"
                                inputProps={{
                                    id: 'kecamatan-required',
                                }}
                                className={classes.selectEmpty}
                            >
                                {
                                    this.state.dataKecamatan.map((data,key)=>
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

AddDapilScreen.propTypes = {
    classes : PropTypes.object.isRequired
};

export default withStyles(styles,{ withTheme: true })(AddDapilScreen);