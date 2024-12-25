useEffect(() => {
  const loadPackages = async () => {
    setLoading(true);
    try {
      const packagesData = isp !== '' && await dispatch(fetchPackages(isp));
      console.log(packagesData, isp, 'fetched packages');
      // Convert packages object to array and add id to each package
      const packagesArray = Object.entries(packagesData).map(([id, pkg]) => ({ ...pkg, id }));
      setPackages(packagesArray);
      console.log(packagesArray);
    } catch (error) {
      console.error('Error loading packages:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  loadPackages();
}, [isp, dispatch]);

const isLoading = useSelector((state) => state.isp.loading);


useEffect(() => {
  const localIsps = localStorage.getItem(`isps_${selectedDealerId}`);
  if (localIsps) {
    dispatch({
      type: 'FETCH_ISPS_SUCCESS',
      payload: JSON.parse(localIsps),
    });
  } else {
    dispatch(fetchISPs(selectedDealerId));
  }
}, [dispatch]);
