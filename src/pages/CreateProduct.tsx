import { useState } from "react";
import CreateProductForm from "../components/CreateProductForm";

function CreateProduct() {
  return (
    <main className="flex-1 py-4 px-2 lg:px-4">
      <div>
        <CreateProductForm />
      </div>
    </main>
  );
}

export default CreateProduct;
