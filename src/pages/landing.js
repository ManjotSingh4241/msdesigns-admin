import { useNavigate } from "react-router-dom";

import Navbar from "../components/navbar";

function Landing() {
    const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto shadow-lg rounded">
            <h1>Welcome to MSdesigns-Admin</h1>
            <div className="d-grid flex-column align-items-center mx-auto  mt-5 mb-5 gap-4 col-12">
              <button
                className="btn btn-primary"
                style={{ height: "60px", fontSize: "18px" }}
                onClick={() => navigate("/ManageProducts")}
              >
                Manage Products
              </button>
              <button
                className="btn btn-warning"
                style={{ height: "60px", fontSize: "18px" }}
                onClick={() => navigate("/AccountRequests")}
              >
                Account Requests
              </button>
              <button
                className="btn btn-danger"
                style={{ height: "60px", fontSize: "18px" }}
                onClick={() => navigate("/DeleteAccounts")}
              >
                Manage Accounts
              </button>
              <button
                className="btn btn-success"
                style={{ height: "60px", fontSize: "18px" }}
                onClick={() => navigate("/CreateUser")}
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Landing;
