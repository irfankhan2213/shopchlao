import {
  BsFiletypeCsv,
  BsFiletypeDoc,
  BsFiletypeDocx,
  BsFiletypePpt,
  BsFiletypePptx,
  BsFiletypeTxt,
} from "react-icons/bs";
import { FcVideoFile } from "react-icons/fc";
import Pdf from "./pdf.svg";
import Excel from "./excel.svg";
import Image from "next/image";
export const getMediaIcons = (size = "50") => ({
  pdf: (
    <div
      style={{
        height: parseInt(size, 10) * 0.8 + "px",
        width: parseInt(size, 10) * 0.8 + "px",
        padding: `${parseInt(size, 10) / 8}px`,
      }}
    >
      <Image objectFit="fit" src={Pdf} alt={"pdf"} />
    </div>
  ),
  xls: (
    <div
      style={{
        height: parseInt(size, 10) * 0.8 + "px",
        width: parseInt(size, 10) * 0.8 + "px",
        padding: `${parseInt(size, 10) / 8}px`,
      }}
    >
      <Image objectFit="fit" src={Excel} alt={"Excel"} />
    </div>
  ),
  xlsx: (
    <div
      style={{
        height: parseInt(size, 10) * 0.8 + "px",
        width: parseInt(size, 10) * 0.8 + "px",
        padding: `${parseInt(size, 10) / 8}px`,
      }}
    >
      <Image objectFit="fit" src={Excel} alt={"Excel"} />
    </div>
  ),
  doc: <BsFiletypeDoc className="my-auto" size={size} />,
  docx: <BsFiletypeDocx className="my-auto" size={size} />,
  ppt: <BsFiletypePpt className="my-auto" size={size} />,
  pptx: <BsFiletypePptx className="my-auto" size={size} />,
  txt: <BsFiletypeTxt className="my-auto" size={size} />,
  video: <FcVideoFile className="my-auto" size={size} />,
  csv: <BsFiletypeCsv className="my-auto" size={size} />,
});
