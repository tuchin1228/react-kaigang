const submitRes = (ref, timestamp, resContent) => () => {
  // console.log(ref,timestamp, resContent)
  ref.child(timestamp).set(resContent);
};

export default submitRes;
