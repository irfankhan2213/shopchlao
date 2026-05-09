import { Mail } from "lucide-react";
import React from "react";

function SupportEmail() {
  return (
    <div className="float-end mb-4 flex items-center mx-auto rounded-full bg-primary/20 py-1 ps-3 pe-1 ">
      <span className="text-secondary-foreground text-sm font-normal">
        Need help?
      </span>{" "}
      <a href="mailto:support@shopchlao.com"  className="bg-background p-1 text-primary rounded-full ms-2 flex items-center gap-2 px-2">
        <Mail size={18} /> support@shopchlao.com
      </a>
    </div>
  );
}

export default SupportEmail;
