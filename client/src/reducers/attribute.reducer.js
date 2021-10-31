const reducer = (state, action) => {
  switch (action.type) {
    case "confirmed": {
      return "confirmed";
    }
    case "active": {
      return "active";
    }
    case "recovered": {
      return "recovered";
    }
    case "deceased": {
      return "deceased";
    }
    case "tested": {
      return "tested";
    }
    case "vaccinated1": {
      return "vaccinated1";
    }
    case "vaccinated2": {
      return "vaccinated2";
    }
    default: {
      return state;
    }
  }
};

export default reducer;
