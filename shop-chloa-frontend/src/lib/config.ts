export const StudentPortalBaseUrl =
  process.env.NEXT_PUBLIC_STUDENT_PORTAL_BASE_URL ||
  "https://www.shopchlao.com";

export const AppSupportingFileTypes = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".webp",
 
];

export const AppSupportingFileTypesByCategory = {
  images: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"],
  documents: [
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".txt",
  ],
  compressed: [".zip", ".rar", ".7z", ".tar", ".gz"],
};

export const AppPreviewFileTypes = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".webp",
  ".pdf",
];
