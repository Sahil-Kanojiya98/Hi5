import MobileNavItem from "./MobileNavItem";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";

const MobileNavbar = () => (
  <div className="bottom-0 left-0 fixed flex justify-between md:hidden bg-white dark:bg-black shadow-inner p-3 w-full">
    <ul className="flex justify-around items-center w-full">
      <MobileNavItem
        icon={<HomeRoundedIcon sx={{ fontSize: { xs: 25, sm: 30 } }} />}
        link="/home"
      />
      <MobileNavItem
        icon={<SearchRoundedIcon sx={{ fontSize: { xs: 25, sm: 30 } }} />}
        link="/search"
      />
      <MobileNavItem
        icon={<AddCircleRoundedIcon sx={{ fontSize: { xs: 25, sm: 30 } }} />}
        link="/reels"
      />
      <MobileNavItem
        icon={<MessageRoundedIcon sx={{ fontSize: { xs: 25, sm: 30 } }} />}
        link="/chat"
      />
      <MobileNavItem
        icon={<NotificationsRoundedIcon />}
        link="/notifications"
        sx={{ fontSize: { xs: 25, sm: 30 } }}
      />
    </ul>
  </div>
);

export default MobileNavbar;
