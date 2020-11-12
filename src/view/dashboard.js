import React, { useState } from 'react';
import styled from 'styled-components';
// import firebase from "firebase";

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DASHBOARD_MANAGE from './dashboard_manage';
import AddBoard from './dashboard_add';

const useStyles = makeStyles(() => ({
  contain: {
    // height: "calc(98vh - 64px)",
    margin: '1vh 0.5vw 0 0.5vw',
    background: 'white',
    padding: '1vh 1vw',
    borderRadius: '5px',
    // paddingBottom: "20vh",
    height: '90%',
    overflow: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  indicator: {
    backgroundColor: '#13b3ff',
  },
}));
const TabsStyle = styled(Tabs)`
  border: 1px solid #003679;
  /* position: absolute;
  top: 0;
  left: 0; */
  /* transform: translateX(-105%); */
  button {
    min-width: 120px;
    font-size: 1.2em;
    letter-spacing: 1.2px;
    span {
      color: white;
      font-weight: 400;
    }
  }
  button.Mui-selected {
    background: #235fcc;
    color: white;
  }
`;

function Dashboard() {
  const classes = useStyles();

  const [nowIndex, setNowIndex] = useState(0);
  const handleChange = (event, newValue) => {
    setNowIndex(newValue);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100%',
      }}
    >
      <TabsStyle
        // indicatorColor="primary"
        classes={{ indicator: classes.indicator }}
        orientation="vertical"
        variant="scrollable"
        value={nowIndex}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
        style={{ marginTop: '1vh' }}
      >
        <Tab label="新增看板" />
        <Tab label="文章管理" />
      </TabsStyle>
      <Container
        maxWidth="md"
        className={classes.contain}
        style={{ position: 'relative' }}
      >
        <div>
          <AddBoard nowIndex={nowIndex} defaultIndex={0} />
          <DASHBOARD_MANAGE nowIndex={nowIndex} defaultIndex={1} />
        </div>
      </Container>
      <div style={{ minWidth: '120px' }} />
    </div>
  );
}

export default Dashboard;
