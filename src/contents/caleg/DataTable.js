import React from 'react';
import MaterialTable from 'material-table';

const DataTable = (props)=> (
    <MaterialTable
        columns={[
            { title: 'No', field: 'idCaleg',type: 'numeric'},
            { title: 'Nama Caleg', field: 'namaCaleg' },
            { title: 'Partai', field:'namaPartai' },
            { title: 'Dapil', field:'dapil' },
        ]}
        data={props.data}
        title={props.title}
        options={
            {
                pageSize:20,
                pageSizeOptions:[20, 40, 60]
            }
        }
    />
);

export default DataTable;