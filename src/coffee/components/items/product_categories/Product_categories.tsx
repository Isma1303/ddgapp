import { useEffect, useRef, useState } from "react";
import { MainLayout } from "../../../../ddg/components/Layout/MainLayout";
import { useProductCategories } from "../../../hooks/useProductCategories";
import type {
  IProductCategory,
  IProductCategoryNew,
} from "../../../interfaces/product_categorie.interface";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

export const ProductCategories = () => {
  const emptyCategory: IProductCategoryNew = {
    product_category_nm: "",
    sort_order: 0,
    is_active: true,
  };

  const {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useProductCategories();
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );
  const [category, setCategory] = useState<IProductCategoryNew>(emptyCategory);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const openNew = () => {
    setSubmitted(false);
    setEditingCategoryId(null);
    setCategory(emptyCategory);
    setCategoryDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setCategoryDialog(false);
  };

  const editCategory = (rowData: IProductCategory) => {
    setSubmitted(false);
    setEditingCategoryId(rowData.product_category_id);
    setCategory({
      product_category_nm: rowData.product_category_nm,
      sort_order: rowData.sort_order,
      is_active: rowData.is_active,
    });
    setCategoryDialog(true);
  };

  const saveCategory = async () => {
    setSubmitted(true);

    if (!category.product_category_nm.trim()) {
      return;
    }

    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, category);
      } else {
        await createCategory(category);
      }

      await fetchCategories();

      toast.current?.show({
        severity: "success",
        summary: "Exitoso",
        detail: editingCategoryId
          ? "Categoría actualizada exitosamente"
          : "Categoría creada exitosamente",
      });

      setCategoryDialog(false);
      setEditingCategoryId(null);
      setCategory(emptyCategory);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al guardar la categoría",
      });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      await fetchCategories();

      toast.current?.show({
        severity: "success",
        summary: "Exitoso",
        detail: "Categoría eliminada exitosamente",
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al eliminar la categoría",
      });
    }
  };

  const isActiveBody = (rowData: IProductCategory) => {
    const icon = rowData.is_active ? "pi pi-verified" : "pi pi-times-circle";
    const style = rowData.is_active
      ? { backgroundColor: "#E0F9E8", color: "#1B9C31", alignItems: "center" }
      : { backgroundColor: "#FFEAEA", color: "#EF4444", alignItems: "center" };

    return (
      <Tag
        value={rowData.is_active ? "Activa" : "Inactiva"}
        icon={icon}
        style={style}
        rounded
      />
    );
  };

  const actionBodyTemplate = (rowData: IProductCategory) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          severity="success"
          aria-label="Editar"
          onClick={() => editCategory(rowData)}
          style={{ height: "2rem", width: "2rem" }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          severity="danger"
          aria-label="Eliminar"
          onClick={() => handleDeleteCategory(rowData.product_category_id)}
          style={{ height: "2rem", width: "2rem" }}
        />
      </div>
    );
  };

  const categoryDialogFooter = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={hideDialog}
      />
      <Button label="Guardar" icon="pi pi-check" onClick={saveCategory} />
    </>
  );

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl font-semibold"></span>
      <Button icon="pi pi-plus" label="Agregar Categoría" onClick={openNew} />
    </div>
  );

  return (
    <MainLayout>
      <h3 className="text-2xl font-bold">Categorías de Productos</h3>
      <Toast ref={toast} />
      <DataTable
        dataKey="product_category_id"
        value={categories}
        paginator
        rows={10}
        showGridlines
        rowsPerPageOptions={[10, 20, 50]}
        header={header}
      >
        <Column field="product_category_nm" header="Nombre" />
        <Column field="sort_order" header="Orden" />
        <Column field="is_active" header="Estado" body={isActiveBody} />
        <Column
          header="Acciones"
          body={actionBodyTemplate}
          exportable={false}
          style={{ width: "9rem" }}
        />
      </DataTable>

      <Dialog
        visible={categoryDialog}
        style={{ width: "30rem" }}
        breakpoints={{ "992px": "75vw", "576px": "95vw" }}
        header={editingCategoryId ? "Editar Categoría" : "Nueva Categoría"}
        modal
        className="p-fluid"
        footer={categoryDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="product_category_nm" className="font-bold">
            Nombre
          </label>
          <InputText
            id="product_category_nm"
            value={category.product_category_nm}
            onChange={(e) =>
              setCategory({ ...category, product_category_nm: e.target.value })
            }
            required
            autoFocus
            className={
              submitted && !category.product_category_nm.trim()
                ? "p-invalid"
                : ""
            }
          />
          {submitted && !category.product_category_nm.trim() && (
            <small className="p-error">El nombre es obligatorio.</small>
          )}
        </div>

        <div className="field">
          <label htmlFor="sort_order" className="font-bold">
            Orden
          </label>
          <InputNumber
            id="sort_order"
            value={category.sort_order}
            min={0}
            useGrouping={false}
            onValueChange={(e) =>
              setCategory({ ...category, sort_order: Number(e.value) || 0 })
            }
            className="w-full"
          />
        </div>

        <div className="field flex gap-2 align-items-center">
          <Checkbox
            inputId="is_active"
            checked={category.is_active}
            onChange={(e) =>
              setCategory({ ...category, is_active: !!e.checked })
            }
          />
          <label htmlFor="is_active" className="font-bold mb-0">
            Activa
          </label>
        </div>
      </Dialog>
    </MainLayout>
  );
};
