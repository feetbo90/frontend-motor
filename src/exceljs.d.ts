declare module "exceljs" {
  export interface CellAlignment {
    horizontal?: "left" | "center" | "right" | "distributed";
    vertical?: "top" | "middle" | "bottom" | "distributed";
  }

  export interface BorderStyle {
    style?: "thin" | "medium" | "thick" | "dotted" | "dashed";
  }

  export interface CellBorder {
    top?: BorderStyle;
    left?: BorderStyle;
    bottom?: BorderStyle;
    right?: BorderStyle;
  }

  export interface Cell {
    value?: unknown;
    alignment?: CellAlignment;
    border?: CellBorder;
  }

  export interface Row {
    number: number;
    font?: { bold?: boolean };
    alignment?: CellAlignment;
    eachCell(callback: (cell: Cell, colNumber: number) => void): void;
  }

  export interface Worksheet {
    addRow(data: unknown[]): Row;
    getCell(row: number, col: number): Cell;
    mergeCells(
      startRow: number,
      startCol: number,
      endRow: number,
      endCol: number
    ): void;
  }

  export interface Workbook {
    addWorksheet(name: string, opts?: { views?: unknown[] }): Worksheet;
    xlsx: { writeBuffer(): Promise<ArrayBuffer> };
  }

  export class WorkbookClass {
    addWorksheet(name: string, opts?: { views?: unknown[] }): Worksheet;
    xlsx: { writeBuffer(): Promise<ArrayBuffer> };
  }

  const ExcelJS: { Workbook: typeof WorkbookClass };
  export default ExcelJS;
}
