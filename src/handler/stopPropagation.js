const stopPropagation = event => {
  event.stopPropagation();
  event.nativeEvent.stopPropagation();
};

export default stopPropagation;
