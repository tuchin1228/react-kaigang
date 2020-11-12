import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
// import Badge from "@material-ui/core/Badge";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
// import MailIcon from "@material-ui/icons/Mail";
// import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from '@material-ui/icons/MoreVert';
import CreateIcon from '@material-ui/icons/Create';
import Tooltip from '@material-ui/core/Tooltip';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Button from '@material-ui/core/Button';

import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Container from '@material-ui/core/Container';
// import Box from "@material-ui/core/Box";
import {
  Link,
} from 'react-router-dom';
import ShowAlert from './action/alert_action';
// import Snackbar from "@material-ui/core/Snackbar";
// import MuiAlert from "@material-ui/lab/Alert";
// import Slide from "@material-ui/core/Slide";

import { SignOut, IsOnline } from './action/login_action';
import drawerToggle from './action/drawer_action';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: '#1e71d8',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    letterSpacing: ' 1.4px',
    fontWeight: ' 600',
    fontSize: ' 1.8em',
    fontFamily: 'sans-serif',
    textShadow: ' 0px 3px 0px #004577',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(1),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  searchbtn: {
    background: '#4086de',
    '&:hover': {
      background: '#0459c3',
    },
  },
}));

function ElevationScroll(props) {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const Navbar = (props) => {
  // const { DrawerStatus } = props;
  const {
    OnlineUser, dispatchdrawerToggle, dispatchSignOut, dispatchIsOnline, dispatchShowAlert, history,
  } = props;
  const [onlineUser, setonlineUser] = useState({});
  const [queryValue, serQuery] = useState('');
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handlekeydown = (e) => {
    if (e.key === 'Enter') {
      if (queryValue.trim() !== '') {
        history.push(`/search?query=${queryValue}`);
      }
    }
  };
  const handleDrawerOpen = () => {
    dispatchdrawerToggle();
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const toSignOut = () => {
    dispatchSignOut();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handlequery = (e) => {
    serQuery(e.target.value);
  };
  // const goSearch = () => {
  //   props.history.push(`/search?query=${queryValue}`);
  // };

  useEffect(() => {
    dispatchIsOnline();
    // console.log('nav', OnlineUser.username == null);
  }, []);

  useEffect(() => {
    setonlineUser(OnlineUser);
  }, [OnlineUser]);

  // const [openAlert, setOpenAlert] = useState(false);
  const goPost = () => {
    if (onlineUser === '') {
      // setOpenAlert(true);
      dispatchShowAlert('error', '登入才能Po文!');
      // props.dispatch(ShowAlert('error', '登入才能Po文!'));
      history.push('/login');
    } else {
      history.push('/post');
    }
  };
  // const handleClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setOpenAlert(false);
  // };
  // useEffect(() => {
  //   setonlineUser(OnlineUser);
  // }, [OnlineUser.username]);

  const menuId = 'primary-search-account-menu';

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      id={menuId}
      keepMounted
      getContentAnchorEl={null}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {OnlineUser.username == null ? (
        <div style={{ outline: 'none' }}>
          <MenuItem disabled>尚未登入</MenuItem>
          <MenuItem
            onClick={() => {
              history.push('/login');
            }}
          >
            登入
          </MenuItem>
        </div>
      ) : (
        <div style={{ outline: 'none' }}>
          <MenuItem disabled>{onlineUser.username}</MenuItem>
          <MenuItem onClick={toSignOut}>登出</MenuItem>
        </div>
      )}
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => {
        props.history.push('/dashboard');
      }}
      >
        <IconButton
          aria-label="show 17 new notifications"
          color="inherit"

        >
          <DashboardIcon />
        </IconButton>
        <p> 後台管理</p>
      </MenuItem>
      <MenuItem onClick={goPost}>
        <IconButton
          aria-label="show 17 new notifications"
          color="inherit"

        >
          <CreateIcon />
        </IconButton>
        <p>Po文</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>會員資訊</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      {/* <Snackbar
        open={openAlert}
        autoHideDuration={1500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert severity="error" variant="filled" onClose={handleClose}>
          登入才能Po文!
        </MuiAlert>
      </Snackbar> */}
      <ElevationScroll>
        <AppBar position="fixed" className={classes.appBar}>
          <Container maxWidth="lg">
            <Toolbar variant="dense">
              <Tooltip title="選擇看板" arrow>
                <IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>

              <Typography className={classes.title} variant="h6" noWrap>
                <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                  KAIGANG
                </Link>
              </Typography>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="標題搜尋"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  onKeyDown={handlekeydown}
                  onChange={handlequery}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </div>
              <Link
                to={{ pathname: '/search', search: `?query=${queryValue}` }}
                style={{
                  color: 'white',
                  fontSize: '1.1em',
                  textDecoration: 'none',
                  pointerEvents: queryValue.trim() === '' ? 'none' : 'auto',
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  className={classes.searchbtn}
                >
                  搜尋
                </Button>
              </Link>
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                {/* <IconButton aria-label="show 4 new mails" color="inherit">
                  <Badge badgeContent={4} color="secondary">
                    <MailIcon />
                  </Badge>
                </IconButton> */}
                <Tooltip title="後台" arrow>
                  <IconButton
                    aria-label="show 17 new notifications"
                    color="inherit"
                    onClick={() => {
                      props.history.push('/dashboard');
                    }}
                  >
                    <DashboardIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Po文" arrow>
                  <IconButton
                    aria-label="show 17 new notifications"
                    color="inherit"
                    onClick={goPost}
                  >
                    <CreateIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="會員" arrow>
                  <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                </Tooltip>
              </div>

              <div className={classes.sectionMobile}>
                <IconButton
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </div>
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};
const mapStateToProps = (store) => ({
  DrawerStatus: store.drawerreducer,
  OnlineUser: store.loginReducer,
});
function mapDispatchToProps(dispatch) {
  return {
    dispatchdrawerToggle: () => dispatch(drawerToggle()),
    dispatchSignOut: () => dispatch(SignOut()),
    dispatchIsOnline: () => dispatch(IsOnline()),
    dispatchShowAlert: (alertType, Msg) => dispatch(ShowAlert(alertType, Msg)),
  };
}

Navbar.propTypes = {
  OnlineUser: PropTypes.shape({
    uid: '',
    username: '',
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  dispatchdrawerToggle: PropTypes.func.isRequired,
  dispatchSignOut: PropTypes.func.isRequired,
  dispatchIsOnline: PropTypes.func.isRequired,
  dispatchShowAlert: PropTypes.func.isRequired,
};
Navbar.defaultProps = {
  OnlineUser: {},
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));

// export default Navbar;
