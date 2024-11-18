export const fetchData = () => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_DATA_REQUEST' });
    try {
      const response = await fetch('https://api.example.com/data'); // Replace with your API
      const data = await response.json();
      dispatch({ type: 'FETCH_DATA_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_DATA_FAILURE', payload: error.message });
    }
  };
};
