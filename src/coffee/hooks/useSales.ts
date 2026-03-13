import { useState } from "react";
import type { ISale, ISaleNew } from "../interfaces/sales.interface";
import type {
  ISaleLine,
  ISaleLineNew,
} from "../interfaces/sale_lines.interface";
import { SalesService } from "../services/sales.service";
import { SalesLinesService } from "../services/Sales_lines.service";

interface ICreateSalePayload {
  sale: ISaleNew;
  lines: Array<Omit<ISaleLineNew, "sale_id">>;
}

const normalizeCollection = <T>(response: unknown): T[] => {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (response && typeof response === "object") {
    const wrappedData = (response as { data?: unknown }).data;
    if (Array.isArray(wrappedData)) {
      return wrappedData as T[];
    }

    if (wrappedData && typeof wrappedData === "object") {
      const secondLevelData = (wrappedData as { data?: unknown }).data;
      if (Array.isArray(secondLevelData)) {
        return secondLevelData as T[];
      }
    }
  }

  return [];
};

const normalizeEntity = <T>(response: unknown): T | null => {
  if (!response || typeof response !== "object") {
    return null;
  }

  const wrapped = response as { data?: unknown };
  const entity = wrapped.data ?? response;

  if (entity && typeof entity === "object" && !Array.isArray(entity)) {
    const secondLevelEntity = (entity as { data?: unknown }).data;
    if (
      secondLevelEntity &&
      typeof secondLevelEntity === "object" &&
      !Array.isArray(secondLevelEntity)
    ) {
      return secondLevelEntity as T;
    }
  }

  if (!entity || typeof entity !== "object" || Array.isArray(entity)) {
    return null;
  }

  return entity as T;
};

export const useSales = () => {
  const salesService = new SalesService();
  const salesLinesService = new SalesLinesService();

  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState<ISale[]>([]);
  const [saleLines, setSaleLines] = useState<ISaleLine[]>([]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const [salesResponse, linesResponse] = await Promise.all([
        salesService.getAll<ISale>(),
        salesLinesService.getAll<ISaleLine>(),
      ]);

      setSales(normalizeCollection<ISale>(salesResponse));
      setSaleLines(normalizeCollection<ISaleLine>(linesResponse));
    } catch (error) {
      setSales([]);
      setSaleLines([]);
      console.error("Error fetching sales module data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createSaleWithLines = async ({ sale, lines }: ICreateSalePayload) => {
    try {
      setLoading(true);

      const createdSaleResponse = await salesService.post<ISale>(sale);
      const createdSale = normalizeEntity<ISale>(createdSaleResponse);
      const saleId = Number(createdSale?.sale_id ?? 0);

      if (!saleId) {
        throw new Error("No se pudo obtener sale_id de la venta creada.");
      }

      if (lines.length > 0) {
        await Promise.all(
          lines.map((line) =>
            salesLinesService.post<ISaleLine>({
              ...line,
              sale_id: saleId,
            }),
          ),
        );
      }

      await fetchSalesData();
      await fetchSalesData();
      return createdSale;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sales,
    saleLines,
    fetchSalesData,
    createSaleWithLines,
  };
};
