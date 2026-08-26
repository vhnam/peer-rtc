import dayjs from "dayjs";
import { useEffect, useState } from "react";

export const LiveClock = () => {
  const [now, setNow] = useState(() => dayjs());

  useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(id);
  }, []);

  return <span>{now.format("hh:mm A")}</span>;
};
