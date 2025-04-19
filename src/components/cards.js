import { useEffect, useState } from "react";
import { db } from "../database/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// import { Link } from "react-router-dom";
import { Card} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/cards.css";

function Cards() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productData);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    getProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts((prev) => prev.filter((product) => product.id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="row">
      {products.map((product) => (
        <div className="col-md-4 mb-4" key={product.id}>
          <Card className="h-100 shadow-sm card-hover">
            <button
              className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
              style={{ zIndex: 1 }}
              onClick={() => handleDelete(product.id)}
            >
              ×
            </button>
            {product.imageUrl && (
              <Card.Img
                variant="top"
                src={product.imageUrl}
                alt={product.title}
                style={{ objectFit: "cover", maxHeight: 500, marginTop: "5%" }}
                // style={{ maxHeight: 500, marginTop: "5%" }}
              />
            )}
            <Card.Body className="text-center">
              <Card.Title>{product.title}</Card.Title>
              <Card.Text>{product.description}</Card.Text>
              <Card.Text>
                <strong>${product.price}</strong>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default Cards;
