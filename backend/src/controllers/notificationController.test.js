const assert = require("node:assert/strict");
const { afterEach, test } = require("node:test");
const Notification = require("../models/Notification");
const { getNotifications, markNotificationAsRead } = require("./notificationController");

const originals = { find: Notification.find, countDocuments: Notification.countDocuments, findOneAndUpdate: Notification.findOneAndUpdate };
afterEach(() => { Notification.find = originals.find; Notification.countDocuments = originals.countDocuments; Notification.findOneAndUpdate = originals.findOneAndUpdate; });
const response = () => ({ statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });

test("notification list and unread count are scoped to the authenticated recipient", async () => {
  const queries = [];
  Notification.find = (query) => {
    queries.push(query);
    return { sort() { return this; }, skip() { return this; }, limit() { return Promise.resolve([]); } };
  };
  Notification.countDocuments = async (query) => { queries.push(query); return 0; };
  const res = response();
  await getNotifications({ user: { id: "user-1" }, query: {} }, res);
  assert.deepEqual(queries, [{ recipient: "user-1" }, { recipient: "user-1" }, { recipient: "user-1", isRead: false }]);
  assert.equal(res.body.unreadCount, 0);
});

test("mark-as-read updates only the notification owned by the authenticated recipient", async () => {
  let criteria;
  Notification.findOneAndUpdate = async (query, update, options) => {
    criteria = query;
    assert.deepEqual(update, { isRead: true, readAt: update.readAt });
    assert.ok(update.readAt instanceof Date);
    assert.deepEqual(options, { new: true });
    return { _id: "note-1", recipient: "user-1", isRead: true };
  };
  const res = response();
  await markNotificationAsRead({ user: { id: "user-1" }, params: { id: "note-1" } }, res);
  assert.deepEqual(criteria, { _id: "note-1", recipient: "user-1" });
  assert.equal(res.body.notification.isRead, true);
});
