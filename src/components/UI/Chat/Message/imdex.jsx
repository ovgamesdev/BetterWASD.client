import { replaceEmotes } from "../../AlertBox/Event";
// import useChatAuth from "../../../../hooks/useChatAuth";

const userColors = ["#7fba40", "#1c3fc8", "#a5276d", "#913ca7", "#4332b6", "#266bc5", "#5bc3c1", "#d87539", "#a9ad47", "#3ca13b", "#4db89a", "#6a4691", "#f5a623", "#e7719e", "#9fcbef", "#7b4b4b"];
const getColor = (user_id) => userColors[user_id % (userColors.length - 1)];

const Message = ({ data, settings, emotes, personalEmotes, subBadges, paints }) => {
  // const { settings, emotes, subBadges, paints } = useChatAuth();
  const { user_login, user_id, user_channel_role, other_roles, message, sticker, meta } = data;

  if (!data) return console.log("data null", data);

  const isOwner = settings.show_owner_icons && user_channel_role === "CHANNEL_OWNER";
  const isMod = settings.show_moderator_icons && user_channel_role === "CHANNEL_MODERATOR";
  const isSub = settings.show_subscriber_icons && other_roles.includes("CHANNEL_SUBSCRIBER");
  const isPromo = settings.show_promo_icons && other_roles.includes("PROMO_CODE_WINNER");
  const isPartner = settings.show_partner_icons && other_roles.includes("WASD_PARTNER");
  const isAdmin = (settings.show_admin_icons && user_channel_role === "WASD_ADMIN") || user_channel_role === "WASD_TEAM";

  const canColorName = isOwner ? null : isMod ? null : isAdmin ? null : true;
  const canBetterPaint = settings.better_paints_enabled;

  const msg = replaceEmotes(message, emotes, personalEmotes, user_id);

  const subscriptionPeriods = [
    { startDays: 0, iconUrl: 'url("https://static.wasd.tv/images/subscribers/1mon.png")' },
    { startDays: 60, iconUrl: 'url("https://static.wasd.tv/images/subscribers/3mon.png")' },
    { startDays: 150, iconUrl: 'url("https://static.wasd.tv/images/subscribers/6mon.png")' },
    { startDays: 240, iconUrl: 'url("https://static.wasd.tv/images/subscribers/9mon.png")' },
    { startDays: 330, iconUrl: 'url("https://static.wasd.tv/images/subscribers/12mon.png")' },
    { startDays: 510, iconUrl: 'url("https://static.wasd.tv/images/subscribers/18mon.png")' },
    { startDays: 690, iconUrl: 'url("https://static.wasd.tv/images/subscribers/24mon.png")' },
  ];
  const getSubUrl = (days_as_sub) => {
    let _currentPeriod = subscriptionPeriods[0];
    subscriptionPeriods.every((t) => !(t.startDays > days_as_sub || ((_currentPeriod = t), 0)));
    const gap = _currentPeriod.iconUrl.split("/");
    const res = gap[gap.length - 1].split(".")[0];

    return settings.better_badges_enabled ? subBadges[res] || _currentPeriod.iconUrl : _currentPeriod.iconUrl;
  };

  const paint = paints[user_login];
  const paintType = !paint ? null : paint.length < 4 ? "paint" : paint.includes("gradient") ? "gradient" : "rgb";

  return (
    <div
      className="block__messages__item"
      style={
        settings.always_show_messages
          ? {
              animation: settings.theme === "wasd" ? `` : settings.theme === "clean" ? `fadeInRight .3s ease forwards` : "",
            }
          : {
              animation:
                settings.theme === "wasd"
                  ? `fadeOut 1s ease ${settings.message_hide_delay}ms forwards`
                  : settings.theme === "clean"
                  ? `fadeInRight .3s ease forwards, fadeOut .5s ease ${settings.message_hide_delay}ms forwards`
                  : "",
            }
      }
    >
      <>
        {settings.theme === "wasd" && (
          <chat-message>
            <div className="message">
              <div className="message--wrapper">{isPromo && <div className="message__promocodes"></div>}</div>
              <div className="message__info">
                <div className="message__status">
                  {isSub && (
                    <div className="message__status--paid" style={{ backgroundImage: getSubUrl(meta.days_as_sub || 0), position: "relative" }}>
                      <i className="icon" />
                    </div>
                  )}
                  <div
                    className={`message__status--name ${isOwner ? "is-owner" : isMod ? "is-moderator" : isAdmin ? "is-admin" : ""}`}
                    style={canColorName ? (paintType === "rgb" && canBetterPaint ? { color: paint } : { color: getColor(user_id) }) : {}}
                  >
                    {isOwner && <i className="icon wasd-icons-owner" />}
                    {isMod && <i className="icon wasd-icons-moderator" />}
                    {isAdmin && <i className="icon wasd-icons-dev" />}
                    <span
                      data-betterwasya-paint={canColorName ? (canBetterPaint ? (paintType === "paint" ? paint : paintType === "gradient" ? "" : null) : null) : null}
                      style={canColorName ? (paintType === "gradient" && canBetterPaint ? { backgroundImage: paint } : {}) : {}}
                    >
                      {user_login}
                    </span>
                  </div>
                  {isPartner && <div className="message__partner" />}
                </div>
                <div className="message-text">
                  <span dangerouslySetInnerHTML={{ __html: msg }}></span>
                  {sticker && (
                    <img
                      alt="sticker"
                      className={`sticker ${settings.sticker_size}`}
                      src={
                        settings.sticker_size === "small"
                          ? Number(settings.text_size.replace("px", "")) <= 16
                            ? sticker.sticker_image.small
                            : Number(settings.text_size.replace("px", "")) <= 32
                            ? sticker.sticker_image.medium
                            : sticker.sticker_image.large
                          : sticker.sticker_image.large
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </chat-message>
        )}
        {settings.theme === "clean" && (
          <>
            <div className="meta">
              {isPromo && <div className="message__promocodes"></div>}
              {isSub && (
                <div className="message__status--paid" style={{ backgroundImage: getSubUrl(meta.days_as_sub || 0), position: "relative" }}>
                  <i className="icon" />
                </div>
              )}
              <div
                className={`message__status--name ${isOwner ? "is-owner" : isMod ? "is-moderator" : isAdmin ? "is-admin" : ""}`}
                style={canColorName ? (paintType === "rgb" && canBetterPaint ? { color: paint } : { color: getColor(user_id) }) : {}}
              >
                {isOwner && <i className="icon wasd-icons-owner" />}
                {isMod && <i className="icon wasd-icons-moderator" />}
                {isAdmin && <i className="icon wasd-icons-dev" />}
                <span
                  data-betterwasya-paint={canColorName ? (canBetterPaint ? (paintType === "paint" ? paint : paintType === "gradient" ? "" : null) : null) : null}
                  style={canColorName ? (paintType === "gradient" && canBetterPaint ? { backgroundImage: paint } : {}) : {}}
                >
                  {user_login}
                </span>
              </div>
              {isPartner && <div className="message__partner" />}
            </div>
            <div className="message">
              <span dangerouslySetInnerHTML={{ __html: msg }}></span>
              {sticker && (
                <img
                  alt="sticker"
                  className={`sticker ${settings.sticker_size}`}
                  src={
                    settings.sticker_size === "small"
                      ? Number(settings.text_size.replace("px", "")) <= 16
                        ? sticker.sticker_image.small
                        : Number(settings.text_size.replace("px", "")) <= 32
                        ? sticker.sticker_image.medium
                        : sticker.sticker_image.large
                      : sticker.sticker_image.large
                  }
                />
              )}
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default Message;
