import { useEffect, useMemo, useRef, useState } from "react";
import { MainLayout } from "../../../ddg/components/Layout/MainLayout";
import { useProductCategories } from "../../hooks/useProductCategories";
import { useProducts } from "../../hooks/useProducts";
import type {
  IProduct,
  IProductNew,
} from "../../interfaces/products.interface";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

export const Products = () => {
  const emptyProduct: IProductNew = {
    product_nm: "",
    product_description: "",
    stock: 0,
    product_price: 0,
    product_category_id: 0,
    is_active: true,
  };

  const { categories, fetchCategories } = useProductCategories();
  const { loading, products, fetchProducts, create, update, remove } =
    useProducts();
  const [productDialog, setProductDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [product, setProduct] = useState<IProductNew>(emptyProduct);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const categoryMap = useMemo(() => {
    return new Map(
      categories.map((category) => [
        category.product_category_id,
        category.product_category_nm,
      ]),
    );
  }, [categories]);

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: category.product_category_nm,
        value: category.product_category_id,
      })),
    [categories],
  );

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat("es-GT", {
        style: "currency",
        currency: "GTQ",
        minimumFractionDigits: 2,
      }),
    [],
  );

  const openNew = () => {
    setSubmitted(false);
    setEditingProductId(null);
    setProduct({
      ...emptyProduct,
      product_category_id: categories[0]?.product_category_id ?? 0,
    });
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const editProduct = (rowData: IProduct) => {
    setSubmitted(false);
    setEditingProductId(rowData.product_id);
    setProduct({
      product_nm: rowData.product_nm,
      product_description: rowData.product_description,
      stock: rowData.stock,
      product_price: rowData.product_price,
      product_category_id: rowData.product_category_id,
      is_active: rowData.is_active,
    });
    setProductDialog(true);
  };

  const saveProduct = async () => {
    setSubmitted(true);

    if (!product.product_nm.trim() || !product.product_category_id) {
      return;
    }

    try {
      if (editingProductId) {
        await update(editingProductId, product);
      } else {
        await create(product);
      }
      await fetchProducts();

      toast.current?.show({
        severity: "success",
        summary: "Exitoso",
        detail: editingProductId
          ? "Producto actualizado exitosamente"
          : "Producto creado exitosamente",
      });

      setProductDialog(false);
      setEditingProductId(null);
      setProduct({
        ...emptyProduct,
        product_category_id: categories[0]?.product_category_id ?? 0,
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al guardar el producto",
      });
    }
  };

  const handleDeleteProduct = async (product_id: number) => {
    try {
      await remove(product_id);
      await fetchProducts();
      toast.current?.show({
        severity: "success",
        summary: "Exitoso",
        detail: "Producto eliminado exitosamente",
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al eliminar el producto",
      });
    }
  };

  const categoryBody = (rowData: IProduct) => {
    return categoryMap.get(rowData.product_category_id) ?? "Sin categoría";
  };

  const priceBody = (rowData: IProduct) => {
    const rawPrice = Number(rowData.product_price);
    const safePrice = Number.isFinite(rawPrice) ? rawPrice : 0;
    return priceFormatter.format(safePrice);
  };

  const isActiveBody = (rowData: IProduct) => {
    const icon = rowData.is_active ? "pi pi-verified" : "pi pi-times-circle";
    const style = rowData.is_active
      ? { backgroundColor: "#E0F9E8", color: "#1B9C31", alignItems: "center" }
      : { backgroundColor: "#FFEAEA", color: "#EF4444", alignItems: "center" };

    return (
      <Tag
        value={rowData.is_active ? "Activo" : "Inactivo"}
        icon={icon}
        style={style}
        rounded
      />
    );
  };

  const actionBodyTemplate = (rowData: IProduct) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          severity="success"
          aria-label="Editar"
          onClick={() => editProduct(rowData)}
          style={{ height: "2rem", width: "2rem" }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          severity="danger"
          aria-label="Eliminar"
          onClick={() => handleDeleteProduct(rowData.product_id)}
          style={{ height: "2rem", width: "2rem" }}
        />
      </div>
    );
  };

  const productDialogFooter = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={hideDialog}
      />
      <Button label="Guardar" icon="pi pi-check" onClick={saveProduct} />
    </>
  );

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl font-semibold"></span>
      <Button
        icon="pi pi-plus"
        label="Agregar Producto"
        onClick={() => openNew()}
      />
    </div>
  );

  return (
    <MainLayout>
      <h3 className="text-2xl font-bold">Productos</h3>
      <Toast ref={toast} />
      <DataTable
        dataKey="product_id"
        value={products}
        paginator
        rows={10}
        showGridlines
        rowsPerPageOptions={[10, 20, 50]}
        loading={loading}
        header={header}
      >
        <Column field="product_nm" dataType="text" header="Nombre" />
        <Column
          field="product_description"
          dataType="text"
          header="Descripción"
        />
        <Column field="stock" header="Stock" />
        <Column field="product_price" header="Precio" body={priceBody} />
        <Column
          field="product_category_id"
          header="Categoría"
          body={categoryBody}
        />
        <Column field="is_active" header="Activo" body={isActiveBody} />
        <Column
          header="Acciones"
          body={actionBodyTemplate}
          exportable={false}
          style={{ width: "9rem" }}
        />
      </DataTable>

      <Dialog
        visible={productDialog}
        style={{ width: "34rem" }}
        breakpoints={{ "992px": "75vw", "576px": "95vw" }}
        header={editingProductId ? "Editar Producto" : "Nuevo Producto"}
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="product_nm" className="font-bold">
            Nombre
          </label>
          <InputText
            id="product_nm"
            value={product.product_nm}
            onChange={(e) =>
              setProduct({ ...product, product_nm: e.target.value })
            }
            required
            autoFocus
            className={
              submitted && !product.product_nm.trim() ? "p-invalid" : ""
            }
          />
          {submitted && !product.product_nm.trim() && (
            <small className="p-error">El nombre es obligatorio.</small>
          )}
        </div>

        <div className="field">
          <label htmlFor="product_description" className="font-bold">
            Descripción
          </label>
          <InputText
            id="product_description"
            value={product.product_description}
            onChange={(e) =>
              setProduct({ ...product, product_description: e.target.value })
            }
          />
        </div>

        <div className="field">
          <label htmlFor="product_category_id" className="font-bold">
            Categoría
          </label>
          <Dropdown
            id="product_category_id"
            value={product.product_category_id}
            options={categoryOptions}
            placeholder="Seleccione una categoría"
            className={
              submitted && !product.product_category_id ? "p-invalid" : ""
            }
            onChange={(event: DropdownChangeEvent) =>
              setProduct({
                ...product,
                product_category_id: Number(event.value) || 0,
              })
            }
          />
          {submitted && !product.product_category_id && (
            <small className="p-error">La categoría es obligatoria.</small>
          )}
        </div>

        <div className="grid">
          <div className="col-12 md:col-6 field">
            <label htmlFor="stock" className="font-bold">
              Stock
            </label>
            <InputNumber
              id="stock"
              value={product.stock}
              min={0}
              useGrouping={false}
              onValueChange={(e) =>
                setProduct({ ...product, stock: Number(e.value) || 0 })
              }
              className="w-full"
            />
          </div>

          <div className="col-12 md:col-6 field">
            <label htmlFor="product_price" className="font-bold">
              Precio
            </label>
            <InputNumber
              id="product_price"
              value={product.product_price}
              min={0}
              mode="currency"
              currency="GTQ"
              locale="es-GT"
              onValueChange={(e) =>
                setProduct({ ...product, product_price: Number(e.value) || 0 })
              }
              className="w-full"
            />
          </div>
        </div>

        <div className="field flex gap-2 align-items-center">
          <Checkbox
            inputId="is_active"
            checked={product.is_active}
            onChange={(e) => setProduct({ ...product, is_active: !!e.checked })}
          />
          <label htmlFor="is_active" className="font-bold mb-0">
            Activo
          </label>
        </div>
      </Dialog>
    </MainLayout>
  );
};
