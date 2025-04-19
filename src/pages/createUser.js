import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../database/firebase";
import Navbar from "../components/navbar";

function CreateUser() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.email || !formData.password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    try {
      const createUser = httpsCallable(functions, "createUserAndNotify");
      await createUser(formData);

      setSuccessMsg("User created and email sent!");
      setErrorMsg("");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        address: "",
        city: "",
        state: "",
        country: "",
        zip: "",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.code === "already-exists") {
        setErrorMsg("That email is already registered.");
      } else {
        setErrorMsg("Failed to create user: " + error.message);
      }
      setSuccessMsg("");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto">
            <form
              className="row g-3 bg-light p-4 rounded shadow-sm"
              onSubmit={handleSubmit}
            >
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input type="text" className="form-control" id="firstName" value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input type="text" className="form-control" id="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" value={formData.password} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label htmlFor="address" className="form-label">Address</label>
                <input type="text" className="form-control" id="address" value={formData.address} onChange={handleChange} placeholder="1234 Main St" />
              </div>
              <div className="col-md-6">
                <label htmlFor="country" className="form-label">Country</label>
                <input type="text" className="form-control" id="country" value={formData.country} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="city" className="form-label">City</label>
                <input type="text" className="form-control" id="city" value={formData.city} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="state" className="form-label">State</label>
                <input type="text" className="form-control" id="state" value={formData.state} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="zip" className="form-label">Zip</label>
                <input type="text" className="form-control" id="zip" value={formData.zip} onChange={handleChange} />
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="gridCheck" />
                  <label className="form-check-label" htmlFor="gridCheck">They are over 18.</label>
                </div>
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100">Create Id.</button>
              </div>
              {successMsg && (
                <div className="alert alert-success col-12">{successMsg}</div>
              )}
              {errorMsg && (
                <div className="alert alert-danger col-12">{errorMsg}</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateUser;
