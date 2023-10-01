import { Button, Grid } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import {
  GridRowsProp,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowId,
  GridRowModel,
  GridToolbar
} from '@mui/x-data-grid';

interface EditToolbarProps {
  handleAdd: () => void;
}

function EditToolbar({ handleAdd }: EditToolbarProps) {
  return (
    <GridToolbarContainer
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Button
        startIcon={<Add fontSize="small" />}
        onClick={handleAdd}
        size="small"
        variant="outlined">
        Add New
      </Button>
      <GridToolbar />
    </GridToolbarContainer>
  );
}

interface CrudGridProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  handleAdd: () => void;
  handleEdit: (id: GridRowId) => void;
  handleDelete: (id: GridRowId) => void;
  processRowUpdate: (newRow: GridRowModel) => GridRowModel;
}

export default function CrudGrid({
  rows,
  columns,
  handleAdd,
  handleEdit,
  handleDelete,
  processRowUpdate
}: CrudGridProps) {
  const allColumns: GridColDef[] = [
    ...columns,
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key="edit"
            aria-label="Edit Row"
            icon={<Edit />}
            label="Edit"
            className="textPrimary"
            onClick={() => handleEdit(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="delete"
            aria-label="Delete Row"
            icon={<Delete />}
            label="Delete"
            onClick={() => handleDelete(id)}
            color="inherit"
          />
        ];
      }
    }
  ];

  return (
    <Grid
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary'
        },
        '& .textPrimary': {
          color: 'text.primary'
        }
      }}>
      <DataGrid
        rows={rows}
        columns={allColumns}
        rowSelection={false}
        disableColumnMenu
        disableDensitySelector
        disableRowSelectionOnClick
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar
        }}
        slotProps={{
          toolbar: { handleAdd }
        }}
      />
    </Grid>
  );
}
