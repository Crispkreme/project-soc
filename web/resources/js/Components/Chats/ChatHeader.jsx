import React from "react";
import { Head } from "@inertiajs/react";

const Title = React.lazy(() => import("@/Components/Headers/Title"));

const ChatHeader = () => {
  return (
    <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
      <Head title="Message" />
        <Title>Messages</Title>
    </div>
  );
};

export default ChatHeader;
