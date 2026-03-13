import { useEffect, useMemo, useRef, useState } from "react";
import { MainLayout } from "../../../ddg/components/Layout/MainLayout";
import { useProducts } from "../../hooks/useProducts";
import { useSales } from "../../hooks/useSales";
import { Button } from "primereact/button";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { useScreenService } from "../../../system/shared/services/screen.service";
import type { IProduct } from "../../interfaces/products.interface";
import type { ISaleLineNew } from "../../interfaces/sale_lines.interface";
import "./SalesModule.css";

interface IDraftSaleLine {
  product_id: number;
  product_nm: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

const dateFormatter = new Intl.DateTimeFormat("es-GT", {
  dateStyle: "medium",
  timeStyle: "short",
});

const moneyFormatter = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  minimumFractionDigits: 2,
});

const buildLocalDateKey = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const SalesModule = () => {
  const toast = useRef<Toast>(null);
  const { sizes } = useScreenService();

  const { products, fetchProducts } = useProducts();
  const { sales, saleLines, loading, fetchSalesData, createSaleWithLines } =
    useSales();

  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState("");
  const [draftLines, setDraftLines] = useState<IDraftSaleLine[]>([]);

  const isXSmall = sizes["screen-x-small"];
  const isSmall = sizes["screen-small"];
  const isMedium = sizes["screen-medium"];
  const isLarge = sizes["screen-large"];

  const isMobile = isXSmall || isSmall;

  useEffect(() => {
    fetchProducts();
    fetchSalesData();
  }, []);

  const normalizedProducts = useMemo(() => {
    return products.map((product) => ({
      ...product,
      product_id: Number(product.product_id),
      product_price: Number(product.product_price || 0),
      is_active: Boolean(product.is_active),
    }));
  }, [products]);

  const productMap = useMemo(() => {
    return new Map(
      normalizedProducts.map((product) => [
        Number(product.product_id),
        product,
      ]),
    );
  }, [normalizedProducts]);

  const productOptions = useMemo(() => {
    return normalizedProducts
      .filter((product) => product.is_active)
      .map((product) => ({
        label: `${product.product_nm} (${moneyFormatter.format(product.product_price)})`,
        value: Number(product.product_id),
      }));
  }, [normalizedProducts]);

  const availableProduct = useMemo<IProduct | null>(() => {
    return productMap.get(Number(selectedProductId)) ?? null;
  }, [productMap, selectedProductId]);

  const totalDraft = useMemo(() => {
    return draftLines.reduce(
      (accumulator, line) => accumulator + line.line_total,
      0,
    );
  }, [draftLines]);

  const todayKey = buildLocalDateKey(new Date());
  const todaySales = useMemo(() => {
    return sales.filter((sale) => {
      const saleDate = new Date(sale.sold_at);
      if (Number.isNaN(saleDate.getTime())) {
        return false;
      }

      return buildLocalDateKey(saleDate) === todayKey;
    });
  }, [sales, todayKey]);

  const revenueToday = useMemo(() => {
    return todaySales.reduce(
      (accumulator, sale) => accumulator + Number(sale.total_amount || 0),
      0,
    );
  }, [todaySales]);

  const averageTicket = useMemo(() => {
    if (sales.length === 0) {
      return 0;
    }

    const grandTotal = sales.reduce(
      (accumulator, sale) => accumulator + Number(sale.total_amount || 0),
      0,
    );

    return grandTotal / sales.length;
  }, [sales]);

  const topProduct = useMemo(() => {
    const quantitiesByProduct = new Map<number, number>();

    saleLines.forEach((line) => {
      const current = quantitiesByProduct.get(line.product_id) ?? 0;
      quantitiesByProduct.set(
        line.product_id,
        current + Number(line.quantity || 0),
      );
    });

    let topProductId = 0;
    let topQuantity = 0;

    quantitiesByProduct.forEach((currentQuantity, productId) => {
      if (currentQuantity > topQuantity) {
        topQuantity = currentQuantity;
        topProductId = productId;
      }
    });

    if (!topProductId) {
      return "Sin datos";
    }

    return productMap.get(topProductId)?.product_nm ?? "Producto sin nombre";
  }, [productMap, saleLines]);

  const recentSales = useMemo(() => {
    return [...sales]
      .sort(
        (first, second) =>
          new Date(second.sold_at).getTime() -
          new Date(first.sold_at).getTime(),
      )
      .slice(0, 8);
  }, [sales]);

  const handleAddLine = () => {
    if (!availableProduct) {
      toast.current?.show({
        severity: "warn",
        summary: "Producto no disponible",
        detail: "Selecciona un producto valido para agregar al resumen.",
      });
      return;
    }

    if (quantity < 1) {
      toast.current?.show({
        severity: "warn",
        summary: "Cantidad invalida",
        detail: "La cantidad debe ser mayor o igual a 1.",
      });
      return;
    }

    const lineTotal = quantity * Number(availableProduct.product_price || 0);

    setDraftLines((previous) => {
      const existingLine = previous.find(
        (line) => line.product_id === availableProduct.product_id,
      );

      if (!existingLine) {
        return [
          ...previous,
          {
            product_id: availableProduct.product_id,
            product_nm: availableProduct.product_nm,
            quantity,
            unit_price: Number(availableProduct.product_price || 0),
            line_total: lineTotal,
          },
        ];
      }

      return previous.map((line) => {
        if (line.product_id !== availableProduct.product_id) {
          return line;
        }

        const mergedQuantity = line.quantity + quantity;
        return {
          ...line,
          quantity: mergedQuantity,
          line_total: mergedQuantity * line.unit_price,
        };
      });
    });

    setQuantity(1);
  };

  const handleRemoveLine = (productId: number) => {
    setDraftLines((previous) =>
      previous.filter((line) => line.product_id !== productId),
    );
  };

  const handleCreateSale = async () => {
    if (draftLines.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Venta vacia",
        detail: "Agrega al menos un producto para registrar la venta.",
      });
      return;
    }

    const linesPayload: Array<Omit<ISaleLineNew, "sale_id">> = draftLines.map(
      (line) => ({
        product_id: line.product_id,
        menu_item_id: 0,
        quantity: line.quantity,
        unit_price: line.unit_price,
        line_total: line.line_total,
      }),
    );

    try {
      await createSaleWithLines({
        sale: {
          sold_at: new Date().toISOString(),
          total_amount: totalDraft,
          notes: notes.trim(),
        },
        lines: linesPayload,
      });

      await Promise.all([fetchSalesData(), fetchProducts()]);

      setDraftLines([]);
      setNotes("");
      setSelectedProductId(0);
      setQuantity(1);

      toast.current?.show({
        severity: "success",
        summary: "Venta registrada",
        detail: "El ticket se guardo correctamente.",
      });
    } catch (error) {
      console.error("Error creating sale:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar la venta.",
      });
    }
  };

  return (
    <MainLayout>
      <Toast ref={toast} />

      <section
        className={`coffee-sales ${isLarge ? "coffee-sales--large" : ""} ${isMedium ? "coffee-sales--medium" : ""} ${isMobile ? "coffee-sales--mobile" : ""}`}
      >
        <header className="coffee-sales__hero">
          <div>
            <h1 className="coffee-sales__title">Modulo de Ventas</h1>
            <p className="coffee-sales__subtitle">
              Flujo rapido para ventas de cafeteria y seguimiento diario.
            </p>
          </div>
        </header>

        <section className="coffee-sales__kpi-grid">
          <article className="coffee-sales__kpi">
            <span className="coffee-sales__kpi-label">Ventas de hoy</span>
            <div className="coffee-sales__kpi-value">
              {moneyFormatter.format(revenueToday)}
            </div>
          </article>

          <article className="coffee-sales__kpi">
            <span className="coffee-sales__kpi-label">Ordenes de hoy</span>
            <div className="coffee-sales__kpi-value">{todaySales.length}</div>
          </article>

          <article className="coffee-sales__kpi">
            <span className="coffee-sales__kpi-label">Ticket promedio</span>
            <div className="coffee-sales__kpi-value">
              {moneyFormatter.format(averageTicket)}
            </div>
          </article>

          <article className="coffee-sales__kpi">
            <span className="coffee-sales__kpi-label">Producto lider</span>
            <div className="coffee-sales__kpi-value">{topProduct}</div>
          </article>
        </section>

        <section className="coffee-sales__content">
          <article className="coffee-sales__card">
            <h2 className="coffee-sales__card-title">Nuevo ticket</h2>

            <div className="coffee-sales__form-grid">
              <div className="coffee-sales__field">
                <label
                  htmlFor="sale-product"
                  className="coffee-sales__field-label"
                >
                  Producto
                </label>
                <Dropdown
                  inputId="sale-product"
                  value={selectedProductId}
                  options={productOptions}
                  onChange={(event: DropdownChangeEvent) =>
                    setSelectedProductId(Number(event.value) || 0)
                  }
                  placeholder="Selecciona un producto"
                  filter
                  className="w-full"
                />
              </div>

              <div className="coffee-sales__field">
                <label
                  htmlFor="sale-quantity"
                  className="coffee-sales__field-label"
                >
                  Cantidad
                </label>
                <InputNumber
                  inputId="sale-quantity"
                  value={quantity}
                  onValueChange={(event) =>
                    setQuantity(Number(event.value) || 1)
                  }
                  min={1}
                  useGrouping={false}
                  className="coffee-sales__quantity-input"
                />
              </div>

              <Button
                label="Agregar"
                icon="pi pi-plus"
                onClick={handleAddLine}
                disabled={!selectedProductId}
                className={`coffee-sales__add-btn ${isMobile ? "w-full" : ""}`}
              />
            </div>

            <div className="coffee-sales__line-list">
              {draftLines.length === 0 && (
                <small className="text-500">
                  Aun no hay productos en el ticket.
                </small>
              )}

              {draftLines.map((line) => (
                <div key={line.product_id} className="coffee-sales__line-item">
                  <div className="coffee-sales__line-main">
                    <span className="coffee-sales__line-name">
                      {line.product_nm}
                    </span>
                    <span className="coffee-sales__line-meta">
                      {line.quantity} x {moneyFormatter.format(line.unit_price)}
                    </span>
                  </div>
                  <div className="flex align-items-center gap-2">
                    <strong>{moneyFormatter.format(line.line_total)}</strong>
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      rounded
                      text
                      onClick={() => handleRemoveLine(line.product_id)}
                      aria-label="Eliminar linea"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="coffee-sales__field coffee-sales__notes-field">
              <label htmlFor="sale-notes" className="coffee-sales__field-label">
                Notas de venta (opcional)
              </label>
              <InputTextarea
                id="sale-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                autoResize
                className="w-full"
              />
            </div>

            <div className="coffee-sales__totals">
              <div className="coffee-sales__total-box">
                <div className="coffee-sales__ticket-row">
                  <span>Total del ticket</span>
                  <strong>{moneyFormatter.format(totalDraft)}</strong>
                </div>
                <Divider className="my-2" />
                <Button
                  label="Registrar venta"
                  icon="pi pi-check"
                  className="w-full"
                  onClick={handleCreateSale}
                  disabled={draftLines.length === 0 || loading}
                  loading={loading}
                />
              </div>
            </div>
          </article>

          <article className="coffee-sales__card">
            <h2 className="coffee-sales__card-title">Historial reciente</h2>
            <p className="coffee-sales__card-subtitle">
              Revision rapida de ordenes.
            </p>

            {recentSales.length === 0 && (
              <small className="text-500">
                Todavia no hay ventas registradas.
              </small>
            )}

            {recentSales.length > 0 && (
              <Accordion>
                {recentSales.map((sale) => {
                  const saleLinesByTicket = saleLines.filter(
                    (line) => line.sale_id === sale.sale_id,
                  );

                  return (
                    <AccordionTab
                      key={sale.sale_id}
                      header={`Ticket #${sale.sale_id} - ${moneyFormatter.format(sale.total_amount)}`}
                    >
                      <div className="coffee-sales__ticket-row">
                        <span>Fecha</span>
                        <strong>
                          {dateFormatter.format(new Date(sale.sold_at))}
                        </strong>
                      </div>

                      <div className="coffee-sales__ticket-row mt-2">
                        <span>Notas</span>
                        <span>{sale.notes || "Sin notas"}</span>
                      </div>

                      <ul className="coffee-sales__ticket-lines">
                        {saleLinesByTicket.map((line) => (
                          <li
                            key={line.sale_line_id}
                            className="coffee-sales__ticket-line"
                          >
                            <span>
                              {productMap.get(Number(line.product_id))
                                ?.product_nm || `Producto #${line.product_id}`}
                            </span>
                            <span>
                              {line.quantity} x{" "}
                              {moneyFormatter.format(line.unit_price)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </AccordionTab>
                  );
                })}
              </Accordion>
            )}
          </article>
        </section>
      </section>
    </MainLayout>
  );
};
