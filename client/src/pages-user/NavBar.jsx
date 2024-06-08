import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/st_logo.svg";
import Profile from "../assets/R.jpg";
import {
  FaThermometerHalf,
  FaLock,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

const NavBar = ({ tempData, tamperData, fallDetectData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropProfile, setIsDropProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const navigate = useNavigate();

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case "High Temperature":
      case "Low Temperature":
        return <FaThermometerHalf className="text-primary text-2xl mr-2" />;
      case "Fall Detected":
        return <FaExclamationTriangle className="text-primary text-2xl mr-2" />;
      case "Tamper Detected":
        return <FaShieldAlt className="text-primary text-2xl mr-2" />;
      default:
        return <FaLock className="text-primary text-2xl mr-2" />;
    }
  };

  const getAlertColor = (alertType) => {
    switch (alertType) {
      case "High Temperature":
        return "badge-danger";
      case "Low Temperature":
        return "badge-warning";
      case "Fall Detected":
        return "badge-info";
      case "Tamper Detected":
        return "badge-danger";
      default:
        return "badge-primary";
    }
  };

  const renderNotifications = () => {
    const alerts = [];

    tempData?.forEach((temp) => {
      if (temp.temperature > 30) {
        alerts.push({
          type: "High Temperature",
          criticality: "Critical",
          description: `High temperature detected: ${temp.temperature}°C in ${temp.luggage_custom_name}`,
          timestamp: temp.timestamp,
        });
      } else if (temp.temperature < 10) {
        alerts.push({
          type: "Low Temperature",
          criticality: "Warning",
          description: `Low temperature detected: ${temp.temperature}°C in ${temp.luggage_custom_name}`,
          timestamp: temp.timestamp,
        });
      }
    });

    tamperData?.forEach((tamper) => {
      alerts.push({
        type: "Tamper Detected",
        criticality: "Critical",
        description: `Tamper detected in ${tamper.luggage_custom_name}`,
        timestamp: tamper.timestamp,
      });
    });

    fallDetectData?.forEach((fall) => {
      alerts.push({
        type: "Fall Detected",
        criticality: "Info",
        description: `Fall detected in ${fall.luggage_custom_name}`,
        timestamp: fall.timestamp,
      });
    });

    return alerts.map((alert, index) => (
      <div key={index} className="card w-full bg-base-100 shadow-xl mb-2">
        <div className="card-body flex items-start">
          <div className="mr-4">{getAlertIcon(alert.type)}</div>
          <div className="flex-1">
            <h4 className="card-title text-base flex items-center">
              {alert.type}
              <div
                className={`badge ${getAlertColor(alert.type)} text-xs ml-2`}
              >
                {alert.criticality}
              </div>
            </h4>
            <p className="text-xs">{alert.description}</p>
            <p className="text-xs text-gray-500">
              {new Date(alert.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    ));
  };

  const handleLogout = () => {
    axios
      .get("http://localhost:3000/auth/logout")
      .then((res) => {
        if (res.data.status) {
          navigate("/sign-in");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleSideBar = () => setIsOpen(!isOpen);

  const handleDropProfile = () => setIsDropProfile(!isDropProfile);

  return (
    <>
      <div
        className="navbar fixed top-2 left-0 right-0 pr-3 pl-3 flex justify-evenly rounded-lg z-10 p-0 mx-auto shadow-md bg-[#020202a0] backdrop-blur-xl text-white"
        style={{ width: "98.90%" }}
      >
        <div className="sidebar fixed left-3 z-10 rounded-lg">
          <div className="navbar-start dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
              onClick={toggleSideBar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            {isOpen && (
              <ul className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow rounded-lg w-52 bg-[#020202a0]">
                <li>
                  <Link
                    to="/"
                    className="link no-underline"
                    onClick={toggleSideBar}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tracking"
                    className="link no-underline"
                    onClick={toggleSideBar}
                  >
                    Map
                  </Link>
                </li>
                <li>
                  <Link
                    to="/luggage"
                    className="link no-underline"
                    onClick={toggleSideBar}
                  >
                    Associated Luggage
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="link no-underline"
                    onClick={toggleSideBar}
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="navbar-center flex-1 justify-center">
          <div className="mr-0">
            <Link
              to="/"
              className="link btn btn-ghost text-sm md:text-xl no-underline flex items-center p-0"
            >
              <span>Luggage Live Tracking</span>
            </Link>
          </div>
          <div className="flex items-center ml-0">
            <span className="mx-1 text-xs">Powered by</span>
            <img src={Logo} alt="Secure Track" className="h-6" />
          </div>
        </div>

        <div className="">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setOpenNotif((prevState) => !prevState)}
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              onClick={handleDropProfile}
            >
              <div className="w-10 rounded-full">
                <img alt="Profile" src={Profile} />
              </div>
            </div>
            {isDropProfile && (
              <ul
                tabIndex={0}
                className="mt-3 z-20 p-2 shadow menu menu-sm dropdown-content rounded-box w-52 bg-[#020202a0]"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      {openNotif && (
        <div className="absolute top-16 right-0 w-96 bg-[#f2f5f8] shadow-lg rounded-lg z-10 p-4">
          <h3 className="text-lg font-medium mb-2">Notifications</h3>
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "400px", overflowX: "hidden" }}
          >
            {renderNotifications()}
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
