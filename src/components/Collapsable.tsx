import { PropsWithChildren, useState } from "react";

import "../css/Collapsable.css";

const Collapsable = ({
  altText,
  fixedBottom = false,
  children,
}: PropsWithChildren<{ altText?: string; fixedBottom?: boolean }>) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      id={fixedBottom ? "fixed-bottom" : ""}
      className={`collapsable${collapsed ? " collapsable-collapsed" : ""}`}
    >
      <button className={"btn-collapsable"} onClick={() => setCollapsed((collapsed) => !collapsed)}>
        {collapsed ? `${altText ?? "+"}` : "-"}
      </button>
      {!collapsed && <div>{children}</div>}
    </div>
  );
};

export default Collapsable;
