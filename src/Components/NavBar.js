import React, {useState, useEffect} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

export const NavBar = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [user, setUser] = useState([])
    const open = Boolean(anchorEl);

    useEffect(()=> {
        fetch('/user').then(response=> {
            if(response.ok){
                return response.json()
            }
        }).then(user => setUser(user))
    },[])

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleMaxiumBidAmount = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setUser({'user': user.user, 'max_bid' : e.target.value})
        }
    }

    const setUser1 = () => {
        fetch(`/set-user`,{
            method: 'POST',
            body: JSON.stringify({
                id: 'user1'
            })
        }).then(response => response.json())
        window.location.reload();
    }

    const setUser2 = () => {
        fetch(`/set-user`,{
            method: 'POST',
            body: JSON.stringify({
                id: 'user2'
            })
        }).then(response => response.json())
        window.location.reload();
    }

    const setMaxiumBidAmount = () => {
        fetch(`/set-max-bid`,{
            method: 'POST',
            body: JSON.stringify({
                'max_bid': user.max_bid
            })
        }).then(response => response.json())
    }
    
    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Typography variant="h6" noWrap>
                Antique Boutique
              </Typography>
              
            </Toolbar>
            </AppBar>
            <div className={classes.toolbar} />
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                paper: classes.drawerPaper,
                }}
                anchor="right"
            >
            <div className={classes.toolbar} />
            <Divider />
            <IconButton
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <AccountCircle /> 
                {user.user}
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={setUser1}>USER1</MenuItem>
                <MenuItem onClick={setUser2}>USER2</MenuItem>
            </Menu>
            <Divider />
            <FormControl fullWidth className={classes.margin} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-amount">Automatic bid maximum total</InputLabel>
                <OutlinedInput
                    value={user.max_bid}
                    onChange={handleMaxiumBidAmount}
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                />
            </FormControl>
            <Button variant="contained" onClick={setMaxiumBidAmount}><b>SAVE MAXIMUM</b></Button>
          </Drawer>
        </div>
    )
}
