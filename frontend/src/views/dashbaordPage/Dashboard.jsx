import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import GetError from '../../components/errors/GetError';
import LoadingBox from '../../components/loading/LoadingBox';
import MessageBox from '../../components/messageBox/MessageBox';
import { myContext } from '../../components/storeProvider/StoreProvider';
import Chart from 'react-google-charts';
import './Dashboard.scss';

const DASHBOARD = {
  FETCH_REQUEST: 'FETCH_REQUEST',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAIL: 'FETCH_FAIL',
};

// reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case DASHBOARD.FETCH_REQUEST:
      return { ...state, loading: true };
    case DASHBOARD.FETCH_SUCCESS:
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case DASHBOARD.FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Dashboard = () => {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(myContext);
  const { userInfo } = state;

  // useEffect to get all users
  useEffect(() => {
    const fetchUsers = async () => {
      const settings = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      dispatch({ type: DASHBOARD.FETCH_REQUEST });
      try {
        const { data } = await axios.get(
          process.env.REACT_APP_SERVER_URL + '/api/orders/summary',
          settings
        );
        dispatch({ type: DASHBOARD.FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: DASHBOARD.FETCH_FAIL, payload: GetError(error) });
      }
    };
    fetchUsers();
  }, [userInfo]);

  return (
    <main className="dashboard-page">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <section className="dashboard-container">
        <h1 className="dashboar-title">Dashboard</h1>

        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <section className="summary-container">
            <article className="users">
              <h4 className="users-title">Users</h4>
              <p className="paragraph">
                {summary.users && summary.users[0]
                  ? summary.users[0].numUsers
                  : 0}
              </p>
            </article>
            <article className="orders">
              <h4 className="orders-title">Orders</h4>
              <p className="paragraph">
                {summary.orders && summary.users[0]
                  ? summary.orders[0].numOrders
                  : 0}
              </p>
            </article>
            <article className="sales">
              <h4 className="sales-title">Sales</h4>
              <p className="paragraph">
                $
                {summary.orders && summary.users[0]
                  ? summary.orders[0].totalSales.toFixed(2)
                  : 0}
              </p>
            </article>
          </section>
        )}
        {/* //! Chart diagram */}
      </section>
    </main>
  );
};

export default Dashboard;
