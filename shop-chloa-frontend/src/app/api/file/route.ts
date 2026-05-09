import fs from "fs";
import * as path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const filePath = path.join(
    process.cwd(),
    "src/Assets/files",
    "ShopChlao_Upload.xlsx"
  );

  const fileStream = fs.readFileSync(filePath);

  return new Response(fileStream, {
    headers: {
      "Content-Disposition":
        "attachment; filename=ShopChlao_Upload.xlsx",
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}
