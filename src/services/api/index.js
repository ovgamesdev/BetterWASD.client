import auth from "./endpoints/auth.ts";
import emote from "./endpoints/emote.ts";
import paint from "./endpoints/paint.ts";
import subBadge from "./endpoints/sub-badge.ts";
import wasd from "./endpoints/wasd.ts";
import uninstall from "./endpoints/uninstall.ts";
import alertBox from "./endpoints/alert-box.ts";
import admin from "./endpoints/admin.ts";
import bells from "./endpoints/bells.ts";
import support from "./endpoints/support.ts";
import upload from "./endpoints/upload.ts";
import disabledOptions from "./endpoints/disabled-options.ts";

const api = { auth, emote, paint, subBadge, wasd, uninstall, alertBox, admin, bells, support, upload, disabledOptions };

export default api;
