import "./TabList.scss";

interface ITabList<T extends string = string> {
  tabs: T[];
  selectedTab: T;
  onTabSelect: (tab: T) => void;
  getLabel?: (tab: T) => string;
}

const TabList = <T extends string>({
  tabs,
  selectedTab,
  onTabSelect,
  getLabel,
}: ITabList<T>) => {
  return (
    <div className="tablist">
      {tabs.map((tab) => (
        <Tab
          key={tab}
          isActive={selectedTab === tab}
          label={getLabel ? getLabel(tab) : tab}
          onClick={() => {
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
