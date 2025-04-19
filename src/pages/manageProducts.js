import Navbar from "../components/navbar"
import Cards from "../components/cards"

function ManageProducts(){
    return(
        <>
        <Navbar/>
        <div className="container py-5">
        <div className="row">
          <div className="col-12 col-sm-10 col-md-8 col-lg-10 mx-auto shadow-lg rounded">
        <Cards/>
        </div></div></div>
        </>
    )
}
export default ManageProducts;