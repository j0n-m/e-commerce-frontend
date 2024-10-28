import { Helmet } from "react-helmet-async";
import CreateProductForm from "../components/CreateProductForm";

function CreateProduct() {
  return (
    <main className="flex-1 py-4 px-2 lg:px-4">
      <Helmet>
        <title>Cyber Den: Add product</title>
      </Helmet>
      <div>
        <CreateProductForm />
      </div>
    </main>
  );
}

export default CreateProduct;
