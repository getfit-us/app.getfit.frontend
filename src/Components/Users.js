
import { Button, TextField, MenuItem, Typography, Grid, Paper, Avatar, Fab, CircularProgress, Backdrop, Modal, Fade, Checkbox } from "@mui/material";
import { useState, useEffect, useMemo } from 'react';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { DevTool } from "@hookform/devtools";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import { Add, Close, SendRounded, Person, PersonOutlined, AdminPanelSettings, Save, AdminPanelSettingsOutlined, FitnessCenter, FitScreenOutlined, FitnessCenterOutlined } from '@mui/icons-material';


import { Box } from "@mui/system";



const Users = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState();
    const [pageSize, setPageSize] = useState(10);
    const [open, setOpen] = useState(false);
    const handleModal = () => setOpen(prev => !prev);
    const axiosPrivate = useAxiosPrivate();
    const { register, formState: { errors }, handleSubmit, getValues, watch, reset, control, setValue } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });
    const watchusers = watch(['cur_client', 'firstname']);




    const columns = useMemo(() => [
        { field: "_id", hide: true },
        {
            field: "avatar_url", headerName: "Avatar",width: 60,  renderCell: (params) => {

                return (
                    <Avatar src={params.row.avatar_url} >{params.row.firstname[0].toUpperCase()} </Avatar>)
            },

            sortable: false,
            filterable: false
        },
        { field: "firstname", headerName: "First Name", width: 120, editable: true },
        { field: "lastname", headerName: "Last Name", width: 130, editable: true },
        { field: "email", headerName: "Email", width: 170, editable: true },
        { field: "phone", headerName: "Phone Number", width: 130, editable: true },
        {
            field: "roles", headerName: "Roles", width: 130, renderCell: (params) => {
                    

                return (
                    <>

                        <Checkbox {...register("roleUser")} checkedIcon={<Person />} icon={<PersonOutlined />}  name='roleUser' defaultChecked={params.row.roles.User ? true : false}/>
                        <Checkbox {...register("roleAdmin")}  name='roleAdmin' checkedIcon={<AdminPanelSettings />} icon={<AdminPanelSettingsOutlined />}  defaultChecked={params.row.roles.Admin ? true : false}/>
                        <Checkbox {...register("roleTrainer")}  name='roleTrainer' checkedIcon={<FitnessCenter />} icon={<FitnessCenterOutlined />}  defaultChecked={params.row.roles.Trainer ? true : false}/>





                    </>
                )


            }
        },
        {
            field: "delete", headerName: "Delete", width: 60, height: 90, renderCell: (params) => {


                return (

                    <>

                        <Fab aria-label="add" color='error' size="small">
                            <DeleteIcon onClick={() => onDelete(params.row._id)} />
                            {loading && <CircularProgress />}
                        </Fab>
                    </>
                )



            }
        },
        {
            field: "modify", headerName: "Modify", width: 60, renderCell: (params) => {

                return (
                    <>
                        <Fab aria-label="add" color='secondary' size="small">
                            <Save onClick={() => onUpdate(params.row)} />
                        </Fab>
                    </>
                )
            }
        }



    ], [users]);



    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        const controller = new AbortController();
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', { signal: controller.signal });
                // console.log(response.data);
                isMounted && setUsers(response.data);
                setLoading(false)


            }
            catch (err) {
                console.log(err);
                setError(err);
                //save last page so they return back to page before re auth. 
                // navigate('/login', {state: {from: location}, replace: true});
            }
        }
        getUsers();
        return () => {
            isMounted = false;
            controller.abort();
        }

    }, [])


    const onSubmit = async (data) => {
        let isMounted = true;

        const controller = new AbortController();
        try {
            const response = await axiosPrivate.post('/users', data, { signal: controller.signal });
            // console.log(response.data);
            setUsers([...users, response.data]);
            reset();
            setLoading(false)
        }
        catch (err) {
            console.log(err);
        }
        return () => {
            isMounted = false;
            controller.abort();
        }

    }



    const onDelete = async (id) => {
        // if (!values.deleteExercise.checked  )  return false; 
        let isMounted = true;
        setLoading(true);

        const controller = new AbortController();
        try {
            const response = await axiosPrivate.delete(`/users/${id}`, { signal: controller.signal });
            //   console.log(response.data);
            reset();
            setLoading(false);
            setUsers(users.filter((user) => user._id !== id));
        }
        catch (err) {
            console.log(err);
        }
        return () => {
            isMounted = false;
            controller.abort();
        }

    }

    const onUpdate = async (data) => {
       const values = getValues();
    console.log(values.roleAdmin.length)

       if (values.roleAdmin.length) {
        data.roles.Admin = 10;
       } else if (!values.roleAdmin.length) {
        data.roles.Admin = "";
       }

       if (values.roleUser.length) {
        data.roles.User = 1;
       }  else if (!values.roleUser.length) {
        data.roles.User = "";
       }

       if (values.roleTrainer.length) {
        data.roles.Trainer = 2;
       } else if (!values.roleTrainer.length) {
        data.roles.Trainer = "";
       }
       
       
        // if (!values.deleteExercise.checked  )  return false; 
        let isMounted = true;
        setLoading(true);


        const controller = new AbortController();
        try {
            const response = await axiosPrivate.put('/users', data, { signal: controller.signal });
            // console.log(response.data);
            const updatedUsers = users.map(user => user._id === response.data._id ? response.data : user)
            setUsers(updatedUsers);
            reset();
            setLoading(false);
        }
        catch (err) {
            console.log(err);
        }
        return () => {
            isMounted = false;
            controller.abort();
        }

    }
    // Update to DataGrid component

    return (

        <Paper  >

         




            <Grid container mt={3} justifyContent='center' alignItems='center'>
                <Grid item xs={12} md={12} lg={12}>
                    <Typography variant='h4' >Users </Typography>
                </Grid>
                <Grid item xs={12}>
                    {error && <p>{error}</p>}
                    {loading && <CircularProgress />}

                    {users && <DataGrid
                        rows={users}
                        columns={columns}
                        rowsPerPageOptions={[5, 10, 20]}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        checkboxSelection
                        getRowId={(users) => users._id}
                        getRowSpacing={params => ({
                            top: params.isFirstVisible ? 0 : 5,
                            bottom: params.isLastVisible ? 0 : 5
                        })}
                        autoHeight
                        sx={{ mt: 2, mb: 2 }}
                    />}
                </Grid>
            </Grid>
            <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style.modal}>



            <form onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }} autoComplete='false'>
                <Grid container spacing={1} justifyContent='center' alignItems='center' >


                    <Grid item xs={12}>
                        <Typography variant='h4' alignSelf='center'>Add User</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField {...register("firstname")} name="firstname" type='text' label='user First Name' fullWidth />

                    </Grid>

                    <Grid item xs={12}>
                        <TextField {...register("lastname")} name="lastname" type='text' label='user Last Name' fullWidth />

                    </Grid>

                    <Grid item xs={12}>
                        <TextField {...register("email")} name="email" type='email' label='Email' fullWidth />

                    </Grid>
                    <Grid item xs={12}>
                        <TextField {...register("phone")} name="phone" type='phone' label='Phone' fullWidth />

                    </Grid>





                    <Grid item xs={12} mb={3}>
                        <Button variant="contained" type='submit'  fullWidth>ADD User</Button>

                    </Grid>
                    <Grid item xs={12}   >
                    <Button onClick={handleModal} color="error" variant="contained" size='large' sx={{  mb: 2 }} endIcon={<Close />} fullWidth>Close</Button>
                  </Grid>


                </Grid>

            </form >
            </Box >
          </Fade>
        </Modal>
           

            <DevTool control={control} />

            <Grid item sx={{ display: 'flex', justifyContent: 'flex-end', margin: 2 }}><Fab >
            <Add onClick={handleModal} />
          </Fab></Grid>
        </Paper >


    )
}







const style = {

    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        mb: 2
    }
};










export default Users;