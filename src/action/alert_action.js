const ShowAlert = (alertType, Msg) => ({
  type: 'SHOW_ALERT',
  status: {
    type: alertType,
    msg: Msg,
  },
});

export default ShowAlert;
