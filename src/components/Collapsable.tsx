import { PropsWithChildren, useState } from "react";

import "../css/Collapsable.css";

const Collapsable = ({ altText, children }: PropsWithChildren<{ altText?: string }>) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`collapsable${collapsed ? " collapsable-collapsed" : ""}`}>
      <button className={"btn-collapsable"} onClick={() => setCollapsed((collapsed) => !collapsed)}>
        {collapsed ? `${altText ?? "+"}` : "-"}
      </button>
      {!collapsed && <div>{children}</div>}
    </div>
  );
};

export default Collapsable;
