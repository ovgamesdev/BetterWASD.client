const SystemMessage = ({ data, settings, emotes, subBadges, paints }) => {
  const { message, meta } = data;

  if (!data) return console.log("data null", data);

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
          <chat-system-message>
            <div className="message">
              <div className="message__title message__title--background">
                <div className="message__text">{message}</div>
              </div>
            </div>
          </chat-system-message>
        )}
        {settings.theme === "clean" && null}
      </>
    </div>
  );
};

export default SystemMessage;
