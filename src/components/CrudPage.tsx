/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { ApolloError, ApolloQueryResult, DocumentNode, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { Box } from '@mui/material';
import { GridColDef, GridRowId } from '@mui/x-data-grid';
import CrudGrid from '../components/CrudGrid';

interface CrudPageProps {
  columns: GridColDef[];
  rows: any[];
  refetch: () => Promise<ApolloQueryResult<any>>;
  FormComponent: any;
  createMutation: DocumentNode;
  updateMutation: DocumentNode;
  deleteMutation: DocumentNode;
}

export default function CrudPage({
  columns,
  rows,
  refetch,
  FormComponent,
  createMutation,
  updateMutation,
  deleteMutation
}: CrudPageProps) {
  const [createItem] = useMutation(createMutation);
  const [updateItem] = useMutation(updateMutation);
  const [deleteItem] = useMutation(deleteMutation);
  const [editItem, setEditItem] = useState(undefined);
  const [open, setOpen] = useState(false);

  const openFormModal = () => {
    setOpen(true);
  };

  const closeFormModal = () => {
    setEditItem(undefined);
    setOpen(false);
    refetch();
  };

  const handleCreate = async (body: any) => {
    try {
      return await createItem({ variables: body });
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error(err.graphQLErrors[0].message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    }
  };

  const handleUpdate = async (id: string, body: any) => {
    try {
      return await updateItem({ variables: { id, ...body } });
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error(err.graphQLErrors[0].message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    }
  };

  const handleDelete = async (id: GridRowId) => {
    try {
      await deleteItem({ variables: { id } });
      refetch();
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error(err.graphQLErrors[0].message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    }
  };

  const handleEdit = (id: GridRowId) => {
    setEditItem(rows.find((item: any) => item.id === id));
    setOpen(true);
  };

  return (
    <Box sx={{ width: '100%', padding: { sm: 3 } }}>
      <CrudGrid
        rows={rows}
        columns={columns}
        handleAdd={openFormModal}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
      <FormComponent
        open={open}
        handleClose={closeFormModal}
        handleCreate={handleCreate}
        handleUpdate={handleUpdate}
        edit={editItem}
      />
    </Box>
  );
}
