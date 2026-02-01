import { useState } from "react";
import "./TabList.scss";

interface ITabList {
  tabs: string[];
  defaultActiveTab: string;
  onTabSelect: (tab: string) => void;
}

const TabList = ({ tabs, defaultActiveTab, onTabSelect }: ITabList) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <Tab
          key={tab}
          isActive={activeTab === tab}
          label={tab}
          onClick={() => {
            setActiveTab(tab);
            onTabSelect(tab);
          }}
        />
      ))}
    </div>
  );
};

const Tab = ({
  isActive,
  label,
  onClick,
}: {
  isActive: boolean;
  label: string;
  onClick: () => void;
}) => {
  return (
    <button onClick={onClick} className={isActive ? "tab active" : "tab"}>
      {label}
    </button>
  );
};

export default TabList;
