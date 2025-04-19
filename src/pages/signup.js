import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../database/firebase"; // make sure db is exported
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import NavbarSignup from "../components/navbar-signup";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Role check from Firestore
      const roleRef = doc(db, "roles", user.uid);
      const roleSnap = await getDoc(roleRef);

      if (roleSnap.exists() && roleSnap.data().role === "admin") {
        navigate("/Landing"); // ✅ allow access
      } else {
        await auth.signOut(); // ❌ deny access
        setError("Access denied. You are not an admin.");
      }
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <>
      <NavbarSignup />
      <div className="container py-5">
        <div className="row">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto shadow-lg rounded">
            <form
              className="row g-3 bg-light p-4 rounded shadow-sm"
              onSubmit={handleSubmit}
            >
              <div className="col-12">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {error && (
                <div className="col-12">
                  <div className="alert alert-danger py-1">{error}</div>
                </div>
              )}

              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100">
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;

