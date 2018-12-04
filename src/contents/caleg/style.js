const styles = theme => ({
    formContainer : {
        display : 'flex',
        flexWrap : 'wrap',
        flexDirection : 'column',
        width : '75%',
        marginBottom : 20
    },
    dense : {
        marginTop : 20
    },
    formControl: {

    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    tableContentCell :{
        display:'flex',
        flexGrow:1,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    gridList:{
        display:'block'
    }
});

export default styles;