import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Button,TextField,Grid,FormControl,InputLabel,Select,MenuItem} from '@material-ui/core';
import {FirestoreDB} from '../../FirebaseApp';
import styles from './style';

const calegCollection = FirestoreDB.collection('caleg');
const partaiCollection = FirestoreDB.collection('partai');

class AddCalegScreen extends Component{
    constructor(){
        super();
        this.state={
            nama:"",
            noUrut:"",
            partai:{},
            dataPartai:[],
            labelWidth: 0,
            id:"",
            loading:false,
            dir:"",
            noUrutOld:""
        };
    }

    componentDidMount() {
        this.setState({dir:"/"+this.props.match.url.split('/')[1]});
        this.getDataPartai();
        if(this.props.match.params.type==="edit") {
            this.setState({loading:true});
            this.getData(this.props.match.params.id);
        }
    }

    handleBack = (e)=>{
        e.preventDefault();
        this.props.history.push(this.state.dir,{back:true});
    };

    getData = (id)=>{
        calegCollection.doc(id).get().then(doc=>{
            this.setState({...doc.data(),loading:false,noUrutOld:parseInt(doc.data().noUrut,10)});
        }).catch(err=>{
            console.log(err);
        });
    };

    getDataPartai = ()=>{
        let data = [];
        partaiCollection.get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                data.push({
                    id:doc.id,
                    nama:doc.data().nama
                });
            });
            this.setState({ dataPartai:data});
        })
        .catch(err=>{
            console.log(err)
        });
    };

    onTextInputChange = (e)=>{
        const value = e.target.value;
        const id = e.target.id;
        this.setState({
            [id]:value
        });
    };

    onSelectChange = event => {
        this.setState({ [event.target.name]: JSON.parse(event.target.value) });
    };

    onSubmit = (e) => {
        e.preventDefault();
        if(this.state.nama==="" || this.state.noUrut==="" || this.state.partai==={}){
            alert("Mohon lengkapi semua data");
            return false;
        }
        const noUrutegistered = {};

        const dataCaleg = {
            nama : this.state.nama,
            noUrut : parseInt(this.state.noUrut,10),
            partai: this.state.partai
        };

        calegCollection.get().then(caleg=>{
            caleg.forEach(doc=>{
                if( parseInt(doc.data().noUrut,10) === parseInt(this.state.noUrut,10) )
                {
                    if(parseInt(doc.data().noUrut,10) !== this.state.noUrutOld){
                        throw noUrutegistered;
                    }
                }
            });

            if(this.props.match.params.type === "add"){
                calegCollection.add(dataCaleg)
                    .then(()=>{
                        this.props.history.push(this.state.dir,{reRender:true});
                    })
                    .catch(err=>{
                        alert("Gagal menyimpan data");
                    });
            }
            if(this.props.match.params.type==="edit"){
                calegCollection.doc(this.props.match.params.id).set(dataCaleg)
                    .then(()=>{
                        this.props.history.push(this.state.dir,{back:true});
                    })
                    .catch(err=>alert("Gagal menyimpan data"));
            }
        }).catch(err=>{
            if(err===noUrutegistered){
                alert("Nomor urut sudah terdaftar");
            }
        });
    };

    render(){
        const {classes,match} = this.props;

        return(
            <div className="App">
                <h2>{match.params.type==="add"?"Tambah ":"Edit "} Data Caleg</h2>
                {!this.state.loading &&(
                    <form onSubmit={this.onSubmit} className={classes.formContainer}>
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
                        <FormControl className={classes.dense} required>
                            <InputLabel htmlFor="partai-required">Partai</InputLabel>
                            <Select
                                value={JSON.stringify(this.state.partai)}
                                onChange={this.onSelectChange}
                                name="partai"
                                inputProps={{
                                    id: 'partai-required',
                                }}
                                className={classes.selectEmpty}
                            >
                                {
                                    this.state.dataPartai.map((data,key)=>
                                        <MenuItem key={key} value={JSON.stringify(data)}>{data.nama}</MenuItem>
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

AddCalegScreen.propTypes = {
    classes : PropTypes.object.isRequired
};

export default withStyles(styles,{ withTheme: true })(AddCalegScreen);