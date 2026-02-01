import { FriendRequests } from "./FriendRequests";
import TabList from "@/components/TabList";
import { useState } from "react";
import { FriendList } from "./FriendList";

const Friends = () => {
  const tabs = ["Friend Requests", "Friend List"];
  const [activeTab, setActiveTab] = useState("Friend Requests");
  return (
    <div>
      <h1 className="text-2xl font-bold">Friends</h1>

      <TabList
        tabs={tabs}
        selectedTab={activeTab}
        onTabSelect={(tab) => setActiveTab(tab)}
      />

      {activeTab === "Friend Requests" && <FriendRequests />}
      {activeTab === "Friend List" && <FriendList />}
    </div>
  );
};

export default Friends;
