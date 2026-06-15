import { FriendRequests } from "./FriendRequests";
import TabList from "@/components/TabList";
import { useState } from "react";
import { FriendList } from "./FriendList";
import { FriendSearch } from "./FriendSearch";
import { useTranslation } from "react-i18next";
import { useGetFriendRequests } from "./hooks/friendRequestHooks";

type FriendTab = "Friend List" | "Friend Requests";

const Friends = () => {
  const { t } = useTranslation();
  const { data: requestData } = useGetFriendRequests();
  const pendingCount = requestData?.receivedRequests?.length || 0;

  const tabs: FriendTab[] = ["Friend List", "Friend Requests"];
  const [activeTab, setActiveTab] = useState<FriendTab>("Friend List");

  const getTabLabel = (tab: FriendTab) => {
    if (tab === "Friend List") {
      return t("friends.tabs.friendList");
    }
    if (tab === "Friend Requests") {
      return pendingCount > 0
        ? t("friends.tabs.friendRequestsWithCount", { count: pendingCount })
        : t("friends.tabs.friendRequests");
    }
    return tab;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t("friends.title")}</h1>
        <FriendSearch />
      </div>

      <TabList
        tabs={tabs}
        selectedTab={activeTab}
        onTabSelect={(tab) => setActiveTab(tab)}
        getLabel={getTabLabel}
      />

      {activeTab === "Friend Requests" && <FriendRequests />}
      {activeTab === "Friend List" && <FriendList />}
    </div>
  );
};

export default Friends;
