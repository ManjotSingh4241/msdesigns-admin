import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../database/firebase"; // Make sure `functions` is exported from firebase.js
import Navbar from "../components/navbar";
import { Card } from "react-bootstrap";

function AccountRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "newMembers"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(data);
      } catch (error) {
        console.error("Error fetching account requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (req) => {
    const createUserAndNotify = httpsCallable(functions, "createUserAndNotify");

    const tempPassword = Math.random().toString(36).slice(-8);

    try {
      await createUserAndNotify({
        email: req.email,
        password: tempPassword,
        firstName: req.firstName,
        lastName: req.lastName,
      });

      // Delete request from Firestore after approval
      await deleteDoc(doc(db, "newMembers", req.id));

      // Remove from UI
      setRequests((prev) => prev.filter((r) => r.id !== req.id));

      alert("✅ User approved & email sent.");
    } catch (error) {
      console.error("Error approving user:", error);
      alert("❌ Approval failed.");
    }
  };

  const handleDecline = async (id) => {
    try {
      await deleteDoc(doc(db, "newMembers", id));
      setRequests((prev) => prev.filter((r) => r.id !== id));
      alert("Request declined and removed.");
    } catch (error) {
      console.error("Error declining request:", error);
    }
    
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h3 className="mb-4 text-center">New Account Requests</h3>
        <div className="row">
          {requests.length > 0 ? (
            requests.map((req) => (
              <div className="col-md-6 col-lg-4 mb-4" key={req.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>
                      {req.firstName} {req.lastName}
                    </Card.Title>
                    <Card.Text>
                      <strong>Email:</strong> {req.email}
                      <br />
                      <strong>Address:</strong> {req.address}
                      <br />
                      <strong>City:</strong> {req.city}
                      <br />
                      <strong>State:</strong> {req.state}
                      <br />
                      <strong>Country:</strong> {req.country}
                      <br />
                      <strong>Zip:</strong> {req.zip}
                    </Card.Text>
                    <Card.Footer className="d-flex justify-content-between">
                      <button
                        className="btn btn-success"
                        onClick={() => handleApprove(req)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDecline(req.id)}
                      >
                        Decline
                      </button>
                    </Card.Footer>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <div className="text-center">No account requests found.</div>
          )}
        </div>
      </div>
    </>
  );
}

export default AccountRequests;
