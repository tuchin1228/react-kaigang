import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import firebase from 'firebase';

// import clsx from "clsx";
import { makeStyles, useTheme } from '@material-ui/core/styles';
// import Drawer from "@material-ui/core/Drawer";
import CssBaseline from '@material-ui/core/CssBaseline';
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
import List from '@material-ui/core/List';
// import Typography from "@material-ui/core/Typography";
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from '@material-ui/core/ListItemText';
// import InboxIcon from "@material-ui/icons/MoveToInbox";
// import MailIcon from "@material-ui/icons/Mail";
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { getBoardName } from './action/action';
import drawerToggle from './action/drawer_action';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  iconStyle: {
    color: 'white',
  },
  drawerPaper: {
    width: drawerWidth,
    background: '#363636',
  },
  draweItem: {
    color: 'white',
    fontWeight: 600,
    textDecoration: 'none',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  LinkActive: {
    background: '#292929',
  },
}));

const Sidebar = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { dispatchdrawerToggle, dispatchgetBoardName } = props;
  const [open, setOpen] = React.useState(false);
  const { DrawerStatus } = props;
  const [board, setboard] = useState([]);
  const { boardname } = props;
  const location = useLocation();

  const ref = firebase.database().ref('/');

  const handleDrawerClose = () => {
    dispatchdrawerToggle();
  };

  useEffect(() => {
    dispatchgetBoardName(ref);
  }, [location]);

  useEffect(() => {
    const temparr = [];
    if (boardname) {
      boardname.data.forEach((item) => {
        const boardobj = {
          boardkey: item[0],
          boardname: item[1].board_name,
        };
        temparr.push(boardobj);
      });
      setboard(temparr);
    }
  }, [boardname]);

  useEffect(() => {
    setOpen(DrawerStatus);
  }, [DrawerStatus]);

  const toggleDrawer = () => () => {
    dispatchdrawerToggle();
  };
  return (
    <div className={classes.root}>
      <CssBaseline />

      <SwipeableDrawer
        className={classes.drawer}
        // fixed
        // variant="permanent"
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <p style={{ fontSize: '1.4em', color: '#ffaf36', fontWeight: 600 }}>
            看 板 名 稱
          </p>
          <IconButton onClick={handleDrawerClose} className={classes.iconStyle}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {board.map((item) => (
            <Link
              key={item.boardkey}
              to={`/${item.boardkey}`}
              className={classes.draweItem}

            >
              <ListItem button className={location.pathname === `/${item.boardkey}` ? classes.LinkActive : ''}>
                <ListItemText primary={item.boardname} />
              </ListItem>
            </Link>
          ))}
        </List>
      </SwipeableDrawer>
    </div>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    dispatchdrawerToggle: () => dispatch(drawerToggle()),
    dispatchgetBoardName: (ref) => dispatch(getBoardName(ref)),
  };
}

const mapStateToProps = (store) => ({
  DrawerStatus: store.drawerreducer,
  boardname: store.boardReducer.board,
});

Sidebar.propTypes = {
  DrawerStatus: PropTypes.bool.isRequired,
  boardname: PropTypes.shape({
    type: PropTypes.string,
    data: PropTypes.instanceOf(Array),
  }),
  dispatchdrawerToggle: PropTypes.func.isRequired,
  dispatchgetBoardName: PropTypes.func.isRequired,
};
Sidebar.defaultProps = {
  boardname: {
    type: '',
    data: [],
  },
};
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
